// app/api/submit-form/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN ?? '' }).base(process.env.AIRTABLE_BASE ?? '');

export async function POST(req: NextRequest) {
  const { name, email, country, seniority, sport_list, skills, remote_office, hours } = await req.json();

  try {
    await base('alerts').create([
      {
        fields: {
          Name: name,
          email: email,
          country: country,
          seniority: seniority,
        sport_list: sport_list,
        skills: skills,
        remote_office: remote_office,
        hours: hours,
          
        },
      },
    ]);

    return NextResponse.json({ error: '' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error  as Error).message || (error as Error).toString() }, { status: 500 });
  }
}
