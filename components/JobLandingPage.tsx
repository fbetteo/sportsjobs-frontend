import type { Metadata } from 'next';
import JobLandingContent from '@/components/JobLandingContent';
import { fetchJobsServer } from '@/lib/fetchJobsServer';
import {
  filterLandingPageJobs,
  jobLandingPages,
  type JobLandingPageConfig,
  type LandingPageJob,
} from '@/lib/jobLandingPages';

const SITE_URL = 'https://www.sportsjobs.online';

export function getJobLandingMetadata(slug: string): Metadata {
  const config = jobLandingPages[slug];

  return {
    title: `${config.title} | SportsJobs Online`,
    description: config.description,
    keywords: config.keywords.join(', '),
    alternates: { canonical: `${SITE_URL}/${config.slug}` },
    openGraph: {
      title: config.title,
      description: config.description,
      url: `${SITE_URL}/${config.slug}`,
      siteName: 'SportsJobs Online',
      type: 'website',
      images: [{
        url: `${SITE_URL}/opengraph-img.png`,
        width: 1200,
        height: 630,
        alt: `${config.shortTitle} on SportsJobs Online`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [`${SITE_URL}/opengraph-img.png`],
    },
  };
}

function buildStructuredData(config: JobLandingPageConfig) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: config.title,
      description: config.description,
      url: `${SITE_URL}/${config.slug}`,
      isPartOf: {
        '@type': 'WebSite',
        name: 'SportsJobs Online',
        url: SITE_URL,
      },
      about: config.keywords,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: config.faqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];
}

export default async function JobLandingPage({ slug }: { slug: string }) {
  const config = jobLandingPages[slug];
  const jobs = await fetchJobsServer(
    config.matchAny ? 250 : 100,
    JSON.stringify(config.filters ?? {})
  ) as LandingPageJob[];
  const matchingJobs = filterLandingPageJobs(config, jobs);
  const lastChecked = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
  const structuredData = buildStructuredData(config);

  return (
    <main>
      <JobLandingContent config={config} jobs={matchingJobs} lastChecked={lastChecked} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
