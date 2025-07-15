'use client';

import {
    Box,
    Container,
    Heading,
    Text,
    Grid,
    VStack,
    HStack,
    Badge,
    Link,
    Card,
    CardBody,
    Button,
    Divider,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaArrowLeft, FaGolfBall, FaDollarSign, FaGift, FaCode, FaDatabase } from 'react-icons/fa';
import { useUser } from '@auth0/nextjs-auth0/client';

const DataSourceCard = ({
    title,
    description,
    url,
    type,
    pricing,
    features,
    difficulty,
    dataTypes,
    isAuthenticated
}: {
    title: string;
    description: string;
    url: string;
    type: 'API' | 'Dataset' | 'Scraping' | 'Database';
    pricing: 'Free' | 'Freemium' | 'Paid';
    features: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    dataTypes: string[];
    isAuthenticated?: boolean;
}) => {
    const getTypeIcon = () => {
        switch (type) {
            case 'API': return <FaCode />;
            case 'Dataset': return <FaDatabase />;
            case 'Scraping': return <FaCode />;
            case 'Database': return <FaDatabase />;
        }
    };

    const getTypeColor = () => {
        switch (type) {
            case 'API': return 'blue';
            case 'Dataset': return 'green';
            case 'Scraping': return 'orange';
            case 'Database': return 'purple';
        }
    };

    const getPricingIcon = () => {
        switch (pricing) {
            case 'Free': return <FaGift />;
            case 'Freemium': return <FaDollarSign />;
            case 'Paid': return <FaDollarSign />;
        }
    };

    const getPricingColor = () => {
        switch (pricing) {
            case 'Free': return 'green';
            case 'Freemium': return 'orange';
            case 'Paid': return 'red';
        }
    };

    const getDifficultyColor = () => {
        switch (difficulty) {
            case 'Beginner': return 'green';
            case 'Intermediate': return 'orange';
            case 'Advanced': return 'red';
        }
    };

    return (
        <Card bg="gray.800" borderColor="gray.600" _hover={{ borderColor: 'teal.400' }}>
            <CardBody>
                <VStack align="start" spacing={4}>
                    <VStack align="start" spacing={2} w="full">
                        <Heading size="md" color="white">{title}</Heading>
                    </VStack>

                    <Text color="gray.300" fontSize="sm">{description}</Text>

                    <VStack align="start" spacing={2} w="full">
                        <Text fontSize="xs" color="gray.400" fontWeight="semibold">Data Types:</Text>
                        <HStack wrap="wrap">
                            {/* {dataTypes.map((dataType, index) => (
                                <Badge key={index} colorScheme="purple" variant="outline" fontSize="xs">
                                    {dataType}
                                </Badge>
                            ))} */}
                        </HStack>
                    </VStack>

                    <VStack align="start" spacing={2} w="full">
                        <Text fontSize="xs" color="gray.400" fontWeight="semibold">Key Features:</Text>
                        <VStack align="start" spacing={1}>
                            {features.map((feature, index) => (
                                <Text key={index} color="gray.300" fontSize="xs">
                                    • {feature}
                                </Text>
                            ))}
                        </VStack>
                    </VStack>

                    <Button
                        as={Link}
                        href={url}
                        isExternal
                        size="sm"
                        colorScheme="teal"
                        rightIcon={<FaExternalLinkAlt />}
                        _hover={{ textDecoration: 'none' }}
                        w="full"
                    >
                        Access Data Source
                    </Button>
                </VStack>
            </CardBody>
        </Card>
    );
};

