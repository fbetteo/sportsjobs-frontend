import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { AuthIdentity, backendJsonHeaders, getBackendBaseUrl, normalizeAuthIdentity } from '../../../lib/userProfileBackend';

async function alertRequest(method: 'GET' | 'DELETE', alertId?: number) {
  const session = await getSession();
  const { auth0Sub } = normalizeAuthIdentity((session?.user || {}) as AuthIdentity);
  if (!auth0Sub) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ error: 'Alert service is unavailable' }, { status: 503 });
  }

  const path = alertId === undefined ? '/alerts' : `/alerts/${alertId}`;
  try {
    const response = await fetch(`${baseUrl}${path}?auth0_sub=${encodeURIComponent(auth0Sub)}`, {
      method,
      headers: backendJsonHeaders,
      cache: 'no-store',
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json({ error: data?.detail || 'Unable to manage alerts' }, { status: response.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to manage alerts:', error);
    return NextResponse.json({ error: 'Unable to manage alerts' }, { status: 502 });
  }
}

export async function GET() {
  return alertRequest('GET');
}

export async function DELETE(req: NextRequest) {
  const rawId = req.nextUrl.searchParams.get('id');
  const alertId = Number(rawId);
  if (!rawId || !Number.isSafeInteger(alertId) || alertId <= 0) {
    return NextResponse.json({ error: 'Invalid alert ID' }, { status: 400 });
  }
  return alertRequest('DELETE', alertId);
}
