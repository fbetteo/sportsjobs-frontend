// components/SignupPopup.tsx (updated)

import { useUser } from '@auth0/nextjs-auth0/client';
import React, { FormEvent, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Icon,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useToast
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { BRAND_PRIMARY, BRAND_PRIMARY_COLOR_SCHEME, BRAND_PRIMARY_LIGHT, BRAND_PRIMARY_SURFACE } from '@/lib/uiTokens';
import { usePathname } from 'next/navigation';
import {
    canShowNewsletterPopup,
    isJobDetailPath,
    isNewsletterPopupExcludedPath,
    markNewsletterPopupDismissed,
    markNewsletterSubscribed,
    openNewsletterSubscribeTab,
} from '@/lib/newsletterPopup';

const SUBSTACK_SUBSCRIBE_URL = 'https://sportsjobs.substack.com/subscribe';
const DEFAULT_DELAY_MS = 10000;
const JOB_PAGE_DELAY_MS = 25000;
const JOB_PAGE_MIN_SCROLL_RATIO = 0.3;

const SignupPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const toast = useToast();
    const { user, isLoading: userLoading } = useUser();
    const pathname = usePathname() ?? '';

    // Restarts per page: dwell time counts on the page the visitor is reading now.
    useEffect(() => {
        if (userLoading || user || isNewsletterPopupExcludedPath(pathname) || !canShowNewsletterPopup()) {
            return;
        }

        const onJobPage = isJobDetailPath(pathname);
        let timerDone = false;
        // Job pages are task pages (reading one posting from search), so only interrupt
        // readers who stayed a while and scrolled into the description.
        let engaged = !onJobPage;

        const maybeOpen = () => {
            if (timerDone && engaged && canShowNewsletterPopup()) {
                setIsOpen(true);
                cleanup();
            }
        };
        const handleScroll = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollable <= 0 || window.scrollY / scrollable >= JOB_PAGE_MIN_SCROLL_RATIO) {
                engaged = true;
                maybeOpen();
            }
        };
        const timer = setTimeout(() => {
            timerDone = true;
            maybeOpen();
        }, onJobPage ? JOB_PAGE_DELAY_MS : DEFAULT_DELAY_MS);
        const cleanup = () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };

        if (onJobPage) {
            window.addEventListener('scroll', handleScroll, { passive: true });
        }
        return cleanup;
    }, [pathname, user, userLoading]);

    const handleClose = () => {
        setIsOpen(false);
        markNewsletterPopupDismissed();
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
            markNewsletterSubscribed();
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
                ? openNewsletterSubscribeTab(substackUrl)
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
            <ModalContent bg={BRAND_PRIMARY_SURFACE}>
                <ModalHeader>Get Free Weekly Job Alerts and Industry News!🚀</ModalHeader>
                <ModalCloseButton />
                <ModalBody >
                    <Flex alignItems="center" mb={4}>
                        {/* Star Icons */}
                        <Icon as={FaStar} color={BRAND_PRIMARY_LIGHT} mr={1} />
                        <Icon as={FaStar} color={BRAND_PRIMARY_LIGHT} mr={1} />
                        <Icon as={FaStar} color={BRAND_PRIMARY_LIGHT} mr={1} />
                        <Icon as={FaStar} color={BRAND_PRIMARY_LIGHT} mr={1} />
                        <Icon as={FaStar} color={BRAND_PRIMARY_LIGHT} />
                        <Box ml={2} fontSize="sm" color="gray.200">
                            Trusted by 2500+ professionals
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
                        <Button mt={4} colorScheme={BRAND_PRIMARY_COLOR_SCHEME} bg={BRAND_PRIMARY} type="submit">
                            Join Now
                        </Button>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={handleClose} color="white">Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default SignupPopup;
