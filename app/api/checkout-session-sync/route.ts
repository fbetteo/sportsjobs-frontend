import { NextRequest, NextResponse } from 'next/server';
import { backendJsonHeaders, getBackendBaseUrl } from '../../../lib/userProfileBackend';

function normalizeSessionId(value: unknown) {
    return typeof value === 'string' ? value.trim() : '';
}

function normalizeSignupFunnelId(value: unknown) {
    return typeof value === 'string' ? value.trim() : '';
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const sessionId = normalizeSessionId(body.sessionId || body.session_id);
    const signupFunnelId = normalizeSignupFunnelId(body.signupFunnelId || body.signup_funnel_id);

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing checkout session ID' }, { status: 400 });
    }

    const baseUrl = getBackendBaseUrl();
    if (!baseUrl) {
        return NextResponse.json({ error: 'Checkout sync backend is not configured' }, { status: 503 });
    }

    try {
        const response = await fetch(`${baseUrl}/stripe/checkout-session/sync`, {
            method: 'POST',
            headers: backendJsonHeaders,
            body: JSON.stringify({
                session_id: sessionId,
                signup_funnel_id: signupFunnelId,
            }),
            cache: 'no-store',
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            return NextResponse.json(
                { error: data?.error || data?.detail || 'Checkout session sync failed' },
                { status: response.status },
            );
        }

        return NextResponse.json(data || { success: true });
    } catch (error) {
        console.error('Checkout session sync failed:', error);
        return NextResponse.json({ error: 'Checkout session sync failed' }, { status: 500 });
    }
}
