import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAuth0AccessToken, disableAuth0User } from '../../utils/auth0';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    
});

const STRIPE_CANCELLATION_FEEDBACK = [
    'customer_service',
    'low_quality',
    'missing_features',
    'other',
    'switched_service',
    'too_complex',
    'too_expensive',
    'unused',
] as const;

type StripeCancellationFeedback = typeof STRIPE_CANCELLATION_FEEDBACK[number];

interface CancelSubscriptionRequest {
    email?: string;
    cancellationFeedback?: StripeCancellationFeedback;
    cancellationComment?: string;
}

function isStripeCancellationFeedback(value: unknown): value is StripeCancellationFeedback {
    return typeof value === 'string' && STRIPE_CANCELLATION_FEEDBACK.includes(value as StripeCancellationFeedback);
}

export async function POST(req: NextRequest) {
    try {
        const { email, cancellationFeedback, cancellationComment }: CancelSubscriptionRequest = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        if (cancellationFeedback && !isStripeCancellationFeedback(cancellationFeedback)) {
            return NextResponse.json({ error: 'Invalid cancellation feedback' }, { status: 400 });
        }

        const normalizedComment = typeof cancellationComment === 'string'
            ? cancellationComment.trim().slice(0, 500)
            : '';

        // Fetch the customer from Stripe
        const customers = await stripe.customers.list({ email, limit: 1 });
        if (customers.data.length === 0) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }
        const customer = customers.data[0];

        // Cancel the subscription
        const subscriptions = await stripe.subscriptions.list({ customer: customer.id, limit: 1 });
        if (subscriptions.data.length === 0) {
            return NextResponse.json({ error: 'Subscription not found. Please contact via email to franco@sportsjobs.online' }, { status: 404 });
        }
        const subscription = subscriptions.data[0];
        const updateParams: Stripe.SubscriptionUpdateParams = { cancel_at_period_end: true };

        if (cancellationFeedback || normalizedComment) {
            updateParams.cancellation_details = {};

            if (cancellationFeedback) {
                updateParams.cancellation_details.feedback = cancellationFeedback;
            }

            if (normalizedComment) {
                updateParams.cancellation_details.comment = normalizedComment;
            }
        }

        await stripe.subscriptions.update(subscription.id, updateParams);

        // Disable the user in Auth0
        const accessToken = await getAuth0AccessToken();
        await disableAuth0User(email, accessToken);


        return NextResponse.json({ status: 'canceled' });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
