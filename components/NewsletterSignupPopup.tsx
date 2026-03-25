// components/SignupPopup.tsx (updated)

import React, { useEffect, useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text, Flex, Icon } from '@chakra-ui/react';
import { useUser } from '@auth0/nextjs-auth0/client'; //
import { FaStar } from 'react-icons/fa';

const SUBSTACK_SUBSCRIBE_URL = 'https://sportsjobs.substack.com/subscribe';

const SignupPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const toast = useToast();
    const { user } = useUser();

    useEffect(() => {
        if (!user) {
            const lastShown = localStorage.getItem('signupPopupShown');
            const currentTime = new Date().getTime();

            if (!lastShown || currentTime - parseInt(lastShown) > 24 * 60 * 60 * 1000) { // 24 hours
                const timer = setTimeout(() => {
                    setIsOpen(true);
                }, 10000); // 10 seconds

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

                // Also track as standard Google Analytics lead event
                window.gtag('event', 'generate_lead', {
                    'event_category': 'engagement',
                    'event_label': 'newsletter_popup',
                    'currency': 'USD',
                    'value': 0
                });
            }

            const normalizedEmail = encodeURIComponent(email.trim().toLowerCase());
            const substackUrl = `${SUBSTACK_SUBSCRIBE_URL}?utm_source=sportsjobs.online&utm_medium=website&utm_campaign=newsletter_popup&email=${normalizedEmail}`;
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
            handleClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to start your subscription. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size='xl'>
            <ModalOverlay />
            <ModalContent bg='purple.700'>
                <ModalHeader>Get Free Weekly Job Alerts and Industry News!🚀</ModalHeader>
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
                                Join thousands of professionals getting our free weekly summaries and job updates. No payment required.

                                <Text mt={2} fontSize="xs" color="gray.300">
                                    Substack may show optional support. You can skip it and keep the subscription free.
                                </Text>

                                <Text as="strong" mt={2} display="block">
                                    Gift 2026: Join now and receive a promo code
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
