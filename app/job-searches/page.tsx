import type { Metadata } from 'next';
import JobSearchesHub from '@/components/JobSearchesHub';

export const metadata: Metadata = {
  title: 'Popular Sports Job Searches | SportsJobs Online',
  description: 'Browse sports jobs by league, sport, role, internship type, and remote work arrangement.',
  alternates: { canonical: 'https://www.sportsjobs.online/job-searches' },
};

export default function JobSearchesPage() {
  return <JobSearchesHub />;
}
