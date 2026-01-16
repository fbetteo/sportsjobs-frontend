import HomeContent from '../components/HomeContent';
import type { Metadata } from 'next';
import { fetchJobsServer, fetchJobsFeaturedServer } from '../lib/fetchJobsServer';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.sportsjobs.online',
  },
};

// Enable ISR - revalidate every 5 minutes
export const revalidate = 300;

export default async function Home() {
  // Fetch initial data server-side (non-auth user view: 8 jobs, 5 featured)
  // This will be cached at edge and revalidated every 5 minutes
  const initialJobs = await fetchJobsServer(8, "{}");
  const initialFeaturedJobs = await fetchJobsFeaturedServer(5);

  return (
    <main>
      <HomeContent
        initialJobs={initialJobs}
        initialFeaturedJobs={initialFeaturedJobs}
      />
    </main>
  );
}
