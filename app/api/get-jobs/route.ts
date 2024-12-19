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
  const country = searchParams.get('country');
  const remote = searchParams.get('remote');
  const seniority = searchParams.get('seniority');
  const industry = searchParams.get('industry');
  const sport = searchParams.get('sport');
  const job_area = searchParams.get('job_area');
  const airtable_id = searchParams.get('airtable_id');


  // try {
  //   const records = await base('jobs')
  //     .select({ view: 'Grid view', maxRecords: limit, sort: [{ field: 'creation_date', direction: 'desc' }] })
  //     .all();


  const filters: Record<string, string> = {};
  if (country) filters.country = country;
  if (remote) filters.remote_office = remote;
  if (seniority) filters.seniority = seniority;
  if (industry) filters.industry = industry;
  if (sport) filters.sport_list = sport;
  if (job_area) filters.job_area = job_area;
  if (airtable_id) filters.airtable_id = airtable_id;
  
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
  
  
  // let filterFormula = '';


  // if (country) {
  //   filterFormula += `AND({country} = '${country}')`;
  // }

  // if (remote) {
  //   filterFormula += filterFormula ? `, ` : '';
  //   filterFormula += `AND({remote_office} = '${remote}')`;
  // }

  // if (seniority) {
  //   filterFormula += filterFormula ? `, ` : '';
  //   filterFormula += `AND({seniority} = '${seniority}')`;
  // }

  // if (industry) {
  //   filterFormula += filterFormula ? `, ` : '';
  //   filterFormula += `AND({industry} = '${industry}')`;
  // }

  // if (sport) {
  //   filterFormula += filterFormula ? `, ` : '';
  //   filterFormula += `AND({sport_list} = '${sport}')`;
  // }

  // if (job_area) {
  //   filterFormula += filterFormula ? `, ` : '';
  //   filterFormula += `AND({job_area} = '${job_area}')`;
  // }




  // try {
  //   const records = await base('jobs')
  //     .select({
  //       view: 'Grid view',
  //       maxRecords: limit,
  //       sort: [{ field: 'creation_date', direction: 'desc' }],
  //       filterByFormula: filterFormula ? `AND(${filterFormula})` : '',
  //     })
  //     .all();
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const records = await response.json();
    // console.log("RECORDS",records);
    // const jobs = records.map((record) => ({
    //   id: record.id,
    //   title: record.get('Name'),
    //   company: record.get('company'),
    //   description: record.get('desciption'),
    //   location: record.get('location'),
    //   salary: record.get('salary'),
    //   country: record.get('country'),
    //   seniority: record.get('seniority'),
    //   remote: record.get('remote'),
    //   skills: record.get('skills'),
    //   logo_permanent_url: record.get('logo_permanent_url'),
    //   remote_string: record.get('remote_string'),
    //   days_ago_text: record.get('days_ago_text'),
    //   }));

    const jobs = records.map((record: any) => ({
      id: record.job_id,
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
      remote_office: record.remote_office,
      days_ago_text: getDaysAgoText(record.creation_date),
      url: record.url,
    }));
    

    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
