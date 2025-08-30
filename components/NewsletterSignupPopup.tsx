// components/SignupPopup.tsx (updated)

import React, { useEffect, useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text, Flex, Icon } from '@chakra-ui/react';
import { useUser } from '@auth0/nextjs-auth0/client'; //
import { FaStar, FaArrowRight } from 'react-icons/fa';

const SignupPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const toast = useToast();
    const { user, isLoading: userLoading } = useUser(); // Adjust according to your auth implementation

    useEffect(() => {
        if (!user) {
            const lastShown = localStorage.getItem('signupPopupShown');
            const currentTime = new Date().getTime();

            if (!lastShown || currentTime - parseInt(lastShown) > 24 * 60 * 60 * 1000) { // 24 hours
                const timer = setTimeout(() => {
                    setIsOpen(true);
                }, 5000); // 5 seconds

                return () => clearTimeout(timer);
            }
        }
    }, [user]);

    const handleClose = () => {
        setIsOpen(false);
        const currentTime = new Date().getTime();
        localStorage.setItem('signupPopupShown', currentTime.toString());
    };

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
            // Record signup in database
            try {
                await fetch('/api/add-newsletter-signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        source: 'website-modal'
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
                    'event_label': 'newsletter_popup'
                });
            }

            toast({
                title: 'Success',
                description: 'You have been subscribed!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setEmail('');
            handleClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size='xl'>
            <ModalOverlay />
            <ModalContent bg='purple.700'>
                <ModalHeader>Get Exclusive Job Alerts and Industry News Weekly!🚀</ModalHeader>
                <ModalCloseButton />
                <ModalBody >
                    <Flex alignItems="center" mb={4}>
                        {/* Star Icons */}
                        <Icon as={FaStar} color="yellow.400" mr={1} />
                        <Icon as={FaStar} color="yellow.400" mr={1} />
                        <Icon as={FaStar} color="yellow.400" mr={1} />
                        <Icon as={FaStar} color="yellow.400" mr={1} />
                        <Icon as={FaStar} color="yellow.400" />
                        <Box ml={2} fontSize="sm" color="gray.200">
                            Trusted by 1000+ professionals
                        </Box>
                    </Flex>
                    <Box as="form" onSubmit={handleSubmit}>
                        <FormControl>
                            <FormLabel htmlFor="email">
                                Join hundreds of professionals who trust us getting summaries and content weekly. No spam, ever.

                                <Text as="strong" mt={2} display="block">
                                    Gift 2025: Join now and receive a promo code
                                </Text>
                            </FormLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                width='auto'
                            />
                        </FormControl>
                        <Button mt={4} bg="#D4A017" color="black"
                            _hover={{ bg: '#B8860B' }}
                            _active={{ bg: '#A67C00' }} type="submit">
                            Join Now
                        </Button>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={handleClose} colorScheme='black'>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default SignupPopup;
