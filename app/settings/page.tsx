'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Button, Heading, VStack, useToast, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ConfirmCancelModal from '../../components/ConfirmCancelModal';

const SettingsPage = () => {
    const { user, error, isLoading } = useUser();
    const router = useRouter();
    const toast = useToast(); // Chakra toast hook for notifications
    const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra hook for modal control

    useEffect(() => {
        if (!isLoading && !user) {
            // Redirect to the main page if the user is not logged in
            router.push('/');
        }
    }, [isLoading, user, router]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    const handleCancelSubscription = async () => {
        try {
            const response = await fetch('/api/cancel-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user?.email }),
            });

            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }

            toast({
                title: 'Subscription Canceled',
                description: 'Your subscription has been canceled successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Wait a bit for the user to see the toast, then log out
            setTimeout(() => {
                router.push('/api/auth/logout');
            }, 3000);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred. Please contact support';
            toast({
                title: 'Error',
                description: message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleUpdateSubscription = async () => {
        toast({
            title: 'Feature Coming Soon',
            description: 'Update subscription functionality is under development.',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Box p={6} maxWidth="400px" mx="auto">
            <Heading as="h2" size="lg" mb={6}>
                Manage Subscription
            </Heading>
            <VStack spacing={4} align="stretch">
                <Button colorScheme="blue" onClick={handleUpdateSubscription}>
                    Update Subscription
                </Button>
                <Button colorScheme="red" onClick={onOpen}>
                    Cancel Subscription
                </Button>
            </VStack>

            <ConfirmCancelModal
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={handleCancelSubscription}
            />
        </Box>
    );
};

export default SettingsPage;
