'use client';

import {
    Box,
    Flex,
    Grid,
    Heading,
    Image,
    Link,
    Text,
    VStack
} from '@chakra-ui/react';
import { BRAND_PRIMARY, BRAND_PRIMARY_LIGHT, BRAND_SECONDARY_SURFACE, BRAND_SECONDARY_SURFACE_HOVER } from '@/lib/uiTokens';
import { buildAttributedOutboundUrl } from '@/lib/outboundAttribution';
import NextLink from 'next/link';


interface FeaturedCompany {
    id: string;
    name: string;
    slug: string;
    tagline?: string;
    logo_url?: string;
    job_count?: number;
    external_url?: string; // For companies that redirect to external sites
}

const FeaturedCompanies = () => {
    // Hardcoded companies - replace with your actual data
    const companies: FeaturedCompany[] = [
        {
            id: '1',
            name: 'AthlyticZ',
            slug: 'athlyticz',
            tagline: 'Master Data Science Through the Lens of Sports',
            logo_url: '/athlyticz.png',
            job_count: 0,
            external_url: 'https://athlyticz.com/membership?am_id=franco2804'
        },
        {
            id: '2',
            name: 'The Athletic',
            slug: 'the-athletic',
            tagline: 'Get every sports story that matters.',
            logo_url: 'https://lever-client-logos.s3.us-west-2.amazonaws.com/8ff13c41-d891-40d4-b9d8-de9c995ff06f-1600385441351.png',
            job_count: 5
        },
        {
            id: '3',
            name: 'Fanatics',
            slug: 'Fanatics',
            tagline: 'Fanatics is not just our name. It is who we are',
            logo_url: 'https://lever-client-logos.s3.amazonaws.com/a26ea84a-d8a3-4394-9927-2b0243d2df5a-1552380484471.png',
            job_count: 8
        },
        {
            id: '4',
            name: 'The Score',
            slug: 'The-Score',
            tagline: 'We Empower the Fan Experience',
            logo_url: 'https://play-lh.googleusercontent.com/dDjFtNHe0GExF_0ldvkanmLP3MR3khTepvsn_HrlwsKX7-50itYY3YT1ohxsvmyhcg',
            job_count: 2
        }
    ]; const trackCompanyClick = (companyName: string, companySlug: string, position: number, isExternal: boolean = false) => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'company_click', {
                event_category: 'engagement',
                event_label: companyName,
                company_name: companyName,
                company_slug: companySlug,
                section: 'featured_companies',
                position: position + 1,
                click_type: isExternal ? 'external' : 'internal',
                value: 1
            });
        }
    };

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
                        color={BRAND_PRIMARY_LIGHT}
                        textDecoration="underline"
                        _hover={{ color: BRAND_PRIMARY }}
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
                >                    {companies.slice(0, 4).map((company, index) => {
                    const isExternal = !!company.external_url;
                    const href = isExternal
                        ? buildAttributedOutboundUrl(company.external_url!, {
                            medium: 'company_directory',
                            campaign: 'company_profile',
                            content: company.slug,
                        })
                        : `/company/${company.slug}`;

                    return (
                        <Box
                            key={company.id}
                            as={isExternal ? 'a' : NextLink}
                            href={href}
                            {...(isExternal && {
                                target: '_blank',
                                rel: 'noopener',
                                referrerPolicy: 'origin',
                            })}
                            onClick={() => trackCompanyClick(company.name, company.slug, index, isExternal)}
                            p={6}
                            bg={BRAND_SECONDARY_SURFACE}
                            borderRadius="xl"
                            textAlign="center"
                            transition="all 0.3s"
                            cursor="pointer"
                            _hover={{
                                bg: BRAND_SECONDARY_SURFACE_HOVER,
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
                                    bg={BRAND_PRIMARY}
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
                                        color="white"
                                        textAlign="center"
                                        lineHeight="short"
                                    >
                                        {company.tagline}
                                    </Text>
                                )}
                            </VStack>
                        </Box>
                    )
                })}
                </Grid>
            </VStack>
        </Box>
    );
};

export default FeaturedCompanies;
