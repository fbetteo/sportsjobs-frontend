import React, { useState } from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Text,
    useToast
} from '@chakra-ui/react';
import {
    BRAND_FOREGROUND,
    BRAND_PRIMARY,
    BRAND_PRIMARY_LIGHT,
    BRAND_SECONDARY
} from '@/lib/uiTokens';

const SUBSTACK_SUBSCRIBE_URL = 'https://sportsjobs.substack.com/subscribe';

interface NewsletterSignupFormProps {
    variant?: 'default' | 'hero';
}

const NewsletterSignupForm = ({ variant = 'default' }: NewsletterSignupFormProps) => {
    const [email, setEmail] = useState('');
    const [showUpscribe, setShowUpscribe] = useState(false);
    const toast = useToast();
    const isHero = variant === 'hero';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            try {
                await fetch('/api/add-newsletter-signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        source: 'website-form'
                    }),
                });
            } catch (dbError) {
                console.error('Database recording error:', dbError);
            }

            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'conversion', {
                    'send_to': 'AW-11429228767/nJWICJPcwI0bEN_h8Mkq'
                });

                window.gtag('event', 'generate_lead', {
                    'event_category': 'engagement',
                    'event_label': 'newsletter_form',
                    'currency': 'USD',
                    'value': 0
                });
            }

            const normalizedEmail = encodeURIComponent(email.trim().toLowerCase());
            const substackUrl = `${SUBSTACK_SUBSCRIBE_URL}?utm_source=sportsjobs.online&utm_medium=website&utm_campaign=newsletter_form&email=${normalizedEmail}`;
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
            setShowUpscribe(true);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to subscribe. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box
            p={isHero ? 0 : 4}
            boxShadow={isHero ? 'none' : 'md'}
            borderRadius={isHero ? 'full' : 'md'}
            mb={isHero ? 0 : 4}
            w={isHero ? { base: '100%', md: '520px' } : 'auto'}
            maxW="100%"
        >
            {!showUpscribe ? (
                <Box as="form" onSubmit={handleSubmit}>
                    {!isHero && (
                        <>
                            <Text mb={2} fontSize="sm" color="gray.300">
                                Get the free weekly newsletter with jobs and sports analytics news.
                            </Text>
                            <Text mb={2} fontSize="xs" color="gray.400">
                                Substack may show optional support, but you can skip it and subscribe for free.
                            </Text>
                        </>
                    )}
                    <Flex
                        alignItems="center"
                        border={isHero ? '2px solid' : undefined}
                        borderColor={isHero ? BRAND_SECONDARY : undefined}
                        borderRadius={isHero ? 'full' : undefined}
                        overflow={isHero ? 'hidden' : undefined}
                        h={isHero ? { base: '46px', md: '50px' } : 'auto'}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email" srOnly>Email</FormLabel>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                mr={0}
                                border={isHero ? '0' : undefined}
                                borderRightRadius="0"
                                borderLeftRadius={isHero ? 'full' : undefined}
                                bg={isHero ? 'transparent' : undefined}
                                color={isHero ? BRAND_FOREGROUND : undefined}
                                _placeholder={isHero ? { color: 'whiteAlpha.600' } : undefined}
                                _focusVisible={isHero ? { boxShadow: 'none' } : undefined}
                            />
                        </FormControl>
                        <Button
                            bg={isHero ? BRAND_SECONDARY : BRAND_PRIMARY}
                            color={BRAND_FOREGROUND}
                            _hover={{ bg: isHero ? BRAND_PRIMARY : BRAND_PRIMARY_LIGHT }}
                            _active={{ bg: BRAND_PRIMARY }}
                            type="submit"
                            borderLeftRadius="0"
                            borderRightRadius={isHero ? 'full' : 'md'}
                            h="100%"
                            minW={isHero ? { base: '118px', md: '130px' } : undefined}
                            fontWeight="bold"
                            fontFamily={isHero ? 'heading' : undefined}
                            textTransform={isHero ? 'uppercase' : undefined}
                        >
                            Join
                        </Button>
                    </Flex>
                </Box>
            ) : (
                <Box>
                    <Text mb={2} fontSize="lg" color="gray.300">
                        Thank you for subscribing!
                    </Text>
                </Box>
            )}
        </Box>
    );
};

export default NewsletterSignupForm;
