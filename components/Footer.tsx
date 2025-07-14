// components/Footer.tsx
import { Box, Text, Link, HStack, IconButton, Grid, VStack } from '@chakra-ui/react';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';

import JobsByLocation from './JobsByLocation'; // Import the new component

const Footer = () => {
    return (
        <Box as="footer" py={4} textAlign="center" bg="gray.700" color="white">
            <Text mb={2}>
                © 2025 Calibrated AI LLC | Built by{' '}
                <Link href="https://twitter.com/franbetteo" isExternal color="teal.200">
                    @franbetteo
                </Link>{' '}
                (<Link href="https://www.fbetteo.com" isExternal color="gray.400" fontSize="sm">
                    fbetteo.com
                </Link>). I&apos;d love to hear your feedback — Get in touch via DM,{' '}
                <Link href="mailto:franco@sportsjobs.online" color="teal.200">
                    franco@sportsjobs.online
                </Link>, or{' '}
                <Link href="https://sportsjobsonline.featurebase.app/" isExternal color="teal.200">
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
                    bg="teal.500"
                    _hover={{ bg: "teal.400" }}
                />
                <IconButton
                    as="a"
                    href="https://www.linkedin.com/company/sportsjobs-online"
                    target="_blank"
                    aria-label="LinkedIn"
                    icon={<FaLinkedin />}
                    bg="teal.500"
                    _hover={{ bg: "teal.400" }}
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
                <Link href="/privacy-policy" color="teal.200" >
                    Privacy Policy
                </Link>
            </Text>
            <Text mt={2} fontSize="sm">
                <Link href="https://climate.stripe.com/83mJaI" color="teal.200" >
                    Sportsjobs Online contributes revenue to removing CO2 from atmosphere
                </Link>
            </Text>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mt={10} px={5}>
                <JobsByLocation />

                <Box p={5} borderWidth="1px" borderRadius="lg" width="100%" textAlign="left">
                    <Text fontWeight="bold" fontSize="lg" mb={3}>Companies</Text>
                    <VStack align="start" spacing={2} color="gray.300">
                        <Link href="/company-jobs">Browse All Companies</Link>
                        {/* <Link href="/top-companies">Top Hiring Companies</Link>
                        <Link href="/remote-companies">Companies Hiring Remote</Link>
                        <Link href="/tech-companies">Sports Tech Companies</Link> */}
                    </VStack>
                </Box>

                <Box p={5} borderWidth="1px" borderRadius="lg" width="100%" textAlign="left">
                    <Text fontWeight="bold" fontSize="lg" mb={3}>Resources</Text>
                    <VStack align="start" spacing={2} color="gray.300">
                        <Link href="/resources">Job Seeker Resources</Link>
                        <Link href="/blog">Career Blog</Link>
                        {/* Future links:
                        <Link href="/resources/tutorials">Tutorials</Link>
                        <Link href="/resources/tools">Tools</Link> */}
                    </VStack>
                </Box>
            </Grid>
        </Box>

    );
};

export default Footer;
