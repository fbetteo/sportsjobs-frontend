import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const company = params.slug.replace(/-/g, ' ').split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

    return {
        title: `Sports Analytics Jobs in ${company} | SportsJobs Online`,
        description: `Find sports analytics, data science and software jobs in ${company}. Browse job opportunities and careers in sports data analytics.`,
        keywords: `${company} sports jobs, ${company} analytics jobs, sports data jobs ${company}, sports careers ${company}, ${company} careers`,
        openGraph: {
            title: `Sports Analytics Jobs in ${company}`,
            description: `Find sports analytics and data jobs in ${company}`, 
            url: `https://www.sportsjobs.online/company/${params.slug}`,
            siteName: 'SportsJobs Online',
            images: [{
                url: 'https://sportsjobs.online/og-image.png',
                width: 800,
                height: 600,
                alt: `Sports jobs in ${company}`
            }]
        }
    };
}
