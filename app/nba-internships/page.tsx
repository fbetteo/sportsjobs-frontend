import JobLandingPage, { getJobLandingMetadata } from '@/components/JobLandingPage';

export const revalidate = 300;
export const metadata = getJobLandingMetadata('nba-internships');

export default function Page() {
  return <JobLandingPage slug="nba-internships" />;
}
