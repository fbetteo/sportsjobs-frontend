import JobLandingPage, { getJobLandingMetadata } from '@/components/JobLandingPage';

export const revalidate = 3600;
export const metadata = getJobLandingMetadata('baseball-analytics-jobs');

export default function Page() {
  return <JobLandingPage slug="baseball-analytics-jobs" />;
}
