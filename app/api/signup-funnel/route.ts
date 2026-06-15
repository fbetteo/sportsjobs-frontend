import { NextRequest, NextResponse } from 'next/server';

const backendBaseUrl = () => {
  const host = process.env.HETZNER_POSTGRES_HOST;
  return host ? `http://${host}:8000` : null;
};

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`,
};

function normalizeEmail(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function normalizeName(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = normalizeEmail(body.email);
  const name = normalizeName(body.name);

  if (!name || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Name and a valid email are required' }, { status: 400 });
  }

  const baseUrl = backendBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ error: 'Signup funnel backend is not configured' }, { status: 503 });
  }

  try {
    const response = await fetch(`${baseUrl}/users/signup_funnel`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name,
        email,
        onboarding: body.onboarding || {},
        source: 'signup-funnel',
      }),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Failed to store signup funnel contact' },
        { status: response.status },
      );
    }

    return NextResponse.json(data || { success: true });
  } catch (error) {
    console.error('Signup funnel contact sync failed:', error);
    return NextResponse.json({ error: 'Failed to store signup funnel contact' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = normalizeEmail(body.email);

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }

  const baseUrl = backendBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ error: 'Signup funnel backend is not configured' }, { status: 503 });
  }

  try {
    const response = await fetch(`${baseUrl}/users/signup_funnel/paid-product-acknowledgement`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        email,
        paidProductAcknowledgedAt: new Date().toISOString(),
      }),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Failed to store acknowledgement' },
        { status: response.status },
      );
    }

    return NextResponse.json(data || { success: true });
  } catch (error) {
    console.error('Signup funnel acknowledgement sync failed:', error);
    return NextResponse.json({ error: 'Failed to store acknowledgement' }, { status: 500 });
  }
}
