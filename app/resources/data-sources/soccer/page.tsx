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
    FaFutbol,
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

export default function SoccerDataSourcesPage() {
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
                            <FaFutbol size="32px" />
                        </Box>
                        <Heading size="2xl" color="white">
                            Soccer Data Sources
                        </Heading>
                    </HStack>
                    <Text fontSize="lg" color="gray.300" maxW="3xl">
                        Global soccer data covering major leagues worldwide including Premier League, La Liga,
                        Serie A, Bundesliga, MLS, and more. Access match data, player statistics, transfer information,
                        and tactical analysis for the world&apos;s most popular sport.
                    </Text>
                </Box>

                <Divider borderColor="gray.600" />

                {/* Alert for Authentication */}
                {/* {!isAuthenticated && (
                    <Alert status="info" bg={BRAND_SECONDARY_SURFACE} borderColor={BRAND_SECONDARY_LIGHT} borderWidth="1px">
                        <AlertIcon color={BRAND_SECONDARY_LIGHT} />
                        <Text color="gray.300">
                            🔐 Some premium soccer data sources and API access guides are available exclusively to SportsJobs members.
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
                            title="Football-Data.org API"
                            description="Free tier API providing match fixtures, results, and league tables for major European leagues. Great starting point for soccer analytics with clean, well-documented endpoints."
                            url="https://www.football-data.org/"
                            type="API"
                            pricing="Freemium"
                            difficulty="Beginner"
                            dataTypes={["Match Results", "League Tables", "Team Info", "Fixtures"]}
                            features={[
                                "10 requests per minute (free tier)",
                                "Major European leagues covered",
                                "JSON REST API",
                                "Historical and current season data"
                            ]}
                            isAuthenticated={isAuthenticated}
                        />

                        <DataSourceCard
                            title="FBref Soccer Statistics"
                            description="Comprehensive soccer statistics database with advanced metrics, player performance data, and detailed match information. Excellent for deep soccer analytics research."
                            url="https://fbref.com/"
                            type="Dataset"
                            pricing="Free"
                            difficulty="Intermediate"
                            dataTypes={["Player Stats", "Advanced Metrics", "Match Data", "Team Performance"]}
                            features={[
                                "Advanced statistics and metrics",
                                "Historical data going back decades",
                                "Expected goals (xG) and other modern metrics",
                                "Scraping-friendly structure"
                            ]}
                            isAuthenticated={isAuthenticated}
                        />
                    </Grid>
                </Box>

                {/* Coming Soon Section */}
                <Box w="full" bg="gray.900" p={6} borderRadius="lg" borderWidth="1px" borderColor="gray.600">
                    <Heading size="lg" mb={4} color="white">⚽ Coming Soon to Soccer Data</Heading>
                    <Text color="gray.300" mb={4}>
                        We&apos;re working on adding these soccer data sources:
                    </Text>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <VStack align="start" spacing={2}>
                            <Text color="gray.400" fontSize="sm">• FIFA World Cup Data</Text>
                            <Text color="gray.400" fontSize="sm">• Transfer Market APIs</Text>
                            <Text color="gray.400" fontSize="sm">• Live Match Data Streams</Text>
                            <Text color="gray.400" fontSize="sm">• Player Valuation Data</Text>
                        </VStack>
                        <VStack align="start" spacing={2}>
                            <Text color="gray.400" fontSize="sm">• Tactical Analysis Data</Text>
                            <Text color="gray.400" fontSize="sm">• Youth Development Tracking</Text>
                            <Text color="gray.400" fontSize="sm">• International Competition Data</Text>
                            <Text color="gray.400" fontSize="sm">• Betting Odds and Markets</Text>
                        </VStack>
                    </Grid>
                </Box>

                {/* League Coverage */}
                <Box w="full">
                    <Heading size="lg" mb={6} color="white">🏆 League Coverage</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                        <Box bg={BRAND_SECONDARY_SURFACE} p={4} borderRadius="lg" borderWidth="1px" borderColor={BRAND_SECONDARY_LIGHT}>
                            <Heading size="md" mb={3} color="white">European Leagues</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="gray.300" fontSize="sm">• Premier League (England)</Text>
                                <Text color="gray.300" fontSize="sm">• La Liga (Spain)</Text>
                                <Text color="gray.300" fontSize="sm">• Serie A (Italy)</Text>
                                <Text color="gray.300" fontSize="sm">• Bundesliga (Germany)</Text>
                                <Text color="gray.300" fontSize="sm">• Ligue 1 (France)</Text>
                            </VStack>
                        </Box>

                        <Box bg={BRAND_PRIMARY_SURFACE} p={4} borderRadius="lg" borderWidth="1px" borderColor={BRAND_PRIMARY_LIGHT}>
                            <Heading size="md" mb={3} color="white">International</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="gray.300" fontSize="sm">• FIFA World Cup</Text>
                                <Text color="gray.300" fontSize="sm">• UEFA European Championship</Text>
                                <Text color="gray.300" fontSize="sm">• Copa América</Text>
                                <Text color="gray.300" fontSize="sm">• Champions League</Text>
                                <Text color="gray.300" fontSize="sm">• Europa League</Text>
                            </VStack>
                        </Box>

                        <Box bg={BRAND_SECONDARY_SURFACE} p={4} borderRadius="lg" borderWidth="1px" borderColor={BRAND_SECONDARY_LIGHT}>
                            <Heading size="md" mb={3} color="white">Other Regions</Heading>
                            <VStack align="start" spacing={1}>
                                <Text color="gray.300" fontSize="sm">• MLS (United States)</Text>
                                <Text color="gray.300" fontSize="sm">• Brazilian Série A</Text>
                                <Text color="gray.300" fontSize="sm">• J1 League (Japan)</Text>
                                <Text color="gray.300" fontSize="sm">• A-League (Australia)</Text>
                                <Text color="gray.300" fontSize="sm">• Liga MX (Mexico)</Text>
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
                            ⚽ Get More Soccer Data Resources
                        </Heading>
                        <Text color="gray.300" mb={4}>
                            Join SportsJobs to access premium soccer data sources, API guides, and exclusive analytics resources.
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
