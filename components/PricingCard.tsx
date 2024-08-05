// components/PricingCard.tsx
'use client';
import React from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

interface PricingCardProps {
    planName: string;
    price: string;
    features: string[];
}

const PricingCard: React.FC<PricingCardProps> = ({ planName, price, features }) => {
    const router = useRouter();

    const handleSelectPlan = () => {
        router.push(`/signup?plan=${planName}`);
    };

    return (
        <Box borderWidth="1px" borderRadius="lg" p={4} textAlign="center">
            <VStack spacing={4}>
                <Text fontSize="2xl" fontWeight="bold">{planName}</Text>
                <Text fontSize="xl">{price}</Text>
                <VStack spacing={2}>
                    {features.map((feature, index) => (
                        <Text key={index}>{feature}</Text>
                    ))}
                </VStack>
                <Button colorScheme="teal" onClick={handleSelectPlan}>Select Plan</Button>
            </VStack>
        </Box>
    );
};

export default PricingCard;
