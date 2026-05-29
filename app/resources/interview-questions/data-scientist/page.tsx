import type { Metadata } from 'next';
import SportsDataScientistInterviewContent from '@/components/SportsDataScientistInterviewContent';
import { dataScientistInterviewQuestions } from '@/lib/sportsDataScientistInterviewContent';

const pageUrl = 'https://www.sportsjobs.online/resources/interview-questions/data-scientist';
const pageTitle = 'Sports Data Scientist Interview Questions | SportsJobs Online';
const pageDescription =
    'Prepare for sports data scientist interviews with practical questions, what interviewers are testing, and sample answer directions for sports analytics, betting, media, teams, leagues, and sports tech roles.';

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    keywords:
        'sports data scientist interview questions, sports analytics interview questions, sports data science interview, sports analytics careers, data scientist sports jobs',
    alternates: {
        canonical: pageUrl,
    },
    openGraph: {
        title: 'Sports Data Scientist Interview Questions',
        description: pageDescription,
        url: pageUrl,
        siteName: 'SportsJobs Online',
        type: 'article',
        images: [
            {
                url: 'https://www.sportsjobs.online/opengraph-img.png',
                width: 1200,
                height: 630,
                alt: 'SportsJobs Online sports data scientist interview questions',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sports Data Scientist Interview Questions',
        description: pageDescription,
        images: ['https://www.sportsjobs.online/opengraph-img.png'],
    },
};

export default function SportsDataScientistInterviewPage() {
    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Sports Data Scientist Interview Questions',
            description: pageDescription,
            mainEntityOfPage: pageUrl,
            datePublished: '2026-05-29',
            dateModified: '2026-05-29',
            author: {
                '@type': 'Organization',
                name: 'SportsJobs Online',
                url: 'https://www.sportsjobs.online',
            },
            publisher: {
                '@type': 'Organization',
                name: 'SportsJobs Online',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://www.sportsjobs.online/opengraph-img.png',
                },
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: dataScientistInterviewQuestions.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${item.testing} ${item.answer}`,
                },
            })),
        },
    ];

    return (
        <main>
            <SportsDataScientistInterviewContent />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </main>
    );
}
