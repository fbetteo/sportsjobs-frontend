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

    // Hetzner via FastaPI
    const response = await fetch('http://'+process.env.HETZNER_POSTGRES_HOST+':8000' + '/add_alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`,
      },
      body: JSON.stringify({ name, email, country, seniority, sport_list, skills, remote_office, hours }),
    });


    const data = await response.json();
    console.log('Response from Hetzner server:', data);


    return NextResponse.json({ error: '' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error  as Error).message || (error as Error).toString() }, { status: 500 });
  }
}
