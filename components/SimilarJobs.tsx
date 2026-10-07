'use client';


import { useEffect, useRef, useState } from 'react';
import {
    Badge,
    Box,
    Flex,
    Heading,
    Image,
    Link as ChakraLink,
    Spinner,
    Text,
    VStack
} from '@chakra-ui/react';
import { BRAND_PRIMARY_COLOR_SCHEME, BRAND_PRIMARY_LIGHT } from '@/lib/uiTokens';
import Link from 'next/link';
import { getJobLogoSrc, isDefaultJobLogo } from '@/lib/jobLogo';
import { formatCountry } from '@/lib/jobPostingMeta';
interface SimilarJob {
    id: string;
    title: string;
    company: string;
    logo_permanent_url: string;
    location: string;
    salary: string;
}

interface SimilarJobsProps {
    currentJobId: string;
    country?: string;
    sportList?: string[];
    seniority?: string;
}

export default function SimilarJobs({ currentJobId, country, sportList, seniority }: SimilarJobsProps) {
    const [similarJobs, setSimilarJobs] = useState<SimilarJob[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasLoaded) {
                    setHasLoaded(true);
                    loadSimilarJobs();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [hasLoaded]);

    const loadSimilarJobs = async () => {
        setLoading(true);
        try {
            // Use new optimized backend endpoint that handles randomization
            const params = new URLSearchParams();
            params.append('exclude_id', currentJobId);
            if (country) params.append('country', country);
            if (sportList) params.append('sport', Array.isArray(sportList) ? sportList[0] : sportList);
            if (seniority) params.append('seniority', seniority);

            const response = await fetch(`/api/get-similar-jobs?${params.toString()}`);
            const data = await response.json();

            // Backend already returns 3 random jobs, no client-side filtering needed
            const jobs = data.jobs || [];

            // Map job_id to id for consistency with existing interface
            const mappedJobs = jobs.map((job: any) => ({
                ...job,
                id: job.slug || job.job_id,
            }));

            setSimilarJobs(mappedJobs);
        } catch (error) {
            console.error('Error loading similar jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Nothing to recommend (or the request failed): collapse instead of showing an empty heading.
    const isEmpty = hasLoaded && !loading && similarJobs.length === 0;
    const countryLabel = formatCountry(country);

    return (
        <Box
            ref={containerRef}
            width="100%"
            maxW="1100px"
            mx="auto"
            px={4}
            mt={isEmpty ? 0 : 12}
            minH={isEmpty ? 0 : "200px"}
            display={isEmpty ? 'none' : 'block'}
        >
            <Heading as="h2" size="md" mb={4} color="white">
                {countryLabel ? `More jobs in ${countryLabel}` : 'Similar jobs'}
            </Heading>
            {loading && (
                <Flex justify="center" align="center" minH="150px">
                    <Spinner size="lg" color={BRAND_PRIMARY_LIGHT} />
                </Flex>
            )}
            {!loading && similarJobs.length > 0 && (
                <VStack spacing={4} align="stretch">
                    {similarJobs.map((job: SimilarJob) => {
                        const usesDefaultLogo = isDefaultJobLogo(job.logo_permanent_url);
                        return (
                        // ChakraLink renders the single <a>; wrapping it in next/link produced nested anchors.
                        <ChakraLink key={job.id} as={Link} href={`/jobs/${job.id}`} prefetch={false} _hover={{ textDecoration: 'none' }}>
                            <Box
                                p={4}
                                bg="gray.800"
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor="gray.700"
                                _hover={{ bg: 'gray.700' }}
                            >
                                <Flex align="center">
                                    <Image
                                        src={getJobLogoSrc(job.logo_permanent_url)}
                                        alt={`${job.company} logo`}
                                        width={usesDefaultLogo ? "88px" : "50px"}
                                        height="50px"
                                        objectFit="contain"
                                        mr={4}
                                        borderRadius={usesDefaultLogo ? "md" : "full"}
                                        bg="white"
                                        p={usesDefaultLogo ? 1 : 0}
                                        flexShrink={0}
                                    />
                                    <Box>
                                        <Text color="white" fontWeight="bold">{job.title}</Text>
                                        <Text color="gray.300" fontSize="sm">{job.company}</Text>
                                        <Flex mt={2} gap={2}>
                                            <Badge colorScheme={BRAND_PRIMARY_COLOR_SCHEME}>{job.location}</Badge>
                                            {job.salary && <Badge colorScheme="green">{job.salary}</Badge>}
                                        </Flex>
                                    </Box>
                                </Flex>
                            </Box>
                        </ChakraLink>
                        );
                    })}
                </VStack>
            )}
        </Box>
    );
}
