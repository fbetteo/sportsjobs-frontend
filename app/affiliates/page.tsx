'use client';

import {
    Box,
    Button,
    Container,
    Heading,
    Text,
    VStack,
    SimpleGrid,
    Icon,
    List,
    ListItem,
    ListIcon,
    useColorModeValue,
    Link,
} from '@chakra-ui/react';
import { FaMoneyBillWave, FaHandshake, FaLink, FaChartLine, FaShareAlt, FaUserCheck, FaMoneyCheckAlt } from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';

const AffiliatePage = () => {
    const AFFILIATE_URL = "https://sportsjobs.promotekit.com"; // Replace with your actual URL

    const bgGradient = "linear(to-r, purple.600, teal.600)";
    const cardBg = useColorModeValue('gray.800', 'gray.700');

    return (
        <Container maxW="container.xl" py={16}>
            {/* Hero Section */}
            <VStack spacing={8} textAlign="center" mb={16}>
                <Heading
                    size="2xl"
                    bgGradient={bgGradient}
                    bgClip="text"
                >
                    Earn Money Promoting Sports Jobs
                </Heading>
                <Text fontSize="xl" maxW="2xl" color="gray.300">
                    Join our affiliate program and earn 30% commission for every subscription, without limits.
                </Text>
                <Button
                    as="a"
                    href={AFFILIATE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                    colorScheme="purple"
                    leftIcon={<FaMoneyBillWave />}
                    px={8}
                    py={6}
                    fontSize="lg"
                    _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'xl',
                    }}
                >
                    Start Earning Now
                </Button>
            </VStack>

            {/* How It Works Section */}
            <VStack spacing={12} mb={16}>
                <Heading size="xl" textAlign="center">How It Works</Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
                    <VStack
                        p={6}
                        bg={cardBg}
                        borderRadius="lg"
                        boxShadow="xl"
                        spacing={4}
                        align="center"
                    >
                        <Icon as={FaShareAlt} w={10} h={10} color="purple.400" />
                        <Heading size="md" textAlign="center">Share your link</Heading>
                        <Text textAlign="center">
                            Become an affiliate and share your personalized link.
                        </Text>
                    </VStack>

                    <VStack
                        p={6}
                        bg={cardBg}
                        borderRadius="lg"
                        boxShadow="xl"
                        spacing={4}
                        align="center"
                    >
                        <Icon as={FaUserCheck} w={10} h={10} color="purple.400" />
                        <Heading size="md" textAlign="center">Somebody signs up</Heading>
                        <Text textAlign="center">
                            Someone clicks your link and buys a subscription. They&apos;re tracked to you, and you get 30% for life.
                        </Text>
                    </VStack>

                    <VStack
                        p={6}
                        bg={cardBg}
                        borderRadius="lg"
                        boxShadow="xl"
                        spacing={4}
                        align="center"
                    >
                        <Icon as={FaMoneyCheckAlt} w={10} h={10} color="purple.400" />
                        <Heading size="md" textAlign="center">Earn $$$</Heading>
                        <Text textAlign="center">
                            Check in any time to see how many customers you've referred, and redeem your payments with one click.
                        </Text>
                    </VStack>
                </SimpleGrid>
            </VStack>

            {/* Benefits Section */}
            <VStack spacing={8} mb={16} align="stretch">
                <Heading size="xl" textAlign="center" mb={8}>Why Become Our Affiliate?</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="xl">
                        <VStack align="start" spacing={4}>
                            <Icon as={FaHandshake} w={10} h={10} color="purple.400" />
                            <Heading size="md">Easy to Join</Heading>
                            <List spacing={3}>
                                <ListItem>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Simple registration process
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Quick approval
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Get access to your affiliate dashboard and check your payouts.
                                </ListItem>
                            </List>
                        </VStack>
                    </Box>
                    <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="xl">
                        <VStack align="start" spacing={4}>
                            <Icon as={FaChartLine} w={10} h={10} color="teal.400" />
                            <Heading size="md">High Earning Potential</Heading>
                            <List spacing={3}>
                                <ListItem>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Competitive 30% commission rate
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Regular payouts
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdCheckCircle} color="green.500" />
                                    Recurring commissions on subscriptions
                                </ListItem>
                            </List>
                        </VStack>
                    </Box>
                </SimpleGrid>
            </VStack>

            {/* Call to Action */}
            <Box textAlign="center" p={8} bg={cardBg} borderRadius="xl" boxShadow="2xl">
                <VStack spacing={6}>
                    <Heading size="lg">Ready to Start Earning?</Heading>
                    <Text fontSize="lg" maxW="2xl">
                        Join our affiliate program today and start earning commissions by promoting sports industry opportunities to your audience.
                    </Text>
                    <Button
                        as="a"
                        href={AFFILIATE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="lg"
                        colorScheme="purple"
                        leftIcon={<FaLink />}
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'xl',
                        }}
                    >
                        Join Our Affiliate Program
                    </Button>
                </VStack>
            </Box>
        </Container>
    );
};

export default AffiliatePage;
