// app/api/get-jobs/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  try {
    const records = await base('jobs')
      .select({ view: 'Grid view', maxRecords: limit })
      .all();

    const jobs = records.map((record) => ({
      id: record.id,
      title: record.get('Name'),
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
