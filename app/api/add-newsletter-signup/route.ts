import { NextRequest, NextResponse } from 'next/server';

// Replace old config with new route segment config
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';

interface NewsletterSignupRequest {
  email: string;
  name?: string;
  source?: string;
}

interface AddNewsletterSignup {
  email: string;
  name: string | null;
  source: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const { email, name, source }: NewsletterSignupRequest = await req.json();

    // Validate required fields
    if (!email || !email.length) {
      return NextResponse.json(
        { error: 'Email is required' }, 
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' }, 
        { status: 400 }
      );
    }

    // Validate source if provided
    const validSources = ['website-modal', 'website-form'];
    if (source && !validSources.includes(source)) {
      return NextResponse.json(
        { error: 'Invalid source. Must be "website-modal" or "website-form"' }, 
        { status: 400 }
      );
    }

    // Format data for Python backend
    const newsletterSignupData: AddNewsletterSignup = {
      email: email.toLowerCase().trim(),
      name: name || null,
      source: source || null
    };

    console.log('Adding newsletter signup to database:', newsletterSignupData);

    // Send to Python backend
    const response = await fetch(`http://${process.env.HETZNER_POSTGRES_HOST}:8000/add_newsletter_signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`
      },
      body: JSON.stringify(newsletterSignupData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Python backend error:', errorText);
      throw new Error(`Database operation failed: ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Newsletter signup added to database successfully:', responseData);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Newsletter signup recorded successfully',
        data: responseData 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Add newsletter signup error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to record newsletter signup' 
      },
      { status: 500 }
    );
  }
}
