import { NextRequest, NextResponse } from 'next/server';
import { fetchJobDetailsFromBackend } from '@/lib/jobDetailsBackend';

function applyJobDetailsCacheHeaders(response: NextResponse, cacheControl: string) {
  response.headers.set('Cache-Control', cacheControl);
  response.headers.set('CDN-Cache-Control', cacheControl);
  response.headers.set('Vercel-CDN-Cache-Control', cacheControl);
  return response;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const job_id_param = searchParams.get('id')?.trim() ?? '';

  if (!job_id_param) {
    return NextResponse.json({ error: "Job id is required" }, { status: 400 });
  }

  try {
    const job = await fetchJobDetailsFromBackend(job_id_param);

    if (!job) {
      const notFoundResponse = NextResponse.json({ error: "Job not found" }, { status: 404 });
      return applyJobDetailsCacheHeaders(
        notFoundResponse,
        'public, s-maxage=3600, max-age=300, stale-while-revalidate=86400'
      );
    }

    const apiResponse = NextResponse.json({ job });
    
    return applyJobDetailsCacheHeaders(
      apiResponse,
      'public, s-maxage=86400, stale-while-revalidate=2592000'
    );
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
