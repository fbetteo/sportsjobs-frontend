import JobLandingPage, { getJobLandingMetadata } from '@/components/JobLandingPage';

export const revalidate = 300;
export const metadata = getJobLandingMetadata('sports-marketing-jobs');

export default function Page() {
  return <JobLandingPage slug="sports-marketing-jobs" />;
}
