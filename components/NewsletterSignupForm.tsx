// components/SignupForm.tsx

import React, { useState, useEffect } from 'react';
import { Box, Button, Input, FormControl, FormLabel, useToast, Flex, Text } from '@chakra-ui/react';

const NewsletterSignupForm = () => {
    const [email, setEmail] = useState('');
    const [showUpscribe, setShowUpscribe] = useState(false);
    const toast = useToast();

    useEffect(() => {
        // Only load sparkloop on client side
        if (typeof window === 'undefined') return;
        
        try {
            // Dynamic import to avoid SSR issues
            import('sparkloop').then((sparkloopModule) => {
                const sparkloop = sparkloopModule.default || sparkloopModule;
                console.log("CARGANDO SPARKLOOP")
                const opts = { scan_forms: false }; // Prevent SparkLoop from scanning forms automatically
                sparkloop('team_88199bebd026', opts); // Replace with your actual SparkLoop team ID
            }).catch((error) => {
                console.error('Error loading SparkLoop:', error);
            });
        } catch (error) {
            console.error('Error initializing SparkLoop:', error);
        }
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/subscribe-newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data.error) {
                toast({
                    title: 'Error',
                    description: data.error,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            // Only track with Sparkloop after successful subscription
            try {
                if (window.SL && typeof window.SL.trackSubscriber === 'function') {
                    await window.SL.trackSubscriber(email);
                }
            } catch (sparkloopError) {
                console.error('Sparkloop tracking error:', sparkloopError);
                // Don't show this error to user since subscription was successful
            }

            toast({
                title: 'Success',
                description: 'You have been subscribed!',
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
                        Do you want to keep updated with jobs and news? 💡
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
                            bg="#D4A017"
                            color="white"
                            _hover={{ bg: '#B8860B' }}
                            _active={{ bg: '#A67C00' }}
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
