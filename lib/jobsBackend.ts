import 'server-only';

// Server-only source for job *lists*. Public API routes (`/api/get-jobs`,
// `/api/get-jobs-featured`) apply visitor limits on top of this; server-rendered
// pages and the sitemap call it directly so they never self-fetch the public API.
//
// List records intentionally omit the apply `url`: applying happens on the job
// detail page, and exposing it here let anyone dump every listing in one request.

export interface JobListFilters {
  country?: string;
  remote?: string;
  seniority?: string;
  industry?: string;
  sport?: string;
  job_area?: string;
  company?: string;
  airtable_id?: string;
}

interface FetchJobListOptions {
  limit: number;
  offset?: number;
  filters?: JobListFilters;
  featuredOnly?: boolean;
  includeFullDetails?: boolean;
  revalidateSeconds?: number;
}

// Maps public query names to backend column names.
const FILTER_COLUMNS: Record<keyof JobListFilters, string> = {
  country: 'country',
  remote: 'remote_office',
  seniority: 'seniority',
  industry: 'industry',
  sport: 'sport_list',
  job_area: 'job_area',
  company: 'company',
  airtable_id: 'airtable_id',
};

export const JOB_LIST_FILTER_KEYS = Object.keys(FILTER_COLUMNS) as Array<keyof JobListFilters>;

function getDaysAgoText(creationDate: string): string {
  const created = new Date(creationDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - created.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Posted Today';
  }
  return `Posted ${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

function mapListJob(record: any, includeFullDetails: boolean) {
  const job = {
    id: record.slug || record.job_id, // Prefer slug if available
    job_id: record.job_id, // Keep original ID for reference
    title: record.name,
    start_date: record.creation_date,
    company: record.company,
    location: record.location,
    salary: record.salary,
    country: record.country,
    seniority: record.seniority,
    remote: record.remote,
    sport_list: record.sport_list,
    job_area: record.job_area,
    logo_permanent_url: record.logo_permanent_url,
    remote_string: record.remote_office,
    days_ago_text: getDaysAgoText(record.creation_date),
    slug: record.slug,
  };

  if (!includeFullDetails) {
    return job;
  }

  return {
    ...job,
    description: record.description,
    skills: record.skills,
  };
}

export async function fetchJobListFromBackend({
  limit,
  offset = 0,
  filters = {},
  featuredOnly = false,
  includeFullDetails = false,
  revalidateSeconds = 300,
}: FetchJobListOptions) {
  const backendFilters: Record<string, string> = {};
  for (const key of JOB_LIST_FILTER_KEYS) {
    const value = filters[key];
    if (value) backendFilters[FILTER_COLUMNS[key]] = value;
  }
  if (featuredOnly) backendFilters.featured = '0 - top';

  const requestBody = {
    limit,
    offset,
    filters: Object.keys(backendFilters).length > 0 ? backendFilters : null,
    sort_by: 'creation_date',
    sort_direction: 'desc',
    // Skip description and other heavy columns in the backend query itself.
    list_fields_only: !includeFullDetails,
  };

  // The Next data cache keys POST fetches by body, so identical list queries
  // share one backend call per revalidation window across all visitors.
  const response = await fetch(`http://${process.env.HETZNER_POSTGRES_HOST}:8000/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.HEADER_AUTHORIZATION}`,
    },
    body: JSON.stringify(requestBody),
    next: { revalidate: revalidateSeconds },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const records = await response.json();
  return (records as any[]).map((record) => mapListJob(record, includeFullDetails));
}
