import { NextRequest, NextResponse } from 'next/server';

const SUBSTACK_SUBSCRIBE_URL = 'https://sportsjobs.substack.com/subscribe';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.length) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const subscribeUrl = `${SUBSTACK_SUBSCRIBE_URL}?utm_source=sportsjobs.online&utm_medium=website&utm_campaign=newsletter_signup&email=${encodeURIComponent(email)}`;

    return NextResponse.json(
      { 
        success: true, 
        message: 'Continue subscription on Substack',
        subscribeUrl
      }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || (error as Error).toString() }, { status: 500 });
  }
}