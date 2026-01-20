'use client';

import { Box, Heading, VStack, Text, Image, Link as ChakraLink, Badge, Flex, Spinner } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

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
    filter?: string;
    sportList?: string[];
    seniority?: string;
}

export default function SimilarJobs({ currentJobId, country, filter, sportList, seniority }: SimilarJobsProps) {
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

    return (
        <Box ref={containerRef} width="100%" mt={8} minH="200px">
            <Heading as="h2" size="md" mb={4} color="white">
                Similar Jobs by {filter}
            </Heading>
            {loading && (
                <Flex justify="center" align="center" minH="150px">
                    <Spinner size="lg" color="purple.400" />
                </Flex>
            )}
            {!loading && similarJobs.length === 0 && hasLoaded && null}
            {!loading && similarJobs.length > 0 && (
                <VStack spacing={4} align="stretch">
                    {similarJobs.map((job: SimilarJob) => (
                        <Link key={job.id} href={`/jobs/${job.id}`} passHref>
                            <ChakraLink _hover={{ textDecoration: 'none' }}>
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
                                            src={job.logo_permanent_url || "https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png"}
                                            alt={`${job.company} logo`}
                                            boxSize="50px"
                                            objectFit="contain"
                                            mr={4}
                                            borderRadius="full"
                                        />
                                        <Box>
                                            <Text color="white" fontWeight="bold">{job.title}</Text>
                                            <Text color="gray.300" fontSize="sm">{job.company}</Text>
                                            <Flex mt={2} gap={2}>
                                                <Badge colorScheme="purple">{job.location}</Badge>
                                                {job.salary && <Badge colorScheme="green">{job.salary}</Badge>}
                                            </Flex>
                                        </Box>
                                    </Flex>
                                </Box>
                            </ChakraLink>
                        </Link>
                    ))}
                </VStack>
            )}
        </Box>
    );
}