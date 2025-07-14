// components/PricingCard.tsx
'use client';

import { Box, Flex, Text, Button, Stack, Icon, List, ListItem, ListIcon } from '@chakra-ui/react';
import { FaBasketballBall, FaCalendarDay, FaFilter, FaBell, FaCheckCircle } from 'react-icons/fa';
import { pricingPlans } from '../pricingPlans';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';


const MixedPricingCard = () => {
    const router = useRouter();
    const { user } = useUser();

    // Don't render pricing card if user is logged in
    if (user) {
        return null;
    }

    const handleSelectPlan = (planName: string) => {
        router.push(`/signup?plan=${planName}`);
    };

    return (
        <Box p={6} maxW="container.xl" mx="auto" width="100%">
            <Flex justify="center" mb={4}>
                <ChevronDownIcon w={80} h={80} color="purple.400" />
            </Flex>
            <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold" textAlign="center" mb={4} color="white">
                Hundreds of jobs are waiting for you!
            </Text>
            <Text fontSize={{ base: "lg", md: "2xl" }} textAlign="center" mb={10} color="gray.300">
                Subscribe to membership and unlock all jobs
            </Text>

            {/* Features Grid */}
            <Box
                mb={12}
                bg="gray.800"
                borderRadius="2xl"
                p={8}
                borderWidth="1px"
                borderColor="gray.700"
            >
                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-around"
                    align="center"
                    gap={8}
                >
                    <Stack spacing={3} align="center" flex="1">
                        <Icon as={FaBasketballBall} w={12} h={12} color="purple.400" />
                        <Text fontWeight="bold" fontSize="lg" color="white">Sports Analytics</Text>
                        <Text textAlign="center" color="gray.300" fontSize="sm">
                            We scan all major sports and leagues
                        </Text>
                    </Stack>
                    <Stack spacing={3} align="center" flex="1">
                        <Icon as={FaCalendarDay} w={12} h={12} color="purple.400" />
                        <Text fontWeight="bold" fontSize="lg" color="white">Updated Daily</Text>
                        <Text textAlign="center" color="gray.300" fontSize="sm">
                            New jobs are added every day as companies post them
                        </Text>
                    </Stack>
                    <Stack spacing={3} align="center" flex="1">
                        <Icon as={FaFilter} w={12} h={12} color="purple.400" />
                        <Text fontWeight="bold" fontSize="lg" color="white">Refined Search</Text>
                        <Text textAlign="center" color="gray.300" fontSize="sm">
                            Use filters like skill, location, etc to narrow results
                        </Text>
                    </Stack>
                    <Stack spacing={3} align="center" flex="1">
                        <Icon as={FaBell} w={12} h={12} color="purple.400" />
                        <Text fontWeight="bold" fontSize="lg" color="white">Alerts</Text>
                        <Text textAlign="center" color="gray.300" fontSize="sm">
                            You can get daily alerts in your email for a specific search
                        </Text>
                    </Stack>
                </Flex>
            </Box>

            {/* Key Benefits */}
            <Box mb={8}>
                <List spacing={4} mb={8}>
                    <ListItem display="flex" alignItems="center">
                        <ListIcon as={FaCheckCircle} color="green.400" fontSize="xl" />
                        <Text color="gray.200" fontSize="lg">
                            Access to job postings from top teams and companies
                        </Text>
                    </ListItem>
                    <ListItem display="flex" alignItems="center">
                        <ListIcon as={FaCheckCircle} color="green.400" fontSize="xl" />
                        <Text color="gray.200" fontSize="lg">
                            Daily updates and notifications based on your preferences
                        </Text>
                    </ListItem>
                </List>
            </Box>

            {/* Social Proof */}
            <Box
                p={6}
                bg="gradient(to-r, green.700, green.600)"
                borderRadius="xl"
                textAlign="center"
                mb={12}
                borderWidth="1px"
                borderColor="green.500"
            >
                <Text fontSize="xl" color="white" fontWeight="bold">
                    🎯 Over 90% of customers chose to renew their subscriptions after the initial sign-up
                </Text>
            </Box>

            {/* Price increase banner */}
            {/* <Box
                p={4}
                bg="red.700"
                borderRadius="xl"
                textAlign="center"
                mb={8}
                borderWidth="2px"
                borderColor="red.500"
                animation="pulse 2s infinite"
                sx={{
                    "@keyframes pulse": {
                        "0%": { opacity: 0.8 },
                        "50%": { opacity: 1 },
                        "100%": { opacity: 0.8 }
                    }
                }}
            >
                <Text fontSize="xl" color="white" fontWeight="bold">
                    ⚠️ LIMITED TIME OFFER: Prices will increase in June 9th week!
                </Text>
                <Text fontSize="md" color="white" mt={1}>
                    Lock in our current rates before the upcoming price change.
                </Text>
                <Text fontSize="md" color="white" mt={1}>
                    We are working  hard to bring you more opportunities, more help getting jobs and more features in general.
                </Text>
            </Box> */}

            <Flex
                direction={{ base: "column", lg: "row" }}
                justify="center"
                align="stretch"
                gap={6}
                maxW="1200px"
                mx="auto"
            >
                {pricingPlans.map((plan, index) => (
                    <Box
                        key={index}
                        flex={{ base: "none", lg: "1" }}
                        w={{ base: "100%", lg: "calc(33.333% - 16px)" }}
                        minW={{ base: "100%", lg: "350px" }}
                        maxW={{ base: "100%", lg: "350px" }}
                        p={8}
                        borderWidth="2px"
                        borderRadius="xl"
                        textAlign="center"
                        boxShadow="xl"
                        bg="gray.700"
                        transition="all 0.3s"
                        position="relative"
                        display="flex"
                        flexDirection="column"
                        _hover={{
                            transform: "translateY(-4px)",
                            boxShadow: "2xl",
                            borderColor: "purple.400"
                        }}
                        borderColor={plan.planName === "Yearly" ? "purple.400" : "gray.600"}
                    >
                        {plan.planName === "Yearly" && (
                            <Text
                                position="absolute"
                                top="-12px"
                                left="50%"
                                transform="translateX(-50%)"
                                bg="purple.500"
                                color="white"
                                px={6}
                                py={2}
                                borderRadius="full"
                                fontSize="sm"
                                fontWeight="bold"
                                boxShadow="lg"
                            >
                                Most Popular
                            </Text>
                        )}

                        {/* Header Section */}
                        <Box mb={6}>
                            <Text fontSize="2xl" fontWeight="bold" mb={3} color="white">
                                {plan.planName}
                            </Text>
                            <Text fontSize="3xl" fontWeight="bold" mb={2} color="purple.300">
                                {plan.price}
                            </Text>
                            <Text fontSize="md" color="gray.300" minH="20px">
                                {plan.planName === "Yearly" ? "Only $3.25/month billed annually" :
                                    plan.planName === "Monthly" ? "Billed Monthly" :
                                        plan.planName === "Lifetime" ? "One-time payment" : ""}
                            </Text>
                        </Box>

                        {/* Features Section */}
                        <Box flex="1" mb={6}>
                            <Stack spacing={4} align="stretch">
                                {plan.features.map((feature, idx) => (
                                    <Flex key={idx} align="flex-start" textAlign="left">
                                        <Text
                                            fontSize="sm"
                                            color="gray.100"
                                            lineHeight="1.5"
                                            w="100%"
                                        >
                                            {feature}
                                        </Text>
                                    </Flex>
                                ))}
                            </Stack>
                        </Box>

                        {/* Button Section */}
                        <Button
                            colorScheme="purple"
                            size="lg"
                            w="full"
                            py={6}
                            fontSize="lg"
                            fontWeight="bold"
                            onClick={() => handleSelectPlan(plan.airtablePlanName)}
                            _hover={{
                                transform: "scale(1.02)",
                                bg: "purple.500"
                            }}
                            transition="all 0.2s"
                            boxShadow="lg"
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
