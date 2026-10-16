// A readable "probably signed in" cookie so the client can skip `/api/auth/me` for
// anonymous visitors. Without it, Auth0's UserProvider calls that function on every page
// load for every visitor and crawler. The Auth0 session cookie itself stays httpOnly and
// remains the only source of truth: a stale hint only costs one `/api/auth/me` call.

export const SESSION_HINT_COOKIE = 'sj_signed_in';
const SESSION_HINT_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
// Sessions created before the hint existed have no cookie, so each browser is checked once.
// Auth0 sessions last at most 7 days by default, so after this date no such session
// remains and the check (and this fallback) can be removed.
const LEGACY_SESSION_CHECK_UNTIL = Date.parse('2026-10-27');
const LEGACY_SESSION_CHECKED_KEY = 'sj_session_hint_checked';

export const sessionHintCookie = (value: '1' | '') =>
  `${SESSION_HINT_COOKIE}=${value}; Path=/; Max-Age=${value ? SESSION_HINT_MAX_AGE_SECONDS : 0}; SameSite=Lax; Secure`;

function hasSessionHint() {
  return document.cookie.split('; ').some((cookie) => cookie === `${SESSION_HINT_COOKIE}=1`);
}

function shouldCheckLegacySession() {
  if (Date.now() > LEGACY_SESSION_CHECK_UNTIL) return false;
  try {
    if (localStorage.getItem(LEGACY_SESSION_CHECKED_KEY)) return false;
    localStorage.setItem(LEGACY_SESSION_CHECKED_KEY, '1');
    return true;
  } catch {
    return false;
  }
}

// Same contract as the SDK's default fetcher: undefined when signed out, throw on errors.
export async function fetchUserIfSignedIn(url: string) {
  if (!hasSessionHint() && !shouldCheckLegacySession()) return undefined;

  const response = await fetch(url);
  if (response.status === 204 || response.status === 401) {
    document.cookie = sessionHintCookie('');
    return undefined;
  }
  if (!response.ok) {
    throw new Error(`Failed to load the signed-in user (${response.status})`);
  }
  // Refresh the hint so active sessions never outlive it.
  document.cookie = sessionHintCookie('1');
  return response.json();
}
