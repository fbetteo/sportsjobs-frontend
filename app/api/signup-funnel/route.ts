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

function normalizeSignupFunnelId(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeOnboardingPayload(value: unknown) {
  const onboarding = typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};

  return {
    ...onboarding,
    roleInterests: [],
    roleUnsure: true,
  };
}

async function parseJsonResponse(response: Response) {
  return response.json().catch(() => null);
}

async function postSignupFunnel(baseUrl: string, payload: Record<string, unknown>) {
  return fetch(`${baseUrl}/users/signup_funnel`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
}

async function patchSignupFunnelAcknowledgement(baseUrl: string, payload: Record<string, unknown>) {
  return fetch(`${baseUrl}/users/signup_funnel/paid-product-acknowledgement`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = normalizeEmail(body.email);
  const name = normalizeName(body.name);
  const signupFunnelId = normalizeSignupFunnelId(body.signupFunnelId || body.signup_funnel_id);

  if (!name || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Name and a valid email are required' }, { status: 400 });
  }

  const baseUrl = backendBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ error: 'Signup funnel backend is not configured' }, { status: 503 });
  }

  try {
    const onboarding = normalizeOnboardingPayload(body.onboarding);
    const legacyPayload = {
      name,
      email,
      onboarding,
      source: 'signup-funnel',
    };
    const modernPayload = {
      signupFunnelId,
      signup_funnel_id: signupFunnelId,
      ...legacyPayload,
    };

    let response = await postSignupFunnel(baseUrl, modernPayload);
    let data = await parseJsonResponse(response);

    if (!response.ok && signupFunnelId) {
      console.warn('Signup funnel modern payload failed; retrying legacy payload', {
        status: response.status,
        error: data?.error || data?.detail,
      });
      response = await postSignupFunnel(baseUrl, legacyPayload);
      data = await parseJsonResponse(response);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || data?.detail || 'Failed to store signup funnel contact' },
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
  const signupFunnelId = normalizeSignupFunnelId(body.signupFunnelId || body.signup_funnel_id);

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }

  const baseUrl = backendBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ error: 'Signup funnel backend is not configured' }, { status: 503 });
  }

  try {
    const paidProductAcknowledgedAt = new Date().toISOString();
    const legacyPayload = {
      email,
      paidProductAcknowledgedAt,
    };
    const modernPayload = {
      signupFunnelId,
      signup_funnel_id: signupFunnelId,
      ...legacyPayload,
    };

    let response = await patchSignupFunnelAcknowledgement(baseUrl, modernPayload);
    let data = await parseJsonResponse(response);

    if (!response.ok && signupFunnelId) {
      console.warn('Signup funnel acknowledgement modern payload failed; retrying legacy payload', {
        status: response.status,
        error: data?.error || data?.detail,
      });
      response = await patchSignupFunnelAcknowledgement(baseUrl, legacyPayload);
      data = await parseJsonResponse(response);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || data?.detail || 'Failed to store acknowledgement' },
        { status: response.status },
      );
    }

    return NextResponse.json(data || { success: true });
  } catch (error) {
    console.error('Signup funnel acknowledgement sync failed:', error);
    return NextResponse.json({ error: 'Failed to store acknowledgement' }, { status: 500 });
  }
}
