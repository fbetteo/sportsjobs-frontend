import { NextRequest, NextResponse } from 'next/server';

// Responses are shared through the CDN per filter combination, so the query must not
// include the current job's ID; the client drops the current job from the result.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get('country');
  const sport = searchParams.get('sport');
  const seniority = searchParams.get('seniority');

  try {
    // Build query params for Python backend
    const params = new URLSearchParams();
    params.append('limit', '4');
    if (country) params.append('country', country);
    if (sport) params.append('sport', sport);
    if (seniority) params.append('seniority', seniority);

    // The CDN caches this route; skip the Data Cache so misses don't also cost ISR writes.
    const response = await fetch(
      `http://${process.env.HETZNER_POSTGRES_HOST}:8000/similar_jobs?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const apiResponse = NextResponse.json(data);
    apiResponse.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, max-age=600, stale-while-revalidate=7200'
    );

    return apiResponse;
  } catch (error) {
    console.error('Error fetching similar jobs:', error);
    return NextResponse.json(
      { error: (error as Error).message, jobs: [], count: 0 },
      { status: 500 }
    );
  }
}
