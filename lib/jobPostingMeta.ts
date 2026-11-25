// lib/jobPostingMeta.ts
// Shared helpers for job detail metadata and JobPosting structured data.

export type JobWorkMode = 'office' | 'remote' | 'global-remote';

// Backend stores countries lowercase ("united states"); display them title-cased.
export const formatCountry = (country?: string | null) =>
    (country ?? '').replace(/\b\w/g, (char) => char.toUpperCase());

// remote_string is the reliable remote signal ("Office" | "Remote" | "Global Remote");
// the boolean `remote` column is known to be wrong for some rows.
export const getWorkMode = (remoteString?: string | null): JobWorkMode => {
    const value = remoteString?.toLowerCase() ?? '';
    if (value.includes('global')) return 'global-remote';
    if (value.includes('remote')) return 'remote';
    return 'office';
};

// Google requires at least one eligible country on remote JobPostings and has no "worldwide"
// value, so worldwide roles list the countries most SportsJobs searchers come from.
const WORLDWIDE_REMOTE_COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'India', 'Germany', 'Australia'];

export const buildApplicantLocationRequirements = (workMode: JobWorkMode, country?: string | null) => {
    const jobCountry = formatCountry(country);
    const countries = workMode === 'global-remote'
        ? Array.from(new Set([jobCountry, ...WORLDWIDE_REMOTE_COUNTRIES].filter(Boolean)))
        : workMode === 'remote' && jobCountry ? [jobCountry] : [];
    return countries.map((name) => ({ '@type': 'Country', name }));
};

interface JobMetaInput {
    title: string;
    company: string;
    location?: string | null;
    country?: string | null;
    remote_string?: string | null;
    seniority?: string | null;
    salary?: string | null;
}

export const buildJobMetaDescription = (job: JobMetaInput, expired: boolean) => {
    const country = formatCountry(job.country);
    const workMode = getWorkMode(job.remote_string);
    const where = workMode === 'global-remote'
        ? 'Remote (worldwide)'
        : workMode === 'remote'
            ? `Remote${country ? ` (${country})` : ''}`
            : job.location || country;
    const facts = [where, job.seniority, job.salary].filter(Boolean).join(' · ');
    const lead = expired
        ? `${job.title} at ${job.company} is no longer accepting applications.`
        : `${job.title} at ${job.company}.`;
    // Facts lead so search snippets truncated around 155 chars keep the useful part.
    const tail = expired
        ? 'See similar jobs on SportsJobs Online.'
        : 'Apply on SportsJobs Online.';
    return [lead, facts ? `${facts}.` : '', tail].filter(Boolean).join(' ');
};
