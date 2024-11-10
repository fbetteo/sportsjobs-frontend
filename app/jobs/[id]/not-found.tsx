import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';

export default function NotFound() {
    return (
        <Box p={5} color="white" bg="black" minHeight="100vh" textAlign="center">
            <VStack spacing={4}>
                <Heading as="h1" size="xl">
                    This job is no longer available
                </Heading>
                <Text>
                    The job posting you're looking for has expired or been removed.
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