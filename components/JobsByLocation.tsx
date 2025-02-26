import { Box, Text, Link, VStack } from '@chakra-ui/react';

export default function JobsByLocation() {
    return (
        <Box p={5} borderWidth="1px" borderRadius="lg" width="100%" textAlign="left">
            <Text fontWeight="bold" fontSize="lg" mb={3}>Jobs by location</Text>
            <VStack align="start" spacing={2} color="gray.300">
                <Link href="/country/united-states">United States</Link>
                <Link href="/country/canada">Canada</Link>
                <Link href="/country/united-kingdom">United Kingdom</Link>
                <Link href="/country/india">India</Link>
            </VStack>
        </Box>
    );
}