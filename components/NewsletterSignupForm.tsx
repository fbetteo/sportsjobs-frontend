// components/SignupForm.tsx
declare global {
    interface Window {
        SL: {
            trackSubscriber: (email: string) => void;
        };
    }
}

import React, { useState, useEffect } from 'react';
import { Box, Button, Input, FormControl, FormLabel, useToast, Flex, Text } from '@chakra-ui/react';
import sparkloop from 'sparkloop';

const NewsletterSignupForm = () => {
    const [email, setEmail] = useState('');
    const [showUpscribe, setShowUpscribe] = useState(false);
    const toast = useToast();

    useEffect(() => {
        try {
            // Initialize SparkLoop with options
            console.log("CARGANDO SPARKLOOP")
            const opts = { scan_forms: false }; // Prevent SparkLoop from scanning forms automatically
            sparkloop('team_88199bebd026', opts); // Replace with your actual SparkLoop team ID
        } catch (error) {
            console.error('Error initializing SparkLoop:', error);
        }
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Ensure the sparkloop instance has been initialized before tracking
            if (window.SL && typeof window.SL.trackSubscriber === 'function') {
                window.SL.trackSubscriber(email); // Track the subscriber manually
            } else {
                throw new Error('SparkLoop not initialized or trackSubscriber not available');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to track subscriber with SparkLoop: ' + ((error as Error).message as string),
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }


        const res = await fetch('/api/subscribe-newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const { error } = await res.json();

        if (error) {
            toast({
                title: 'Error',
                description: error,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Success',
                description: 'You have been subscribed!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setEmail('');
            setShowUpscribe(true);
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
