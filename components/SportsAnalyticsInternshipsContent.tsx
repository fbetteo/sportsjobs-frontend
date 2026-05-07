'use client';

import NextLink from 'next/link';
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
    Flex,
    Heading,
    HStack,
    Image,
    LinkBox,
    LinkOverlay,
    SimpleGrid,
    Stack,
    Tag,
    Text,
    VStack,
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaLock } from 'react-icons/fa';
import NewsletterSignupForm from './NewsletterSignupForm';
import { internshipFaqItems } from '@/lib/sportsAnalyticsInternshipsContent';

export interface InternshipJob {
    id: string;
    title?: string;
    company?: string;
    salary?: string;
    location?: string;
    country?: string;
    seniority?: string;
    remote_string?: string;
    days_ago_text?: string;
    logo_permanent_url?: string;
    sport_list?: string;
    job_area?: string;
    start_date?: string;
}

interface Props {
    initialJobs: InternshipJob[];
    lastChecked: string;
}

const taxonomy = [
    {
        title: 'Player and Game Performance Analytics',
        text: 'These internships sit closest to coaches, scouts, player development, video, sport science, and front office decision-making. Students may clean event data, chart games, prepare opponent reports, build dashboards, or support models that describe player performance, lineup choices, and game strategy.',
        tags: ['player performance', 'statistics', 'data science'],
    },
    {
        title: 'Business and Fan Analytics',
        text: 'Business analytics internships focus on revenue and audience questions: ticket pricing, sponsorship performance, fan loyalty, promotions, CRM reporting, and sales funnels. They are common with teams, leagues, agencies, and sports business organizations that need clearer data around fan engagement.',
        tags: ['business analytics', 'fan engagement', 'finance'],
    },
    {
        title: 'Content, Media, and Social Analytics',
        text: 'Some analytics internships support social media, marketing, journalism, video, and digital production. The work may include campaign reporting, audience segmentation, content performance dashboards, or lightweight technical tasks with HTML, CSS, JavaScript, JSON, PHP, Django, Adobe Audition, or Pro Tools.',
        tags: ['marketing', 'social media', 'content'],
    },
    {
        title: 'Tracking, Reporting, and Operations Roles',
        text: 'Operations-heavy internships can still be analytics-relevant when the role involves structured reporting, data quality, tracking sheets, event support, or internal dashboards. These are often good entry points for undergraduate students who need applied experience before more technical roles.',
        tags: ['operations', 'reporting', 'hybrid'],
    },
];

const requirementBlocks = [
    {
        title: 'Typical Majors and Backgrounds',
        text: 'Sports analytics internships commonly mention statistics, data science, computer science, economics, finance, journalism, graphic design, or sport management. Graduate students may see stronger technical expectations, while undergraduate students can compete well with a clear portfolio and applied sports examples.',
    },
    {
        title: 'Student and Academic-Credit Expectations',
        text: 'Many internships are built for current students and recent graduates. Some teams and NCAA athletic departments ask for academic credit eligibility, campus availability, or proof that the internship fits a degree program.',
    },
    {
        title: 'Remote, Onsite, and Hybrid Formats',
        text: 'Remote internships exist, especially in media, business analytics, and data reporting. Onsite and hybrid roles are still common with teams because game operations, arena work, athlete data, and stakeholder meetings often happen in person.',
    },
    {
        title: 'Seasonal Timing for Applications',
        text: 'Summer internships are often posted from late fall through early spring. Fall roles usually appear in spring and summer, while spring roles tend to post in late summer or fall. Teams in the NBA, NFL, MLB, MLS, NHL, NCAA, WNBA, and NWSL may also hire around their league calendars.',
    },
];

function getRoleFamily(job: InternshipJob) {
    const text = `${job.title ?? ''} ${job.job_area ?? ''}`.toLowerCase();

    if (/(performance|player|game|scout|video|baseball operations|basketball operations|football operations)/.test(text)) {
        return 'Performance analytics';
    }

    if (/(business|ticket|pricing|revenue|finance|sponsorship|crm|fan)/.test(text)) {
        return 'Business analytics';
    }

    if (/(marketing|social|content|media|communications|journalism)/.test(text)) {
        return 'Content and media analytics';
    }

    return 'Data analytics and reporting';
}

function getAnalyticsNote(job: InternshipJob) {
    const family = getRoleFamily(job);

    if (family === 'Performance analytics') {
        return 'Analytics relevance: likely connected to player performance, scouting, game data, or sport operations reporting.';
    }

    if (family === 'Business analytics') {
        return 'Analytics relevance: likely tied to business analytics, fan engagement, ticketing, sponsorships, or revenue reporting.';
    }

    if (family === 'Content and media analytics') {
        return 'Analytics relevance: likely useful for marketing, social media, content performance, or audience analysis.';
    }

    return 'Analytics relevance: useful entry-level exposure to data analytics, reporting workflows, and sports organizations.';
}

