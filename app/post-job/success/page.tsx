'use client';

import { useEffect } from 'react';
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

const SuccessPage = () => {
    useEffect(() => {
        // Track Google Ads conversion when page loads
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'conversion', {
                'send_to': 'AW-11429228767/LGYfCOL6tp8ZEN_h8Mkq'
            });
        }
    }, []);

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

export default SuccessPage;
