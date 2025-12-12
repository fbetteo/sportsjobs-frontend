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
    Image
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
    hideTypeBadge = false,
    isFeatured = false,
    logoSrc
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
    isFeatured?: boolean;
    logoSrc?: string;
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
        <Card
            bg={isFeatured ? "purple.900" : "gray.800"}
            borderColor={isFeatured ? "purple.400" : "gray.600"}
            borderWidth={isFeatured ? "2px" : "1px"}
            _hover={{ borderColor: isFeatured ? 'purple.300' : 'purple.400' }}
            position="relative"
        >
            {isFeatured && (
                <Badge
                    position="absolute"
                    top={2}
                    right={2}
                    colorScheme="yellow"
                    variant="solid"
                    fontSize="xs"
                    zIndex={1}
                >
                    ⭐ FEATURED
                </Badge>
            )}
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

                    {logoSrc ? (
                        <HStack spacing={3} align="center">
                            <Image
                                src={logoSrc}
                                alt={`${title} logo`}
                                boxSize="64px"
                                objectFit="contain"
                                borderRadius="md"
                                bg="white"
                                p={1}
                            />
                            <Heading size="md" color="white">{title}</Heading>
                        </HStack>
                    ) : (
                        <Heading size="md" color="white">{title}</Heading>
                    )}
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
                        colorScheme="purple"
                        rightIcon={<FaExternalLinkAlt />}
                        _hover={{ textDecoration: 'none' }}
                    >
                        Access Resource
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
                            title="AthlyticZ - Master Data Science
Through the Lens of Sports"
                            description="Advance your career in Data Science with project-based training in Machine Learning using Python, R Programming, Shiny Application Development, Bayesian Modeling using Stan, and more. Get lifetime access to asynchronous courses taught by industry experts."
                            url="https://athlyticz.com/affiliate-courses?am_id=sportsjobs"
                            type="tutorial"
                            isFeatured={true}
                            promoCode="SPORTSJOBS"
                            discount="Special pricing"
                            isAuthenticated={isAuthenticated}
                            logoSrc="/athlyticz.png"
                        />
                        <ResourceCard
                            title="Build Job Ready Skills in Sports Analytics "
                            description="TailoredU is a cutting-edge learning platform that prepares emerging sports analysts for entry-level jobs and helps professional analysts upskill."
                            url="https://tailoredu.com/?utm_source=sportsjobs.online&utm_medium=job_board&utm_campaign=resources"
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
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                        <ResourceCard
                            title="CT Data Science Lab"
                            description="Connecticut Statistical Data Science Lab channel featuring data science tutorials, sports analytics projects, and educational content for aspiring data scientists and analysts."
                            url="https://www.youtube.com/@ctdatasciencelab"
                            type="video"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title="Course: mathematical modelling of football"
                            description="This series of videos (combination of live videos and prerecorded) take us all the way from loading in data in to Python, through plotting data, expected goals, evaluating actions, working with tracking data, to analysing fitness."
                            url="https://www.youtube.com/playlist?list=PLedeYskZY0vBOdQ6Uc9eZjZ2-nz1JT3R7"
                            type="video"
                            isAuthenticated={isAuthenticated}
                        />

                    </Grid>
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
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                        <ResourceCard
                            title="Samford University - Careers & Education in Sports Analytics "
                            description="To prepare individuals for a career in one of these exciting fields, Samford's Center for Sports Analytics partners with Brock School of Business to offer rigorous sports analytics curricula for mathematically gifted and highly motived candidates paired with a real-world analytics internship in the sports industry."
                            url="https://www.samford.edu/sports-analytics/careers-and-education"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                        />
                    </Grid>
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
                            title="SCORE Sports Data Repository"
                            description="The SCORE Network Sports Data Repository curates interesting datasets across a variety of sports for use in statistics and data science education."
                            url="https://data.scorenetwork.org/?utm_source=sportsjobs.online&utm_medium=website&utm_campaign=resources"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                            hideTypeBadge={true}
                        />
                        <ResourceCard
                            title="SportsDataverse"
                            description="Lots of R and Python packages to access sports data. An open source sports analytics and data organization."
                            url="https://www.sportsdataverse.org/?utm_source=sportsjobs.online&utm_medium=website&utm_campaign=resources"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                            hideTypeBadge={true}
                        />
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
                        <ResourceCard
                            title="Golf Data Sources"
                            description="Professional golf data from PGA Tour, European Tour, and major championships including player statistics, tournament results, and course analytics."
                            url="/resources/data-sources/golf"
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
                        <ResourceCard
                            title="SMT's Data Challenge​"
                            description="While there are many well established sports analytics conferences, they are often not accessible to students due to technical level, cost, or space limitations. Connecticut Sports Analytics Symposium (CSAS) is a continuation of the UConn Sports Analytics Symposium (UCSAS) which started in 2019 with a broadened scope. Check the Data Challenge of each year!"
                            url="https://statds.org/events.html?utm_source=sportsjobs.online&utm_medium=website&utm_campaign=resources"
                            type="guide"
                            isAuthenticated={isAuthenticated}
                        />
                        <ResourceCard
                            title=" Baylor’s National Collegiate Sports Analytics Competition​"
                            description="Join the nation’s most promising business analytics students as they step into the spotlight at the National Collegiate Sports Analytics Championship. This premier event invites students from universities of all sizes to present their cutting-edge analyses to a panel of esteemed judges, all of whom are seasoned professionals in the field of analytics. It’s a unique opportunity for aspiring analysts to shine, showcasing their skills in a rigorous, real-world scenario"
                            url="https://sites.baylor.edu/ncbc/national-collegiate-business-championships/sports-analytics/?utm_source=sportsjobs.online&utm_medium=website&utm_campaign=resources"
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
