// app/api/get-jobs/route.ts

import { NextRequest, NextResponse } from 'next/server';
// import Airtable from 'airtable';

// const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN ?? '' }).base(process.env.AIRTABLE_BASE ?? '');
// Helper function to calculate days ago text
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
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  // let filterFormula = '';
  // filterFormula += `AND({featured} = '0 - top')`;
  const filters: Record<string, string> = {};
  filters.featured = '0 - top';

  const requestBody = {
      limit,
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
    
    const records = await response.json();

    const jobs = records.map((record: any) => ({
      id: record.slug || record.job_id, // Prefer slug if available
      job_id: record.job_id, // Keep original ID for reference
      title: record.name,
      company: record.company,
      description: record.description,
      location: record.location,
      salary: record.salary,
      country: record.country,
      seniority: record.seniority,
      remote: record.remote,
      skills: record.skills,
      logo_permanent_url: record.logo_permanent_url,
      remote_string: record.remote_office,
      days_ago_text: getDaysAgoText(record.creation_date),
    }));

    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
