
import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN ?? '' }).base(process.env.AIRTABLE_BASE ?? '');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') ?? '';

  try {
      const record = await base('jobs').find(id);

      const job=   {
        id: record.id,
        title: record.get('Name'),
        company: record.get('company'),
        description: record.get('desciption'),
        start_date: record.get('Start date'),
        location: record.get('location'),
        hours: record.get('hours'),
        salary: record.get('salary'),
        country: record.get('country'),
        country_code: record.get('country_code'),
        seniority: record.get('seniority'),
        remote: record.get('remote'),
        skills: record.get('skills'),
        logo_permanent_url: record.get('logo_permanent_url'),
        remote_string: record.get('remote_string'),
        days_ago_text: record.get('days_ago_text'),
        industry: record.get('industry'),
        job_area: record.get('job_area'),
        apply_url: record.get('url'),
    };

    return NextResponse.json({ job });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
