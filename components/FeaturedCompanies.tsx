'use client';
import { Box, Flex, Grid, Heading, Text, Link, Image, VStack, HStack } from '@chakra-ui/react';
import NextLink from 'next/link';

interface FeaturedCompany {
    id: string;
    name: string;
    slug: string;
    tagline?: string;
    logo_url?: string;
    job_count?: number;
}

const FeaturedCompanies = () => {
    // Hardcoded companies - replace with your actual data
    const companies: FeaturedCompany[] = [
        {
            id: '1',
            name: 'The Athletic',
            slug: 'the-athletic',
            tagline: 'Get every sports story that matters.',
            logo_url: 'https://lever-client-logos.s3.us-west-2.amazonaws.com/8ff13c41-d891-40d4-b9d8-de9c995ff06f-1600385441351.png', // Add your logo URL here
            job_count: 5
        },
        {
            id: '2',
            name: 'Brooks Running',
            slug: 'Brooks-Running',
            tagline: 'Shop runner favorites',
            logo_url: 'https://lever-client-logos.s3.amazonaws.com/f0a2961a-09a7-412e-9b8f-0d186769bc1a-1501529042183.png', // Add your logo URL here
            job_count: 3
        },
        {
            id: '3',
            name: 'Fanatics',
            slug: 'Fanatics',
            tagline: 'Fanatics is not just our name. It is who we are',
            logo_url: 'https://lever-client-logos.s3.amazonaws.com/a26ea84a-d8a3-4394-9927-2b0243d2df5a-1552380484471.png', // Add your logo URL here
            job_count: 8
        },
        {
            id: '4',
            name: 'The Score',
            slug: 'The-Score',
            tagline: 'We Empower the Fan Experience',
            logo_url: 'https://play-lh.googleusercontent.com/dDjFtNHe0GExF_0ldvkanmLP3MR3khTepvsn_HrlwsKX7-50itYY3YT1ohxsvmyhcg', // Add your logo URL here
            job_count: 2
        }
    ];

    if (!companies || companies.length === 0) {
        return null;
    }

    return (
        <Box mb={10} px={4}>
            <VStack spacing={6} align="stretch">
                <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
                    <Heading as="h2" size="lg" color="white">
                        Popular Companies
                    </Heading>                    <Link
                        as={NextLink}
                        href="/advertise"
                        fontSize="sm"
                        color="blue.400"
                        textDecoration="underline"
                        _hover={{ color: "blue.300" }}
                    >
                        Your brand here?
                    </Link>
                </Flex>

                <Grid
                    templateColumns={{
                        base: "1fr",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)"
                    }}
                    gap={4}
                >
                    {companies.slice(0, 4).map((company) => (
                        <Box
                            key={company.id}
                            as={NextLink}
                            href={`/company/${company.slug}`}
                            p={6}
                            bg="gray.700"
                            borderRadius="xl"
                            textAlign="center"
                            transition="all 0.3s"
                            cursor="pointer"
                            _hover={{
                                bg: "gray.600",
                                transform: "translateY(-2px)",
                                boxShadow: "lg"
                            }}
                            minH="180px"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            gap={3}
                        >
                            {company.logo_url ? (
                                <Image
                                    src={company.logo_url}
                                    alt={`${company.name} logo`}
                                    maxH="60px"
                                    maxW="120px"
                                    objectFit="contain"
                                />
                            ) : (
                                <Box
                                    w={12}
                                    h={12}
                                    bg="purple.500"
                                    borderRadius="lg"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontSize="xl"
                                    fontWeight="bold"
                                    color="white"
                                >
                                    {company.name.charAt(0)}
                                </Box>
                            )}

                            <VStack spacing={2}>
                                <Text
                                    fontWeight="bold"
                                    fontSize="lg"
                                    color="white"
                                    textAlign="center"
                                    lineHeight="short"
                                >
                                    {company.name}
                                </Text>

                                {company.tagline && (
                                    <Text
                                        fontSize="sm"
                                        color="gray.300"
                                        textAlign="center"
                                        lineHeight="short"
                                    >
                                        {company.tagline}
                                    </Text>
                                )}
                                {/* 
                                {company.job_count && company.job_count > 0 && (
                                    <Text
                                        fontSize="xs"
                                        color="purple.300"
                                        fontWeight="medium"
                                    >
                                        {company.job_count} open positions
                                    </Text>
                                )} */}
                            </VStack>
                        </Box>
                    ))}
                </Grid>
            </VStack>
        </Box>
    );
};

export default FeaturedCompanies;