import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import Stripe from 'stripe';
import {
    AuthIdentity,
    backendJsonHeaders,
    getBackendBaseUrl,
    normalizeAuthIdentity,
} from '../../../lib/userProfileBackend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
    typescript: true,
});

const SUPPORT_MESSAGE = 'Subscription not found. Please contact franco@sportsjobs.online and we will help cancel it.';
const AMBIGUOUS_SUBSCRIPTION_MESSAGE = 'We found more than one matching Stripe subscription. Please contact franco@sportsjobs.online so we can cancel the right one.';

const CANCELLABLE_SUBSCRIPTION_STATUSES = new Set<Stripe.Subscription.Status>([
    'active',
    'trialing',
    'past_due',
]);

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
    cancellationFeedback?: StripeCancellationFeedback;
    cancellationComment?: string;
}

interface BackendBillingResponse {
    email?: unknown;
    stripe_customer_id?: unknown;
    stripe_subscription_id?: unknown;
}

interface BillingIdentity {
    email: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
}

class BillingIdentityError extends Error {
    constructor(message: string, public status: number) {
        super(message);
    }
}

function isStripeCancellationFeedback(value: unknown): value is StripeCancellationFeedback {
    return typeof value === 'string' && STRIPE_CANCELLATION_FEEDBACK.includes(value as StripeCancellationFeedback);
}

function normalizeBillingIdentity(data: BackendBillingResponse): BillingIdentity {
    const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
    const stripeCustomerId = typeof data.stripe_customer_id === 'string'
            ? data.stripe_customer_id.trim()
            : '';
    const stripeSubscriptionId = typeof data.stripe_subscription_id === 'string'
            ? data.stripe_subscription_id.trim()
            : '';

    return { email, stripeCustomerId, stripeSubscriptionId };
}

async function fetchBillingIdentity(auth0Sub: string) {
    const baseUrl = getBackendBaseUrl();
    if (!baseUrl) {
        throw new Error('User billing backend is not configured');
    }

    const response = await fetch(`${baseUrl}/users/billing?auth0_sub=${encodeURIComponent(auth0Sub)}`, {
        headers: backendJsonHeaders,
        cache: 'no-store',
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new BillingIdentityError(SUPPORT_MESSAGE, 404);
        }

        throw new BillingIdentityError('We could not verify your billing details. Please contact franco@sportsjobs.online and we will help cancel it.', 502);
    }

    const data = await response.json() as BackendBillingResponse;
    return normalizeBillingIdentity(data);
}

function getCancellationUpdateParams(cancellationFeedback?: StripeCancellationFeedback, normalizedComment = '') {
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

    return updateParams;
}

function isCancellableSubscription(subscription: Stripe.Subscription) {
    return CANCELLABLE_SUBSCRIPTION_STATUSES.has(subscription.status);
}

async function findSingleCancellableSubscriptionForCustomer(customerId: string) {
    const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        limit: 100,
    });
    const cancellableSubscriptions = subscriptions.data.filter(isCancellableSubscription);

    if (cancellableSubscriptions.length > 1) {
        return { error: AMBIGUOUS_SUBSCRIPTION_MESSAGE };
    }

    return { subscription: cancellableSubscriptions[0] || null };
}

async function findSingleCustomerByEmail(email: string) {
    const customers = await stripe.customers.list({ email, limit: 2 });

    if (customers.data.length > 1) {
        return { error: AMBIGUOUS_SUBSCRIPTION_MESSAGE };
    }

    return { customer: customers.data[0] || null };
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        const sessionUser = session?.user as AuthIdentity | undefined;
        const { auth0Sub } = normalizeAuthIdentity(sessionUser || {});

        if (!auth0Sub) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const { cancellationFeedback, cancellationComment }: CancelSubscriptionRequest = await req.json().catch(() => ({}));

        if (cancellationFeedback && !isStripeCancellationFeedback(cancellationFeedback)) {
            return NextResponse.json({ error: 'Invalid cancellation feedback' }, { status: 400 });
        }

        const normalizedComment = typeof cancellationComment === 'string'
            ? cancellationComment.trim().slice(0, 500)
            : '';

        const billingIdentity = await fetchBillingIdentity(auth0Sub);
        const updateParams = getCancellationUpdateParams(cancellationFeedback, normalizedComment);

        if (billingIdentity.stripeSubscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(billingIdentity.stripeSubscriptionId);

            if (!isCancellableSubscription(subscription)) {
                return NextResponse.json({ error: SUPPORT_MESSAGE }, { status: 404 });
            }

            await stripe.subscriptions.update(subscription.id, updateParams);
            return NextResponse.json({ status: 'scheduled_for_cancellation' });
        }

        if (billingIdentity.stripeCustomerId) {
            const result = await findSingleCancellableSubscriptionForCustomer(billingIdentity.stripeCustomerId);

            if (result.error) {
                return NextResponse.json({ error: result.error }, { status: 409 });
            }

            if (!result.subscription) {
                return NextResponse.json({ error: SUPPORT_MESSAGE }, { status: 404 });
            }

            await stripe.subscriptions.update(result.subscription.id, updateParams);
            return NextResponse.json({ status: 'scheduled_for_cancellation' });
        }

        if (billingIdentity.email) {
            const customerResult = await findSingleCustomerByEmail(billingIdentity.email);

            if (customerResult.error) {
                return NextResponse.json({ error: customerResult.error }, { status: 409 });
            }

            if (!customerResult.customer) {
                return NextResponse.json({ error: SUPPORT_MESSAGE }, { status: 404 });
            }

            const subscriptionResult = await findSingleCancellableSubscriptionForCustomer(customerResult.customer.id);

            if (subscriptionResult.error) {
                return NextResponse.json({ error: subscriptionResult.error }, { status: 409 });
            }

            if (!subscriptionResult.subscription) {
                return NextResponse.json({ error: SUPPORT_MESSAGE }, { status: 404 });
            }

            await stripe.subscriptions.update(subscriptionResult.subscription.id, updateParams);
            return NextResponse.json({ status: 'scheduled_for_cancellation' });
        }

        return NextResponse.json({ error: SUPPORT_MESSAGE }, { status: 404 });
    } catch (error) {
        if (error instanceof BillingIdentityError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        console.error('Failed to cancel subscription:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
