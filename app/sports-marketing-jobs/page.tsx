import JobLandingPage, { getJobLandingMetadata } from '@/components/JobLandingPage';

export const revalidate = 3600;
export const metadata = getJobLandingMetadata('sports-marketing-jobs');

export default function Page() {
  return <JobLandingPage slug="sports-marketing-jobs" />;
}
