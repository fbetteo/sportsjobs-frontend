import HomeContent from '../components/HomeContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.sportsjobs.online',
  },
};

export default function Home() {
  return (
    <main>
      <HomeContent />
    </main>
  );
}
