// app/api/subscribe-newsletter/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.length) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const API_KEY = process.env.MAILCHIMP_API_KEY ?? '';
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID ?? '';
    const DATACENTER = API_KEY.split('-')[1];

    const data = {
      email_address: email,
      status: 'subscribed',
    };

    const response = await fetch(`https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`, {
      method: 'POST',
      headers: {
        Authorization: `apikey ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status >= 400) {
      return NextResponse.json({ error: `There was an error subscribing this email: ${response.statusText}` }, { status: 400 });
    }

    return NextResponse.json({ error: '' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || (error as Error).toString() }, { status: 500 });
  }
}
