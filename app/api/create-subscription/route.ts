import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAuth0AccessToken, createAuth0User } from '../../utils/auth0';
import { createAirtableRecord } from '../../utils/airtable';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
    typescript: true,
});

// Get base URL from environment or construct from request
const getBaseUrl = (req: NextRequest) => {
    return process.env.NEXT_PUBLIC_BASE_URL || 
           `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`;
};

export async function POST(req: NextRequest) {
    try {
        const { priceId } = await req.json();

        if (!priceId) {
            return NextResponse.json(
                { error: 'Missing price ID' },
                { status: 400 }
            );
        }

        const baseUrl = getBaseUrl(req);
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            mode: priceId === process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID_DEBUG ? 'payment' : 'subscription',
            allow_promotion_codes: true,
            billing_address_collection: 'required',
            success_url: new URL('/signup/success?session_id={CHECKOUT_SESSION_ID}', baseUrl).toString(),
            cancel_url: new URL('/signup?canceled=true', baseUrl).toString(),
            metadata: {
                priceId
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe session creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}