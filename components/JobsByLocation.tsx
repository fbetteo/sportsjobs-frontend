import { Box, Link, Text, VStack } from '@chakra-ui/react';
import { BRAND_SECONDARY_LIGHT, BRAND_SECONDARY_SURFACE_HOVER } from '@/lib/uiTokens';
export default function JobsByLocation() {
    return (
        <Box p={5} borderWidth="1px" borderColor={BRAND_SECONDARY_LIGHT} bg={BRAND_SECONDARY_SURFACE_HOVER} borderRadius="lg" width="100%" textAlign="left">
            <Text fontWeight="bold" fontSize="lg" mb={3}>Jobs by location</Text>
            <VStack align="start" spacing={2} color="white">
                <Link href="/country/united-states">United States</Link>
                <Link href="/country/canada">Canada</Link>
                <Link href="/country/united-kingdom">United Kingdom</Link>
                <Link href="/country/india">India</Link>
            </VStack>
        </Box>
    );
}
