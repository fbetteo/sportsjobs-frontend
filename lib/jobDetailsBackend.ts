import 'server-only';

import { cache } from 'react';

export interface JobDetailsJob {
  id: string;
  title: string;
  company: string;
  description: string;
  start_date: string;
  location: string;
  hours: string;
  salary: string;
  country: string;
  country_code: string;
  seniority: string;
  remote: string;
  skills: string;
  logo_permanent_url: string;
  remote_string: string;
  days_ago_text: string;
  sport_list?: string;
  industry: string;
  job_area: string;
  apply_url: string;
  slug?: string;
}

interface BackendJobRecord {
  job_id: string;
  name: string;
  company: string;
  description: string;
  creation_date: string;
  location: string;
  hours: string;
  salary: string;
  country: string;
  country_code: string;
  seniority: string;
  remote: string;
  skills: string;
  logo_permanent_url: string;
  remote_office: string;
  sport_list?: string;
  industry: string;
  job_area: string;
  url: string;
  slug?: string;
}

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

function mapBackendJob(record: BackendJobRecord): JobDetailsJob {
  return {
    id: record.job_id,
    title: record.name,
    company: record.company,
    description: record.description,
    start_date: record.creation_date,
    location: record.location,
    hours: record.hours,
    salary: record.salary,
    country: record.country,
    country_code: record.country_code,
    seniority: record.seniority,
    remote: record.remote,
    skills: record.skills,
    logo_permanent_url: record.logo_permanent_url,
    remote_string: record.remote_office,
    days_ago_text: getDaysAgoText(record.creation_date),
    sport_list: record.sport_list,
    industry: record.industry,
    job_area: record.job_area,
    apply_url: record.url,
    slug: record.slug,
  };
}

export const fetchJobDetailsFromBackend = cache(async (id: string): Promise<JobDetailsJob | null> => {
  const jobId = id.trim();
  if (!jobId) {
    return null;
  }

  const filters = /^\d+$/.test(jobId)
    ? { job_id: jobId }
    : { slug: jobId };

  const requestBody = {
    limit: 1,
    filters,
    sort_by: 'creation_date',
    sort_direction: 'desc',
  };

  const response = await fetch(`http://${process.env.HETZNER_POSTGRES_HOST}:8000/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Invalid data received from server');
  }

  const record = data[0] as BackendJobRecord | undefined;
  if (!record) {
    return null;
  }

  return mapBackendJob(record);
});
