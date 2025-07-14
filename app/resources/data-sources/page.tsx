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
    Divider
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaFootballBall, FaBasketballBall, FaFutbol, FaArrowLeft } from 'react-icons/fa';
import { useUser } from '@auth0/nextjs-auth0/client';

const SportCard = ({
    title,
    description,
    icon,
    url,
    sourceCount,
    tags,
    isAuthenticated
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    url: string;
    sourceCount: number;
    tags: string[];
    isAuthenticated?: boolean;
}) => {
    return (
        <Card bg="gray.800" borderColor="gray.600" _hover={{ borderColor: 'teal.400' }}>
            <CardBody>
                <VStack align="start" spacing={4}>
                    <HStack spacing={3}>
                        <Box color="teal.400" fontSize="2xl">
                            {icon}
                        </Box>
                        <VStack align="start" spacing={1}>
                            <Heading size="md" color="white">{title}</Heading>
                            <Badge colorScheme="teal" variant="subtle">
                                {sourceCount} Data Sources
                            </Badge>
                        </VStack>
                    </HStack>

                    <Text color="gray.300" fontSize="sm">{description}</Text>

                    <HStack wrap="wrap">
                        {tags.map((tag, index) => (
                            <Badge key={index} colorScheme="purple" variant="outline" fontSize="xs">
                                {tag}
                            </Badge>
                        ))}
                    </HStack>

                    <Button
                        as={Link}
                        href={url}
                        size="sm"
                        colorScheme="teal"
                        rightIcon={<FaExternalLinkAlt />}
                        _hover={{ textDecoration: 'none' }}
                        w="full"
                    >
                        Explore {title} Data Sources
                    </Button>
                </VStack>
            </CardBody>
        </Card>
    );
};

export default function DataSourcesPage() {
    const { user } = useUser();
    const isAuthenticated = !!user;

    return (
        <Container maxW="7xl" py={8}>
            <VStack spacing={8} align="start">
                {/* Header */}
                <Box w="full">
                    <Button
                        as={Link}
                        href="/resources"
                        leftIcon={<FaArrowLeft />}
                        variant="ghost"
                        colorScheme="teal"
                        mb={4}
                        _hover={{ textDecoration: 'none' }}
                    >
                        Back to Resources
                    </Button>
                    <Heading size="2xl" mb={4} color="white">
                        📊 Sports Data Sources
                    </Heading>
                    <Text fontSize="lg" color="gray.300" maxW="3xl">
                        Comprehensive collection of APIs, databases, and data sources for sports analytics.
                        Find the right data for your projects, research, or professional work across major sports.
                    </Text>
                </Box>

                <Divider borderColor="gray.600" />

                {/* Sports Grid */}
                <Box w="full">
                    <Heading size="lg" mb={6} color="white">Choose Your Sport</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                        <SportCard
                            title="NFL Football"
                            description="Player tracking data, game statistics, team performance metrics, draft data, and advanced analytics from the National Football League."
                            icon={<FaFootballBall />}
                            url="/resources/data-sources/nfl"
                            sourceCount={12}
                            tags={["Player Tracking", "Game Stats", "Draft Data", "Advanced Metrics"]}
                            isAuthenticated={isAuthenticated}
                        />

                        <SportCard
                            title="Soccer"
                            description="Global soccer data covering major leagues, player performance, match statistics, tactical analysis, and transfer data from around the world."
                            icon={<FaFutbol />}
                            url="/resources/data-sources/soccer"
                            sourceCount={8}
                            tags={["Match Data", "Player Stats", "League Tables", "Transfer Market"]}
                            isAuthenticated={isAuthenticated}
                        />

                        <SportCard
                            title="Basketball"
                            description="NBA and basketball analytics data including player stats, shot charts, team performance metrics, and advanced basketball statistics."
                            icon={<FaBasketballBall />}
                            url="/resources/data-sources/basketball"
                            sourceCount={10}
                            tags={["Shot Charts", "Player Stats", "Team Metrics", "Advanced Analytics"]}
                            isAuthenticated={isAuthenticated}
                        />
                    </Grid>
                </Box>

                {/* Features Overview */}
                <Box w="full" bg="gray.900" p={6} borderRadius="lg" borderWidth="1px" borderColor="gray.600">
                    <Heading size="lg" mb={4} color="white">🎯 What You&apos;ll Find</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                        <VStack align="start" spacing={3}>
                            <Text color="white" fontWeight="semibold">Free Data Sources</Text>
                            <VStack align="start" spacing={1}>
                                <Text color="gray.300" fontSize="sm">• Open APIs with rate limits</Text>
                                <Text color="gray.300" fontSize="sm">• Public datasets and CSV files</Text>
                                <Text color="gray.300" fontSize="sm">• Web scraping resources</Text>
                                <Text color="gray.300" fontSize="sm">• Community-maintained data</Text>
                            </VStack>
                        </VStack>

                        <VStack align="start" spacing={3}>
                            <Text color="white" fontWeight="semibold">Premium Data Sources</Text>
                            <VStack align="start" spacing={1}>
                                <Text color="gray.300" fontSize="sm">• Real-time APIs with high limits</Text>
                                <Text color="gray.300" fontSize="sm">• Advanced tracking data</Text>
                                <Text color="gray.300" fontSize="sm">• Historical archives</Text>
                                <Text color="gray.300" fontSize="sm">• Professional-grade accuracy</Text>
                            </VStack>
                        </VStack>
                    </Grid>
                </Box>

                {/* Coming Soon */}
                <Box w="full" bg="blue.900" p={6} borderRadius="lg" borderWidth="1px" borderColor="blue.600">
                    <Heading size="lg" mb={4} color="white">🚀 Coming Soon</Heading>
                    <Text color="gray.300" mb={4}>
                        We&apos;re continuously adding new sports and data sources to help you find exactly what you need:
                    </Text>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                        <VStack align="start" spacing={1}>
                            <Text color="blue.300" fontWeight="semibold">Hockey (NHL)</Text>
                            <Text color="blue.300" fontWeight="semibold">Baseball (MLB)</Text>
                            <Text color="blue.300" fontWeight="semibold">Tennis</Text>
                        </VStack>
                        <VStack align="start" spacing={1}>
                            <Text color="blue.300" fontWeight="semibold">Formula 1</Text>
                            <Text color="blue.300" fontWeight="semibold">Golf</Text>
                            <Text color="blue.300" fontWeight="semibold">Cricket</Text>
                        </VStack>
                        <VStack align="start" spacing={1}>
                            <Text color="blue.300" fontWeight="semibold">Olympics</Text>
                            <Text color="blue.300" fontWeight="semibold">Esports</Text>
                            <Text color="blue.300" fontWeight="semibold">College Sports</Text>
                        </VStack>
                    </Grid>
                </Box>

                {/* Call to Action */}
                {!isAuthenticated && (
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
                            📊 Access Premium Data Resources
                        </Heading>
                        <Text color="gray.300" mb={4}>
                            Join SportsJobs to unlock exclusive data source recommendations and API access guides.
                        </Text>
                        <Button
                            as={Link}
                            href="/signup"
                            colorScheme="purple"
                            size="lg"
                            _hover={{ textDecoration: 'none' }}
                        >
                            Sign Up Now
                        </Button>
                    </Box>
                )}
            </VStack>
        </Container>
    );
}
