'use client';

import {
    Box,
    Button,
    Container,
    Heading,
    VStack,
    Text,
    SimpleGrid,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import FAQ from "../../components/FAQ";
import SenjaMarquee from '../../components/SenjaMarquee';

const PricingCard = ({ title, price, period, features, priceId, onSubscribe, isPopular }: {
    title: string;
    price: string;
    period: string;
    features: string[];
    priceId: string;
    onSubscribe: (priceId: string) => void;
    isPopular?: boolean;
}) => (
    <Box
        borderWidth="2px"
        borderRadius="xl"
        p={6}
        bg={isPopular ? 'teal.700' : 'gray.700'}
        textAlign="center"
        position="relative"
        transform={isPopular ? 'scale(1.05)' : 'none'}
        transition="transform 0.2s"
        _hover={{ transform: 'translateY(-8px)' }}
        boxShadow={isPopular ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)'}

    >
        {isPopular && (
            <Box
                position="absolute"
                top="-4"
                right="-4"
                bg="yellow.400"
                color="gray.800"
                fontSize="sm"
                fontWeight="bold"
                px={3}
                py={1}
                borderRadius="full"
            >
                MOST POPULAR
            </Box>
        )}
        <Heading size="lg" mb={4} color={isPopular ? 'white' : 'teal.200'}>{title}</Heading>
        <Text fontSize="4xl" fontWeight="bold" mb={2}>
            {price}
        </Text>
        <Text mb={6} color={isPopular ? 'teal.100' : 'gray.400'}>{period}</Text>
        <VStack spacing={4} mb={8} align="start">
            {features.map((feature, index) => (
                <Text key={index} display="flex" alignItems="center" fontSize="md">
                    {feature}
                </Text>
            ))}
        </VStack>
        <Button
            colorScheme={isPopular ? 'yellow' : 'teal'}
            width="full"
            size="lg"
            onClick={() => onSubscribe(priceId)}
            _hover={{
                transform: 'scale(1.05)',
            }}
        >
            Get Started Now
        </Button>
    </Box>
);

const SignupPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSubscribe = async (priceId: string, isLifetime = false) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/create-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId,
                    mode: isLifetime ? 'payment' : 'subscription',
                    referral: (window as any).promotekit_referral || null
                }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);
            if (data.url) window.location.href = data.url;
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Something went wrong',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="container.xl" py={16}>
            <VStack spacing={10}>
                <Box textAlign="center" mb={8}>
                    <Heading size="2xl" mb={4}>Find Sports Analytics Jobs That Others Never See</Heading>
                    <Text fontSize="xl" color="gray.400" mb={4}>
                        Stop missing out on hidden opportunities in sports data, analytics, and tech roles
                    </Text>

                </Box>

                <Box
                    p={4}
                    bg="gray.700"
                    borderRadius="xl"
                    textAlign="center"
                    width="full"
                    mb={8}
                >
                    <Text fontSize="lg" color="green.300" fontWeight="bold">
                        🎯 Over 90% of customers chose to renew their subscriptions after the initial sign-up
                    </Text>
                </Box>

                <Box
                    p={6}
                    bg="purple.800"
                    borderRadius="xl"
                    textAlign="center"
                    width="full"
                    mb={8}
                    borderWidth="2px"
                    borderColor="purple.500"
                >
                    <Text fontSize="xl" color="white" fontWeight="bold" mb={3}>
                        🎁 Exclusive Member Benefits
                    </Text>
                    <Text fontSize="lg" color="purple.200" mb={2}>
                        Get access to exclusive discount codes on premium courses and tools
                    </Text>
                    <Text fontSize="md" color="purple.300">
                        💸 <Text as="span" color="yellow.300" fontWeight="bold">Your first discount typically pays for your entire subscription</Text> 💸
                    </Text>
                    <Text fontSize="sm" color="purple.400" mt={2}>
                        Save 10-30% on courses from TailoredU, Udemy, and other premium learning platforms
                    </Text>
                </Box>


                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} width="full">
                    <PricingCard
                        title="Monthly Plan"
                        price="$6.99"
                        period="per month"
                        features={[
                            '🤸‍♂️ Flexible for short time job hunting',
                            '💼 Unlimited access to all job posts',
                            '🎯 Advanced filtering tools',
                            '🔔 Personalized daily job alerts',
                            '📱 Mobile-friendly job search',
                            '🎁 Exclusive discount codes on courses & tools',
                            '💸 Save more than your subscription cost',
                            '↪️ Cancel anytime',
                        ]}
                        priceId={process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!}
                        onSubscribe={(priceId) => handleSubscribe(priceId)}
                    />
                    <PricingCard
                        title="Annual Plan"
                        price="$39"
                        period="per year"
                        features={[
                            '🏆 Save 50% compared to monthly',
                            '💼 Unlimited access to all job posts',
                            '🎯 Advanced filtering tools',
                            '🔔 Personalized daily job alerts',
                            '📱 Mobile-friendly job search',
                            '💰 Most popular choice',
                            '🎁 Exclusive discount codes on courses & tools',
                            '💸 Save more than your subscription cost',
                            '↪️ Cancel anytime',
                        ]}
                        priceId={process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!}
                        onSubscribe={(priceId) => handleSubscribe(priceId)}
                        isPopular={true}
                    />
                    <PricingCard
                        title="Lifetime Access"
                        price="$59"
                        period="one-time payment"
                        features={[
                            '🌟 One-time payment, lifetime access',
                            '💰 Best value for long-term career growth',
                            '💼 Unlimited access to all job posts',
                            '🎯 Advanced filtering tools',
                            '🔔 Personalized daily job alerts',
                            '📱 Mobile-friendly job search',
                            '🎁 Exclusive discount codes on courses & tools',
                            '💸 Save more than your subscription cost',
                        ]}
                        priceId={process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID!}
                        onSubscribe={(priceId) => handleSubscribe(priceId, true)}
                    />
                </SimpleGrid>


                <SenjaMarquee />
                <VStack spacing={4} px={{ base: 4, md: 20 }}>
                    <Text fontSize="lg" color="gray.400">
                        <Text as="span" color="teal.300" fontWeight="bold">Annual Plan</Text> - Our most popular choice! Perfect for both active job seekers and professionals
                        who want to stay aware of opportunities. Enjoy flexibility and continuous access throughout the year.
                    </Text>
                    <Text fontSize="lg" color="gray.400">
                        <Text as="span" color="teal.300" fontWeight="bold">Lifetime Access</Text> - A one-time investment that pays off. Get all the benefits of the annual plan
                        without recurring payments. Ideal for career-focused professionals who want long-term access.
                    </Text>
                </VStack>
                <FAQ />
            </VStack>
        </Container>
    );
};

export default SignupPage;