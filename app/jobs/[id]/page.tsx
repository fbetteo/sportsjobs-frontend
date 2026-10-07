import SimilarJobs from '@/components/SimilarJobs';
import JobApplyButton from '@/components/JobApplyButton';
import JobPageUpsell from '@/components/JobPageUpsell';

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
import { getJobLogoSrc, isDefaultJobLogo } from '@/lib/jobLogo';
import { buildBaseSalarySchema } from '@/lib/jobSalary';
import { buildJobMetaDescription, formatCountry, getWorkMode } from '@/lib/jobPostingMeta';

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
        const description = buildJobMetaDescription(job, expired);

        return {
            title: `${job.title} at ${job.company} - SportsJobs Online`,
            description,
            keywords: `${job.sport_list ?? "Sports"} jobs, ${formatCountry(job.country)} jobs,  sports analytics jobs, sports data science jobs, sports software jobs, sports betting jobs, sports data jobs, sports analytics careers, sports data science careers, sports software careers, sports betting careers`,
            alternates: {
                canonical: `https://www.sportsjobs.online/jobs/${params.id}`,
            },
            openGraph: {
                title: `${job.title} at ${job.company} - SportsJobs Online`,
                description,
                url: `https://www.sportsjobs.online/jobs/${params.id}`,
                siteName: 'SportsJobs Online',
                type: 'website',
                images: [
                    {
                        url: getJobLogoSrc(job.logo_permanent_url, true),
                        width: isDefaultJobLogo(job.logo_permanent_url) ? 2000 : 800,
                        height: isDefaultJobLogo(job.logo_permanent_url) ? 1000 : 600,
                        alt: `Logo of ${job.company}`,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${job.title} at ${job.company} - SportsJobs Online`,
                description,
                images: [
                    getJobLogoSrc(job.logo_permanent_url, true),
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
    const usesDefaultLogo = isDefaultJobLogo(job.logo_permanent_url);
    const jobLogoSrc = getJobLogoSrc(job.logo_permanent_url);

    if (job.slug && params.id !== job.slug) {
        permanentRedirect(`/jobs/${job.slug}`);
    }

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
            "logo": getJobLogoSrc(job.logo_permanent_url, true),
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location,
                "addressCountry": job.country_code,
            },
        },
    };

    // Only emit salary when currency and pay period are unambiguous (see lib/jobSalary.ts)
    const baseSalary = buildBaseSalarySchema(job.salary);
    if (baseSalary) {
        schemaData.baseSalary = baseSalary;
    }

    // Use remote_string, not the `remote` boolean, which is wrong for some DB rows.
    // Google only expects applicantLocationRequirements on TELECOMMUTE jobs; worldwide
    // remote roles omit it so they are not restricted to the scraped country.
    const workMode = getWorkMode(job.remote_string);
    if (workMode !== 'office') {
        schemaData.jobLocationType = "TELECOMMUTE";
    }
    if (workMode === 'remote' && job.country) {
        schemaData.applicantLocationRequirements = {
            "@type": "Country",
            "name": formatCountry(job.country),
        };
    }

    const jobPostingSchema = JSON.stringify(schemaData);
    const jobFacts = [
        job.hours,
        job.remote_string,
        job.seniority,
        job.location,
        mappedIndustryJobType,
        job.job_area,
    ].filter(Boolean);

    return (
        <>
            <main>
                {/* JobPosting schema only if not expired. Kept inside <main>: as the last child of the
                    streamed Suspense boundary it collided with Next's injected scripts and broke hydration. */}
                {!expired && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: jobPostingSchema }}
                    />
                )}
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
                                    src={jobLogoSrc}
                                    alt={`Logo of ${job.company}`}
                                    width={usesDefaultLogo ? { base: "144px", md: "176px" } : { base: "72px", md: "88px" }}
                                    height={{ base: "72px", md: "88px" }}
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
                                {job.salary && (
                                    <Text
                                        mt={4}
                                        px={5}
                                        py={1}
                                        borderRadius="full"
                                        bg={BRAND_PRIMARY}
                                        color={BRAND_FOREGROUND}
                                        fontFamily="heading"
                                        fontSize={{ base: "22px", md: "26px" }}
                                        letterSpacing="wide"
                                    >
                                        {job.salary}
                                    </Text>
                                )}
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

                        {/* Expired notice goes first so visitors from search see it before reading */}
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
                                mt={8}
                                mx={4}
                                maxW="1100px"
                                width={{ base: "auto", md: "88%" }}
                                p={4}
                            >
                                <Heading as="h2" size="md" mb={2}>
                                    This job is no longer accepting applications
                                </Heading>
                                <Text fontSize="sm" mb={2}>
                                    The posting has expired or been removed.
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    Jobs typically stay active for 60 days or until filled.
                                </Text>
                            </Alert>
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

                    </Flex>
                    <SimilarJobs currentJobId={job.id} country={job.country} />
                    {/* <SimilarJobs currentJobId={job.id} sportList={job.sportList} />
                    <SimilarJobs currentJobId={job.id} seniority={job.seniority} /> */}
                    {/* Renders only for anonymous visitors */}
                    <JobPageUpsell jobId={job.id} expired={expired} />
                </Box>
            </main>
        </>
    );
}
