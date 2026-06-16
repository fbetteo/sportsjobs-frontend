import { NextRequest, NextResponse } from 'next/server';
import { getAuth0AccessToken, createAuth0User } from '../../../utils/auth0';
import Stripe from 'stripe';
import { validatePasswordStrength } from '../../../../lib/validatePasswordStrength';
import { claimBackendPaidSignupUser, ensureBackendUserProfile } from '../../../../lib/userProfileBackend';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
    typescript: true,
});

export async function POST(req: NextRequest) {
    try {
        const { email, password, name, sessionId, signupFunnelId } = await req.json();

        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
        const normalizedName = typeof name === 'string' ? name.trim() : '';
        const normalizedSessionId = typeof sessionId === 'string' ? sessionId.trim() : '';
        const normalizedSignupFunnelId = typeof signupFunnelId === 'string' ? signupFunnelId.trim() : '';
        let checkoutEmail = '';
        let checkoutName = '';
        let stripeCustomerId = '';
        let stripeSubscriptionId = '';

        if (!normalizedEmail || !normalizedName || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Validate password strength
        const passwordError = validatePasswordStrength(password);
        if (passwordError) {
            return NextResponse.json(
                { error: passwordError },
                { status: 400 }
            );
        }

        if (normalizedSessionId) {
            // Legacy paid-first signup flow.
            const session = await stripe.checkout.sessions.retrieve(normalizedSessionId);
            if (!session) {
                return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
            }

            if (session.status !== 'complete' || session.payment_status !== 'paid') {
                return NextResponse.json({ error: 'Checkout has not been paid' }, { status: 400 });
            }

            const sessionSignupFunnelId = session.metadata?.signup_funnel_id || '';
            checkoutEmail = (
                session.metadata?.email ||
                session.customer_details?.email ||
                session.customer_email ||
                ''
            ).trim().toLowerCase();
            checkoutName = (
                session.metadata?.name ||
                session.customer_details?.name ||
                ''
            ).trim();
            stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id || '';
            stripeSubscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id || '';

            if (
                normalizedSignupFunnelId &&
                sessionSignupFunnelId &&
                normalizedSignupFunnelId !== sessionSignupFunnelId
            ) {
                return NextResponse.json({ error: 'Signup session does not match checkout session' }, { status: 400 });
            }
        }

        // Create Auth0 user
        const accessToken = await getAuth0AccessToken();
        const auth0User = await createAuth0User(normalizedEmail, password, accessToken, normalizedName);

        try {
            if (normalizedSessionId) {
                const claimedProfile = await claimBackendPaidSignupUser({
                    sub: auth0User.user_id,
                    email: normalizedEmail,
                    name: normalizedName,
                    sessionId: normalizedSessionId,
                    signupFunnelId: normalizedSignupFunnelId,
                    checkoutEmail,
                    checkoutName,
                    stripeCustomerId,
                    stripeSubscriptionId,
                });
                if (!claimedProfile) {
                    throw new Error('Paid signup backend is not configured');
                }
            } else {
                await ensureBackendUserProfile({
                    sub: auth0User.user_id,
                    email: normalizedEmail,
                    name: normalizedName,
                });
            }
        } catch (backendError) {
            console.error('Failed to ensure backend user during signup:', backendError);
            return NextResponse.json({
                success: true,
                backendStatus: 'pending_backend',
                message: 'Account created. Profile sync will retry after login.',
            });
        }

        return NextResponse.json({ success: true, backendStatus: 'synced' });
    } catch (error) {
        console.error('Signup error:', error);
        const message = error instanceof Error ? error.message : 'Failed to create account';
        const status = message.toLowerCase().includes('already exists') ? 409 : 500;
        return NextResponse.json({ error: message }, { status });
    }
}
