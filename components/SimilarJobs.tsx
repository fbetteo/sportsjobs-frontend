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
    country: string;
}

export default async function SimilarJobs({ currentJobId, country }: SimilarJobsProps) {
    // Fetch similar jobs using the fetchJobs utility
    const filters = {
        country: country
    };

    const jobs = await fetchJobs(4, JSON.stringify(filters));

    // Filter out current job and limit to 3 jobs
    const similarJobs = jobs
        .filter((job: SimilarJob) => job.id !== currentJobId)
        .slice(0, 3);

    if (similarJobs.length === 0) {
        return null;
    }

    return (
        <Box width="100%" mt={8}>
            <Heading as="h2" size="md" mb={4} color="white">
                Similar Jobs
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
                                        src={job.logo_permanent_url}
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