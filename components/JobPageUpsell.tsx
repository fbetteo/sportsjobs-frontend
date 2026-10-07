'use client';

// Compact membership prompt for job detail pages. Visitors there usually arrived
// from search for one posting, so this replaces the full pricing section and
// testimonials wall that the homepage uses.

import { Box, Button, Flex, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
    BRAND_PRIMARY,
    BRAND_PRIMARY_COLOR_SCHEME,
    BRAND_PRIMARY_LIGHT,
    BRAND_PRIMARY_SURFACE,
} from '@/lib/uiTokens';
import { trackAnalyticsEvent } from '@/lib/analyticsClient';
import { pricingPlans } from '@/pricingPlans';

const yearlyPlan = pricingPlans.find((plan) => plan.planName === 'Yearly');

const BENEFITS = [
    'Unlimited access to all jobs',
    'Advanced filtering tools',
    'Exclusive discount codes',
];

interface JobPageUpsellProps {
    jobId: string;
    expired: boolean;
}

export default function JobPageUpsell({ jobId, expired }: JobPageUpsellProps) {
    const { user, isLoading } = useUser();

    if (isLoading || user) {
        return null;
    }

    return (
        <Box px={4} py={{ base: 8, md: 10 }} width="100%">
            <Box
                maxW="900px"
                mx="auto"
                bg={BRAND_PRIMARY_SURFACE}
                borderWidth="1px"
                borderColor={BRAND_PRIMARY_LIGHT}
                borderRadius="xl"
                px={{ base: 5, md: 8 }}
                py={{ base: 6, md: 7 }}
            >
                <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 5, md: 8 }} align={{ md: 'center' }}>
                    <Box flex="1">
                        <Text color="white" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" lineHeight="short">
                            {expired
                                ? 'This one is closed. Find the next one first.'
                                : 'Find more jobs like this before everyone else.'}
                        </Text>
                        <Stack spacing={1} mt={3}>
                            {BENEFITS.map((benefit) => (
                                <HStack key={benefit} spacing={2}>
                                    <Icon as={FaCheckCircle} color={BRAND_PRIMARY_LIGHT} />
                                    <Text color="gray.200">{benefit}</Text>
                                </HStack>
                            ))}
                        </Stack>
                    </Box>
                    <Stack spacing={2} align={{ base: 'stretch', md: 'center' }} flexShrink={0}>
                        <Button
                            as="a"
                            href="/signup"
                            colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
                            bg={BRAND_PRIMARY}
                            size="lg"
                            px={8}
                            onClick={() => trackAnalyticsEvent('job_page_upsell_click', { job_id: jobId, expired })}
                        >
                            Get full access
                        </Button>
                        <Text color="gray.300" fontSize="sm" textAlign="center">
                            {yearlyPlan ? `From ${yearlyPlan.price}/year · ` : ''}25% off applied at checkout
                        </Text>
                    </Stack>
                </Flex>
            </Box>
        </Box>
    );
}
