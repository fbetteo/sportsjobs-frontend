// app/api/get-jobs/route.ts
// Public job-list endpoint for client components. Limits depend on the visitor's
// session (see lib/jobListAccess.ts); server pages use lib/jobsBackend.ts directly.

import { NextRequest, NextResponse } from 'next/server';
import { fetchJobListFromBackend, JOB_LIST_FILTER_KEYS, JobListFilters } from '@/lib/jobsBackend';
import { jobListResponse, resolveJobListAccess } from '@/lib/jobListAccess';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { limit, includeFullDetails } = await resolveJobListAccess(req, 5);

  const filters: JobListFilters = {};
  for (const key of JOB_LIST_FILTER_KEYS) {
    const value = req.nextUrl.searchParams.get(key);
    if (value) filters[key] = value;
  }

  try {
    const jobs = await fetchJobListFromBackend({ limit, filters, includeFullDetails });
    return jobListResponse(jobs);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
