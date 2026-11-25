import type { Metadata } from 'next';
import CompanyContent from '@/components/CompanyContent';
import { fetchJobsFeaturedServer, fetchJobsServer } from '@/lib/fetchJobsServer';

// Without force-static, a [slug] route with no generateStaticParams renders on every request.
export const dynamic = 'force-static';
export const revalidate = 3600;

const SITE_URL = 'https://www.sportsjobs.online';
const ANONYMOUS_JOB_LIMIT = 100;
const FEATURED_JOB_LIMIT = 7;

type Props = {
    params: { slug: string };
};

async function getCompanyPage(slug: string) {
    const companyFilter = slug.replace(/-/g, ' ');
    const jobs = await fetchJobsServer(ANONYMOUS_JOB_LIMIT, JSON.stringify({ company: companyFilter }));
    const titleCasedSlug = companyFilter.replace(/\b\w/g, (char) => char.toUpperCase());
    // Job records carry the real spelling (e.g. "StatsBomb"); the slug is lowercase.
    const companyName: string = jobs[0]?.company || titleCasedSlug;
    return { companyFilter, companyName, jobs };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { companyName, jobs } = await getCompanyPage(params.slug);
    const url = `${SITE_URL}/company/${params.slug.toLowerCase()}`;
    const title = `${companyName} Jobs, Careers & Internships`;
    const description = jobs.length > 0
        ? `Browse ${jobs.length} recent ${companyName} jobs and internships in analytics, data, engineering, operations, and marketing. Updated daily on SportsJobs Online.`
        : `Find ${companyName} jobs, careers, and internships in sports analytics, data, and technology. Get alerts when new ${companyName} roles open.`;

    return {
        title: `${title} | SportsJobs Online`,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            siteName: 'SportsJobs Online',
            type: 'website',
            images: [{
                url: `${SITE_URL}/opengraph-img.png`,
                width: 1200,
                height: 630,
                alt: `${companyName} jobs on SportsJobs Online`,
            }],
        },
    };
}

export default async function CompanyPage({ params }: Props) {
    const [{ companyFilter, companyName, jobs }, featuredJobs] = await Promise.all([
        getCompanyPage(params.slug),
        fetchJobsFeaturedServer(FEATURED_JOB_LIMIT),
    ]);

    return (
        <main>
            <CompanyContent
                companyName={companyName}
                companyFilter={companyFilter}
                initialJobs={jobs}
                initialFeaturedJobs={featuredJobs}
            />
        </main>
    );
}
