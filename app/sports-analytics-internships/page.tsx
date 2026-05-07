import type { Metadata } from 'next';
import SportsAnalyticsInternshipsContent from '@/components/SportsAnalyticsInternshipsContent';
import { fetchJobsServer } from '@/lib/fetchJobsServer';
import { internshipFaqItems } from '@/lib/sportsAnalyticsInternshipsContent';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Sports Analytics Internships in the USA | SportsJobs Online',
  description:
    'Find current sports analytics internships in the USA. Browse remote, onsite, and hybrid data analytics internships with teams, leagues, NCAA programs, and sports organizations.',
  keywords:
    'sports analytics internships, sports data analytics internships, sports internships USA, sports analytics intern, NBA internships, NFL internships, MLB internships, MLS internships, NCAA internships',
  alternates: {
    canonical: 'https://www.sportsjobs.online/sports-analytics-internships',
  },
  openGraph: {
    title: 'Sports Analytics Internships in the USA',
    description:
      'Curated sports analytics internships with filters for location, work type, sport, role type, and job alerts.',
    url: 'https://www.sportsjobs.online/sports-analytics-internships',
    siteName: 'SportsJobs Online',
    type: 'website',
    images: [
      {
        url: 'https://www.sportsjobs.online/opengraph-img.png',
        width: 1200,
        height: 630,
        alt: 'SportsJobs Online sports analytics internships',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sports Analytics Internships in the USA',
    description:
      'Browse current sports analytics and data analytics internships with teams, leagues, and sports organizations.',
    images: ['https://www.sportsjobs.online/opengraph-img.png'],
  },
};

export default async function SportsAnalyticsInternshipsPage() {
  const usaInternships = await fetchJobsServer(
    80,
    JSON.stringify({ seniority: 'Internship', country: 'united states' })
  );
  const jobs = usaInternships.length
    ? usaInternships
    : await fetchJobsServer(80, JSON.stringify({ seniority: 'Internship' }));
  const lastChecked = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Sports Analytics Internships in the USA',
      description:
        'A curated listing and guide for sports analytics internships, data analytics internships, and student roles in sports organizations.',
      url: 'https://www.sportsjobs.online/sports-analytics-internships',
      isPartOf: {
        '@type': 'WebSite',
        name: 'SportsJobs Online',
        url: 'https://www.sportsjobs.online',
      },
      about: [
        'sports analytics',
        'data analytics',
        'internships',
        'student jobs',
        'sports teams',
        'sports leagues',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: internshipFaqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <main>
      <SportsAnalyticsInternshipsContent initialJobs={jobs} lastChecked={lastChecked} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
