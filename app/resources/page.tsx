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
    Button
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaYoutube, FaBook, FaTools, FaBriefcase, FaLock } from 'react-icons/fa';
import { useUser } from '@auth0/nextjs-auth0/client';

const ResourceCard = ({
    title,
    description,
    url,
    type,
    isPremium = false,
    promoCode,
    discount,
    isAuthenticated,
    hideTypeBadge = false
}: {
    title: string;
    description: string;
    url: string;
    type: 'tutorial' | 'video' | 'tool' | 'guide';
    isPremium?: boolean;
    promoCode?: string;
    discount?: string;
    isAuthenticated?: boolean;
    hideTypeBadge?: boolean;
}) => {
    const getIcon = () => {
        switch (type) {
            case 'tutorial': return <FaBook />;
            case 'video': return <FaYoutube />;
            case 'tool': return <FaTools />;
            case 'guide': return <FaBriefcase />;
        }
    };

    const getTypeColor = () => {
        switch (type) {
            case 'tutorial': return 'blue';
            case 'video': return 'red';
            case 'tool': return 'green';
            case 'guide': return 'purple';
        }
    };

    return (
        <Card bg="gray.800" borderColor="gray.600" _hover={{ borderColor: 'teal.400' }}>
            <CardBody>
                <VStack align="start" spacing={3}>
                    <HStack wrap="wrap">
                        {!hideTypeBadge && (
                            <>
                                <Box color={`${getTypeColor()}.400`}>
                                    {getIcon()}
                                </Box>
                                <Badge colorScheme={getTypeColor()} variant="subtle">
                                    {type.toUpperCase()}
                                </Badge>
                            </>
                        )}
                        {isPremium && <Badge colorScheme="purple">PREMIUM</Badge>}
                        {promoCode && isAuthenticated && (
                            <Badge colorScheme="green" variant="solid">
                                💰 {promoCode} ({discount})
                            </Badge>
                        )}
                        {promoCode && !isAuthenticated && (
                            <Badge
                                colorScheme="orange"
                                variant="solid"
                                px={3}
                                py={1}
                                fontSize="xs"
                                display="flex"
                                alignItems="center"
                                gap={1}
                            >
                                <FaLock />
                                Exclusive Discount
                            </Badge>
                        )}
                    </HStack>

                    <Heading size="md" color="white">{title}</Heading>
                    <Text color="gray.300" fontSize="sm">{description}</Text>

                    {promoCode && isAuthenticated && (
                        <Text fontSize="xs" color="green.300" fontWeight="semibold">
                            🎯 Use code &quot;{promoCode}&quot; for {discount} off - Exclusive for SportsJobs users!
                        </Text>
                    )}

                    {promoCode && !isAuthenticated && (
                        <Text fontSize="xs" color="orange.300" fontWeight="semibold">
                            🔒 Sign up as a premium user to unlock exclusive discount codes and save on courses!
                        </Text>
                    )}

                    <Button
                        as={Link}
                        href={url}
                        isExternal
                        size="sm"
                        colorScheme="teal"
                        rightIcon={<FaExternalLinkAlt />}
                        _hover={{ textDecoration: 'none' }}
                    >
                        View Resource
                    </Button>
                </VStack>
            </CardBody>
        </Card>
    );
};

