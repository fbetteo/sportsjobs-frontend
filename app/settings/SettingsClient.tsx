'use client';


import { useEffect, useRef, useState } from 'react';
import { Box, Button, Heading, useDisclosure, useToast, VStack } from '@chakra-ui/react';
import ConfirmCancelModal, { CancellationFeedbackPayload } from '../../components/ConfirmCancelModal';
import AlertSettingsPanel from '../../components/AlertSettingsPanel';
import ResumeSettingsPanel from '../../components/ResumeSettingsPanel';
import { BRAND_PRIMARY_COLOR_SCHEME, BRAND_SECONDARY_COLOR_SCHEME } from '../../lib/uiTokens';

const SETTINGS_LOGIN_URL = '/api/auth/login?returnTo=%2Fsettings%3Fsignin%3Dverified';

function redirectToSettingsLogin() {
    window.location.assign(SETTINGS_LOGIN_URL);
}

const SettingsClient = ({ signInVerified }: { signInVerified: boolean }) => {
    const toast = useToast(); // Chakra toast hook for notifications
    const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra hook for modal control
    const [isCanceling, setIsCanceling] = useState(false);
    const isCancelingRef = useRef(false);

    useEffect(() => {
        if (!signInVerified) return;
        window.history.replaceState(window.history.state, '', '/settings');
        toast({
            id: 'settings-signin-verified',
            title: 'Sign-in verified',
            description: 'For your security, we needed to verify your sign-in before allowing changes to your subscription. You can now try again.',
            status: 'info',
            duration: 8000,
            isClosable: true,
        });
    }, [signInVerified, toast]);

    const handleCancelSubscription = async (payload: CancellationFeedbackPayload) => {
        if (isCancelingRef.current) return;
        isCancelingRef.current = true;

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
            isCancelingRef.current = false;
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

            <ResumeSettingsPanel />
            <AlertSettingsPanel />

            <ConfirmCancelModal
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={handleCancelSubscription}
                isSubmitting={isCanceling}
            />
        </Box>
    );
};

export default SettingsClient;
