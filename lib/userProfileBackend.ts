import 'server-only';

import { UserProfile } from './userProfile';

export type AuthIdentity = {
  sub?: unknown;
  email?: unknown;
  name?: unknown;
  nickname?: unknown;
};

export type NormalizedAuthIdentity = Pick<UserProfile, 'auth0Sub' | 'email' | 'name'>;

export function normalizeAuthIdentity(user: AuthIdentity): NormalizedAuthIdentity {
  const email = typeof user.email === 'string' ? user.email : '';
  const name = typeof user.name === 'string'
    ? user.name
    : typeof user.nickname === 'string'
      ? user.nickname
      : email;

  return {
    auth0Sub: typeof user.sub === 'string' ? user.sub : '',
    email,
    name,
  };
}

export function fallbackUserProfile(user: AuthIdentity): UserProfile {
  return {
    ...normalizeAuthIdentity(user),
    plan: 'free',
    subscriptionStatus: 'none',
    onboardingCompletedAt: null,
    onboarding: {},
    backendStatus: 'pending_backend',
  };
}

export function getBackendBaseUrl() {
  const host = process.env.HETZNER_POSTGRES_HOST;
  return host ? `http://${host}:8000` : null;
}

export const backendJsonHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`,
};

export async function fetchBackendUserProfile(path: string, init?: RequestInit) {
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) return null;

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...backendJsonHeaders,
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Backend profile request failed with ${response.status}`);
  }

  return response.json() as Promise<UserProfile>;
}

export async function ensureBackendUserProfile(user: AuthIdentity) {
  return fetchBackendUserProfile('/users/ensure', {
    method: 'POST',
    body: JSON.stringify(normalizeAuthIdentity(user)),
  });
}

export async function claimBackendPaidSignupUser({
  sub,
  email,
  name,
  sessionId,
  signupFunnelId,
  checkoutEmail,
  checkoutName,
  stripeCustomerId,
  stripeSubscriptionId,
}: {
  sub: string;
  email: string;
  name: string;
  sessionId: string;
  signupFunnelId?: string;
  checkoutEmail?: string;
  checkoutName?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}) {
  return fetchBackendUserProfile('/users/signup_funnel/claim', {
    method: 'POST',
    body: JSON.stringify({
      auth0Sub: sub,
      auth0_sub: sub,
      email,
      name,
      finalEmail: email,
      final_email: email,
      finalName: name,
      final_name: name,
      checkoutEmail: checkoutEmail || '',
      checkout_email: checkoutEmail || '',
      checkoutName: checkoutName || '',
      checkout_name: checkoutName || '',
      sessionId,
      session_id: sessionId,
      signupFunnelId: signupFunnelId || '',
      signup_funnel_id: signupFunnelId || '',
      stripeCustomerId: stripeCustomerId || '',
      stripe_customer_id: stripeCustomerId || '',
      stripeSubscriptionId: stripeSubscriptionId || '',
      stripe_subscription_id: stripeSubscriptionId || '',
    }),
  });
}
