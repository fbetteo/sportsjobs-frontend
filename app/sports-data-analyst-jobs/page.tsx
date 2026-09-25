import JobLandingPage, { getJobLandingMetadata } from '@/components/JobLandingPage';

export const revalidate = 300;
export const metadata = getJobLandingMetadata('sports-data-analyst-jobs');

export default function Page() {
  return <JobLandingPage slug="sports-data-analyst-jobs" />;
}
