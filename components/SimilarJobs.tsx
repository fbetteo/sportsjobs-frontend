import { Box, Heading, VStack, Text, Image, Link as ChakraLink, Badge, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { fetchJobs } from '@/lib/fetchJobs';

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

export default async function SimilarJobs({ currentJobId, country, filter, sportList, seniority }: SimilarJobsProps) {
    // Fetch jobs from the same country
    const filters = {
        country: country,
        sport: sportList,
        seniority: seniority
    };


    // Fetch more jobs to have a better pool for randomization
    const jobs = await fetchJobs(100, JSON.stringify(filters));

    // Filter out current job
    const availableJobs = jobs.filter((job: SimilarJob) => job.id !== currentJobId);

    // Randomly select 3 jobs from the available pool
    const similarJobs = availableJobs
        .sort(() => Math.random() - 0.5) // Randomize the order
        .slice(0, 3);

    if (similarJobs.length === 0) {
        return null;
    }

    return (
        <Box width="100%" mt={8}>
            <Heading as="h2" size="md" mb={4} color="white">
                Similar Jobs by {filter}
            </Heading>
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
        </Box>
    );
}