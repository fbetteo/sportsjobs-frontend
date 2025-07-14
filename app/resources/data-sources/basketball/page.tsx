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
import { FaExternalLinkAlt, FaArrowLeft, FaBasketballBall, FaDollarSign, FaGift, FaCode, FaDatabase } from 'react-icons/fa';
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
                        {/* <HStack wrap="wrap" spacing={2}>
                            <Badge colorScheme={getTypeColor()} variant="subtle">
                                {getTypeIcon()}
                                <Text ml={1}>{type}</Text>
                            </Badge>
                            <Badge colorScheme={getPricingColor()} variant="solid">
                                {getPricingIcon()}
                                <Text ml={1}>{pricing}</Text>
                            </Badge>
                            <Badge colorScheme={getDifficultyColor()} variant="outline">
                                {difficulty}
                            </Badge>
                        </HStack> */}
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

export default function BasketballDataSourcesPage() {
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
                        <FaBasketballBall color="#2DD4BF" size="32px" />
                        <Heading size="2xl" color="white">
                            Basketball Data Sources
                        </Heading>
                    </HStack>
                    <Text fontSize="lg" color="gray.300" maxW="3xl">
                        Comprehensive NBA and basketball data sources including player statistics, shot charts,
                        team performance metrics, and advanced analytics. Perfect for basketball research,
                        fantasy sports, and building predictive models.
                    </Text>
                </Box>

                <Divider borderColor="gray.600" />

                {/* Alert for Authentication */}
                {/* {!isAuthenticated && (
                    <Alert status="info" bg="blue.900" borderColor="blue.600" borderWidth="1px">
                        <AlertIcon color="blue.300" />
                        <Text color="blue.100">
                            🔐 Some premium basketball data sources and API access guides are available exclusively to SportsJobs members.
                            Sign up to unlock additional resources!
                        </Text>
                    </Alert>
                )} */}

                {/* Data Sources Grid */}
                <Box w="full">
                    <Text fontSize="md" color="gray.400" mb={6}>
                        Showing 2 data sources • More coming soon...
                    </Text>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                        <DataSourceCard
                            title="NBA Stats API"
                            description="Official NBA statistics API providing comprehensive player and team data, game logs, shot charts, and advanced metrics. The most reliable source for NBA analytics."
                            url="https://stats.nba.com/"
                            type="API"
                            pricing="Free"
                            difficulty="Intermediate"
                            dataTypes={["Player Stats", "Team Data", "Shot Charts", "Game Logs"]}
                            features={[
                                "Official NBA data source",
                                "Real-time and historical data",
                                "Advanced metrics included",
                                "JSON endpoints available"
                            ]}
                            isAuthenticated={isAuthenticated}
                        />

                        <DataSourceCard
                            title="Basketball Reference"
                            description="Comprehensive basketball statistics database with historical data, advanced metrics, and detailed player/team information. Excellent for research and analysis."
                            url="https://basketball-reference.com/"
                            type="Dataset"
                            pricing="Free"
                            difficulty="Beginner"
                            dataTypes={["Historical Stats", "Player Bios", "Team Records", "Season Data"]}
                            features={[
                                "Historical data back to 1946",
                                "Advanced statistics and metrics",
                                "College and professional data",
                                "Playoff and regular season stats"
                            ]}
                            isAuthenticated={isAuthenticated}
                        />
                    </Grid>
                </Box>

                {/* Coming Soon Section */}
                <Box w="full" bg="gray.900" p={6} borderRadius="lg" borderWidth="1px" borderColor="gray.600">
                    <Heading size="lg" mb={4} color="white">🏀 Coming Soon to Basketball Data</Heading>
                    <Text color="gray.300" mb={4}>
                        We&apos;re working on adding these basketball data sources:
                    </Text>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <VStack align="start" spacing={2}>
                            <Text color="gray.400" fontSize="sm">• WNBA Statistics and Data</Text>
                            <Text color="gray.400" fontSize="sm">• College Basketball APIs</Text>
                            <Text color="gray.400" fontSize="sm">• International League Data</Text>
                            <Text color="gray.400" fontSize="sm">• Player Tracking Data</Text>
                        </VStack>
                        <VStack align="start" spacing={2}>
                            <Text color="gray.400" fontSize="sm">• Draft and Combine Data</Text>
                            <Text color="gray.400" fontSize="sm">• Injury Reports and Status</Text>
                            <Text color="gray.400" fontSize="sm">• Salary and Contract Info</Text>
                            <Text color="gray.400" fontSize="sm">• Fantasy Basketball Data</Text>
                        </VStack>
                    </Grid>
                </Box>

                {/* Data Categories */}
                <Box w="full">
                    <Heading size="lg" mb={6} color="white">🏀 Basketball Data Categories</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                        <Box bg="orange.900" p={4} borderRadius="lg" borderWidth="1px" borderColor="orange.600">
                            <Heading size="md" mb={3} color="orange.100">Player Analytics</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="orange.200" fontSize="sm">• Traditional statistics</Text>
                                <Text color="orange.200" fontSize="sm">• Advanced metrics (PER, BPM)</Text>
                                <Text color="orange.200" fontSize="sm">• Shot chart data</Text>
                                <Text color="orange.200" fontSize="sm">• Hustle statistics</Text>
                            </VStack>
                        </Box>

                        <Box bg="red.900" p={4} borderRadius="lg" borderWidth="1px" borderColor="red.600">
                            <Heading size="md" mb={3} color="red.100">Team Performance</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="red.200" fontSize="sm">• Team efficiency ratings</Text>
                                <Text color="red.200" fontSize="sm">• Offensive and defensive stats</Text>
                                <Text color="red.200" fontSize="sm">• Pace and possession data</Text>
                                <Text color="red.200" fontSize="sm">• Clutch performance metrics</Text>
                            </VStack>
                        </Box>

                        <Box bg="blue.900" p={4} borderRadius="lg" borderWidth="1px" borderColor="blue.600">
                            <Heading size="md" mb={3} color="blue.100">Game Data</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="blue.200" fontSize="sm">• Play-by-play data</Text>
                                <Text color="blue.200" fontSize="sm">• Live scores and updates</Text>
                                <Text color="blue.200" fontSize="sm">• Historical game logs</Text>
                                <Text color="blue.200" fontSize="sm">• Referee and venue info</Text>
                            </VStack>
                        </Box>
                    </Grid>
                </Box>

                {/* Call to Action */}
                {/* {!isAuthenticated && (
                    <Box
                        w="full"
                        bg="purple.900"
                        p={6}
                        borderRadius="lg"
                        textAlign="center"
                        borderWidth="1px"
                        borderColor="purple.600"
                    >
                        <Heading size="lg" mb={3} color="white">
                            🏀 Get More Basketball Data Resources
                        </Heading>
                        <Text color="gray.300" mb={4}>
                            Join SportsJobs to access premium basketball data sources, API guides, and exclusive analytics resources.
                        </Text>
                        <Button
                            as={Link}
                            href="/signup"
                            colorScheme="purple"
                            size="lg"
                            _hover={{ textDecoration: 'none' }}
                        >
                            Sign Up for Premium Access
                        </Button>
                    </Box>
                )} */}
            </VStack>
        </Container>
    );
}
