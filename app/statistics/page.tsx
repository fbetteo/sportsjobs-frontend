import type { Metadata } from 'next';
import SportsAnalyticsStatisticsContent from '@/components/SportsAnalyticsStatisticsContent';
import { skillsReport } from '@/lib/skillsReportData';

const PAGE_URL = 'https://www.sportsjobs.online/statistics';
const AI_CHART = 'https://www.sportsjobs.online/statistics/ai-vs-machine-learning-sports-jobs.png';
const DESCRIPTION =
    'Which skills sports teams hire for: AI, machine learning, Python, SQL, Tableau, and video analysis in soccer and US major-league data job postings, with downloadable data.';

export const metadata: Metadata = {
    title: 'Sports Analytics Hiring Statistics: Skills Teams Want | SportsJobs Online',
    description: DESCRIPTION,
    keywords:
        'sports analytics statistics, sports analytics hiring trends, AI in sports jobs, football club data jobs, soccer analytics skills, sports data job market',
    alternates: {
        canonical: PAGE_URL,
    },
    openGraph: {
        title: 'Sports Analytics Hiring Statistics',
        description: DESCRIPTION,
        url: PAGE_URL,
        siteName: 'SportsJobs Online',
        type: 'article',
        images: [{ url: AI_CHART, width: 2000, height: 1240, alt: 'Share of sports data job ads mentioning AI and machine learning' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sports Analytics Hiring Statistics',
        description: DESCRIPTION,
        images: [AI_CHART],
    },
};

export default function StatisticsPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        name: 'Skills in sports data and analytics job postings',
        description: DESCRIPTION,
        url: PAGE_URL,
        dateModified: skillsReport.updatedAt,
        temporalCoverage: skillsReport.period,
        isAccessibleForFree: true,
        license: 'https://creativecommons.org/licenses/by/4.0/',
        creator: {
            '@type': 'Organization',
            name: 'SportsJobs Online',
            url: 'https://www.sportsjobs.online',
        },
        variableMeasured: skillsReport.skills.map((skill) => `Share of postings mentioning ${skill}`),
        distribution: [
            {
                '@type': 'DataDownload',
                encodingFormat: 'text/csv',
                contentUrl: 'https://www.sportsjobs.online/statistics/sports-data-skills.csv',
            },
        ],
    };

    return (
        <main>
            <SportsAnalyticsStatisticsContent />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </main>
    );
}
