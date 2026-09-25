import JobLandingPage, { getJobLandingMetadata } from '@/components/JobLandingPage';

export const revalidate = 300;
export const metadata = getJobLandingMetadata('baseball-analytics-jobs');

export default function Page() {
  return <JobLandingPage slug="baseball-analytics-jobs" />;
}
