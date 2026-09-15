import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { AuthIdentity, backendJsonHeaders, ensureBackendUserProfile, getBackendBaseUrl, normalizeAuthIdentity } from '../../../lib/userProfileBackend';

export async function POST(req: NextRequest) {
  const session = await getSession();
  const { auth0Sub } = normalizeAuthIdentity((session?.user || {}) as AuthIdentity);
  if (!auth0Sub) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ error: 'Alert service is unavailable' }, { status: 503 });
  }

  const payload = await req.json().catch(() => null);
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'Invalid alert' }, { status: 400 });
  }

  try {
    await ensureBackendUserProfile((session?.user || {}) as AuthIdentity);
    const response = await fetch(`${baseUrl}/alerts`, {
      method: 'POST',
      headers: backendJsonHeaders,
      body: JSON.stringify({ ...payload, auth0Sub }),
      cache: 'no-store',
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json({ error: data?.detail || 'Unable to create alert' }, { status: response.status });
    }
    return NextResponse.json(
      { error: '', alert: data?.record, duplicate: Boolean(data?.duplicate) },
      { status: data?.duplicate ? 200 : 201 },
    );
  } catch (error) {
    console.error('Failed to create alert:', error);
    return NextResponse.json({ error: 'Unable to create alert' }, { status: 502 });
  }
}
