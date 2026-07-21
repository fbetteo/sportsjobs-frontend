import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSession } from '@auth0/nextjs-auth0';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
    typescript: true,
});

const SIGNUP_PROMO_CODE = 'SPORTS25';

type PlanId = 'monthly_subscription' | 'yearly_subscription' | 'lifetime';

type CheckoutPlan = {
    id: PlanId;
    name: string;
    priceId?: string;
    priceValue: number;
    mode: 'payment' | 'subscription';
};

function getCheckoutPlans(): CheckoutPlan[] {
    return [
        {
            id: 'monthly_subscription',
            name: 'Monthly',
            priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
            priceValue: 6.99,
            mode: 'subscription',
        },
        {
            id: 'yearly_subscription',
            name: 'Yearly',
            priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID,
            priceValue: 39,
            mode: 'subscription',
        },
        {
            id: 'lifetime',
            name: 'Lifetime',
            priceId: process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID,
            priceValue: 59,
            mode: 'payment',
        },
    ];
}

function normalizePlanId(value: unknown): PlanId | null {
    if (typeof value !== 'string') return null;
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue === 'monthly' || normalizedValue === 'monthly_subscription') return 'monthly_subscription';
    if (normalizedValue === 'yearly' || normalizedValue === 'yearly_subscription') return 'yearly_subscription';
    if (normalizedValue === 'lifetime') return 'lifetime';
    return null;
}

async function getSignupPromotionCodeId() {
    const configuredPromotionCodeId = process.env.STRIPE_SIGNUP_PROMOTION_CODE_ID?.trim();
    if (configuredPromotionCodeId) return configuredPromotionCodeId;

    const promotionCodes = await stripe.promotionCodes.list({
        active: true,
        code: SIGNUP_PROMO_CODE,
        limit: 1,
    });

    return promotionCodes.data[0]?.id || '';
}

// Get base URL from environment or construct from request
const getBaseUrl = (req: NextRequest) => {
    return process.env.NEXT_PUBLIC_BASE_URL || 
           `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`;
};

export async function POST(req: NextRequest) {
    try {
        const { priceId, referral, planId, planName, signupFunnelId, contactName, contactEmail } = await req.json();
        const sessionUser = (await getSession())?.user;

        const checkoutPlans = getCheckoutPlans();
        const normalizedPlanId = normalizePlanId(planId) || normalizePlanId(planName);
        const selectedPlan = checkoutPlans.find((plan) => plan.id === normalizedPlanId)
            || checkoutPlans.find((plan) => plan.priceId && plan.priceId === priceId);

        if (!selectedPlan?.priceId) {
            return NextResponse.json(
                { error: 'Invalid or unavailable subscription plan' },
                { status: 400 }
            );
        }

        if (priceId && priceId !== selectedPlan.priceId) {
            return NextResponse.json(
                { error: 'Plan and price ID do not match' },
                { status: 400 }
            );
        }

        const baseUrl = getBaseUrl(req);
        const isAuthenticatedUpgrade = !!sessionUser?.sub;
        const normalizedSignupFunnelId = typeof signupFunnelId === 'string' ? signupFunnelId.trim() : '';
        const normalizedContactName = typeof contactName === 'string' ? contactName.trim() : '';
        const normalizedContactEmail = typeof contactEmail === 'string' ? contactEmail.trim().toLowerCase() : '';
        const checkoutEmail = typeof sessionUser?.email === 'string' ? sessionUser.email : normalizedContactEmail;
        const checkoutName = typeof sessionUser?.name === 'string' ? sessionUser.name : normalizedContactName;
        const signupPromotionCodeId = isAuthenticatedUpgrade ? '' : await getSignupPromotionCodeId();

        if (!isAuthenticatedUpgrade && !signupPromotionCodeId) {
            return NextResponse.json(
                { error: `${SIGNUP_PROMO_CODE} is not configured in Stripe` },
                { status: 503 }
            );
        }

        let successUrl = isAuthenticatedUpgrade
            ? '/?upgrade=success&session_id={CHECKOUT_SESSION_ID}'
            : '/signup/success?session_id={CHECKOUT_SESSION_ID}';
        successUrl += `&plan=${encodeURIComponent(selectedPlan.name)}`;
        successUrl += `&plan_id=${encodeURIComponent(selectedPlan.id)}`;
        if (!isAuthenticatedUpgrade && normalizedSignupFunnelId) {
            successUrl += `&signup_funnel_id=${encodeURIComponent(normalizedSignupFunnelId)}`;
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: selectedPlan.priceId,
                quantity: 1,
            }],
            mode: selectedPlan.mode,
            allow_promotion_codes: isAuthenticatedUpgrade ? true : undefined,
            discounts: signupPromotionCodeId ? [{ promotion_code: signupPromotionCodeId }] : undefined,
            billing_address_collection: 'required',
            success_url: new URL(successUrl, baseUrl).toString(),
            cancel_url: new URL(
                isAuthenticatedUpgrade
                    ? '/?upgrade=canceled'
                    : `/signup?step=plans&plan=${encodeURIComponent(selectedPlan.id)}&canceled=true`,
                baseUrl,
            ).toString(),
            customer_email: checkoutEmail || undefined,
            client_reference_id: typeof sessionUser?.sub === 'string' ? sessionUser.sub : undefined,
            metadata: {
                priceId: selectedPlan.priceId,
                planId: selectedPlan.id,
                planName: selectedPlan.name,
                auth0_sub: typeof sessionUser?.sub === 'string' ? sessionUser.sub : '',
                email: checkoutEmail || '',
                name: checkoutName || '',
                signup_funnel_id: normalizedSignupFunnelId,
                source: isAuthenticatedUpgrade ? 'dashboard-upgrade' : 'signup-funnel',
                promotekit_referral: referral || '',
                promotion_code: signupPromotionCodeId ? SIGNUP_PROMO_CODE : '',
            }
        });

        return NextResponse.json({
            url: session.url,
            checkout: {
                planId: selectedPlan.id,
                planName: selectedPlan.name,
                value: typeof session.amount_total === 'number'
                    ? session.amount_total / 100
                    : Math.round(selectedPlan.priceValue * 0.75 * 100) / 100,
                currency: session.currency?.toUpperCase() || 'USD',
                coupon: signupPromotionCodeId ? SIGNUP_PROMO_CODE : null,
            },
        });
    } catch (error) {
        console.error('Stripe session creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
