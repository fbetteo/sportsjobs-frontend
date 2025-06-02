import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { Metadata } from 'next';

// Add metadata for SEO purposes
export const metadata: Metadata = {
    title: 'Job Not Found | SportsJobs',
    description: 'The job posting you are looking for has expired or been removed.',
    robots: {
        index: false,
        follow: true,
    }
};

// This file should rarely be used as the page.tsx in this directory 
// redirects to the correct path /jobs/[id]
export default function NotFound() {
    return (
        <Box p={5} color="white" bg="black" minHeight="100vh" textAlign="center">
            <VStack spacing={4}>
                <Heading as="h1" size="xl">
                    This job is no longer available
                </Heading>
                <Text>
                    The job posting you are looking for has expired or been removed.
                </Text>
                <Text fontSize="sm" color="gray.400">
                    Jobs typically stay active for 60 days or until filled.
                </Text>
                <Button
                    as="a"
                    href="/"
                    colorScheme="purple"
                    size="lg"
                >
                    Browse Latest Jobs
                </Button>
            </VStack>
        </Box>
    );
}