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
    FaBasketballBall,
    FaCode,
    FaDatabase,
    FaDollarSign,
    FaExternalLinkAlt,
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
                        colorScheme={BRAND_SECONDARY_COLOR_SCHEME}
                        mb={4}
                        _hover={{ textDecoration: 'none' }}
                    >
                        Back to Data Sources
                    </Button>
                    <HStack spacing={3} mb={4}>
                        <Box color={BRAND_SECONDARY_LIGHT}>
                            <FaBasketballBall size="32px" />
                        </Box>
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
                    <Alert status="info" bg={BRAND_SECONDARY_SURFACE} borderColor={BRAND_SECONDARY_LIGHT} borderWidth="1px">
                        <AlertIcon color={BRAND_SECONDARY_LIGHT} />
                        <Text color="gray.300">
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
                            url="https://stats.nba.com/?utm_source=sportsjobs.online&utm_medium=website&utm_campaign=resources"
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
                            url="https://basketball-reference.com/?utm_source=sportsjobs.online&utm_medium=website&utm_campaign=resources"
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
                        <Box bg={BRAND_PRIMARY_SURFACE} p={4} borderRadius="lg" borderWidth="1px" borderColor={BRAND_PRIMARY_LIGHT}>
                            <Heading size="md" mb={3} color="white">Player Analytics</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="gray.300" fontSize="sm">• Traditional statistics</Text>
                                <Text color="gray.300" fontSize="sm">• Advanced metrics (PER, BPM)</Text>
                                <Text color="gray.300" fontSize="sm">• Shot chart data</Text>
                                <Text color="gray.300" fontSize="sm">• Hustle statistics</Text>
                            </VStack>
                        </Box>

                        <Box bg={BRAND_SECONDARY_SURFACE} p={4} borderRadius="lg" borderWidth="1px" borderColor={BRAND_SECONDARY_LIGHT}>
                            <Heading size="md" mb={3} color="white">Team Performance</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="gray.300" fontSize="sm">• Team efficiency ratings</Text>
                                <Text color="gray.300" fontSize="sm">• Offensive and defensive stats</Text>
                                <Text color="gray.300" fontSize="sm">• Pace and possession data</Text>
                                <Text color="gray.300" fontSize="sm">• Clutch performance metrics</Text>
                            </VStack>
                        </Box>

                        <Box bg={BRAND_PRIMARY_SURFACE} p={4} borderRadius="lg" borderWidth="1px" borderColor={BRAND_PRIMARY_LIGHT}>
                            <Heading size="md" mb={3} color="white">Game Data</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="gray.300" fontSize="sm">• Play-by-play data</Text>
                                <Text color="gray.300" fontSize="sm">• Live scores and updates</Text>
                                <Text color="gray.300" fontSize="sm">• Historical game logs</Text>
                                <Text color="gray.300" fontSize="sm">• Referee and venue info</Text>
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
                            🏀 Get More Basketball Data Resources
                        </Heading>
                        <Text color="gray.300" mb={4}>
                            Join SportsJobs to access premium basketball data sources, API guides, and exclusive analytics resources.
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
