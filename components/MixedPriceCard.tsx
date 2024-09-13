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
        <Box p={4} mx="auto">
            <Flex justify="center" mb={2}>
                <ChevronDownIcon w={100} h={100} color="gray.500" />
            </Flex>
            <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={6}>
                Hundreds of jobs are waiting for you!
            </Text>
            <Text fontSize="2xl" textAlign="center" mb={8}>
                Subscribe to membership and unlock all jobs
            </Text>
            <Flex justify="space-around" mb={8}>
                <Stack mr={3} spacing={3} align="center">
                    <Icon as={FaBasketballBall} w={10} h={10} />
                    <Text fontWeight="bold">Sports Analytics</Text>
                    <Text>We scan all major sports and leagues</Text>
                </Stack>
                <Stack mr={3} spacing={3} align="center">
                    <Icon as={FaCalendarDay} w={10} h={10} />
                    <Text fontWeight="bold">Updated Daily</Text>
                    <Text>New jobs are added every day as companies post them</Text>
                </Stack>
                <Stack mr={3} spacing={3} align="center">
                    <Icon as={FaFilter} w={10} h={10} />
                    <Text fontWeight="bold">Refined Search</Text>
                    <Text>Use filters like skill, location, etc to narrow results</Text>
                </Stack>
                <Stack spacing={3} align="center">
                    <Icon as={FaBell} w={10} h={10} />
                    <Text fontWeight="bold">Alerts</Text>
                    <Text>You can get daily alerts in your email for a specific search</Text>
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
            <Flex justify="space-around">
                {pricingPlans.map((plan, index) => (
                    <Box
                        key={index}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        textAlign="center"
                        w="45%"
                        boxShadow="md"
                        bg='gray.700'
                    >
                        <Text fontSize="2xl" fontWeight="bold" mb={4}>
                            {plan.planName}
                        </Text>
                        <Text fontSize="xl" mb={4}>
                            {plan.price}
                        </Text>
                        {/* <Stack spacing={2} mb={4}>
                            {plan.features.map((feature, idx) => (
                                <Text key={idx}>{feature}</Text>
                            ))}
                        </Stack> */}
                        <Button colorScheme="purple" onClick={() => handleSelectPlan(plan.airtablePlanName)}>Choose Plan</Button>
                    </Box>
                ))}
            </Flex>
        </Box>
    );
};

export default MixedPricingCard;
