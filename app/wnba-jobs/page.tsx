import JobLandingPage, { getJobLandingMetadata } from '@/components/JobLandingPage';

export const revalidate = 300;
export const metadata = getJobLandingMetadata('wnba-jobs');

export default function Page() {
  return <JobLandingPage slug="wnba-jobs" />;
}
