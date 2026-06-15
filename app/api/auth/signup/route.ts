import { NextRequest, NextResponse } from 'next/server';
import { getAuth0AccessToken, createAuth0User } from '../../../utils/auth0';
import Stripe from 'stripe';
import { validatePasswordStrength } from '../../../../lib/validatePasswordStrength';
import { ensureBackendUserProfile } from '../../../../lib/userProfileBackend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
    typescript: true,
});

export async function POST(req: NextRequest) {
    try {
        const { email, password, name, sessionId } = await req.json();

        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
        const normalizedName = typeof name === 'string' ? name.trim() : '';

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

        if (sessionId) {
            // Legacy paid-first signup flow.
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            if (!session) {
                return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
            }
        }

        // Create Auth0 user
        const accessToken = await getAuth0AccessToken();
        const auth0User = await createAuth0User(normalizedEmail, password, accessToken, normalizedName);

        try {
            await ensureBackendUserProfile({
                sub: auth0User.user_id,
                email: normalizedEmail,
                name: normalizedName,
            });
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
