import HomeContent from '../components/HomeContent';
import type { Metadata } from 'next';
import { fetchJobs } from '../lib/fetchJobs';
import { fetchJobsFeatured } from '../lib/fetchJobsFeatured';

export const revalidate = 3600; // Cache this page for 1 hour

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.sportsjobs.online',
  },
};

export default async function Home() {
  const [initialJobs, initialFeaturedJobs] = await Promise.all([
    fetchJobs(8, JSON.stringify({})),
    fetchJobsFeatured(5)
  ]);

  return <HomeContent initialJobs={initialJobs} initialFeaturedJobs={initialFeaturedJobs} />;
}
