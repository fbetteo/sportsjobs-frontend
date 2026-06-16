'use client';

import { Button, Icon } from '@chakra-ui/react';
import { BRAND_PRIMARY, BRAND_PRIMARY_COLOR_SCHEME, BRAND_PRIMARY_SURFACE_HOVER } from '@/lib/uiTokens';
import { FiMessageSquare } from 'react-icons/fi';
interface FeedbackButtonProps {
    variant?: 'solid' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    colorScheme?: string;
    position?: 'fixed' | 'relative';
}

export default function FeedbackButton({
    variant = 'outline',
    size = 'md',
    colorScheme = BRAND_PRIMARY_COLOR_SCHEME,
    position = 'relative'
}: FeedbackButtonProps) {
    const handleFeedbackClick = () => {
        window.open('https://sportsjobsonline.featurebase.app/', '_blank', 'noopener,noreferrer');
    };

    const buttonProps = position === 'fixed'
        ? {
            position: 'fixed' as const,
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            boxShadow: 'xl',
            bg: BRAND_PRIMARY,
            color: 'white',
            _hover: {
                bg: BRAND_PRIMARY,
                transform: 'scale(1.05)',
                boxShadow: '2xl'
            },
            _active: {
                bg: BRAND_PRIMARY_SURFACE_HOVER,
                transform: 'scale(0.95)'
            },
            borderRadius: 'full',
            px: 4,
            py: 3,
            fontSize: 'sm',
            fontWeight: 'bold'
        }
        : {};

    return (
        <Button
            onClick={handleFeedbackClick}
            variant={variant}
            size={size}
            colorScheme={colorScheme}
            leftIcon={<Icon as={FiMessageSquare} />}
            {...buttonProps}
        >
            Feedback
        </Button>
    );
}
