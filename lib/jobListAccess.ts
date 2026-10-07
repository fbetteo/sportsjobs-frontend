import 'server-only';

import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

// Visitor limits for the public job-list API routes. Anonymous previews only need
// a handful of jobs (homepage 8, signup preview 4, company pages show 5 unlocked
// plus blurred teasers); signed-in list views request up to 300.
export const ANONYMOUS_JOB_LIST_LIMIT = 20;
export const AUTHENTICATED_JOB_LIST_LIMIT = 300;

export async function resolveJobListAccess(req: NextRequest, defaultLimit: number) {
  let isAuthenticated = false;
  try {
    isAuthenticated = Boolean((await getSession())?.user?.sub);
  } catch (error) {
    // A broken or expired session cookie should degrade to the anonymous view.
    console.error('Job list session check failed:', error);
  }

  const maxLimit = isAuthenticated ? AUTHENTICATED_JOB_LIST_LIMIT : ANONYMOUS_JOB_LIST_LIMIT;
  const requested = parseInt(req.nextUrl.searchParams.get('limit') || '', 10);
  const limit = Math.min(Number.isFinite(requested) && requested > 0 ? requested : defaultLimit, maxLimit);

  return {
    isAuthenticated,
    limit,
    // Descriptions are heavy and are the bulk of the paid content; signed-in only.
    includeFullDetails: isAuthenticated && req.nextUrl.searchParams.get('full') === 'true',
  };
}

// Responses differ per visitor, so they must never be stored in a shared CDN cache
// (an anonymous capped response would otherwise be served to signed-in users).
export function jobListResponse(jobs: unknown[]) {
  const response = NextResponse.json({ jobs });
  response.headers.set('Cache-Control', 'private, max-age=60');
  return response;
}
