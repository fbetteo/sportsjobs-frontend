import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { backendJsonHeaders, getBackendBaseUrl, normalizeAuthIdentity } from '../../../lib/userProfileBackend';

export const runtime = 'nodejs';
const MAX_BYTES = 4 * 1024 * 1024;

function storage() {
  const bucket = process.env.CLOUDFLARE_R2_RESUMES_BUCKET_NAME;
  const endpoint = process.env.CLOUDFLARE_R2_RESUMES_ENDPOINT_URL || process.env.CLOUDFLARE_R2_ENDPOINT_URL;
  const accessKeyId = process.env.CLOUDFLARE_R2_RESUMES_ACCESS_KEY;
  const secretAccessKey = process.env.CLOUDFLARE_R2_RESUMES_SECRET_KEY;
  if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) return null;
  return { bucket, client: new S3Client({ region: 'auto', endpoint, credentials: { accessKeyId, secretAccessKey } }) };
}

async function context() {
  const session = await getSession();
  const auth0Sub = normalizeAuthIdentity(session?.user || {}).auth0Sub;
  if (!auth0Sub) return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) };
  const baseUrl = getBackendBaseUrl();
  const r2 = storage();
  if (!baseUrl || !r2) return { error: NextResponse.json({ error: 'Resume storage is not configured' }, { status: 503 }) };
  return { auth0Sub, baseUrl, r2 };
}

async function backendResponse(baseUrl: string, path: string, init?: RequestInit) {
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { ...backendJsonHeaders, ...init?.headers },
    cache: 'no-store',
  });
}

async function currentCv(baseUrl: string, auth0Sub: string) {
  const response = await backendResponse(baseUrl, `/users/me/cv?auth0_sub=${encodeURIComponent(auth0Sub)}`);
  if (!response.ok) throw new Error('Could not load resume');
  return response.json();
}

async function deleteObjects(r2: NonNullable<ReturnType<typeof storage>>, keys: string[]) {
  await Promise.all(keys.map((Key) => r2.client.send(new DeleteObjectCommand({ Bucket: r2.bucket, Key }))));
}

export async function GET(request: NextRequest) {
  const ctx = await context();
  if (ctx.error) return ctx.error;
  const { auth0Sub, baseUrl, r2 } = ctx;
  try {
    const cv = await currentCv(baseUrl, auth0Sub);
    if (!request.nextUrl.searchParams.has('download')) {
      return NextResponse.json(cv ? { filename: cv.filename, sizeBytes: cv.size_bytes, uploadedAt: cv.created_at } : null);
    }
    if (!cv) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    const object = await r2.client.send(new GetObjectCommand({ Bucket: r2.bucket, Key: cv.s3_key }));
    const bytes = await object.Body?.transformToByteArray();
    if (!bytes) throw new Error('Resume is unavailable');
    const filename = cv.filename.replace(/[^a-zA-Z0-9._ -]/g, '_').replace(/[\r\n"]/g, '_');
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Could not load resume' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }
  const ctx = await context();
  if (ctx.error) return ctx.error;
  const { auth0Sub, baseUrl, r2 } = ctx;
  const contentLength = Number(request.headers.get('content-length'));
  if (contentLength > MAX_BYTES + 64 * 1024) {
    return NextResponse.json({ error: 'Choose a PDF under 4 MB' }, { status: 413 });
  }
  const form = await request.formData().catch(() => null);
  const file = form?.get('resume');
  if (!file || typeof file === 'string') return NextResponse.json({ error: 'Choose a PDF file' }, { status: 400 });
  if (!file.name.toLowerCase().endsWith('.pdf') || file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Choose a PDF under 4 MB' }, { status: 400 });
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const header = bytes.subarray(0, 5).toString('ascii');
  const trailer = bytes.subarray(Math.max(0, bytes.length - 1024)).toString('latin1');
  if (header !== '%PDF-' || !trailer.includes('%%EOF')) {
    return NextResponse.json({ error: 'This file does not appear to be a valid PDF' }, { status: 400 });
  }
  const key = `resumes/${crypto.randomUUID()}.pdf`;
  try {
    await r2.client.send(new PutObjectCommand({ Bucket: r2.bucket, Key: key, Body: bytes, ContentType: 'application/pdf' }));
    const response = await backendResponse(baseUrl, '/users/me/cv', {
      method: 'POST',
      body: JSON.stringify({ auth0Sub, s3Key: key, filename: file.name, sizeBytes: bytes.length }),
    });
    if (!response.ok) {
      await deleteObjects(r2, [key]);
      return NextResponse.json({ error: 'Could not save resume' }, { status: response.status });
    }
    const saved = await response.json();
    await deleteObjects(r2, saved.oldKeys || []).catch(() => {});
    return NextResponse.json({ filename: saved.cv.filename, sizeBytes: saved.cv.size_bytes, uploadedAt: saved.cv.created_at });
  } catch {
    return NextResponse.json({ error: 'Could not upload resume' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }
  const ctx = await context();
  if (ctx.error) return ctx.error;
  const { auth0Sub, baseUrl, r2 } = ctx;
  try {
    const cv = await currentCv(baseUrl, auth0Sub);
    if (cv) await deleteObjects(r2, cv.all_keys || [cv.s3_key]);
    const response = await backendResponse(baseUrl, `/users/me/cv?auth0_sub=${encodeURIComponent(auth0Sub)}`, { method: 'DELETE' });
    if (!response.ok) return NextResponse.json({ error: 'Could not delete resume' }, { status: response.status });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Could not completely delete resume' }, { status: 500 });
  }
}
