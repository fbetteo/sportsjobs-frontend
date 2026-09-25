import JobLandingPage, { getJobLandingMetadata } from '@/components/JobLandingPage';

export const revalidate = 300;
export const metadata = getJobLandingMetadata('football-data-analyst-jobs');

export default function Page() {
  return <JobLandingPage slug="football-data-analyst-jobs" />;
}
