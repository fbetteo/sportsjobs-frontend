import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
    typescript: true,
});

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get('session_id')?.trim();

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing checkout session ID' }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (
            session.metadata?.source !== 'signup-funnel'
            || session.status !== 'complete'
            || session.payment_status !== 'paid'
        ) {
            return NextResponse.json({ error: 'Checkout session is not a completed signup payment' }, { status: 400 });
        }

        return NextResponse.json({
            sessionId: session.id,
            planId: session.metadata?.planId || '',
            planName: session.metadata?.planName || 'Subscription',
            signupFunnelId: session.metadata?.signup_funnel_id || '',
            value: typeof session.amount_total === 'number' ? session.amount_total / 100 : 0,
            currency: session.currency?.toUpperCase() || 'USD',
        });
    } catch (error) {
        console.error('Checkout session verification error:', error);
        return NextResponse.json({ error: 'Could not verify checkout session' }, { status: 400 });
    }
}
