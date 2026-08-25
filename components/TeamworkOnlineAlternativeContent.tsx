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
    Flex,
    Heading,
    HStack,
    Image,
    LinkBox,
    LinkOverlay,
    SimpleGrid,
    Stack,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaLock } from 'react-icons/fa';
import { BRAND_PRIMARY_COLOR_SCHEME, BRAND_SECONDARY, BRAND_SECONDARY_COLOR_SCHEME, BRAND_SECONDARY_LIGHT } from '@/lib/uiTokens';
import NextLink from 'next/link';
import NewsletterSignupForm from './NewsletterSignupForm';
import type { AnalyticsSearchJob, InventorySummary } from '@/lib/teamworkOnlineAlternativeContent';
import { getAnalyticsFocus, teamworkOnlineFaqItems } from '@/lib/teamworkOnlineAlternativeContent';
import { getJobLogoSrc, isDefaultJobLogo } from '@/lib/jobLogo';
interface Props {
    initialJobs: AnalyticsSearchJob[];
    inventory: InventorySummary;
    sampleSize: number;
    lastChecked: string;
}

const explainerCards = [
    {
        title: 'A broad sports and entertainment hiring platform',
        text: 'TeamWork Online is built around sports jobs and sports & entertainment recruiting at scale. It is not limited to analytics, so the same search environment can contain ticketing, partnerships, marketing, operations, venue, media, and corporate roles alongside data-focused openings.',
    },
    {
        title: 'The leagues, teams, and categories it emphasizes',
        text: 'Its brand strength comes from recognizable sports employers across the NBA, NFL, NHL, MLB, MLS, colleges, and other organizations. That league access matters if your goal is general sports business exposure or a first step into the industry.',
    },
    {
        title: 'Who it tends to serve best',
        text: 'It usually fits candidates who want broad sports careers, internships, entry level access, career events, or employer discovery. It is less tailored to job seekers who only want sports analytics, data analyst, data scientist, or business intelligence roles.',
    },
];

const strengthCards = [
    {
        title: 'Big-name sports organizations and leagues',
        text: 'Few brands match TeamWork Online for familiar logos and employer breadth. If you want exposure to teams, league offices, colleges, and sports & entertainment organizations, it is a practical place to scan.',
    },
    {
        title: 'Entry-level, internship, and general sports-business hiring',
        text: 'The platform is especially useful when you are open to internships, entry level commercial roles, ticketing, client services, operations, or broader sports-business work that can later turn into a more specialized path.',
    },
    {
        title: 'Career events and networking access',
        text: 'TeamWork Online has long leaned into hiring events, career fairs, and networking touchpoints. For candidates changing industries or trying to build a first sports network, that can be a real advantage.',
    },
];

const weaknessCards = [
    {
        title: 'Too many broad sports-business and venue roles',
        text: 'If you search for analytics-adjacent terms, you can still end up sorting through ticket sales, event staffing, facilities, concessions, and operations-heavy postings. That raises the time cost for niche candidates.',
    },
    {
        title: 'Analytics is not the core organizing principle',
        text: 'The platform is organized around sports hiring generally, not around analytics-specific pathways like performance analyst, business intelligence, pricing, data scientist, analytics engineer, or sports betting roles.',
    },
    {
        title: 'Harder to separate data jobs from adjacent work',
        text: 'For serious analytics candidates, the real problem is relevance. A broad board can contain useful jobs, but it can also bury them under roles where data analysis is secondary or missing entirely.',
    },
];

const comparisonRows = [
    ['Primary value', 'Scale, recognizable employers, and broad sports jobs coverage', 'Narrower focus on analytics-relevant sports roles and search intent'],
    ['Best for', 'Candidates open to general sports business, internships, events, and employer discovery', 'Candidates targeting sports analytics, data analyst, data scientist, business intelligence, and performance analyst roles'],
    ['Visible role mix', 'Broader mix that often includes ticketing, operations, venues, sales, and event management', 'More relevant mix for data, strategy, analytics, engineering, and related technical paths'],
    ['Remote jobs and niche searches', 'Possible, but not the main organizing promise', 'Useful when you specifically want remote jobs, betting analytics, BI, or analytics-by-function discovery'],
    ['Why someone would choose it', 'You want the largest general sports-hiring ecosystem', 'You want relevance to beat scale for a niche search'],
];

