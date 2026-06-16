import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { OnboardingAnswers } from '../../../lib/userProfile';
import {
    AuthIdentity,
    backendJsonHeaders,
    ensureBackendUserProfile,
    fallbackUserProfile,
    fetchBackendUserProfile,
    getBackendBaseUrl,
    normalizeAuthIdentity
} from '../../../lib/userProfileBackend';
function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
}

function normalizeOnboardingAnswers(value: unknown): OnboardingAnswers {
  const input = typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};

  return {
    sportsInterests: normalizeStringArray(input.sportsInterests),
    jobSearchDuration: typeof input.jobSearchDuration === 'string' ? input.jobSearchDuration.trim() : '',
    hardestPart: typeof input.hardestPart === 'string' ? input.hardestPart.trim() : '',
    country: typeof input.country === 'string' ? input.country.trim() : '',
    roleInterests: normalizeStringArray(input.roleInterests),
    roleUnsure: input.roleUnsure === true,
  };
}

async function requireUser() {
  const session = await getSession();
  const user = session?.user as AuthIdentity | undefined;

  if (!user?.sub) {
    return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) };
  }

  return { user };
}

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const user = auth.user;
  const { auth0Sub } = normalizeAuthIdentity(user);

  try {
    const profile = await fetchBackendUserProfile(`/users/me?auth0_sub=${encodeURIComponent(auth0Sub)}`);
    return NextResponse.json(profile || fallbackUserProfile(user));
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return NextResponse.json(fallbackUserProfile(user));
  }
}

export async function POST() {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const user = auth.user;

  try {
    const profile = await ensureBackendUserProfile(user);
    return NextResponse.json(profile || fallbackUserProfile(user));
  } catch (error) {
    console.error('Failed to ensure user profile:', error);
    return NextResponse.json(fallbackUserProfile(user));
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ error: 'User profile backend is not configured' }, { status: 503 });
  }

  const user = auth.user;
  const body = await req.json().catch(() => ({}));
  const onboarding = normalizeOnboardingAnswers(body.onboarding);

  if (
    onboarding.sportsInterests.length === 0 ||
    !onboarding.jobSearchDuration ||
    !onboarding.hardestPart ||
    (!onboarding.roleUnsure && onboarding.roleInterests.length === 0)
  ) {
    return NextResponse.json({ error: 'Please complete all onboarding questions' }, { status: 400 });
  }

  try {
    const response = await fetch(`${baseUrl}/users/me/onboarding`, {
      method: 'PATCH',
      headers: backendJsonHeaders,
      body: JSON.stringify({
        auth0Sub: normalizeAuthIdentity(user).auth0Sub,
        onboarding,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      return NextResponse.json(
        { error: data?.error || 'Failed to save onboarding answers' },
        { status: response.status },
      );
    }

    const profile = await response.json();
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Failed to save onboarding answers:', error);
    return NextResponse.json({ error: 'Failed to save onboarding answers' }, { status: 500 });
  }
}
