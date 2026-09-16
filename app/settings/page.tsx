'use client';


import { useEffect, useState } from 'react';
import { Box, Button, Heading, useDisclosure, useToast, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import ConfirmCancelModal, { CancellationFeedbackPayload } from '../../components/ConfirmCancelModal';
import AlertSettingsPanel from '../../components/AlertSettingsPanel';
import ResumeSettingsPanel from '../../components/ResumeSettingsPanel';
import { BRAND_PRIMARY_COLOR_SCHEME, BRAND_SECONDARY_COLOR_SCHEME } from '../../lib/uiTokens';

const SETTINGS_REAUTHENTICATION_KEY = 'sportsjobs_settings_reauthentication';
const SETTINGS_LOGIN_URL = '/api/auth/login?returnTo=/settings';

function redirectToSettingsLogin() {
    try {
        window.sessionStorage.setItem(SETTINGS_REAUTHENTICATION_KEY, 'required');
    } catch (storageError) {
        console.error('Failed to store settings reauthentication state:', storageError);
    }

    window.location.assign(SETTINGS_LOGIN_URL);
}

const SettingsPage = () => {
    const { user, error, isLoading } = useUser();
    const router = useRouter();
    const toast = useToast(); // Chakra toast hook for notifications
    const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra hook for modal control
    const [isCanceling, setIsCanceling] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            redirectToSettingsLogin();
        }
    }, [isLoading, user]);

    useEffect(() => {
        if (isLoading || !user) return;

        try {
            if (window.sessionStorage.getItem(SETTINGS_REAUTHENTICATION_KEY) !== 'required') return;

            window.sessionStorage.removeItem(SETTINGS_REAUTHENTICATION_KEY);
            toast({
                title: 'Sign-in verified',
                description: 'For your security, we needed to verify your sign-in before allowing changes to your subscription. You can now try again.',
                status: 'info',
                duration: 8000,
                isClosable: true,
            });
        } catch (storageError) {
            console.error('Failed to read settings reauthentication state:', storageError);
        }
    }, [isLoading, toast, user]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    const handleCancelSubscription = async (payload: CancellationFeedbackPayload) => {
        if (isCanceling) return;

        try {
            setIsCanceling(true);
            const response = await fetch('/api/cancel-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cancellationFeedback: payload.cancellationFeedback,
                    cancellationComment: payload.cancellationComment,
                }),
            });

            if (response.status === 401) {
                redirectToSettingsLogin();
                return;
            }

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.error || 'Failed to cancel subscription');
            }

            onClose();

            toast({
                title: 'Subscription canceled',
                description: 'Your subscription cancellation has been scheduled successfully.',
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
                duration: 15000,
                isClosable: true,
            });
        } finally {
            setIsCanceling(false);
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
        <Box p={6} maxWidth="720px" mx="auto">
            <Heading as="h2" size="lg" mb={6}>
                Manage Subscription
            </Heading>
            <VStack spacing={4} align="stretch">
                <Button colorScheme={BRAND_SECONDARY_COLOR_SCHEME} onClick={handleUpdateSubscription}>
                    Update Subscription
                </Button>
                <Button colorScheme={BRAND_PRIMARY_COLOR_SCHEME} onClick={onOpen}>
                    Cancel Subscription
                </Button>
            </VStack>

            {user && <ResumeSettingsPanel />}
            {user && <AlertSettingsPanel />}

            <ConfirmCancelModal
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={handleCancelSubscription}
                isSubmitting={isCanceling}
            />
        </Box>
    );
};

export default SettingsPage;
