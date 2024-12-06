// components/PricingCard.tsx
'use client';

import { Box, Flex, Text, Button, Stack, Icon, List, ListItem, ListIcon } from '@chakra-ui/react';
import { FaBasketballBall, FaCalendarDay, FaFilter, FaBell, FaCheckCircle } from 'react-icons/fa';
import { pricingPlans } from '../pricingPlans';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';


const MixedPricingCard = () => {
    const router = useRouter();

    const handleSelectPlan = (planName: string) => {
        router.push(`/signup?plan=${planName}`);
    };

    return (
        <Box p={4} maxW="container.lg" mx="auto" width="100%">
            <Flex justify="center" mb={2}>
                <ChevronDownIcon w={100} h={100} color="gray.500" />
            </Flex>
            <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={6}>
                Hundreds of jobs are waiting for you!
            </Text>
            <Text fontSize="2xl" textAlign="center" mb={8}>
                Subscribe to membership and unlock all jobs
            </Text>
            <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-around"
                mb={8}
                align="center"
                gap={6}
            >
                <Stack mb={{ base: 4, md: 0 }} spacing={3} align="center">
                    <Icon as={FaBasketballBall} w={10} h={10} />
                    <Text fontWeight="bold">Sports Analytics</Text>
                    <Text textAlign="center">We scan all major sports and leagues</Text>
                </Stack>
                <Stack mb={{ base: 4, md: 0 }} spacing={3} align="center">
                    <Icon as={FaCalendarDay} w={10} h={10} />
                    <Text fontWeight="bold">Updated Daily</Text>
                    <Text textAlign="center">New jobs are added every day as companies post them</Text>
                </Stack>
                <Stack mb={{ base: 4, md: 0 }} spacing={3} align="center">
                    <Icon as={FaFilter} w={10} h={10} />
                    <Text fontWeight="bold">Refined Search</Text>
                    <Text textAlign="center">Use filters like skill, location, etc to narrow results</Text>
                </Stack>
                <Stack mb={{ base: 4, md: 0 }} spacing={3} align="center">
                    <Icon as={FaBell} w={10} h={10} />
                    <Text fontWeight="bold">Alerts</Text>
                    <Text textAlign="center">You can get daily alerts in your email for a specific search</Text>
                </Stack>
            </Flex>
            <List spacing={3} mb={8}>
                <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    Access to job postings from top teams and companies
                </ListItem>
                <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    Daily updates and notifications based on your preferences
                </ListItem>
            </List>
            <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-around"
                gap={4}
            >
                {pricingPlans.map((plan, index) => (
                    <Box
                        key={index}
                        p={6}
                        borderWidth="2px"
                        borderRadius="xl"
                        textAlign="center"
                        w={{ base: "100%", md: "45%" }}
                        boxShadow="lg"
                        bg='gray.700'
                        transition="all 0.3s"
                        position="relative"
                        _hover={{
                            transform: "translateY(-8px)",
                            boxShadow: "xl",
                        }}
                        borderColor={plan.planName === "Yearly" ? "purple.400" : "transparent"}
                    >
                        {plan.planName === "Yearly" && (
                            <Text
                                position="absolute"
                                top="-4"
                                left="50%"
                                transform="translateX(-50%)"
                                bg="purple.500"
                                color="white"
                                px={4}
                                py={1}
                                borderRadius="full"
                                fontSize="sm"
                                fontWeight="bold"
                            >
                                Most Popular
                            </Text>
                        )}
                        <Text fontSize="3xl" fontWeight="bold" mb={2}>
                            {plan.planName}
                        </Text>
                        <Text fontSize="4xl" fontWeight="bold" mb={2}>
                            {plan.price}
                        </Text>
                        <Text fontSize="sm" color="gray.300" mb={6}>
                            {plan.planName === "Yearly" ? "Only $2.5/month billed annually" :
                                plan.planName === "Monthly" ? "Billed Monthly" : ""}
                        </Text>
                        <Stack spacing={3} mb={6}>
                            {plan.features.map((feature, idx) => (
                                <Flex key={idx} align="center" justify="center">
                                    <Text>{feature}</Text>
                                </Flex>
                            ))}
                        </Stack>
                        <Button
                            colorScheme="purple"
                            size="lg"
                            w="full"
                            onClick={() => handleSelectPlan(plan.airtablePlanName)}
                            _hover={{
                                transform: "scale(1.05)",
                            }}
                            transition="all 0.2s"
                        >
                            Get Started Now
                        </Button>
                    </Box>
                ))}
            </Flex>
        </Box>
    );
};

export default MixedPricingCard;
