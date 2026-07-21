'use client';

import React, { Suspense, useEffect, useState } from 'react';
import {
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    useToast,
    VStack
} from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { validatePasswordStrength } from '../../../lib/validatePasswordStrength';
import { SIGNUP_ACCENT_COLOR_SCHEME } from '@/lib/uiTokens';
import { trackAnalyticsEvent } from '@/lib/analyticsClient';

const STORAGE_KEY = 'sportsjobs_signup_funnel';

type StoredFunnelState = {
    signupFunnelId?: string;
    signup_funnel_id?: string;
    contact?: {
        name?: string;
        email?: string;
    };
};

function readStoredFunnelState(): StoredFunnelState {
    if (typeof window === 'undefined') return {};

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('Failed to read signup funnel state:', error);
        return {};
    }
}

const SuccessPageContent = () => {
    const searchParams = useSearchParams();
    const toast = useToast();
    const { user } = useUser();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [passwordError, setPasswordError] = useState('');
    const [signupFunnelId, setSignupFunnelId] = useState('');

    const sessionId = searchParams?.get('session_id') || '';
    const urlSignupFunnelId = searchParams?.get('signup_funnel_id') || '';

    useEffect(() => {
        if (user) {
            window.location.href = '/';
        }
    }, [user]);

    useEffect(() => {
        const storedState = readStoredFunnelState();
        const currentSignupFunnelId = urlSignupFunnelId || storedState.signupFunnelId || storedState.signup_funnel_id || '';
        setSignupFunnelId(currentSignupFunnelId);
        setFormData((current) => ({
            ...current,
            name: storedState.contact?.name || current.name,
            email: storedState.contact?.email || current.email,
        }));

        if (!sessionId) return;

        const trackVerifiedPurchase = async () => {
            const trackingKey = `sportsjobs_purchase_tracked_${sessionId}`;
            if (window.localStorage.getItem(trackingKey)) return;

            try {
                const response = await fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`, {
                    cache: 'no-store',
                });
                const checkout = await response.json().catch(() => null);

                if (!response.ok) {
                    throw new Error(checkout?.error || 'Could not verify checkout');
                }

                if (window.gtag) {
                    window.gtag('event', 'conversion', {
                        send_to: 'AW-11429228767/LGYfCOL6tp8ZEN_h8Mkq',
                        value: checkout.value,
                        currency: checkout.currency,
                        transaction_id: checkout.sessionId,
                    });
                }

                trackAnalyticsEvent('purchase', {
                    transaction_id: checkout.sessionId,
                    signup_funnel_id: checkout.signupFunnelId,
                    value: checkout.value,
                    currency: checkout.currency,
                    coupon: 'SPORTS25',
                    items: [{
                        item_id: checkout.planId,
                        item_name: checkout.planName,
                        price: checkout.value,
                        quantity: 1,
                        coupon: 'SPORTS25',
                    }],
                });
                window.localStorage.setItem(trackingKey, new Date().toISOString());
            } catch (error) {
                console.error('Failed to track verified signup purchase:', error);
            }
        };

        void trackVerifiedPurchase();
    }, [sessionId, urlSignupFunnelId]);

    const handlePasswordSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const passwordValidation = validatePasswordStrength(formData.password);
        if (passwordValidation) {
            setPasswordError(passwordValidation);
            setIsProcessing(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, sessionId, signupFunnelId }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Signup failed');

            toast({
                title: 'Account Created',
                description: 'Please log in with your credentials',
                status: 'success',
                duration: 5000,
            });

            window.location.href = '/api/auth/login';
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to create account',
                status: 'error',
                duration: 5000,
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Container maxW="container.sm" py={10}>
            <VStack spacing={6}>
                <Heading>Payment successful</Heading>
                <Text>Create your account to access the platform. You can fix your name or email before creating the account.</Text>

                <form onSubmit={handlePasswordSignup} style={{ width: '100%' }}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </FormControl>
                        <FormControl isRequired isInvalid={!!passwordError}>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={e => {
                                        setFormData({ ...formData, password: e.target.value });
                                        setPasswordError('');
                                    }}
                                />
                                <InputRightElement>
                                    <IconButton
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        onClick={() => setShowPassword(!showPassword)}
                                        variant="ghost"
                                    />
                                </InputRightElement>
                            </InputGroup>
                            {passwordError && (
                                <Text color="red.500" fontSize="sm" mt={1}>
                                    {passwordError}
                                </Text>
                            )}
                        </FormControl>
                        <Button type="submit" colorScheme={SIGNUP_ACCENT_COLOR_SCHEME} width="full" isLoading={isProcessing}>
                            Create Account
                        </Button>
                    </VStack>
                </form>
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
