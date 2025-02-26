import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { location: string } }): Promise<Metadata> {
    const location = params.location.replace(/-/g, ' ');

    return {
        title: `Sports Analytics Jobs in ${location} | SportsJobs Online`,
        description: `Find sports analytics, data science and software jobs in ${location}. Browse job opportunities and careers in sports data analytics.`,
        keywords: `${location} sports jobs, ${location} analytics jobs, sports data jobs ${location}, sports careers ${location}`,
        openGraph: {
            title: `Sports Analytics Jobs in ${location}`,
            description: `Find sports analytics and data jobs in ${location}`, 
            url: `https://www.sportsjobs.online/country/${params.location}`,
            siteName: 'SportsJobs Online',
            images: [{
                url: 'https://sportsjobs.online/og-image.png',
                width: 800,
                height: 600,
                alt: `Sports jobs in ${location}`
            }]
        }
    };
}
