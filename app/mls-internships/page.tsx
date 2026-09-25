import JobLandingPage, { getJobLandingMetadata } from '@/components/JobLandingPage';

export const revalidate = 300;
export const metadata = getJobLandingMetadata('mls-internships');

export default function Page() {
  return <JobLandingPage slug="mls-internships" />;
}
