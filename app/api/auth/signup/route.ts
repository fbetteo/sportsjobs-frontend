import { NextRequest, NextResponse } from 'next/server';
import { getAuth0AccessToken, createAuth0User } from '../../../utils/auth0';
import { createAirtableRecord } from '../../../utils/airtable';
import Stripe from 'stripe';
import { validatePasswordStrength } from '../../../../lib/validatePasswordStrength';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
    typescript: true,
});

export async function POST(req: NextRequest) {
    try {
        const { email, password, name, sessionId } = await req.json();

        // Validate password strength
        const passwordError = validatePasswordStrength(password);
        if (passwordError) {
            return NextResponse.json(
                { error: passwordError },
                { status: 400 }
            );
        }

        // Verify the session first
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
        }

        // Create Auth0 user
        const accessToken = await getAuth0AccessToken();
        await createAuth0User(email, password, accessToken);

        // Get plan type from session metadata
        const planType = session.metadata?.mode === 'payment' ? 'lifetime' : 
                        (session.metadata?.priceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? 'monthly_subscription' : 'yearly_subscription');

        // Create Airtable record
        await createAirtableRecord(name, email, planType);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }
}