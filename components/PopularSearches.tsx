'use client';

import { Box, Flex, Grid, Heading, Link, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';

const searches = [
    {
        title: 'Sports Analytics Internships',
        href: '/sports-analytics-internships',
        description: 'Browse the latest student and early-career internship roles in sports analytics.',
    },
    {
        title: 'Sports Industry Companies',
        href: '/company-jobs',
        description: 'Explore organizations hiring across analytics, data, engineering, and sports business.',
    },
];

export default function PopularSearches() {
    return (
        <Box mb={10} px={4}>
            <VStack spacing={6} align="stretch">
                <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
                    <Heading as="h2" size="lg" color="white">
                        Popular Searches
                    </Heading>
                    <Link
                        as={NextLink}
                        href="/resources"
                        fontSize="sm"
                        color="blue.400"
                        textDecoration="underline"
                        _hover={{ color: 'blue.300' }}
                    >
                        Career resources
                    </Link>
                </Flex>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    {searches.map((search) => (
                        <Box
                            key={search.href}
                            as={NextLink}
                            href={search.href}
                            p={6}
                            bg="gray.700"
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor="gray.600"
                            transition="all 0.2s"
                            _hover={{
                                bg: 'gray.600',
                                borderColor: 'purple.400',
                                transform: 'translateY(-2px)',
                                textDecoration: 'none',
                            }}
                        >
                            <Heading as="h3" size="md" color="white" mb={2}>
                                {search.title}
                            </Heading>
                            <Text color="gray.300" fontSize="sm">
                                {search.description}
                            </Text>
                        </Box>
                    ))}
                </Grid>
            </VStack>
        </Box>
    );
}
