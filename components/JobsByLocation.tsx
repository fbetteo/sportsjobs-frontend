import { Box, Text, Link, VStack } from '@chakra-ui/react';

export default function JobsByLocation() {
    return (
        <Box mt={10} p={5} borderWidth="1px" borderRadius="lg" width="100%" textAlign="left">
            <Text fontWeight="bold" fontSize="lg" mb={3}>Jobs by location</Text>
            <VStack align="start" spacing={2} color="gray.300">
                <Link href="/country/united-states">United States</Link>
            </VStack>
        </Box>
    );
}