const taxonomyCards = [
    {
        title: 'Performance analytics roles',
        text: 'Look for performance analyst, player development analyst, scouting analyst, sport science, video analysis, and team strategy roles. These are closest to coaches, players, and on-field or on-court decision-making.',
    },
    {
        title: 'Business intelligence and pricing roles',
        text: 'These jobs cover fan insights, CRM, sponsorship reporting, ticket pricing, revenue management, and business intelligence. They are often a better fit for analysts coming from economics, finance, marketing analytics, or BI backgrounds.',
    },
    {
        title: 'Data science and engineering roles',
        text: 'Search for data scientist, machine learning, analytics engineer, data engineer, experimentation, forecasting, and modeling work. Sports technology and media companies often have the strongest concentration here.',
    },
    {
        title: 'Betting, quant, and trading roles',
        text: 'Sports betting, quant research, odds trading, and risk roles sit outside traditional team-side hiring but can offer some of the deepest analytical work and strongest salary upside.',
    },
    {
        title: 'Internships and entry-level analytics roles',
        text: 'Students and early-career candidates should search for internships, research assistant work, junior analyst openings, and rotational roles that build proof before higher-end data scientist or strategy jobs.',
    },
];

const observedRoleMixRows = [
    ['Broad sports board pattern', 'Ticket sales, operations, events, facilities, partnerships, and general sports-business hiring often dominate the visible mix.'],
    ['Analytics-specific search need', 'Sports analytics candidates usually want a faster path to data analyst, performance analyst, business intelligence, data scientist, pricing, or sports betting work.'],
    ['Decision rule', 'Use TeamWork Online when scale and employer discovery matter more than precision. Use an analytics-focused board when precision matters more than scale.'],
];

function renderCountTags(entries: Array<[string, number]>, emptyLabel: string) {
    if (entries.length === 0) {
        return <Tag colorScheme="gray">{emptyLabel}</Tag>;
    }

    return (
        <HStack spacing={2} flexWrap="wrap">
            {entries.slice(0, 4).map(([label, count]) => (
                <Tag key={label} colorScheme={BRAND_SECONDARY_COLOR_SCHEME} variant="subtle">
                    {label}: {count}
                </Tag>
            ))}
        </HStack>
    );
}

