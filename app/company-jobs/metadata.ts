import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {	

    return {
        title: 'Sports Industry Companies - SportsJobs Online',
        description: 'Browse companies hiring in sports analytics, data science, and software engineering. Find your next career opportunity in the sports industry.',
        keywords: 'sports companies, sports employers, sports industry jobs, sports analytics companies',
    };
}
