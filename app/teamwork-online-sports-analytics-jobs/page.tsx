import type { Metadata } from 'next';
import TeamworkOnlineAlternativeContent from '@/components/TeamworkOnlineAlternativeContent';
import { fetchJobsServer } from '@/lib/fetchJobsServer';
import { buildAnalyticsInventory, filterAnalyticsJobs, teamworkOnlineFaqItems } from '@/lib/teamworkOnlineAlternativeContent';
import type { AnalyticsSearchJob } from '@/lib/teamworkOnlineAlternativeContent';

import { format } from 'date-fns';
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'TeamWork Online Alternative for Sports Analytics Jobs | SportsJobs Online',
  description:
    'Compare TeamWork Online with SportsJobs Online for sports analytics jobs, data analyst roles, business intelligence, performance analysis, remote jobs, and internships.',
  keywords:
    'teamwork online, teamwork online alternative, sports analytics jobs, sports jobs, teamwork.com, teamworks, sports data analyst jobs, sports business intelligence jobs, sports betting jobs',
  alternates: {
    canonical: 'https://www.sportsjobs.online/teamwork-online-sports-analytics-jobs',
  },
  openGraph: {
    title: 'TeamWork Online Alternative for Sports Analytics Jobs',
    description:
      'A balanced guide to where TeamWork Online helps, where it falls short for analytics candidates, and how SportsJobs Online compares.',
    url: 'https://www.sportsjobs.online/teamwork-online-sports-analytics-jobs',
    siteName: 'SportsJobs Online',
    type: 'website',
    images: [
      {
        url: 'https://www.sportsjobs.online/opengraph-img.png',
        width: 1200,
        height: 630,
        alt: 'SportsJobs Online TeamWork Online alternative guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TeamWork Online Alternative for Sports Analytics Jobs',
    description:
      'See whether TeamWork Online or SportsJobs Online is the better fit for sports analytics, BI, performance, and data roles.',
    images: ['https://www.sportsjobs.online/opengraph-img.png'],
  },
};

export default async function TeamworkOnlineSportsAnalyticsJobsPage() {
  const recentJobs = (await fetchJobsServer(80, '{}', true)) as AnalyticsSearchJob[];
  const analyticsInventory = filterAnalyticsJobs(recentJobs);
  const jobs = analyticsInventory.slice(0, 8);
  const inventory = buildAnalyticsInventory(analyticsInventory);
  const lastChecked = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'TeamWork Online Alternative for Sports Analytics Jobs',
      description:
        'A comparison guide for TeamWork Online versus SportsJobs Online for sports analytics, business intelligence, performance analyst, remote, and internship searches.',
      url: 'https://www.sportsjobs.online/teamwork-online-sports-analytics-jobs',
      publisher: {
        '@type': 'Organization',
        name: 'SportsJobs Online',
        url: 'https://www.sportsjobs.online',
      },
      about: [
        'TeamWork Online',
        'sports analytics jobs',
        'sports jobs',
        'data analyst',
        'data scientist',
        'business intelligence',
        'performance analyst',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: teamworkOnlineFaqItems.map((item) => ({
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
      <TeamworkOnlineAlternativeContent
        initialJobs={jobs}
        inventory={inventory}
        sampleSize={recentJobs.length}
        lastChecked={lastChecked}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
