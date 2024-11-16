import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAirtableRecord } from '../../utils/airtable';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
    typescript: true,
});

export async function POST(req: NextRequest) {
    try {
        const { sessionId, email, name } = await req.json();

        // Verify the checkout session
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
        }

        // Get plan type from session metadata
        const planType = session.metadata?.mode === 'payment' ? 'lifetime' : 
                        (session.metadata?.priceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID_DEBUG ? 'monthly_subscription' : 'yearly_subscription');

        // Create Airtable record for Google-authenticated user
        await createAirtableRecord(name, email, planType);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Failed to complete registration' }, { status: 500 });
    }
}