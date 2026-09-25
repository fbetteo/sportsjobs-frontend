'use client';

import { Box, Container, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { jobLandingPageSlugs, jobLandingPages } from '@/lib/jobLandingPages';
import { BRAND_SECONDARY_LIGHT, BRAND_SECONDARY_SURFACE } from '@/lib/uiTokens';

export default function JobSearchesHub() {
  return (
    <Container maxW="7xl" py={{ base: 8, md: 12 }}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center" maxW="3xl" mx="auto">
          <Heading as="h1" size={{ base: 'xl', md: '2xl' }} color="white" mb={4}>
            Popular Sports Job Searches
          </Heading>
          <Text color="gray.300" fontSize={{ base: 'md', md: 'lg' }}>
            Explore live openings and practical career guidance by league, sport, role, internship type, and work arrangement.
          </Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {jobLandingPageSlugs.map((slug) => {
            const page = jobLandingPages[slug];
            return (
              <Box
                key={slug}
                as={NextLink}
                href={`/${slug}`}
                p={6}
                bg={BRAND_SECONDARY_SURFACE}
                borderWidth="1px"
                borderColor="gray.600"
                borderRadius="lg"
                _hover={{ borderColor: BRAND_SECONDARY_LIGHT, transform: 'translateY(-2px)', textDecoration: 'none' }}
                transition="all 0.2s"
              >
                <Heading as="h2" size="md" color="white" mb={3}>
                  {page.shortTitle}
                </Heading>
                <Text color="gray.300" fontSize="sm">
                  {page.description}
                </Text>
              </Box>
            );
          })}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
