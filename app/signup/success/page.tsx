'use client';

import React, { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import Script from 'next/script';
import {
    Container,
    VStack,
    Heading,
    Text,
    Button,
    useToast,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { validatePasswordStrength } from '../../../lib/validatePasswordStrength';

const SuccessPageContent = () => {
    const searchParams = useSearchParams();
    const toast = useToast();
    const { user } = useUser();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [passwordError, setPasswordError] = useState('');

    const sessionId = searchParams?.get('session_id');

    useEffect(() => {
        if (user) {
            window.location.href = '/dashboard';
        }
    }, [user]);

    useEffect(() => {
        // Track Google Ads conversion when page loads
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'conversion', {
                'send_to': 'AW-11429228767/LGYfCOL6tp8ZEN_h8Mkq'
            });
        }
    }, []);

    const handlePasswordSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Validate password strength first
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
                body: JSON.stringify({ ...formData, sessionId }),
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
                <Heading>Payment Successful!</Heading>
                <Text>Create your account to access the platform</Text>

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
                                        setPasswordError('');  // Clear error on change
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
                        <Button type="submit" colorScheme="blue" width="full" isLoading={isProcessing}>
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