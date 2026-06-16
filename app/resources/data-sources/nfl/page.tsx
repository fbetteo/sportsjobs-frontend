'use client';


import {
    Alert,
    AlertIcon,
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    Container,
    Divider,
    Grid,
    HStack,
    Heading,
    Link,
    Text,
    VStack
} from '@chakra-ui/react';
import {
    FaArrowLeft,
    FaCode,
    FaDatabase,
    FaDollarSign,
    FaExternalLinkAlt,
    FaFootballBall,
    FaGift
} from 'react-icons/fa';
import { BRAND_PRIMARY_COLOR_SCHEME, BRAND_PRIMARY_LIGHT, BRAND_PRIMARY_SURFACE, BRAND_SECONDARY_COLOR_SCHEME, BRAND_SECONDARY_LIGHT, BRAND_SECONDARY_SURFACE } from '@/lib/uiTokens';
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
            case 'API': return BRAND_PRIMARY_COLOR_SCHEME;
            case 'Dataset': return BRAND_SECONDARY_COLOR_SCHEME;
            case 'Scraping': return BRAND_PRIMARY_COLOR_SCHEME;
            case 'Database': return BRAND_SECONDARY_COLOR_SCHEME;
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
            case 'Free': return BRAND_SECONDARY_COLOR_SCHEME;
            case 'Freemium': return BRAND_PRIMARY_COLOR_SCHEME;
            case 'Paid': return BRAND_PRIMARY_COLOR_SCHEME;
        }
    };

    const getDifficultyColor = () => {
        switch (difficulty) {
            case 'Beginner': return BRAND_SECONDARY_COLOR_SCHEME;
            case 'Intermediate': return BRAND_PRIMARY_COLOR_SCHEME;
            case 'Advanced': return BRAND_PRIMARY_COLOR_SCHEME;
        }
    };

    return (
        <Card bg="gray.800" borderColor="gray.600" _hover={{ borderColor: BRAND_SECONDARY_LIGHT }}>
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
                                <Badge key={index} colorScheme={BRAND_PRIMARY_COLOR_SCHEME} variant="outline" fontSize="xs">
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
                        colorScheme={BRAND_SECONDARY_COLOR_SCHEME}
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

export default function NFLDataSourcesPage() {
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
                        colorScheme={BRAND_SECONDARY_COLOR_SCHEME}
                        mb={4}
                        _hover={{ textDecoration: 'none' }}
                    >
                        Back to Data Sources
                    </Button>
                    <HStack spacing={3} mb={4}>
                        <Box color={BRAND_SECONDARY_LIGHT}>
                            <FaFootballBall size="32px" />
                        </Box>
                        <Heading size="2xl" color="white">
                            NFL Data Sources
                        </Heading>
                    </HStack>
                    <Text fontSize="lg" color="gray.300" maxW="3xl">
                        Comprehensive collection of NFL data sources including player tracking, game statistics,
                        draft data, and advanced analytics. Perfect for building models, creating visualizations,
                        or conducting research on America&apos;s most popular sport.
                    </Text>
                </Box>

                <Divider borderColor="gray.600" />

                {/* Alert for Authentication */}
                {/* {!isAuthenticated && (
                    <Alert status="info" bg={BRAND_SECONDARY_SURFACE} borderColor={BRAND_SECONDARY_LIGHT} borderWidth="1px">
                        <AlertIcon color={BRAND_SECONDARY_LIGHT} />
                        <Text color="gray.300">
                            🔐 Some premium data sources and API keys are available exclusively to SportsJobs members.
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
                            title="NFL Open Data"
                            description="Free NFL statistics and game data provided directly by the league. Includes basic player stats, team records, and historical game results. Great starting point for NFL analytics."
                            url="https://github.com/nflverse/nfldata"
                            type="Dataset"
                            pricing="Free"
                            difficulty="Beginner"
                            dataTypes={["Player Stats", "Team Records", "Game Results", "Season Data"]}
                            features={[
                                "Historical data back to 1999",
                                "CSV and JSON formats available",
                                "Regular season and playoff data",
                                "No rate limits or API keys required"
                            ]}
                            isAuthenticated={isAuthenticated}
                        />

                        <DataSourceCard
                            title="ESPN NFL API"
                            description="Comprehensive NFL data API with real-time scores, player statistics, team information, and more. Includes current season data and historical archives with good documentation."
                            url="https://gist.github.com/nntrn/ee26cb2a0716de0947a0a4e9a157bc1c?utm_source=SportsJobsOnline&utm_medium=jobboard&utm_campaign=resources"
                            type="API"
                            pricing="Free"
                            difficulty="Intermediate"
                            dataTypes={["Live Scores", "Player Stats", "Team Info", "Schedule"]}
                            features={[
                                "Real-time game data",
                                "JSON REST API",
                                "No authentication required",
                                "Comprehensive team and player info"
                            ]}
                            isAuthenticated={isAuthenticated}
                        />
                    </Grid>
                </Box>

                {/* Coming Soon Section */}
                <Box w="full" bg="gray.900" p={6} borderRadius="lg" borderWidth="1px" borderColor="gray.600">
                    <Heading size="lg" mb={4} color="white">🚀 Coming Soon to NFL Data</Heading>
                    <Text color="gray.300" mb={4}>
                        We&apos;re working on adding these premium NFL data sources:
                    </Text>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <VStack align="start" spacing={2}>
                            <Text color="gray.400" fontSize="sm">• NFL Next Gen Stats API</Text>
                            <Text color="gray.400" fontSize="sm">• Pro Football Reference Scraper</Text>
                            <Text color="gray.400" fontSize="sm">• Fantasy Football Data APIs</Text>
                            <Text color="gray.400" fontSize="sm">• Betting Odds and Lines</Text>
                        </VStack>
                        <VStack align="start" spacing={2}>
                            <Text color="gray.400" fontSize="sm">• NFL Combine Data</Text>
                            <Text color="gray.400" fontSize="sm">• Injury Reports and Status</Text>
                            <Text color="gray.400" fontSize="sm">• Advanced Tracking Data</Text>
                            <Text color="gray.400" fontSize="sm">• Coaching and Staff Info</Text>
                        </VStack>
                    </Grid>
                </Box>

                {/* Data Categories */}
                <Box w="full">
                    <Heading size="lg" mb={6} color="white">📊 NFL Data Categories</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                        <Box bg={BRAND_SECONDARY_SURFACE} p={4} borderRadius="lg" borderWidth="1px" borderColor={BRAND_SECONDARY_LIGHT}>
                            <Heading size="md" mb={3} color="white">Game Data</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="gray.300" fontSize="sm">• Live scores and results</Text>
                                <Text color="gray.300" fontSize="sm">• Play-by-play data</Text>
                                <Text color="gray.300" fontSize="sm">• Team and player stats</Text>
                                <Text color="gray.300" fontSize="sm">• Historical archives</Text>
                            </VStack>
                        </Box>

                        <Box bg={BRAND_PRIMARY_SURFACE} p={4} borderRadius="lg" borderWidth="1px" borderColor={BRAND_PRIMARY_LIGHT}>
                            <Heading size="md" mb={3} color="white">Player Data</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="gray.300" fontSize="sm">• Career statistics</Text>
                                <Text color="gray.300" fontSize="sm">• Draft and combine data</Text>
                                <Text color="gray.300" fontSize="sm">• Contract information</Text>
                                <Text color="gray.300" fontSize="sm">• Injury history</Text>
                            </VStack>
                        </Box>

                        <Box bg={BRAND_SECONDARY_SURFACE} p={4} borderRadius="lg" borderWidth="1px" borderColor={BRAND_SECONDARY_LIGHT}>
                            <Heading size="md" mb={3} color="white">Advanced Analytics</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="gray.300" fontSize="sm">• Next Gen Stats tracking</Text>
                                <Text color="gray.300" fontSize="sm">• Expected points models</Text>
                                <Text color="gray.300" fontSize="sm">• Win probability data</Text>
                                <Text color="gray.300" fontSize="sm">• Efficiency metrics</Text>
                            </VStack>
                        </Box>
                    </Grid>
                </Box>

                {/* Call to Action */}
                {/* {!isAuthenticated && (
                    <Box
                        w="full"
                        bg={BRAND_PRIMARY_SURFACE}
                        p={6}
                        borderRadius="lg"
                        textAlign="center"
                        borderWidth="1px"
                        borderColor={BRAND_PRIMARY_LIGHT}
                    >
                        <Heading size="lg" mb={3} color="white">
                            🏈 Get More NFL Data Resources
                        </Heading>
                        <Text color="gray.300" mb={4}>
                            Join SportsJobs to access premium NFL data sources, API guides, and exclusive analytics resources.
                        </Text>
                        <Button
                            as={Link}
                            href="/signup"
                            colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
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
