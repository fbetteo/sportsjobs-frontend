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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const job_id_param = searchParams.get('id') ?? '';

  const filters = { job_id: job_id_param};

  const requestBody = {
    limit: 1,
    filters: Object.keys(filters).length > 0 ? filters : null,
    sort_by: "creation_date",
    sort_direction: "desc"
  };

  try {
    // Fetch from Hetzner server
    const response = await fetch(`http://${process.env.HETZNER_POSTGRES_HOST}:8000/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data) {
      throw new Error('No data received from server');
    }

    // Ensure record has required properties
    // if (!record.id || !record.name) {
    //   throw new Error('Invalid job data received');
    // }

    const record = data[0];

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
  };

    return NextResponse.json({ job });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