export default function ResourcesPage() {
    const { user, isLoading } = useUser();
    const isAuthenticated = !!user;

    return (
        <Container maxW="7xl" py={8}>
            <VStack spacing={8} align="start">
                <Box textAlign="center" w="full">
                    <Heading size="2xl" mb={4} color="white">
                        Resources for Sports Job Seekers
                    </Heading>
                    <Text fontSize="lg" color="gray.300" maxW="2xl" mx="auto">
                        Curated tutorials, guides, and tools to help you excel in sports analytics,
                        data science, and the sports betting industry.
                    </Text>
                    {!isAuthenticated && (
                        <Text fontSize="md" color="orange.300" mt={4} fontWeight="semibold">
                            🔐 Sign up to unlock all the jobs and exclusive discount codes that save you more than your subscription costs!
                        </Text>
                    )}
                </Box>

                {/* Tutorials Section */}
                <Box w="full">
                    <Heading size="lg" mb={6} color="white">📚 Tutorials & Courses</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                        <ResourceCard
                            title="Build Job Ready Skills in Sports Analytics "
                            description="TailoredU is a cutting-edge learning platform that prepares emerging sports analysts for entry-level jobs and helps professional analysts upskill."
                            url="hhttps://tailoredu.com/?utm_source=sportsjobs.online&utm_medium=job_board&utm_campaign=resources"
                            type="tutorial"
                            promoCode="SPORTSJOBS10"
                            discount="10% off"
                            isAuthenticated={isAuthenticated}
                        />
                        {/* <ResourceCard
                            title="SQL for Sports Databases"
                            description="Learn to query sports databases and extract meaningful insights."
                            url="https://sqlbolt.com/"
                            type="tutorial"
                            isAuthenticated={isAuthenticated}
                        /> */}
                        <ResourceCard
                            title="Guide to Arbitrage in Sports Betting"
                            description="The aim of this course is to teach students how to take advantage of sports betting, even without any prior betting experience or knowledge about the specific sports."
                            url="https://www.udemy.com/course/arbitrage-in-sports-betting-profit-guaranteed/?referralCode=FF59D38EB32F4EB4B983"
                            type="tutorial"
                            // isPremium={true}
                            promoCode="SPORTSJOBSFREE"
                            discount="Free!"
                            isAuthenticated={isAuthenticated}
                        />
                        {/* <ResourceCard
                            title="R for Sports Statistics"
                            description="Use R programming language for advanced sports statistical analysis."
                            url="https://r4ds.had.co.nz/"
                            type="tutorial"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Machine Learning in Sports"
                            description="Apply ML algorithms to predict game outcomes and player performance."
                            url="https://scikit-learn.org/stable/tutorial/"
                            type="tutorial"
                            promoCode="MLSPORTS15"
                            discount="15% off"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Sports Data Visualization"
                            description="Create compelling visualizations with Tableau and Power BI."
                            url="https://public.tableau.com/gallery"
                            type="tutorial"
                            isAuthenticated={isAuthenticated}
                        /> */}
                    </Grid>
                </Box>

                {/* Video Content Section */}
                <Box w="full">
                    <Heading size="lg" mb={6} color="white">🎥 Video Content</Heading>
                    {/* <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                        <ResourceCard
                            title="Sports Analytics Fundamentals"
                            description="YouTube series covering the basics of sports analytics and data science."
                            url="https://www.youtube.com/results?search_query=sports+analytics+tutorial"
                            type="video"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Interview Prep for Sports Jobs"
                            description="Common interview questions and how to answer them for sports analytics roles."
                            url="https://www.youtube.com/results?search_query=data+science+interview+prep"
                            type="video"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Building Sports Dashboards"
                            description="Step-by-step guide to creating interactive sports analytics dashboards."
                            url="https://www.youtube.com/results?search_query=sports+dashboard+tutorial"
                            type="video"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Sports Betting Analytics Explained"
                            description="Deep dive into the mathematics and statistics behind sports betting."
                            url="https://www.youtube.com/results?search_query=sports+betting+analytics"
                            type="video"
                            isPremium={true}
                            isAuthenticated={isAuthenticated}
                        />
                    </Grid> */}
                </Box>

                {/* Tools Section */}
                <Box w="full">
                    <Heading size="lg" mb={6} color="white">🛠️ Tools & Resources</Heading>
                    {/* <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                        <ResourceCard
                            title="Sports Data APIs"
                            description="Free and paid APIs for accessing sports statistics and real-time data."
                            url="https://github.com/topics/sports-api"
                            type="tool"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Portfolio Template"
                            description="GitHub template for creating an impressive sports analytics portfolio."
                            url="https://github.com/topics/data-science-portfolio"
                            type="tool"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Resume Builder for Tech Jobs"
                            description="Create ATS-friendly resumes tailored for sports analytics positions."
                            url="https://resume.io/"
                            type="tool"
                            promoCode="RESUME25"
                            discount="25% off"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Jupyter Notebook Templates"
                            description="Ready-to-use notebooks for common sports analytics tasks."
                            url="https://github.com/topics/jupyter-notebook"
                            type="tool"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Sports Statistics Databases"
                            description="Comprehensive databases with historical and real-time sports data."
                            url="https://www.sports-reference.com/"
                            type="tool"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Data Visualization Tools"
                            description="Free and premium tools for creating stunning sports data visualizations."
                            url="https://public.tableau.com/"
                            type="tool"
                            promoCode="DATAVIZ30"
                            discount="30% off"
                            isAuthenticated={isAuthenticated}
                        />
                    </Grid> */}
                </Box>

                {/* Career Guides Section */}
                <Box w="full">
                    <Heading size="lg" mb={6} color="white">💼 Career Guides</Heading>
                    {/* <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                        <ResourceCard
                            title="Breaking into Sports Analytics"
                            description="Step-by-step guide to transitioning into a sports analytics career."
                            url="/blog"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Resume Tips for Sports Jobs"
                            description="How to tailor your resume for sports industry positions."
                            url="/blog"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Networking in Sports Industry"
                            description="Build connections and find mentors in the sports analytics field."
                            url="/blog"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Salary Negotiation Guide"
                            description="Get paid what you're worth in sports analytics and data science roles."
                            url="/blog"
                            type="guide"
                            isPremium={true}
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Remote Work in Sports"
                            description="Find and excel in remote sports analytics positions."
                            url="/blog"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Building Your Sports Analytics Brand"
                            description="Establish yourself as a thought leader in the sports analytics community."
                            url="/blog"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                        />
                    </Grid> */}
                </Box>

                {/* Books Section */}
                <Box w="full">
                    <Heading size="lg" mb={6} color="white">📚 Recommended Books</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                        <ResourceCard
                            title="Essential Sports Analytics Books"
                            description="Curated collection of 15+ must-read books covering sports analytics, data science, statistics, and industry insights. From beginner to advanced level."
                            url="/resources/books"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                        />
                    </Grid>
                </Box>

                {/* Data Sources Section */}
                <Box w="full">
                    <Heading size="lg" mb={6} color="white">📊 Sports Data Sources</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                        <ResourceCard
                            title="NFL Data Sources"
                            description="Comprehensive APIs, databases, and tools for NFL statistics, player tracking, and game data. Includes free and premium options for advanced analytics."
                            url="/resources/data-sources/nfl"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                            hideTypeBadge={true}
                        />
                        <ResourceCard
                            title="Soccer Data Sources"
                            description="Global soccer data covering major leagues, player performance, match statistics, and tactical analysis from around the world."
                            url="/resources/data-sources/soccer"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                            hideTypeBadge={true}
                        />
                        <ResourceCard
                            title="Basketball Data Sources"
                            description="NBA and basketball analytics data including player stats, shot charts, team performance metrics, and advanced basketball statistics."
                            url="/resources/data-sources/basketball"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                            hideTypeBadge={true}
                        />
                    </Grid>
                </Box>

                {/* Competitions Section */}
                <Box w="full">
                    <Heading size="lg" mb={6} color="white">🏆 Sports Analytics Competitions</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                        <ResourceCard
                            title="NFL Big Data Bowl"
                            description="Annual analytics competition using NFL tracking data. Build models to analyze player performance, game strategy, and next-gen stats. Great for showcasing skills to NFL teams."
                            url="https://operations.nfl.com/gameday/analytics/big-data-bowl?utm_source=sportsjobs.online&utm_medium=website&utm_campaign=resources"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Hockey Big Data Cup"
                            description="Hockey analytics competition focusing on NHL tracking data. Analyze player movements, team strategies, and game dynamics. Perfect for breaking into hockey analytics."
                            url="https://stathletes.com/big-data-cup?utm_source=sportsjobs.online&utm_medium=website&utm_campaign=resources"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                        />
                    </Grid>
                </Box>

                {/* Call to Action for Premium Users */}
                {!isAuthenticated && (
                    <Box
                        w="full"
                        bg="purple.900"
                        p={8}
                        borderRadius="lg"
                        textAlign="center"
                        borderWidth="1px"
                        borderColor="purple.600"
                    >
                        <Heading size="lg" mb={4} color="white">
                            � Unlock Exclusive Promo Codes
                        </Heading>
                        <Text color="gray.300" mb={4} fontSize="lg">
                            Get access to all the jobs and to exclusive discount codes that save you more than your subscription costs!

                        </Text>
                        <VStack spacing={2} mb={6}>
                            <Text color="orange.300" fontSize="md" fontWeight="semibold">
                                � Hidden discount codes on premium courses and tools
                            </Text>
                            <Text color="orange.300" fontSize="md" fontWeight="semibold">
                                💰 Save 10-30% on the resources you see above
                            </Text>
                            <Text color="orange.300" fontSize="md" fontWeight="semibold">
                                🎯 The discounts pay for your entire subscription
                            </Text>
                            <Text color="orange.300" fontSize="md" fontWeight="semibold">
                                📈 Every additional purchase = pure savings
                            </Text>
                        </VStack>
                        <Button
                            as={Link}
                            href="/signup"
                            colorScheme="purple"
                            size="lg"
                            _hover={{ textDecoration: 'none' }}
                        >
                            Sign Up Now - Unlock Discounts
                        </Button>
                    </Box>
                )}

                {isAuthenticated && (
                    <Box
                        w="full"
                        bg="green.900"
                        p={8}
                        borderRadius="lg"
                        textAlign="center"
                        borderWidth="1px"
                        borderColor="green.600"
                    >
                        <Heading size="lg" mb={4} color="white">
                            🎉 You Have Access to Exclusive Discounts!
                        </Heading>
                        <Text color="gray.300" mb={4} fontSize="lg">
                            Look for the green 💰 badges above to find your exclusive promo codes!
                        </Text>
                        <Text color="green.300" fontSize="md" fontWeight="semibold">
                            Copy the codes and use them when purchasing courses and tools to save money.
                        </Text>
                    </Box>
                )}
            </VStack>
        </Container>
    );
}
