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

const PricingCard = ({ title, price, period, features, priceId, onSubscribe }: {
    title: string;
    price: string;
    period: string;
    features: string[];
    priceId: string;
    onSubscribe: (priceId: string) => void;
}) => (
    <Box
        borderWidth="1px"
        borderRadius="lg"
        p={6}
        bg="gray.700"
        textAlign="center"
    >
        <Heading size="md" mb={4}>{title}</Heading>
        <Text fontSize="3xl" fontWeight="bold" mb={2}>
            {price}
        </Text>
        <Text mb={6} color="gray.400">{period}</Text>
        <VStack spacing={3} mb={6} align="start">
            {features.map((feature, index) => (
                <Text key={index}>✓ {feature}</Text>
            ))}
        </VStack>
        <Button
            colorScheme="teal"
            width="full"
            onClick={() => onSubscribe(priceId)}
        >
            Subscribe Now
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
                    mode: isLifetime ? 'payment' : 'subscription'
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

    const faqItems = [
        {
            question: "What's included in the subscription?",
            answer: "Access to all job listings, premium features, and direct application capabilities."
        },
        {
            question: "Can I cancel my subscription?",
            answer: "Yes, you can cancel anytime. Your benefits continue until the end of your billing period."
        },
        // Add more FAQ items as needed
    ];

    return (
        <Container maxW="container.xl" py={10}>
            <VStack spacing={10}>
                <Heading textAlign="center">Choose Your Plan</Heading>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} width="full">
                    <PricingCard
                        title="Monthly Plan"
                        price="$4.99"
                        period="per month"
                        features={[
                            "Access to all job listings",
                            "Premium features",
                            "Direct applications",
                            "Monthly billing"
                        ]}
                        priceId={process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID_DEBUG!}
                        onSubscribe={(priceId) => handleSubscribe(priceId)}
                    />
                    <PricingCard
                        title="Annual Plan"
                        price="$29.99"
                        period="per year"
                        features={[
                            "Everything in Monthly",
                            "Save 50%",
                            "Priority support",
                            "Annual billing"
                        ]}
                        priceId={process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID_DEBUG!}
                        onSubscribe={(priceId) => handleSubscribe(priceId)}
                    />
                    <PricingCard
                        title="Lifetime Access"
                        price="$99.99"
                        period="one-time payment"
                        features={[
                            "Unlimited access forever",
                            "All premium features",
                            "Priority support",
                            "No recurring payments"
                        ]}
                        priceId={process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID_DEBUG!}
                        onSubscribe={(priceId) => handleSubscribe(priceId, true)}
                    />
                </SimpleGrid>

                <Box width="full" mt={10}>
                    <Heading size="lg" mb={6}>Frequently Asked Questions</Heading>
                    <Accordion allowToggle>
                        {faqItems.map((item, index) => (
                            <AccordionItem key={index}>
                                <h2>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                            {item.question}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    {item.answer}
                                </AccordionPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </Box>
            </VStack>
        </Container>
    );
};

export default SignupPage;