export default function TeamworkOnlineAlternativeContent({
    initialJobs,
    inventory,
    sampleSize,
    lastChecked,
}: Props) {
    return (
        <Container maxW="7xl" py={{ base: 8, md: 12 }}>
            <VStack spacing={{ base: 10, md: 14 }} align="stretch">
                <Box textAlign="center" maxW="4xl" mx="auto">
                    <Badge colorScheme={BRAND_SECONDARY_COLOR_SCHEME} mb={4} px={3} py={1} borderRadius="md">
                        Brand comparison guide
                    </Badge>
                    <Heading as="h1" size={{ base: 'xl', md: '2xl' }} color="white" mb={4}>
                        TeamWork Online Alternative for Sports Analytics Jobs
                    </Heading>
                    <Text color="gray.300" fontSize={{ base: 'md', md: 'lg' }}>
                        TeamWork Online is a real and useful sports jobs platform, but it is built for broad sports &
                        entertainment hiring rather than for analytics specialists first. If you want sports analytics,
                        data analyst, data scientist, business intelligence, performance analyst, or sports betting roles,
                        this page shows where TeamWork Online helps, where it slows you down, and when SportsJobs Online is
                        the better fit.
                    </Text>
                    <HStack justify="center" spacing={4} mt={6} flexWrap="wrap">
                        <Button as={NextLink} href="#analytics-openings" colorScheme={BRAND_PRIMARY_COLOR_SCHEME} rightIcon={<FaExternalLinkAlt />}>
                            See live analytics jobs
                        </Button>
                        <Button as={NextLink} href="/company-jobs" variant="outline" colorScheme={BRAND_SECONDARY_COLOR_SCHEME}>
                            Browse hiring companies
                        </Button>
                    </HStack>
                </Box>

                <Alert status="info" bg="gray.800" color="gray.100" borderRadius="md" borderWidth="1px" borderColor="gray.600">
                    <AlertIcon />
                    Not to be confused with Teamwork.com or Teamworks: this page is about TeamWork Online, the sports hiring platform.
                </Alert>

                <Box as="section" id="analytics-openings">
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
                                        Live Sports Analytics Jobs on SportsJobs Online
                                    </Heading>
                                    <Text color="gray.400" mt={2}>
                                        These are analytics-relevant openings pulled from the latest SportsJobs inventory.
                                        The inventory snapshot below is based on the most recent {sampleSize} jobs checked on {lastChecked}.
                                    </Text>
                                </Box>
                                <Button as={NextLink} href="/signup" colorScheme={BRAND_PRIMARY_COLOR_SCHEME} leftIcon={<FaLock />} flexShrink={0}>
                                    Unlock full access
                                </Button>
                            </Flex>

                            <VStack spacing={4} align="stretch">
                                {initialJobs.length === 0 ? (
                                    <Alert status="info" bg="gray.800" color="gray.100" borderRadius="md">
                                        <AlertIcon />
                                        No analytics-focused jobs are visible right now. The comparison content still applies, and new roles should appear as inventory refreshes.
                                    </Alert>
                                ) : (
                                    initialJobs.map((job) => {
                                        const usesDefaultLogo = isDefaultJobLogo(job.logo_permanent_url);
                                        return (
                                        <LinkBox
                                            as={Card}
                                            key={job.id}
                                            bg="gray.800"
                                            borderWidth="1px"
                                            borderColor="gray.600"
                                            borderRadius="md"
                                            _hover={{ borderColor: BRAND_SECONDARY_LIGHT, bg: 'gray.700' }}
                                        >
                                            <CardBody>
                                                <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                                                    <Image
                                                        src={getJobLogoSrc(job.logo_permanent_url)}
                                                        alt={`${job.company ?? 'Sports organization'} logo`}
                                                        width={usesDefaultLogo ? "104px" : "64px"}
                                                        height="64px"
                                                        objectFit="contain"
                                                        borderRadius="md"
                                                        bg="white"
                                                        p={1}
                                                        flexShrink={0}
                                                    />
                                                    <Box flex="1" minW={0}>
                                                        <Text color="gray.400" fontWeight="semibold">
                                                            {job.company ?? 'Sports organization'}
                                                        </Text>
                                                        <LinkOverlay as={NextLink} href={`/jobs/${job.id}`} prefetch={false}>
                                                            <Heading as="h3" size="md" color="white" mt={1}>
                                                                {job.title ?? 'Sports analytics role'}
                                                            </Heading>
                                                        </LinkOverlay>
                                                        <HStack spacing={2} wrap="wrap" mt={3}>
                                                            <Tag colorScheme={BRAND_SECONDARY_COLOR_SCHEME}>{getAnalyticsFocus(job)}</Tag>
                                                            <Tag colorScheme="blue">{job.remote_string || 'Work type not listed'}</Tag>
                                                            <Tag colorScheme="green">{job.sport_list || 'Sports'}</Tag>
                                                            <Tag colorScheme={job.salary ? BRAND_PRIMARY_COLOR_SCHEME : 'gray'}>
                                                                {job.salary || 'Pay not listed'}
                                                            </Tag>
                                                            <Tag colorScheme={job.days_ago_text === 'Posted Today' ? 'green' : 'gray'}>
                                                                {job.days_ago_text || 'Recently checked'}
                                                            </Tag>
                                                        </HStack>
                                                        <Text color="gray.300" fontSize="sm" mt={3}>
                                                            {job.location || job.country || 'Location not listed'} - {job.seniority || 'Seniority not listed'}
                                                        </Text>
                                                    </Box>
                                                </Flex>
                                            </CardBody>
                                        </LinkBox>
                                        );
                                    })
                                )}
                            </VStack>
                        </Box>

                        <VStack
                            w={{ base: '100%', lg: '360px' }}
                            spacing={4}
                            align="stretch"
                        >
                            <Box bg="gray.800" borderWidth="1px" borderColor="gray.600" borderRadius="md" p={5}>
                                <Heading as="h2" size="md" color="white" mb={3}>
                                    Inventory snapshot
                                </Heading>
                                <Stack spacing={4}>
                                    <Box>
                                        <Text color="gray.400" fontSize="sm" mb={2}>
                                            Analytics-relevant jobs in sample
                                        </Text>
                                        <Tag colorScheme={BRAND_PRIMARY_COLOR_SCHEME} size="lg">
                                            {inventory.total}
                                        </Tag>
                                    </Box>
                                    <Box>
                                        <Text color="gray.400" fontSize="sm" mb={2}>
                                            By function
                                        </Text>
                                        {renderCountTags(inventory.focusCounts, 'No function breakdown yet')}
                                    </Box>
                                    <Box>
                                        <Text color="gray.400" fontSize="sm" mb={2}>
                                            By work setting
                                        </Text>
                                        {renderCountTags(inventory.workModeCounts, 'No work setting listed')}
                                    </Box>
                                    <Box>
                                        <Text color="gray.400" fontSize="sm" mb={2}>
                                            By seniority
                                        </Text>
                                        {renderCountTags(inventory.seniorityCounts, 'No seniority listed')}
                                    </Box>
                                    <Box>
                                        <Text color="gray.400" fontSize="sm" mb={2}>
                                            By sport
                                        </Text>
                                        {renderCountTags(inventory.sportCounts, 'No sport breakdown yet')}
                                    </Box>
                                </Stack>
                            </Box>

                            <Box bg="gray.800" borderWidth="1px" borderColor="gray.600" borderRadius="md" p={5}>
                                <Heading as="h2" size="md" color="white" mb={3}>
                                    Sports analytics career updates
                                </Heading>
                                <Text color="gray.300" fontSize="sm" mb={4}>
                                    Get the free weekly newsletter with sports analytics jobs, internships, remote jobs, and practical search tips.
                                </Text>
                                <NewsletterSignupForm />
                            </Box>
                        </VStack>
                    </Flex>
                </Box>

                <Divider borderColor="gray.700" />

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        What TeamWork Online Is
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                        {explainerCards.map((item) => (
                            <Card key={item.title} bg="gray.800" borderColor="gray.600" borderWidth="1px" borderRadius="md">
                                <CardBody>
                                    <Heading as="h3" size="md" color="white" mb={3}>
                                        {item.title}
                                    </Heading>
                                    <Text color="gray.300" fontSize="sm">
                                        {item.text}
                                    </Text>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Box>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        Where TeamWork Online Is Strong
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                        {strengthCards.map((item) => (
                            <Box key={item.title} bg="gray.800" borderWidth="1px" borderColor="gray.600" borderRadius="md" p={5}>
                                <Heading as="h3" size="md" color="white" mb={3}>
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
                        Where TeamWork Online Falls Short for Sports Analytics Candidates
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                        {weaknessCards.map((item) => (
                            <Box key={item.title} bg="gray.800" borderWidth="1px" borderColor="gray.600" borderRadius="md" p={5}>
                                <Heading as="h3" size="md" color="white" mb={3}>
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
                        TeamWork Online vs SportsJobs Online
                    </Heading>
                    <Text color="gray.300" mb={5}>
                        The key difference is scale versus relevance. TeamWork Online is usually stronger for broad sports careers and employer discovery. SportsJobs Online is more useful when you already know you want sports analytics, business intelligence, performance analysis, data science, or sports betting work.
                    </Text>
                    <TableContainer borderWidth="1px" borderColor="gray.600" borderRadius="md">
                        <Table variant="simple">
                            <Thead bg="gray.800">
                                <Tr>
                                    <Th color="gray.300">Comparison point</Th>
                                    <Th color="gray.300">TeamWork Online</Th>
                                    <Th color="gray.300">SportsJobs Online</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {comparisonRows.map(([label, left, right]) => (
                                    <Tr key={label}>
                                        <Td color="white" fontWeight="semibold">{label}</Td>
                                        <Td color="gray.300">{left}</Td>
                                        <Td color="gray.300">{right}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        Better Ways to Find Sports Analytics Jobs
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                        {taxonomyCards.map((item) => (
                            <Card key={item.title} bg="gray.800" borderColor="gray.600" borderWidth="1px" borderRadius="md">
                                <CardBody>
                                    <Heading as="h3" size="md" color="white" mb={3}>
                                        {item.title}
                                    </Heading>
                                    <Text color="gray.300" fontSize="sm">
                                        {item.text}
                                    </Text>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Box>


                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        Observed Role Mix on Broad Sports Boards
                    </Heading>
                    <VStack spacing={4} align="stretch">
                        {observedRoleMixRows.map(([title, text]) => (
                            <Box key={title} bg="gray.800" borderWidth="1px" borderColor="gray.600" borderRadius="md" p={5}>
                                <Heading as="h3" size="sm" color="white" mb={2}>
                                    {title}
                                </Heading>
                                <Text color="gray.300" fontSize="sm">
                                    {text}
                                </Text>
                            </Box>
                        ))}
                    </VStack>
                </Box>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        FAQs About TeamWork Online and Sports Analytics Jobs
                    </Heading>
                    <VStack spacing={4} align="stretch">
                        {teamworkOnlineFaqItems.map((item) => (
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
                    borderColor={BRAND_SECONDARY}
                    borderRadius="md"
                    p={{ base: 6, md: 8 }}
                    textAlign="center"
                >
                    <Heading as="h2" size="lg" color="white" mb={3}>
                        Use the Right Board for the Role You Actually Want
                    </Heading>
                    <Text color="gray.300" maxW="3xl" mx="auto" mb={5}>
                        TeamWork Online is worth knowing if you want broad sports careers. If you want a faster route to sports analytics, remote jobs, internships, business intelligence, performance analyst, or data scientist openings, a more focused search will usually save time.
                    </Text>
                    <HStack justify="center" spacing={4} flexWrap="wrap">
                        <Button as={NextLink} href="/signup" colorScheme={BRAND_PRIMARY_COLOR_SCHEME} rightIcon={<FaExternalLinkAlt />}>
                            Start analytics job search
                        </Button>
                        <Button as={NextLink} href="/" variant="outline" colorScheme={BRAND_SECONDARY_COLOR_SCHEME}>
                            Browse all sports jobs
                        </Button>
                    </HStack>
                </Box>
            </VStack>
        </Container>
    );
}
