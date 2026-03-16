// components/SignupForm.tsx

import React, { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, useToast, Flex, Text } from '@chakra-ui/react';

const SUBSTACK_SUBSCRIBE_URL = 'https://sportsjobs.substack.com/subscribe';

const NewsletterSignupForm = () => {
    const [email, setEmail] = useState('');
    const [showUpscribe, setShowUpscribe] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Record signup in database
            try {
                await fetch('/api/add-newsletter-signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        source: 'website-form'
                    }),
                });
            } catch (dbError) {
                console.error('Database recording error:', dbError);
                // Don't show this error to user since newsletter subscription was successful
            }

            // Track Google Ads newsletter conversion
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'conversion', {
                    'send_to': 'AW-11429228767/nJWICJPcwI0bEN_h8Mkq' // Replace with your newsletter conversion label
                });

                // Also track as Google Analytics event for additional insights
                window.gtag('event', 'newsletter_signup', {
                    'event_category': 'engagement',
                    'event_label': 'newsletter_form'
                });
            }

            const normalizedEmail = encodeURIComponent(email.trim().toLowerCase());
            const substackUrl = `${SUBSTACK_SUBSCRIBE_URL}?utm_source=sportsjobs.online&utm_medium=website&utm_campaign=newsletter_form&email=${normalizedEmail}`;
            const openedWindow = typeof window !== 'undefined'
                ? window.open(substackUrl, '_blank', 'noopener,noreferrer')
                : null;

            if (!openedWindow) {
                toast({
                    title: 'Popup blocked',
                    description: 'Please allow popups and try again to continue on Substack.',
                    status: 'warning',
                    duration: 6000,
                    isClosable: true,
                });
                return;
            }

            toast({
                title: 'Almost done',
                description: 'Please complete your subscription on Substack in the opened page.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setEmail('');
            setShowUpscribe(true);

        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to subscribe. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={4} boxShadow="md" borderRadius="md" mb={4}>
            {!showUpscribe ? (
                <Box as="form" onSubmit={handleSubmit}>
                    <Text mb={2} fontSize="sm" color="gray.300">
                        Get the free weekly newsletter with jobs and sports analytics news.  💡
                    </Text>
                    <Text mb={2} fontSize="xs" color="gray.400">
                        Substack may show optional support, but you can skip it and subscribe for free.
                    </Text>
                    <Flex alignItems="center">
                        <FormControl>
                            <FormLabel htmlFor="email" srOnly>Email</FormLabel>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                mr={0}
                                borderRightRadius="0"
                            />
                        </FormControl>
                        <Button
                            bg="purple.500"
                            color="white"
                            _hover={{ bg: 'purple.400' }}
                            _active={{ bg: 'purple.600' }}
                            type="submit"
                            borderLeftRadius="0"
                            borderRightRadius="md"
                        >
                            Join
                        </Button>
                    </Flex>
                </Box>
            ) : (
                <Box>
                    <Text mb={2} fontSize="lg" color="gray.300">
                        Thank you for subscribing!
                    </Text>
                </Box>
            )}
        </Box>
    );
};
export default NewsletterSignupForm;
