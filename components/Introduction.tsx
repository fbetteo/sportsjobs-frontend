// components/Introduction.tsx
'use client';

import React from 'react';
import localFont from 'next/font/local';
import { Box, Flex, Heading, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { FaBriefcase, FaSyncAlt } from 'react-icons/fa';
import { BRAND_BACKGROUND, BRAND_FOREGROUND, BRAND_PRIMARY, BRAND_SECONDARY } from '@/lib/uiTokens';
import NewsletterSignupForm from './NewsletterSignupForm';

interface IntroductionProps {
    totalJobs?: number;
    newJobsToday?: number;
}

const sugoPro = localFont({
    src: '../app/fonts/Sugo-Pro-Display-Bold-trial.ttf',
    display: 'swap',
});

const studioGrotesk = localFont({
    src: '../app/fonts/StudioGrotesk-Regular.ttf',
    display: 'swap',
});

const Introduction: React.FC<IntroductionProps> = ({ totalJobs }) => {
    return (
        <Box as="section" bg={BRAND_BACKGROUND}>
            <Box
                bg={BRAND_BACKGROUND}
                backgroundImage="url('/hero-sportsjobs-basketball-bg.png')"
                backgroundRepeat="no-repeat"
                backgroundSize="cover"
                backgroundPosition={{ base: '65% center', md: 'center center' }}
                minH={{ base: '500px', md: '640px', lg: '720px' }}
                w="100%"
                display="flex"
                alignItems="center"
                px={{ base: 6, md: 12, lg: 20 }}
                py={{ base: 10, md: 16 }}
                overflow="hidden"
            >
                <Heading
                    as="h1"
                    color={BRAND_FOREGROUND}
                    fontWeight="normal"
                    lineHeight="0.98"
                    letterSpacing="0"
                    textTransform="uppercase"
                    maxW={{ base: '330px', md: '620px', lg: '720px' }}
                >
                    <Box
                        as="span"
                        display="block"
                        className={sugoPro.className}
                        fontSize={{ base: '52px', md: '84px', lg: '104px' }}
                    >
                        Find your
                    </Box>
                    <Box
                        as="span"
                        display="block"
                        className={sugoPro.className}
                        color={BRAND_PRIMARY}
                        fontSize={{ base: '52px', md: '84px', lg: '104px' }}
                        mt={{ base: 1, md: 3 }}
                    >
                        Dream job
                    </Box>
                    <Box
                        as="span"
                        display="block"
                        className={studioGrotesk.className}
                        fontSize={{ base: '46px', md: '76px', lg: '94px' }}
                        fontWeight="300"
                        mt={{ base: 3, md: 5 }}
                    >
                        In sports
                    </Box>
                    <Box
                        as="span"
                        display="block"
                        className={studioGrotesk.className}
                        fontSize={{ base: '46px', md: '76px', lg: '94px' }}
                        fontWeight="300"
                        mt={{ base: 2, md: 4 }}
                    >
                        Analytics
                    </Box>
                </Heading>
            </Box>

            <VStack
                spacing={{ base: 5, md: 6 }}
                align="center"
                textAlign="center"
                px={{ base: 5, md: 8 }}
                pt={{ base: 7, md: 9 }}
                pb={{ base: 8, md: 10 }}
                color={BRAND_FOREGROUND}
            >
                <VStack spacing={2}>
                    <Heading
                        as="h2"
                        fontSize={{ base: '28px', md: '42px' }}
                        fontWeight="normal"
                        lineHeight="1"
                        letterSpacing="0"
                        textTransform="uppercase"
                    >
                        The #1 job board for sports data, analytics & tech roles
                    </Heading>
                    <Text
                        fontFamily="heading"
                        color={BRAND_PRIMARY}
                        fontSize={{ base: '30px', md: '44px' }}
                        lineHeight="1"
                        textTransform="uppercase"
                    >
                        Stop searching, start applying!
                    </Text>
                </VStack>

                <Flex
                    gap={{ base: 5, md: 16 }}
                    align="center"
                    justify="center"
                    direction={{ base: 'column', sm: 'row' }}
                    flexWrap="wrap"
                >
                    <HStack spacing={3}>
                        <Icon as={FaBriefcase} boxSize={{ base: 8, md: 12 }} color={BRAND_SECONDARY} />
                        <Text fontFamily="heading" fontSize={{ base: '26px', md: '34px' }} textTransform="uppercase">
                            +{totalJobs || 3000} jobs
                        </Text>
                    </HStack>
                    <HStack spacing={3}>
                        <Icon as={FaSyncAlt} boxSize={{ base: 8, md: 12 }} color={BRAND_SECONDARY} />
                        <Text fontFamily="heading" fontSize={{ base: '26px', md: '34px' }} textTransform="uppercase">
                            Updated daily
                        </Text>
                    </HStack>
                </Flex>

                <Text
                    fontSize={{ base: '18px', md: '22px' }}
                    lineHeight="1.35"
                    maxW="900px"
                >
                    Sports analytics, engineering, data science, betting & marketing roles from top teams and companies worldwide.
                </Text>

                <VStack spacing={3} w="100%">
                    <Text
                        fontFamily="heading"
                        fontSize={{ base: '22px', md: '29px' }}
                        lineHeight="1.1"
                        textTransform="uppercase"
                    >
                        Get the <Box as="span" color={BRAND_PRIMARY}>free weekly newsletter</Box> with jobs and sports analytics news
                    </Text>
                    <NewsletterSignupForm variant="hero" />
                </VStack>
            </VStack>
        </Box>
    );
};

export default Introduction;
