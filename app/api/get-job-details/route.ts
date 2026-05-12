import { NextRequest, NextResponse } from 'next/server';
// import Airtable from 'airtable';

// const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN ?? '' }).base(process.env.AIRTABLE_BASE ?? '');

function getDaysAgoText(creationDate: string): string {
  const created = new Date(creationDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - created.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Posted Today';
  }
  return `Posted ${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

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

  // Determine if it's a numeric ID or a slug
  const isNumeric = /^\d+$/.test(job_id_param);

  const filters = isNumeric
    ? { job_id: job_id_param }
    : { slug: job_id_param };

  const requestBody = {
    limit: 1,
    filters: Object.keys(filters).length > 0 ? filters : null,
    sort_by: "creation_date",
    sort_direction: "desc"
  };

  try {
    // Fetch from Hetzner server
    const fetchResponse = await fetch(`http://${process.env.HETZNER_POSTGRES_HOST}:8000/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!fetchResponse.ok) {
      throw new Error(`HTTP error! status: ${fetchResponse.status}`);
    }
    
    const data = await fetchResponse.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid data received from server');
    }

    // Ensure record has required properties
    // if (!record.id || !record.name) {
    //   throw new Error('Invalid job data received');
    // }

    const record = data[0];

    if (!record) {
      const notFoundResponse = NextResponse.json({ error: "Job not found" }, { status: 404 });
      return applyJobDetailsCacheHeaders(
        notFoundResponse,
        'public, s-maxage=3600, max-age=300, stale-while-revalidate=86400'
      );
    }

    const job = {
      id: record.job_id,
      title: record.name,
      company: record.company,
      description: record.description,
      start_date: record.creation_date,
      location: record.location,
      hours: record.hours,
      salary: record.salary,
      country: record.country,
      country_code: record.country_code,
      seniority: record.seniority,
      remote: record.remote,
      skills: record.skills,
      logo_permanent_url: record.logo_permanent_url,
      remote_string: record.remote_office,
      days_ago_text: getDaysAgoText(record.creation_date),
      sport_list: record.sport_list,
      industry: record.industry,
      job_area: record.job_area,
      apply_url: record.url,
      slug: record.slug,
    };

    const apiResponse = NextResponse.json({ job });
    
    return applyJobDetailsCacheHeaders(
      apiResponse,
      'public, s-maxage=86400, stale-while-revalidate=2592000'
    );
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
