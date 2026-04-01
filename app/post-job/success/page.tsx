'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Button,
    Icon,
    Link as ChakraLink,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FiCheckCircle, FiMail } from 'react-icons/fi';

const SuccessPageContent = () => {
    const searchParams = useSearchParams();
    const sessionId = searchParams?.get('session_id') || '';
    const rawValue = searchParams?.get('value');
    const value = rawValue ? parseFloat(rawValue) : 50; // default to base price 50

    useEffect(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            // Track Google Ads conversion
            window.gtag('event', 'conversion', {
                'send_to': 'AW-11429228767/LGYfCOL6tp8ZEN_h8Mkq',
                'value': value,
                'currency': 'USD',
                'transaction_id': sessionId
            });

            // Standard GA4 Purchase Event (Monetization dashboards)
            window.gtag('event', 'purchase', {
                transaction_id: sessionId,
                value: value,
                currency: 'USD',
                items: [
                    {
                        item_id: 'job_posting',
                        item_name: 'Job Posting',
                        price: value,
                        quantity: 1
                    }
                ]
            });
        }
    }, [sessionId, value]);

    return (
        <Container maxW="container.md" py={20}>
            <VStack spacing={8} textAlign="center">
                <Icon as={FiCheckCircle} w={20} h={20} color="green.400" />

                <Heading size="2xl" bgGradient="linear(to-r, teal.400, green.400)"
                    backgroundClip="text">
                    Job Posted Successfully!
                </Heading>

                <Text fontSize="xl" color="gray.300">
                    Thank you for choosing SportsJobs Online to find your next team member.
                    Your job listing is now live and ready to attract the best talent in sports.
                </Text>

                <Box py={6}>
                    <VStack spacing={4} color="gray.300">
                        <Text>
                            Need to make changes or have questions? Reach out anytime:
                        </Text>
                        <ChakraLink
                            href="mailto:franco@sportsjobs.online"
                            color="teal.300"
                            fontSize="lg"
                            display="flex"
                            alignItems="center"
                        >
                            <Icon as={FiMail} mr={2} />
                            franco@sportsjobs.online
                        </ChakraLink>
                    </VStack>
                </Box>

                <VStack spacing={4} pt={6}>
                    <Link href="/" passHref>
                        <Button colorScheme="teal" size="lg">
                            Browse More Jobs
                        </Button>
                    </Link>
                    <Link href="/post-job" passHref>
                        <Button variant="outline" colorScheme="teal">
                            Post Another Job
                        </Button>
                    </Link>
                </VStack>

                <Text color="gray.400" fontSize="sm" maxW="md" pt={8}>
                    Your support helps us continue connecting the best talent with
                    amazing opportunities in the sports industry. We&apos;re grateful
                    to have you as part of our community.
                </Text>
            </VStack>
        </Container>
    );
};

const SuccessPage = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <SuccessPageContent />
    </Suspense>
);

export default SuccessPage;
