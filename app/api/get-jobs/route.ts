// app/api/get-jobs/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN ?? '' }).base(process.env.AIRTABLE_BASE ?? '');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const country = searchParams.get('country');
  const remote = searchParams.get('remote');
  const seniority = searchParams.get('seniority');
  const industry = searchParams.get('industry');
  const sport = searchParams.get('sport');
  const job_area = searchParams.get('job_area');


  // try {
  //   const records = await base('jobs')
  //     .select({ view: 'Grid view', maxRecords: limit, sort: [{ field: 'creation_date', direction: 'desc' }] })
  //     .all();

  let filterFormula = '';


  if (country) {
    filterFormula += `AND({country} = '${country}')`;
  }

  if (remote) {
    filterFormula += filterFormula ? `, ` : '';
    filterFormula += `AND({remote_office} = '${remote}')`;
  }

  if (seniority) {
    filterFormula += filterFormula ? `, ` : '';
    filterFormula += `AND({seniority} = '${seniority}')`;
  }

  if (industry) {
    filterFormula += filterFormula ? `, ` : '';
    filterFormula += `AND({industry} = '${industry}')`;
  }

  if (sport) {
    filterFormula += filterFormula ? `, ` : '';
    filterFormula += `AND({sport_list} = '${sport}')`;
  }

  if (job_area) {
    filterFormula += filterFormula ? `, ` : '';
    filterFormula += `AND({job_area} = '${job_area}')`;
  }




  try {
    const records = await base('jobs')
      .select({
        view: 'Grid view',
        maxRecords: limit,
        sort: [{ field: 'creation_date', direction: 'desc' }],
        filterByFormula: filterFormula ? `AND(${filterFormula})` : '',
      })
      .all();

    const jobs = records.map((record) => ({
      id: record.id,
      title: record.get('Name'),
      company: record.get('company'),
      description: record.get('desciption'),
      location: record.get('location'),
      salary: record.get('salary'),
      country: record.get('country'),
      seniority: record.get('seniority'),
      remote: record.get('remote'),
      skills: record.get('skills'),
      logo_permanent_url: record.get('logo_permanent_url'),
      remote_string: record.get('remote_string'),
      days_ago_text: record.get('days_ago_text'),
    }));

    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
