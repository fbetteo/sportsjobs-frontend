// app/api/get-jobs-featured/route.ts
// Public featured-job list for client components. Limits depend on the visitor's
// session (see lib/jobListAccess.ts); server pages use lib/jobsBackend.ts directly.

import { NextRequest, NextResponse } from 'next/server';
import { fetchJobListFromBackend } from '@/lib/jobsBackend';
import { jobListResponse, resolveJobListAccess } from '@/lib/jobListAccess';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { limit, includeFullDetails } = await resolveJobListAccess(req, 7);

  try {
    const jobs = await fetchJobListFromBackend({
      limit,
      featuredOnly: true,
      includeFullDetails,
      revalidateSeconds: 600, // featured jobs change less often
    });
    return jobListResponse(jobs);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
