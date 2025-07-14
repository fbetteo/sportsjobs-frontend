'use client';
import { Button, Icon } from "@chakra-ui/react";
import { FiMessageSquare } from "react-icons/fi";

interface FeedbackButtonProps {
    variant?: 'solid' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    colorScheme?: string;
    position?: 'fixed' | 'relative';
}

export default function FeedbackButton({
    variant = 'outline',
    size = 'md',
    colorScheme = 'purple',
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
            bg: 'purple.500',
            color: 'white',
            _hover: {
                bg: 'purple.600',
                transform: 'scale(1.05)',
                boxShadow: '2xl'
            },
            _active: {
                bg: 'purple.700',
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
