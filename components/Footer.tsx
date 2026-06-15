// components/Footer.tsx
import { Box, Text, Link, HStack, IconButton, Grid, VStack } from '@chakra-ui/react';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';

import JobsByLocation from './JobsByLocation'; // Import the new component
import {
    BRAND_PRIMARY,
    BRAND_PRIMARY_LIGHT,
    BRAND_SECONDARY_LIGHT,
    BRAND_SECONDARY_SURFACE,
    BRAND_SECONDARY_SURFACE_HOVER,
} from '@/lib/uiTokens';

const Footer = () => {
    return (
        <Box as="footer" py={4} textAlign="center" bg={BRAND_SECONDARY_SURFACE} color="white">
            <Text mb={2}>
                © 2026 Calibrated AI LLC | Built by{' '}
                <Link href="https://twitter.com/franbetteo" isExternal color={BRAND_PRIMARY_LIGHT}>
                    @franbetteo
                </Link>{' '}
                (<Link href="https://www.fbetteo.com" isExternal color={BRAND_SECONDARY_LIGHT} fontSize="sm">
                    fbetteo.com
                </Link>). I&apos;d love to hear your feedback — Get in touch via DM,{' '}
                <Link href="mailto:franco@sportsjobs.online" color={BRAND_PRIMARY_LIGHT}>
                    franco@sportsjobs.online
                </Link>, or{' '}
                <Link href="https://sportsjobsonline.featurebase.app/" isExternal color={BRAND_PRIMARY_LIGHT}>
                    submit feedback here
                </Link>
            </Text>
            <HStack justify="center" spacing={4}>
                <IconButton
                    as="a"
                    href="https://x.com/SportsjobsBoard"
                    target="_blank"
                    aria-label="Twitter"
                    icon={<FaTwitter />}
                    bg={BRAND_PRIMARY}
                    _hover={{ bg: BRAND_PRIMARY_LIGHT }}
                />
                <IconButton
                    as="a"
                    href="https://www.linkedin.com/company/sportsjobs-online"
                    target="_blank"
                    aria-label="LinkedIn"
                    icon={<FaLinkedin />}
                    bg={BRAND_PRIMARY}
                    _hover={{ bg: BRAND_PRIMARY_LIGHT }}
                />
                {/* <Link
                    href="https://www.jobboardfinder.com/jobboard-sportsjobsonline-usa?utm_source=logo_referenced&utm_medium=logo_jobboard&utm_content=logo_referenced&utm_campaign=logo_jobboard"
                    title="JobboardFinder - Any e-recruitment media, anywhere"
                    isExternal
                >
                    <Image
                        src="https://www.jobboardfinder.com/img/logo_referenced_on_jobboard_finder_90x90.png"
                        alt="JobboardFinder - Search the best job board worldwide"
                    />
                </Link> */}
            </HStack>
            <Text mt={2} fontSize="sm">
                <Link href="/privacy-policy" color={BRAND_PRIMARY_LIGHT} >
                    Privacy Policy
                </Link>
            </Text>
            <Text mt={2} fontSize="sm">
                <Link href="https://climate.stripe.com/83mJaI" color={BRAND_PRIMARY_LIGHT} >
                    Sportsjobs Online contributes revenue to removing CO2 from atmosphere
                </Link>
            </Text>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mt={10} px={5}>
                <JobsByLocation />

                <Box p={5} borderWidth="1px" borderColor={BRAND_SECONDARY_LIGHT} bg={BRAND_SECONDARY_SURFACE_HOVER} borderRadius="lg" width="100%" textAlign="left">
                    <Text fontWeight="bold" fontSize="lg" mb={3}>Companies</Text>
                    <VStack align="start" spacing={2} color="white">
                        <Link href="/company-jobs">Browse All Companies</Link>
                        {/* <Link href="/top-companies">Top Hiring Companies</Link>
                        <Link href="/remote-companies">Companies Hiring Remote</Link>
                        <Link href="/tech-companies">Sports Tech Companies</Link> */}
                    </VStack>
                </Box>

                <Box p={5} borderWidth="1px" borderColor={BRAND_SECONDARY_LIGHT} bg={BRAND_SECONDARY_SURFACE_HOVER} borderRadius="lg" width="100%" textAlign="left">
                    <Text fontWeight="bold" fontSize="lg" mb={3}>Resources</Text>
                    <VStack align="start" spacing={2} color="white">
                        <Link href="/sports-analytics-internships">Sports Analytics Internships</Link>
                        <Link href="/sports-analytics-salaries">Sports Analytics Salaries</Link>
                        <Link href="/teamwork-online-sports-analytics-jobs">TeamWork Online Alternative</Link>
                        <Link href="/resources">Job Seeker Resources</Link>
                        <Link href="/blog">Career Blog</Link>
                    </VStack>
                </Box>

                <Box p={5} borderWidth="1px" borderColor={BRAND_SECONDARY_LIGHT} bg={BRAND_SECONDARY_SURFACE_HOVER} borderRadius="lg" width="100%" textAlign="left">
                    <Text fontWeight="bold" fontSize="lg" mb={3}>For Employers</Text>
                    <VStack align="start" spacing={2} color="white">
                        <Link href="/advertise">Advertise Jobs</Link>
                        <Link href="/affiliates">Affiliate Program</Link>
                        <Link href="/post-job">Post a Job</Link>
                    </VStack>
                </Box>
            </Grid>
        </Box>

    );
};

export default Footer;
