'use client';

import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaCheckCircle, FaExternalLinkAlt, FaLock } from 'react-icons/fa';
import type { JobLandingPageConfig, LandingPageJob } from '@/lib/jobLandingPages';
import { jobLandingPages } from '@/lib/jobLandingPages';
import { getJobLogoSrc, isDefaultJobLogo } from '@/lib/jobLogo';
import {
  BRAND_PRIMARY_COLOR_SCHEME,
  BRAND_SECONDARY,
  BRAND_SECONDARY_COLOR_SCHEME,
  BRAND_SECONDARY_LIGHT,
  BRAND_SECONDARY_SURFACE,
} from '@/lib/uiTokens';
import NewsletterSignupForm from './NewsletterSignupForm';

interface Props {
  config: JobLandingPageConfig;
  jobs: LandingPageJob[];
  lastChecked: string;
}

export default function JobLandingContent({ config, jobs, lastChecked }: Props) {
  return (
    <Container maxW="7xl" py={{ base: 8, md: 12 }}>
      <VStack spacing={{ base: 10, md: 14 }} align="stretch">
        <Box textAlign="center" maxW="4xl" mx="auto">
          <Badge colorScheme={BRAND_SECONDARY_COLOR_SCHEME} mb={4} px={3} py={1} borderRadius="md">
            {config.badge}
          </Badge>
          <Heading as="h1" size={{ base: 'xl', md: '2xl' }} color="white" mb={4}>
            {config.title}
          </Heading>
          <Text color="gray.300" fontSize={{ base: 'md', md: 'lg' }}>
            {config.intro}
          </Text>
        </Box>

        <Box as="section" id="current-openings">
          <Flex direction={{ base: 'column', lg: 'row' }} gap={8} align="start">
            <Box flex="1" minW={0}>
              <Flex
                justify="space-between"
                align={{ base: 'start', md: 'center' }}
                direction={{ base: 'column', md: 'row' }}
                gap={3}
                mb={5}
              >
                <Box>
                  <Heading as="h2" size="lg" color="white">
                    {config.jobsHeading}
                  </Heading>
                  <Text color="gray.400" mt={2}>
                    Current matching opportunities from SportsJobs Online. Last checked: {lastChecked}.
                  </Text>
                </Box>
                <Button
                  as={NextLink}
                  href="/signup"
                  colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
                  leftIcon={<FaLock />}
                  flexShrink={0}
                >
                  Unlock all jobs
                </Button>
              </Flex>

              <VStack spacing={4} align="stretch">
                {jobs.length === 0 ? (
                  <Alert status="info" bg="gray.800" color="gray.100" borderRadius="md">
                    <AlertIcon />
                    {config.emptyMessage}
                  </Alert>
                ) : (
                  jobs.map((job) => {
                    const usesDefaultLogo = isDefaultJobLogo(job.logo_permanent_url);
                    return (
                      <LinkBox
                        as={Card}
                        key={job.id}
                        bg="gray.800"
                        borderWidth="1px"
                        borderColor="gray.600"
                        borderRadius="md"
                        _hover={{ borderColor: BRAND_SECONDARY_LIGHT, bg: 'gray.700' }}
                      >
                        <CardBody>
                          <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                            <Image
                              src={getJobLogoSrc(job.logo_permanent_url)}
                              alt={`${job.company ?? 'Sports organization'} logo`}
                              width={usesDefaultLogo ? '104px' : '64px'}
                              height="64px"
                              objectFit="contain"
                              borderRadius="md"
                              bg="white"
                              p={1}
                              flexShrink={0}
                            />
                            <Box flex="1" minW={0}>
                              <Text color="gray.400" fontWeight="semibold">
                                {job.company ?? 'Sports organization'}
                              </Text>
                              <LinkOverlay as={NextLink} href={`/jobs/${job.id}`} prefetch={false}>
                                <Heading as="h3" size="md" color="white" mt={1}>
                                  {job.title ?? config.shortTitle}
                                </Heading>
                              </LinkOverlay>
                              <HStack spacing={2} wrap="wrap" mt={3}>
                                {job.sport_list && <Tag colorScheme={BRAND_SECONDARY_COLOR_SCHEME}>{job.sport_list}</Tag>}
                                {job.seniority && <Tag colorScheme="blue">{job.seniority}</Tag>}
                                <Tag colorScheme="green">{job.remote_string || 'Work type not listed'}</Tag>
                                <Tag colorScheme={job.salary ? BRAND_PRIMARY_COLOR_SCHEME : 'gray'}>
                                  {job.salary || 'Pay not listed'}
                                </Tag>
                              </HStack>
                              <Text color="gray.300" fontSize="sm" mt={3}>
                                {job.location || job.country || 'Location not listed'}
                                {job.days_ago_text ? ` · ${job.days_ago_text}` : ''}
                              </Text>
                            </Box>
                          </Flex>
                        </CardBody>
                      </LinkBox>
                    );
                  })
                )}
              </VStack>
            </Box>

            <Box
              w={{ base: '100%', lg: '360px' }}
              bg={BRAND_SECONDARY_SURFACE}
              borderWidth="1px"
              borderColor="gray.600"
              borderRadius="md"
              p={5}
            >
              <Heading as="h2" size="md" color="white" mb={3}>
                Get New Sports Jobs Weekly
              </Heading>
              <Text color="gray.300" fontSize="sm" mb={4}>
                Receive new openings and practical sports-career resources without checking every employer site yourself.
              </Text>
              <NewsletterSignupForm />
            </Box>
          </Flex>
        </Box>

        <Divider borderColor="gray.700" />

        <Box as="section">
          <Heading as="h2" size="lg" color="white" mb={5}>
            Roles You May Find
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            {config.roleGroups.map((role) => (
              <Card key={role.title} bg="gray.800" borderColor="gray.600" borderWidth="1px" borderRadius="md">
                <CardBody>
                  <Heading as="h3" size="md" color="white" mb={2}>
                    {role.title}
                  </Heading>
                  <Text color="gray.300" fontSize="sm">
                    {role.text}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        <SimpleGrid as="section" columns={{ base: 1, lg: 2 }} spacing={6}>
          <Box bg="gray.800" borderWidth="1px" borderColor="gray.600" borderRadius="md" p={6}>
            <Heading as="h2" size="lg" color="white" mb={4}>
              Useful Skills and Experience
            </Heading>
            <List spacing={3} color="gray.300">
              {config.skills.map((skill) => (
                <ListItem key={skill} display="flex">
                  <ListIcon as={FaCheckCircle} color={BRAND_SECONDARY_LIGHT} mt={1} />
                  <Text>{skill}</Text>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box bg="gray.800" borderWidth="1px" borderColor="gray.600" borderRadius="md" p={6}>
            <Heading as="h2" size="lg" color="white" mb={4}>
              How to Search More Effectively
            </Heading>
            <Text color="gray.300">{config.searchAdvice}</Text>
          </Box>
        </SimpleGrid>

        <Box as="section">
          <Heading as="h2" size="lg" color="white" mb={5}>
            Frequently Asked Questions
          </Heading>
          <VStack spacing={4} align="stretch">
            {config.faqs.map((item) => (
              <Box key={item.question} bg="gray.800" borderWidth="1px" borderColor="gray.600" borderRadius="md" p={5}>
                <Heading as="h3" size="sm" color="white" mb={2}>
                  {item.question}
                </Heading>
                <Text color="gray.300" fontSize="sm">
                  {item.answer}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>

        <Box as="nav" aria-label="Related job searches">
          <Heading as="h2" size="lg" color="white" mb={4}>
            Related Sports Job Searches
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {config.relatedSlugs.map((slug) => {
              const related = jobLandingPages[slug];
              if (!related) return null;
              return (
                <Box
                  key={slug}
                  as={NextLink}
                  href={`/${slug}`}
                  p={5}
                  bg={BRAND_SECONDARY_SURFACE}
                  borderWidth="1px"
                  borderColor="gray.600"
                  borderRadius="md"
                  _hover={{ borderColor: BRAND_SECONDARY_LIGHT, textDecoration: 'none' }}
                >
                  <Heading as="h3" size="sm" color="white" mb={2}>
                    {related.shortTitle}
                  </Heading>
                  <Text color="gray.300" fontSize="sm">
                    {related.description}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>

        <Box
          as="section"
          bg="gray.800"
          borderWidth="1px"
          borderColor={BRAND_SECONDARY}
          borderRadius="md"
          p={{ base: 6, md: 8 }}
          textAlign="center"
        >
          <Heading as="h2" size="lg" color="white" mb={3}>
            Find Your Next Role in Sports
          </Heading>
          <Text color="gray.300" maxW="3xl" mx="auto" mb={5}>
            Browse curated openings across analytics, data, technology, performance, operations, marketing, and sports business.
          </Text>
          <HStack justify="center" spacing={4} flexWrap="wrap">
            <Button as={NextLink} href="/signup" colorScheme={BRAND_PRIMARY_COLOR_SCHEME} rightIcon={<FaExternalLinkAlt />}>
              Start your search
            </Button>
            <Button as={NextLink} href="/#current-openings" variant="outline" colorScheme={BRAND_SECONDARY_COLOR_SCHEME}>
              Browse all jobs
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Container>
  );
}
