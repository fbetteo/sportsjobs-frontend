import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const excludeId = searchParams.get('exclude_id');
  const country = searchParams.get('country');
  const sport = searchParams.get('sport');
  const seniority = searchParams.get('seniority');

  if (!excludeId) {
    return NextResponse.json({ error: 'exclude_id is required' }, { status: 400 });
  }

  try {
    // Build query params for Python backend
    const params = new URLSearchParams();
    params.append('exclude_id', excludeId);
    if (country) params.append('country', country);
    if (sport) params.append('sport', sport);
    if (seniority) params.append('seniority', seniority);

    // Fetch from Python backend
    const response = await fetch(
      `http://${process.env.HETZNER_POSTGRES_HOST}:8000/similar_jobs?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Create response with aggressive cache headers
    // Similar jobs change infrequently, can cache longer
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
