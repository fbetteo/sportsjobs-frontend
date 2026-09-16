import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { backendJsonHeaders, getBackendBaseUrl, normalizeAuthIdentity } from '../../../lib/userProfileBackend';

export async function PATCH(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }
  const session = await getSession();
  const auth0Sub = normalizeAuthIdentity(session?.user || {}).auth0Sub;
  if (!auth0Sub) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) return NextResponse.json({ error: 'Profile backend is not configured' }, { status: 503 });
  const body = await request.json().catch(() => null);
  if (!body || (body.linkedinUrl !== null && typeof body.linkedinUrl !== 'string')) {
    return NextResponse.json({ error: 'Invalid LinkedIn URL' }, { status: 400 });
  }
  try {
    const response = await fetch(`${baseUrl}/users/me/linkedin`, {
      method: 'PATCH',
      headers: backendJsonHeaders,
      body: JSON.stringify({ auth0Sub, linkedinUrl: body.linkedinUrl }),
      cache: 'no-store',
    });
    if (!response.ok) return NextResponse.json({ error: 'Could not save LinkedIn URL' }, { status: response.status });
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: 'Could not save LinkedIn URL' }, { status: 500 });
  }
}