export default function GolfDataSourcesPage() {
    const { user } = useUser();
    const isAuthenticated = !!user;

    return (
        <Container maxW="7xl" py={8}>
            <VStack spacing={8} align="start">
                {/* Header */}
                <Box w="full">
                    <Button
                        as={Link}
                        href="/resources/data-sources"
                        leftIcon={<FaArrowLeft />}
                        variant="ghost"
                        colorScheme="teal"
                        mb={4}
                        _hover={{ textDecoration: 'none' }}
                    >
                        Back to Data Sources
                    </Button>
                    <HStack spacing={3} mb={4}>
                        <FaGolfBall color="#2DD4BF" size="32px" />
                        <Heading size="2xl" color="white">
                            Golf Data Sources
                        </Heading>
                    </HStack>
                    <Text fontSize="lg" color="gray.300" maxW="3xl">
                        Professional golf data covering PGA Tour, European Tour, and major championships.
                        Access player statistics, tournament results, course data, and performance analytics
                        for the world&apos;s premier golf competitions.
                    </Text>
                </Box>

                <Divider borderColor="gray.600" />

                {/* Data Sources Grid */}
                <Box w="full">
                    <Text fontSize="md" color="gray.400" mb={6}>
                        Showing 1 data sources • More coming soon...
                    </Text>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                        <DataSourceCard
                            title="PGA Tour Golf Data (2015-2022)"
                            description="Comprehensive Kaggle dataset containing detailed PGA Tour statistics from 2015-2022. Includes player performance metrics, tournament results, course data, and historical trends perfect for golf analytics projects."
                            url="https://www.kaggle.com/datasets/robikscube/pga-tour-golf-data-20152022/data"
                            type="Dataset"
                            pricing="Free"
                            difficulty="Beginner"
                            dataTypes={["Tournament Results", "Player Stats", "Course Data", "Historical Trends"]}
                            features={[
                                "8 years of comprehensive PGA Tour data",
                                "Player performance and rankings",
                                "Tournament scoring and results",
                                "Ready-to-use CSV format"
                            ]}
                            isAuthenticated={isAuthenticated}
                        />

                    </Grid>
                </Box>

                {/* Coming Soon Section */}
                <Box w="full" bg="gray.900" p={6} borderRadius="lg" borderWidth="1px" borderColor="gray.600">
                    <Heading size="lg" mb={4} color="white">⛳ Coming Soon to Golf Data</Heading>
                    <Text color="gray.300" mb={4}>
                        We&apos;re working on adding these golf data sources:
                    </Text>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <VStack align="start" spacing={2}>
                            <Text color="gray.400" fontSize="sm">• European Tour Data</Text>
                            <Text color="gray.400" fontSize="sm">• LPGA Tour Statistics</Text>
                            <Text color="gray.400" fontSize="sm">• Real-time Scoring APIs</Text>
                            <Text color="gray.400" fontSize="sm">• Course Architecture Data</Text>
                        </VStack>
                        <VStack align="start" spacing={2}>
                            <Text color="gray.400" fontSize="sm">• Weather Impact Analysis</Text>
                            <Text color="gray.400" fontSize="sm">• Amateur Golf Statistics</Text>
                            <Text color="gray.400" fontSize="sm">• Historical Major Championships</Text>
                            <Text color="gray.400" fontSize="sm">• Golf Equipment Performance</Text>
                        </VStack>
                    </Grid>
                </Box>

                {/* Tour Coverage */}
                <Box w="full">
                    <Heading size="lg" mb={6} color="white">🏌️ Tour Coverage</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                        <Box bg="green.900" p={4} borderRadius="lg" borderWidth="1px" borderColor="green.600">
                            <Heading size="md" mb={3} color="green.100">PGA Tour</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="green.200" fontSize="sm">• Regular Season Events</Text>
                                <Text color="green.200" fontSize="sm">• FedEx Cup Playoffs</Text>
                                <Text color="green.200" fontSize="sm">• The Players Championship</Text>
                                <Text color="green.200" fontSize="sm">• WGC Events</Text>
                                <Text color="green.200" fontSize="sm">• Tour Championships</Text>
                            </VStack>
                        </Box>

                        <Box bg="blue.900" p={4} borderRadius="lg" borderWidth="1px" borderColor="blue.600">
                            <Heading size="md" mb={3} color="blue.100">Major Championships</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="blue.200" fontSize="sm">• The Masters Tournament</Text>
                                <Text color="blue.200" fontSize="sm">• PGA Championship</Text>
                                <Text color="blue.200" fontSize="sm">• U.S. Open</Text>
                                <Text color="blue.200" fontSize="sm">• The Open Championship</Text>
                                <Text color="blue.200" fontSize="sm">• Women&apos;s Majors</Text>
                            </VStack>
                        </Box>

                        <Box bg="purple.900" p={4} borderRadius="lg" borderWidth="1px" borderColor="purple.600">
                            <Heading size="md" mb={3} color="purple.100">International Tours</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="purple.200" fontSize="sm">• European Tour (DP World Tour)</Text>
                                <Text color="purple.200" fontSize="sm">• LPGA Tour</Text>
                                <Text color="purple.200" fontSize="sm">• Asian Tour</Text>
                                <Text color="purple.200" fontSize="sm">• Korn Ferry Tour</Text>
                                <Text color="purple.200" fontSize="sm">• LIV Golf</Text>
                            </VStack>
                        </Box>
                    </Grid>
                </Box>
            </VStack>
        </Container>
    );
}
