// app/jobs/[id]/page.tsx

import { fetchJobDetails } from '../../../lib/fetchJobDetails';
import { marked } from 'marked';
import { addMonths, format } from 'date-fns';
import { Box, Heading, Text, Image, Badge, HStack, Flex, Button } from '@chakra-ui/react';
import MixedPricingCard from '@/components/MixedPriceCard';
import styles from '../../../markdown.module.css';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect, notFound } from 'next/navigation';

interface Job {
    id: string;
    title: string;
    description: string;
    company: string;
    location: string;
    salary: string;
    industry: string;
    logo_permanent_url: string;
    skills: string;
    remote: string;
    remote_string: string;
    seniority: string;
    hours: string;
    start_date: string;
    country: string;
    country_code: string;
    job_area: string;
}

const industryJobTypeMapping: { [key: string]: string } = {
    Sports: '🥅 sports',
    Betting: '🎲 betting',
    Esports: '🎮 esports',
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    try {
        const jobDetails = await fetchJobDetails(params.id);
        if (!jobDetails) {
            return {
                title: 'Job Not Found - SportsJobs Online',
                description: 'This job posting is no longer available.',
            };
        }

        return {
            title: `${jobDetails.title} at ${jobDetails.company} jobs- SportsJobs Online`,
            description: `${jobDetails.sport_list} software and analytics jobs. Hiring remotely in ${jobDetails.country}. Apply now. Find more great sports analytics jobs like this on Sportsjobs Online. Sports and betting analytics careers`,
            keywords: `${jobDetails.sport_list} jobs, ${jobDetails.country} jobs,  sports analytics jobs, sports data science jobs, sports software jobs, sports betting jobs, sports data jobs, sports analytics careers, sports data science careers, sports software careers, sports betting careers`,
            alternates: {
                canonical: `https://www.sportsjobs.online/jobs/${params.id}`,
            },
            openGraph: {
                title: `${jobDetails.title} jobs - SportsJobs Online`,
                description: `${jobDetails.sport_list} software and analytics jobs. Hiring remotely in ${jobDetails.country}. Apply now. Find more great sports analytics jobs like this on Sportsjobs Online. Sports and betting analytics careers`,
                url: `https://www.sportsjobs.online/jobs/${params.id}`,
                siteName: 'SportsJobs Online',
                type: 'website',
                images: [
                    {
                        url: jobDetails.logo_permanent_url || 'https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png',
                        width: 800,
                        height: 600,
                        alt: `Logo of ${jobDetails.company}`,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${jobDetails.title} - SportsJobs Online`,
                description: `${jobDetails.sport_list} software and analytics jobs. Hiring remotely in ${jobDetails.country}. Apply now. Find more great sports analytics jobs like this on Sportsjobs Online. Sports and betting analytics careers`,
                images: [
                    jobDetails.logo_permanent_url || 'https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png',
                ],
            },
        };
    } catch (error) {
        return {
            title: 'Job Not Found - SportsJobs Online',
            description: 'This job posting is no longer available.',
        };
    }
}

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={
            <Box p={5} color="white" bg="black" minHeight="100vh">
                <Flex direction="column" align="center" justify="center" textAlign="center">
                    <Heading as="h1" size="xl" mb={5}>Loading...</Heading>
                </Flex>
            </Box>
        }>
            <JobDetails params={params} />
        </Suspense>
    );
}

async function JobDetails({ params }: { params: { id: string } }) {
    const job = await fetchJobDetails(params.id);
    if (!job) {
        notFound();
    }

    // Add salary parsing helper
    const extractSalaryValue = (salaryString: string): number | null => {
        const matches = salaryString.match(/\d+/g);
        if (matches && matches.length > 0) {
            // Get the first number found in the string
            return parseInt(matches[0], 10);
        }
        return null;
    };

    const mappedIndustryJobType = industryJobTypeMapping[job.industry] || '🎯 sports';
    const descriptionHtml = marked(job.description);
    const datePosted = new Date(job.start_date);
    const validThrough = format(addMonths(datePosted, 2), 'yyyy-MM-dd');

    const jobTypeMapping: { [key: string]: string } = {
        fulltime: 'FULL_TIME',
        "part time": 'PART_TIME',
        // Add more mappings if necessary
    };

    let mappedJobType = jobTypeMapping[job.hours[0]?.toLowerCase()] || job.hours[0];
    if (job.seniority?.toLowerCase() === 'internship') {
        mappedJobType = 'INTERN';
    }

    // Create base schema
    const schemaData: any = {
        "@context": "http://schema.org",
        "@type": "JobPosting",
        "title": job.title,
        "description": descriptionHtml,
        "identifier": {
            "@type": "PropertyValue",
            "name": job.company,
            "value": job.id,
        },
        "datePosted": job.start_date,
        "validThrough": validThrough,
        "employmentType": mappedJobType,
        "hiringOrganization": {
            "@type": "Organization",
            "name": job.company,
            "logo": job.logo_permanent_url,
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location,
                "addressCountry": job.country_code,
            },
        },
        "applicantLocationRequirements": {
            "@type": "Country",
            "name": job.country,
        },
    };

    // Only add salary if we can extract a valid number
    const salaryValue = extractSalaryValue(job.salary);
    if (salaryValue) {
        schemaData.baseSalary = {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": {
                "@type": "QuantitativeValue",
                "value": salaryValue,
                "unitText": "YEAR"
            }
        };
    }

    // Add remote work type if applicable
    if (job.remote === "Yes") {
        schemaData.jobLocationType = "TELECOMMUTE";
    }

    const jobPostingSchema = JSON.stringify(schemaData);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jobPostingSchema }} />
            <main>
                <Box p={5} color="white" bg="black" minHeight="100vh">
                    <Flex direction="column" align="center" justify="center" textAlign="center">
                        <Image src={job.logo_permanent_url} alt={`Logo of ${job.company}`} boxSize="100px" objectFit="contain" mb={4} />
                        <Heading as="h1" size="lg" mb={2}>
                            {job.title}
                        </Heading>
                        <Heading as="h2" size="lg" mb={2}>
                            {job.company}
                        </Heading>
                        <HStack spacing={4} mb={4} justify="center">
                            <Badge colorScheme="teal" border="1px" borderColor="gray.200" px={4} py={2}>{job.hours}</Badge>
                            <Badge colorScheme="orange" border="1px" borderColor="gray.200" px={4} py={2}>{job.remote_string}</Badge>
                            <Badge colorScheme="orange" border="1px" borderColor="gray.200" px={4} py={2}>{job.seniority}</Badge>
                        </HStack>
                        <Flex wrap="wrap" justify="flex-start" align="center" mb={4}>
                            <Button
                                as="a"
                                href={job.apply_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                colorScheme="purple"
                                size="lg"
                                px={4}
                                py={2}
                                m={1}
                            >
                                Apply Now
                            </Button>
                        </Flex>
                        <Flex>
                            <Box display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" ml={4}>
                                <Badge border="1px" borderColor="gray.200" px={4} py={2} m={1}>
                                    <Text><strong>{job.location}</strong></Text>
                                </Badge>
                                <Badge border="1px" borderColor="gray.200" px={4} py={2} m={1}>
                                    <Text><strong>Salary:</strong> {job.salary}</Text>
                                </Badge>
                                <Badge border="1px" borderColor="gray.200" px={4} py={2} m={1}>
                                    <Text><strong>{mappedIndustryJobType}</strong></Text>
                                </Badge>
                                <Badge border="1px" borderColor="gray.200" px={4} py={2} m={1}>
                                    <Text><strong>{job.job_area}</strong></Text>
                                </Badge>
                            </Box>
                        </Flex>
                        <Box mt={4} textAlign="left" width="80%">
                            <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                        </Box>
                        <Button
                            as="a"
                            href={job.apply_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            colorScheme="purple"
                            size="lg"
                            px={4}
                            py={2}
                            m={1}
                            mt={5}
                        >
                            Apply Now
                        </Button>
                    </Flex>
                </Box>
                <Flex direction="column" width="100%" flexDirection="column" alignItems="center">
                    <MixedPricingCard />
                </Flex>
            </main>
        </>
    );
}
