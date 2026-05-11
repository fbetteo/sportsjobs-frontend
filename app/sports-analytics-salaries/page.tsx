import type { Metadata } from 'next';
import SportsAnalyticsSalariesContent from '@/components/SportsAnalyticsSalariesContent';
import { salaryFaqItems } from '@/lib/sportsAnalyticsSalariesContent';

export const metadata: Metadata = {
  title: 'Sports Analytics Salaries in the United States | SportsJobs Online',
  description:
    'See sports analytics salary ranges in the United States by experience level, role, location, industry, skills, and career path.',
  keywords:
    'sports analytics salaries, sports analyst salary, sports data analyst salary, sports analytics salary United States, sports data scientist salary, sports betting analytics salary',
  alternates: {
    canonical: 'https://www.sportsjobs.online/sports-analytics-salaries',
  },
  openGraph: {
    title: 'Sports Analytics Salaries in the United States',
    description:
      'Salary ranges for sports analyst, sports data analyst, data science, performance analytics, BI, and sports betting analytics roles.',
    url: 'https://www.sportsjobs.online/sports-analytics-salaries',
    siteName: 'SportsJobs Online',
    type: 'website',
    images: [
      {
        url: 'https://www.sportsjobs.online/opengraph-img.png',
        width: 1200,
        height: 630,
        alt: 'SportsJobs Online sports analytics salary guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sports Analytics Salaries in the United States',
    description:
      'Compare sports analytics salaries by role, experience, employer type, location, skills, and growth path.',
    images: ['https://www.sportsjobs.online/opengraph-img.png'],
  },
};

export default function SportsAnalyticsSalariesPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Sports Analytics Salaries in the United States',
      description:
        'A sports analytics salary guide covering salary ranges by role, experience, location, employer type, skills, and career outlook.',
      url: 'https://www.sportsjobs.online/sports-analytics-salaries',
      publisher: {
        '@type': 'Organization',
        name: 'SportsJobs Online',
        url: 'https://www.sportsjobs.online',
      },
      about: [
        'sports analytics',
        'sports analyst salary',
        'sports data analyst salary',
        'annual salary',
        'hourly rate',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: salaryFaqItems.map((item) => ({
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
      <SportsAnalyticsSalariesContent />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
