import JobLandingPage, { getJobLandingMetadata } from '@/components/JobLandingPage';

export const revalidate = 300;
export const metadata = getJobLandingMetadata('remote-sports-jobs');

export default function Page() {
  return <JobLandingPage slug="remote-sports-jobs" />;
}
