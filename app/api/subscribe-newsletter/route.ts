import { NextRequest, NextResponse } from 'next/server';

interface BeehiivSubscriptionData {
  email: string;
  reactivate_existing: boolean;
  send_welcome_email: boolean;
  utm_source: string;
  utm_campaign?: string;
  utm_medium: string;
  referring_site: string;
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.length) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const API_KEY = process.env.BEEHIIV_API_KEY ?? '';
    const AUDIENCE_ID = process.env.BEEHIV_PUBLICATION_ID ?? '';

    const data: BeehiivSubscriptionData = {
      email,
      reactivate_existing: false,
      send_welcome_email: true, // Changed to true to ensure users get welcome email
      utm_source: 'sportsjobs.online',
      utm_medium: 'website',    // Changed to be more specific
      utm_campaign: 'newsletter_signup',
      referring_site: 'sportsjobs.online'
    };

    const response = await fetch(`https://api.beehiiv.com/v2/publications/${AUDIENCE_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
      
    const responseData = await response.json();
    console.log('Beehiiv API Response:', responseData);

    if (response.status >= 400) {
      return NextResponse.json(
        { error: `Subscription failed: ${responseData.message || response.statusText}` }, 
        { status: response.status }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed to newsletter',
        data: responseData 
      }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || (error as Error).toString() }, { status: 500 });
  }
}