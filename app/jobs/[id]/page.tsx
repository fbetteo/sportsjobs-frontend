import SimilarJobs from '@/components/SimilarJobs';
import JobApplyButton from '@/components/JobApplyButton';
import { default as dynamicImport } from 'next/dynamic';
import MixedPricingCard from '@/components/MixedPriceCard';

import TestimonialsWallFromDB from '@/components/TestimonialsWallFromDB';

// app/jobs/[id]/page.tsx
export const dynamic = 'force-static';
export const revalidate = 2592000; // 30 days

import styles from '../../../markdown.module.css';
import { Metadata } from 'next';
import { marked } from 'marked';
import { Suspense } from 'react';
import {
    Alert,
    Box,
    Flex,
    Grid,
    Heading,
    HStack,
    Image,
    Text
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { BRAND_BACKGROUND, BRAND_FOREGROUND, BRAND_PRIMARY, BRAND_SECONDARY } from '@/lib/uiTokens';
import { notFound, permanentRedirect } from 'next/navigation';
import { addMonths, format } from 'date-fns';
import { fetchJobDetails } from '../../../lib/fetchJobDetails';
const SenjaWallOfLove = dynamicImport(() => import('@/components/WallOfLove'), {
    loading: () => (
        <Box
            minH={{ base: "1000px", md: "800px" }}
            width="100%"
            bg="gray.800"
            borderRadius="xl"
        />
    ),
    ssr: false
});

// Using MixedPricingCard component directly
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
    slug?: string;
}