export default function SportsAnalyticsInternshipsContent({ initialJobs, lastChecked }: Props) {
    const latestJobs = initialJobs.slice(0, 10);

    return (
        <Container maxW="7xl" py={{ base: 8, md: 12 }}>
            <VStack spacing={{ base: 10, md: 14 }} align="stretch">
                <Box textAlign="center" maxW="4xl" mx="auto">
                    <Badge colorScheme="teal" mb={4} px={3} py={1} borderRadius="md">
                        Updated internship search
                    </Badge>
                    <Heading as="h1" size={{ base: 'xl', md: '2xl' }} color="white" mb={4}>
                        Sports Analytics Internships in the USA
                    </Heading>
                    <Text color="gray.300" fontSize={{ base: 'md', md: 'lg' }}>
                        Find sports analytics internships, data analytics internships, and adjacent student roles with teams,
                        leagues, NCAA programs, sports media companies, and business organizations across the United States.
                        Use this page to separate performance analytics roles from business analytics, marketing, social media,
                        operations, and reporting internships.
                    </Text>
                </Box>

                <Box as="section" id="current-openings">
                    <Flex direction={{ base: 'column', lg: 'row' }} gap={8} align="start">
                        <Box flex="1" minW={0}>
                            <Flex
                                justify="space-between"
                                align={{ base: 'start', md: 'center' }}
                                direction={{ base: 'column', md: 'row' }}
                                gap={3}
                                mb={5}
                            >
                                <Box>
                                    <Heading as="h2" size="lg" color="white">
                                        Latest Sports Analytics Internships
                                    </Heading>
                                    <Text color="gray.400" mt={2}>
                                        These are the last 10 internships from SportsJobs data, including remote, onsite,
                                        hybrid, paid, and unpaid roles when those details are available. Last checked: {lastChecked}.
                                    </Text>
                                </Box>
                                <Button
                                    as={NextLink}
                                    href="/signup"
                                    colorScheme="purple"
                                    leftIcon={<FaLock />}
                                    flexShrink={0}
                                >
                                    Unlock all jobs
                                </Button>
                            </Flex>

                            <VStack spacing={4} align="stretch">
                                {latestJobs.length === 0 ? (
                                    <Alert status="info" bg="gray.800" color="gray.100" borderRadius="md">
                                        <AlertIcon />
                                        No internships are visible right now. Check back soon for newly added roles.
                                    </Alert>
                                ) : (
                                    latestJobs.map((job) => (
                                        <LinkBox
                                            as={Card}
                                            key={job.id}
                                            bg="gray.800"
                                            borderWidth="1px"
                                            borderColor="gray.600"
                                            borderRadius="md"
                                            _hover={{ borderColor: 'teal.300', bg: 'gray.700' }}
                                        >
                                            <CardBody>
                                                <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                                                    <Image
                                                        src={job.logo_permanent_url || 'https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png'}
                                                        alt={`${job.company ?? 'Sports organization'} logo`}
                                                        boxSize="64px"
                                                        objectFit="contain"
                                                        borderRadius="md"
                                                        bg="white"
                                                        p={1}
                                                    />
                                                    <Box flex="1" minW={0}>
                                                        <Text color="gray.400" fontWeight="semibold">
                                                            {job.company ?? 'Sports organization'}
                                                        </Text>
                                                        <LinkOverlay as={NextLink} href={`/jobs/${job.id}`}>
                                                            <Heading as="h3" size="md" color="white" mt={1}>
                                                                {job.title ?? 'Sports analytics internship'}
                                                            </Heading>
                                                        </LinkOverlay>
                                                        <HStack spacing={2} wrap="wrap" mt={3}>
                                                            <Tag colorScheme="teal">{getRoleFamily(job)}</Tag>
                                                            <Tag colorScheme="blue">{job.remote_string || 'Work type not listed'}</Tag>
                                                            <Tag colorScheme="green">{job.sport_list || 'Sports'}</Tag>
                                                            <Tag colorScheme={job.salary ? 'purple' : 'gray'}>
                                                                {job.salary || 'Pay not listed'}
                                                            </Tag>
                                                            <Tag colorScheme={job.days_ago_text === 'Posted Today' ? 'green' : 'gray'}>
                                                                {job.days_ago_text || 'Recently checked'}
                                                            </Tag>
                                                        </HStack>
                                                        <Text color="gray.300" fontSize="sm" mt={3}>
                                                            {job.location || job.country || 'United States'} - {getAnalyticsNote(job)}
                                                        </Text>
                                                    </Box>
                                                </Flex>
                                            </CardBody>
                                        </LinkBox>
                                    ))
                                )}
                            </VStack>
                        </Box>

                        <Box
                            w={{ base: '100%', lg: '360px' }}
                            bg="gray.800"
                            borderWidth="1px"
                            borderColor="gray.600"
                            borderRadius="md"
                            p={5}
                        >
                            <Heading as="h2" size="md" color="white" mb={3}>
                                Sports Analytics Career Updates
                            </Heading>
                            <Text color="gray.300" fontSize="sm" mb={4}>
                                Get the free weekly newsletter with sports analytics jobs, internships, resources,
                                and practical career notes.
                            </Text>
                            <NewsletterSignupForm />
                        </Box>
                    </Flex>
                </Box>

                <Divider borderColor="gray.700" />

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        What Counts as a Sports Analytics Internship
                    </Heading>
                    <Text color="gray.300" mb={6}>
                        A sports analytics internship is any student or early-career role where the work turns sports,
                        fan, operational, or business data into decisions. The best searches include the exact phrase
                        sports analytics, but also data analytics, business analytics, player performance, fan engagement,
                        sponsorships, promotions, marketing analytics, social media analytics, and reporting.
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                        {taxonomy.map((item) => (
                            <Card key={item.title} bg="gray.800" borderColor="gray.600" borderWidth="1px" borderRadius="md">
                                <CardBody>
                                    <Heading as="h3" size="md" color="white" mb={2}>
                                        {item.title}
                                    </Heading>
                                    <Text color="gray.300" fontSize="sm" mb={4}>
                                        {item.text}
                                    </Text>
                                    <HStack wrap="wrap">
                                        {item.tags.map((tag) => (
                                            <Tag key={tag} colorScheme="teal" variant="subtle">
                                                {tag}
                                            </Tag>
                                        ))}
                                    </HStack>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Box>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        Popular Employers and Sports Hiring for Analytics Interns
                    </Heading>
                    <Text color="gray.300">
                        Hiring can come from pro teams and leagues, college athletics and university programs, sports
                        media companies, betting companies, vendors, agencies, and business organizations. Search broadly
                        across NBA, NFL, MLB, MLS, NHL, NCAA, WNBA, and NWSL ecosystems, but read each role carefully:
                        a Jacksonville Jaguars, Orlando Magic, NBCUniversal, or Samford University posting may use
                        different language even when the internship is still analytics-relevant.
                    </Text>
                </Box>

                {/* <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        Related Internship Categories You Will See on This Search
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                        {['Sports management', 'Marketing and sponsorship', 'Communications and media', 'Operations and event support'].map((category) => (
                            <Box key={category} bg="gray.800" borderWidth="1px" borderColor="gray.600" borderRadius="md" p={5}>
                                <Heading as="h3" size="sm" color="white" mb={2}>
                                    {category}
                                </Heading>
                                <Text color="gray.300" fontSize="sm">
                                    These categories can be useful when the role includes measurable outcomes, reporting,
                                    dashboards, audience analysis, or data cleanup.
                                </Text>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Box> */}

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        Common Requirements for Sports Analytics Internships
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                        {requirementBlocks.map((item) => (
                            <Box key={item.title} bg="gray.800" borderWidth="1px" borderColor="gray.600" borderRadius="md" p={5}>
                                <Heading as="h3" size="sm" color="white" mb={2}>
                                    {item.title}
                                </Heading>
                                <Text color="gray.300" fontSize="sm">
                                    {item.text}
                                </Text>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Box>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        Skills Mentioned Across Sports Analytics Internship Pages
                    </Heading>
                    <Stack spacing={4}>
                        <Text color="gray.300">
                            Statistics and analysis skills show up most often: SQL, Excel, Python, R, Tableau, Power BI,
                            data cleaning, data visualization, and clear written communication. For performance roles,
                            add sports context, scouting language, video workflows, and familiarity with public datasets.
                        </Text>
                        <Text color="gray.300">
                            Business analytics internships may mention finance, economics, CRM, ticket pricing, fan
                            loyalty, sponsorship reporting, promotions, and fan engagement. Content and digital roles may
                            add social media metrics, journalism, graphic design, CSS, HTML, JavaScript, JSON, PHP,
                            Django, Adobe Audition, or Pro Tools.
                        </Text>
                    </Stack>
                </Box>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        Frequently Asked Questions About Sports Analytics Internships
                    </Heading>
                    <VStack spacing={4} align="stretch">
                        {internshipFaqItems.map((item) => (
                            <Box key={item.question} bg="gray.800" borderWidth="1px" borderColor="gray.600" borderRadius="md" p={5}>
                                <Heading as="h3" size="sm" color="white" mb={2}>
                                    {item.question}
                                </Heading>
                                <Text color="gray.300" fontSize="sm">
                                    {item.answer}
                                </Text>
                            </Box>
                        ))}
                    </VStack>
                </Box>

                <Box
                    as="section"
                    bg="gray.800"
                    borderWidth="1px"
                    borderColor="teal.500"
                    borderRadius="md"
                    p={{ base: 6, md: 8 }}
                    textAlign="center"
                >
                    <Heading as="h2" size="lg" color="white" mb={3}>
                        Start Your Sports Analytics Internship Search
                    </Heading>
                    <Text color="gray.300" maxW="3xl" mx="auto" mb={5}>
                        SportsJobs keeps the search narrow so students and recent graduates can spend less time sorting
                        through generic sports internships and more time applying to analytics-relevant roles.
                    </Text>
                    <HStack justify="center" spacing={4} flexWrap="wrap">
                        <Button as={NextLink} href="/signup" colorScheme="purple" rightIcon={<FaExternalLinkAlt />}>
                            Start internship search
                        </Button>
                        <Button as={NextLink} href="/#current-openings" variant="outline" colorScheme="teal">
                            Browse all sports jobs
                        </Button>
                    </HStack>
                </Box>
            </VStack>
        </Container>
    );
}