const industryJobTypeMapping: { [key: string]: string } = {
    Sports: '🥅 sports',
    Betting: '🎲 betting',
    Esports: '🎮 esports',
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    try {
        const jobResult = await fetchJobDetails(params.id);
        if (!jobResult) {
            return {
                title: 'Job Not Found - SportsJobs Online',
                description: 'This job posting is no longer available.',
            };
        }

        const { job, expired } = jobResult;

        return {
            title: `${job.title} at ${job.company} jobs - SportsJobs Online`,
            description: `${job.sport_list ?? "Sports"} software and analytics jobs. Hiring remotely in ${job.country}. Apply now. Find more great sports analytics jobs like this on Sportsjobs Online. Sports and betting analytics careers`, keywords: `${job.sport_list ?? "Sports"} jobs, ${job.country} jobs,  sports analytics jobs, sports data science jobs, sports software jobs, sports betting jobs, sports data jobs, sports analytics careers, sports data science careers, sports software careers, sports betting careers`,
            alternates: {
                canonical: `https://www.sportsjobs.online/jobs/${params.id}`,
            },
            openGraph: {
                title: `${job.title} jobs - SportsJobs Online`,
                description: `${job.sport_list ?? "Sports"} software and analytics jobs. Hiring remotely in ${job.country}. Apply now. Find more great sports analytics jobs like this on Sportsjobs Online. Sports and betting analytics careers`,
                url: `https://www.sportsjobs.online/jobs/${params.id}`,
                siteName: 'SportsJobs Online',
                type: 'website',
                images: [
                    {
                        url: job.logo_permanent_url || 'https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png',
                        width: 800,
                        height: 600,
                        alt: `Logo of ${job.company}`,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${job.title} - SportsJobs Online`,
                description: `${job.sport_list ?? "Sports"} software and analytics jobs. Hiring remotely in ${job.country}. Apply now. Find more great sports analytics jobs like this on Sportsjobs Online. Sports and betting analytics careers`,
                images: [
                    job.logo_permanent_url || 'https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png',
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
    const jobResult = await fetchJobDetails(params.id);
    if (!jobResult || !jobResult.job) {
        notFound();
    }
    const { job, expired } = jobResult;

    if (job.slug && params.id !== job.slug) {
        permanentRedirect(`/jobs/${job.slug}`);
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
        "{fulltime}": 'FULL_TIME',
        "part time": 'PART_TIME',
        // Add more mappings if necessary
    };

    let mappedJobType = jobTypeMapping[job.hours?.toLowerCase()] || job.hours;
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
    // I've modifeid this since in my DB now Remote is being handled wrongly
    if (job.remote_string?.toUpperCase().includes("REMOTE")) {
        schemaData.jobLocationType = "TELECOMMUTE";
    }

    const jobPostingSchema = JSON.stringify(schemaData);
    const jobFacts = [
        job.hours,
        job.remote_string,
        job.seniority,
        job.location,
        job.salary ? `Salary: ${job.salary}` : undefined,
        mappedIndustryJobType,
        job.job_area,
    ].filter(Boolean);

    return (
        <>
            <main>
                <Box color={BRAND_FOREGROUND} bg={BRAND_BACKGROUND} minHeight="100vh">
                    <Flex direction="column" align="center" textAlign="center">
                        <Box as="header" w="100%">
                            <Flex
                                direction="column"
                                align="center"
                                px={{ base: 5, md: 8 }}
                                pt={{ base: 8, md: 10 }}
                                pb={{ base: 6, md: 7 }}
                            >
                                <Image
                                    src={job.logo_permanent_url || "https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png"}
                                    alt={`Logo of ${job.company}`}
                                    boxSize={{ base: "72px", md: "88px" }}
                                    objectFit="contain"
                                    mb={4}
                                    fallback={<Box width="88px" height="88px" bg="gray.200" />}
                                />
                                <Heading
                                    as="h1"
                                    fontSize={{ base: "34px", md: "44px" }}
                                    lineHeight="1"
                                    textTransform="uppercase"
                                    color={BRAND_FOREGROUND}
                                >
                                    {job.title}
                                </Heading>
                                <Text
                                    fontSize={{ base: "22px", md: "30px" }}
                                    mt={2}
                                    color={BRAND_FOREGROUND}
                                >
                                    {job.company}
                                </Text>
                            </Flex>

                            <Flex
                                bg={BRAND_SECONDARY}
                                color={BRAND_FOREGROUND}
                                w="100%"
                                px={{ base: 5, md: 12 }}
                                py={{ base: 5, md: 5 }}
                                align="center"
                                justify="space-between"
                                gap={{ base: 6, md: 8 }}
                                direction={{ base: "column", md: "row" }}
                            >
                                <Grid
                                    flex="1"
                                    w="100%"
                                    maxW={{ base: "100%", md: "640px" }}
                                    gap={{ base: 3, md: 4 }}
                                    templateColumns={{ base: "1fr", sm: "repeat(2, minmax(0, 1fr))" }}
                                    alignItems="center"
                                    justifyItems="center"
                                    mx="auto"
                                >
                                    {jobFacts.map((fact) => (
                                        <HStack key={fact} spacing={3} align="center" justify="left" w="100%">
                                            <Box color={BRAND_PRIMARY} fontSize={{ base: "20px", md: "24px" }} flexShrink={0}>
                                                <FaCheckCircle />
                                            </Box>
                                            <Text
                                                textAlign="center"
                                                fontSize={{ base: "18px", md: "22px" }}
                                                lineHeight="1.1"
                                                textTransform="uppercase"
                                            >
                                                {fact}
                                            </Text>
                                        </HStack>
                                    ))}
                                </Grid>

                                {!expired && (
                                    <JobApplyButton
                                        applyUrl={job.apply_url}
                                        jobId={job.id}
                                        jobSlug={job.slug}
                                        company={job.company}
                                        buttonLocation="hero"
                                    />
                                )}
                            </Flex>
                        </Box>

                        {/* Smaller message above the description */}
                        {expired && (
                            <Text fontSize="l" color="gray.200" mt={8} mb={4} textAlign="center">
                                Note: This job has expired and is no longer accepting applications.
                            </Text>
                        )}
                        <Box mt={{ base: 12, md: 16 }} textAlign="left" width={{ base: "100%", md: "88%" }} maxW="1100px" px={{ base: 4, md: 0 }}>
                            <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                        </Box>
                        {/* Apply button only if not expired */}
                        {!expired && (
                            <JobApplyButton
                                applyUrl={job.apply_url}
                                jobId={job.id}
                                jobSlug={job.slug}
                                company={job.company}
                                buttonLocation="bottom"
                            />
                        )}
                        {/* Expired message */}
                        {expired && (
                            <Alert
                                status="info"
                                variant="left-accent"
                                flexDirection="column"
                                alignItems="flex-start"
                                justifyContent="center"
                                textAlign="left"
                                borderRadius="md"
                                bg="gray.100"
                                color="gray.800"
                                mt={6}
                                p={4}
                            >
                                <Heading as="h2" size="md" mb={2}>
                                    This job is no longer available
                                </Heading>
                                <Text fontSize="sm" mb={2}>
                                    The job posting you are looking for has expired or been removed.
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    Jobs typically stay active for 60 days or until filled.
                                </Text>
                            </Alert>
                        )}

                    </Flex>
                    <SimilarJobs currentJobId={job.id} country={job.country} filter="Country" />
                    {/* <SimilarJobs currentJobId={job.id} country={job.sportList} filter="sport" />
                    <SimilarJobs currentJobId={job.id} country={job.seniority} filter="seniority" /> */}                </Box>
                {/* MixedPricingCard already handles showing only for non-authenticated users */}
                <Suspense fallback={
                    <Box
                        minH={{ base: "1000px", md: "800px" }}
                        width="100%"
                        bg="gray.800"
                        borderRadius="xl"
                    />
                }>
                    <MixedPricingCard />
                </Suspense>
                <Suspense fallback={
                    <Box
                        minH={{ base: "1000px", md: "800px" }}
                        width="100%"
                        bg="gray.800"
                        borderRadius="xl"
                    />
                }>
                    <TestimonialsWallFromDB />
                </Suspense>
            </main>
            {/* JobPosting schema only if not expired */}
            {!expired && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: jobPostingSchema }}
                />
            )}
        </>
    );
}
