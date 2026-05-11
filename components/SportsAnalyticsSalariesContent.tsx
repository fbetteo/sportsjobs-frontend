import NextLink from 'next/link';
import {
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    Container,
    Divider,
    Grid,
    Heading,
    HStack,
    Link,
    SimpleGrid,
    Stack,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
} from '@chakra-ui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { salaryFaqItems } from '@/lib/sportsAnalyticsSalariesContent';

const experienceRows = [
    ['Intern / apprentice', '$15-$30/hour', '$31K-$62K annualized', 'Student roles, part-time internships, seasonal analyst support'],
    ['Entry-level', '$50K-$75K', '$24-$36/hour', 'Junior sports analyst, sports data analyst, BI analyst, research assistant'],
    ['Mid-level', '$75K-$115K', '$36-$55/hour', 'Analyst II, data analyst, performance analyst, analytics engineer'],
    ['Senior level', '$110K-$165K', '$53-$79/hour', 'Senior analyst, senior data scientist, lead BI analyst, modeling specialist'],
    ['Manager / director', '$140K-$225K+', '$67-$108+/hour', 'Analytics manager, director of analytics, director of strategy, head of data'],
];

const roleRows = [
    ['Sports analyst', '$55K-$95K', 'Reporting, scouting support, research, game or business analysis'],
    ['Sports data analyst', '$65K-$110K', 'SQL, dashboards, data cleaning, team or business performance reporting'],
    ['Sports data scientist', '$95K-$165K+', 'Machine learning, predictive modeling, experimentation, product analytics'],
    ['Performance analyst', '$55K-$105K', 'Player performance, video, tracking data, coaching staff support'],
    ['BI / business analytics', '$70K-$125K', 'Fan engagement, ticketing, sponsorships, CRM, revenue analytics'],
    ['Betting analytics', '$90K-$180K+', 'Sports betting models, pricing, risk, trading, fantasy sports, forecasting'],
];

const industryCards = [
    {
        title: 'Professional Sports Teams',
        range: '$55K-$140K+',
        text: 'Team-side roles can be the most competitive because many applicants want to work close to players, coaches, and leagues. Entry-level salaries may trail broader tech, but senior performance, strategy, and director roles can become highly paid.',
    },
    {
        title: 'Sports Technology Companies',
        range: '$85K-$170K+',
        text: 'Sports technology companies usually pay closer to software and data-market compensation. Roles tied to data platforms, wearable technology, computer vision, fan products, and predictive modeling tend to have stronger upside.',
    },
    {
        title: 'Media and Broadcasting',
        range: '$65K-$130K',
        text: 'Media and broadcasting roles often combine data analysis with storytelling, audience analytics, content strategy, and production. Compensation rises when the role owns business impact or specialized data products.',
    },
    {
        title: 'Sports Betting and Fantasy Sports',
        range: '$90K-$190K+',
        text: 'Sports betting and fantasy sports typically pay well for quantitative skills, modeling, pricing, risk, and experimentation. These roles often compete with finance, insurance, gaming, and technology employers for talent.',
    },
    {
        title: 'College Athletics',
        range: '$45K-$95K',
        text: 'College athletics and related organizations can be a strong entry point, especially for performance analytics, recruiting, operations, and fan engagement. Pay varies widely by school, conference, and department budget.',
    },
];

const locationCards = [
    {
        title: 'California',
        text: 'California roles, especially around Los Angeles and sports technology hubs, often sit near the top of the range. Cost of living matters, so compare base pay with rent, taxes, commute, and onsite expectations.',
    },
    {
        title: 'New York',
        text: 'New York can pay strongly for media, broadcasting, league office, betting, and business analytics roles. High salaries may still feel different after cost-of-living adjustments.',
    },
    {
        title: 'Texas',
        text: 'Texas has a mix of team, media, betting, and sports technology roles with a lower cost-of-living profile than many coastal markets. Dallas, Austin, and Houston can be attractive for mid-level analysts.',
    },
    {
        title: 'Florida',
        text: 'Florida roles span professional teams, college athletics, sports media, health and fitness, and event organizations. Pay ranges can vary sharply by employer type and whether the role is technical or operational.',
    },
    {
        title: 'Remote Roles',
        text: 'Remote sports analytics roles can match city-based pay when the employer hires nationally. Remote performance roles are less common than remote business analytics, BI, data science, betting, and media roles.',
    },
    {
        title: 'Chicago',
        text: 'Chicago can offer a useful middle ground across teams, media, data, and business analytics roles. Compare salary bands against remote options and nearby Midwest cost-of-living advantages.',
    },
];

const skillCards = [
    ['Python, R, and SQL', 'These are the core technical tools behind most sports data analyst and sports data scientist roles. SQL plus one analysis language is usually the strongest baseline.'],
    ['BI tools and dashboards', 'Tableau, Power BI, Looker, and similar BI tools matter for fan engagement, ticketing, sponsorship, operations, and executive reporting roles.'],
    ['Machine learning', 'Machine learning, predictive modeling, forecasting, and experimentation push roles toward higher data science salary bands, especially in betting, fantasy sports, and sports technology.'],
    ['Sports specialization', 'Knowing the sport, data source, league context, and decision-maker matters. A technically good model is worth more when it answers a coach, product, trading, or revenue question.'],
    ['Communication', 'Analysts who can explain uncertainty, tradeoffs, and recommendations to coaches, executives, product managers, or nontechnical stakeholders usually progress faster.'],
    ['Education and credentials', 'A bachelor\'s degree is common. A master\'s degree or certification can help, but portfolio evidence, internships, and job-ready projects usually carry more weight.'],
];

export default function SportsAnalyticsSalariesContent() {
    return (
        <Container maxW="7xl" py={{ base: 8, md: 12 }}>
            <VStack spacing={{ base: 10, md: 14 }} align="stretch">
                <Box textAlign="center" maxW="4xl" mx="auto">
                    <Badge colorScheme="teal" mb={4} px={3} py={1} borderRadius="md">
                        Salary guide
                    </Badge>
                    <Heading as="h1" size={{ base: 'xl', md: '2xl' }} color="white" mb={4}>
                        Sports Analytics Salaries in the United States
                    </Heading>
                    <Text color="gray.300" fontSize={{ base: 'md', md: 'lg' }}>
                        Sports analytics salaries in the United States usually fall between $50K and $165K for individual
                        contributor roles, with manager and director compensation often reaching $140K-$225K or more.
                        The biggest differences come from role type, experience, location, and industry: professional
                        sports teams, sports technology, media and broadcasting, college athletics, and sports betting
                        employers do not all pay the same way.
                    </Text>
                </Box>

                <SimpleGrid as="section" columns={{ base: 1, md: 4 }} spacing={4}>
                    <Card bg="gray.800" borderColor="gray.600" borderWidth="1px" borderRadius="md">
                        <CardBody>
                            <Stat>
                                <StatLabel color="gray.400">Typical annual salary</StatLabel>
                                <StatNumber color="white">$50K-$165K</StatNumber>
                                <StatHelpText color="gray.300">Most analyst through senior IC roles</StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                    <Card bg="gray.800" borderColor="gray.600" borderWidth="1px" borderRadius="md">
                        <CardBody>
                            <Stat>
                                <StatLabel color="gray.400">Average hourly equivalent</StatLabel>
                                <StatNumber color="white">$24-$79/hr</StatNumber>
                                <StatHelpText color="gray.300">Based on 2,080 work hours</StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                    <Card bg="gray.800" borderColor="gray.600" borderWidth="1px" borderRadius="md">
                        <CardBody>
                            <Stat>
                                <StatLabel color="gray.400">Higher-end IC roles</StatLabel>
                                <StatNumber color="white">$110K-$190K+</StatNumber>
                                <StatHelpText color="gray.300">Data science, betting, senior BI</StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                    <Card bg="gray.800" borderColor="gray.600" borderWidth="1px" borderRadius="md">
                        <CardBody>
                            <Stat>
                                <StatLabel color="gray.400">Manager / director</StatLabel>
                                <StatNumber color="white">$140K-$225K+</StatNumber>
                                <StatHelpText color="gray.300">Leadership and strategy ownership</StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                </SimpleGrid>

                <Box as="section" bg="gray.800" borderWidth="1px" borderColor="teal.500" borderRadius="md" p={{ base: 5, md: 7 }}>
                    <Heading as="h2" size="lg" color="white" mb={3}>
                        Methodology and Salary Sources
                    </Heading>
                    <Stack spacing={3} color="gray.300">
                        <Text>
                            Sports analytics is not a single official salary category, so this guide uses title clusters
                            instead of pretending every role maps to one number. Ranges are directional and combine common
                            public salary bands for sports analyst, sports data analyst, data scientist, BI, performance
                            analyst, and betting analytics roles with broader U.S. labor benchmarks.
                        </Text>
                        <Text>
                            For external context, the U.S. Bureau of Labor Statistics reported May 2024 median pay of
                            $112,590 for data scientists, $91,290 for operations research analysts, and $76,950 for market
                            research analysts. Sports-specific roles can land below or above those benchmarks depending on
                            competition, employer budget, location, and technical depth.
                        </Text>
                        <HStack spacing={3} flexWrap="wrap">
                            <Link href="https://www.bls.gov/ooh/math/data-scientists.htm" isExternal color="teal.300">
                                BLS Data Scientists
                            </Link>
                            <Link href="https://www.bls.gov/ooh/math/operations-research-analysts.htm" isExternal color="teal.300">
                                BLS Operations Research Analysts
                            </Link>
                            <Link href="https://www.bls.gov/ooh/business-and-financial/market-research-analysts.htm" isExternal color="teal.300">
                                BLS Market Research Analysts
                            </Link>
                        </HStack>
                    </Stack>
                </Box>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        Average Sports Analytics Salary in the United States
                    </Heading>
                    <Stack spacing={4} color="gray.300">
                        <Text>
                            A practical benchmark for sports analytics salary planning is $65K-$115K for many full-time
                            analyst roles, with entry-level sports analyst jobs starting closer to $50K-$75K and senior data
                            science or betting analytics roles moving into the $110K-$190K range. The annual salary number
                            can be misleading unless you know the title family: a sports data analyst supporting dashboards,
                            a performance analyst supporting coaches, and a machine learning specialist in sports betting
                            may all appear under the sports analytics umbrella.
                        </Text>
                        <Text>
                            Hourly rate comparisons help with internships, contractor roles, and seasonal jobs. A $50K
                            annual salary is roughly $24 per hour, $90K is about $43 per hour, and $165K is about $79 per
                            hour before bonus, equity, benefits, taxes, and cost-of-living adjustments.
                        </Text>
                    </Stack>
                </Box>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        Sports Analytics Salary by Experience Level
                    </Heading>
                    <TableContainer borderWidth="1px" borderColor="gray.600" borderRadius="md">
                        <Table variant="simple">
                            <Thead bg="gray.800">
                                <Tr>
                                    <Th color="gray.300">Career stage</Th>
                                    <Th color="gray.300">Typical salary</Th>
                                    <Th color="gray.300">Hourly equivalent</Th>
                                    <Th color="gray.300">Common titles</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {experienceRows.map(([stage, salary, hourly, titles]) => (
                                    <Tr key={stage}>
                                        <Td color="white" fontWeight="semibold">{stage}</Td>
                                        <Td color="gray.300">{salary}</Td>
                                        <Td color="gray.300">{hourly}</Td>
                                        <Td color="gray.300">{titles}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        Sports Analytics Salary by Role
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {roleRows.map(([title, range, text]) => (
                            <Card key={title} bg="gray.800" borderColor="gray.600" borderWidth="1px" borderRadius="md">
                                <CardBody>
                                    <HStack justify="space-between" align="start" spacing={4}>
                                        <Heading as="h3" size="sm" color="white">
                                            {title}
                                        </Heading>
                                        <Tag colorScheme="purple" flexShrink={0}>{range}</Tag>
                                    </HStack>
                                    <Text color="gray.300" fontSize="sm" mt={3}>
                                        {text}
                                    </Text>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Box>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        Sports Analytics Salary by Industry and Employer Type
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                        {industryCards.map((item) => (
                            <Card key={item.title} bg="gray.800" borderColor="gray.600" borderWidth="1px" borderRadius="md">
                                <CardBody>
                                    <Tag colorScheme="teal" mb={3}>{item.range}</Tag>
                                    <Heading as="h3" size="md" color="white" mb={2}>
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
                        Sports Analytics Salary by Location
                    </Heading>
                    <Text color="gray.300" mb={5}>
                        Location still matters, even for remote roles. California, New York, Texas, Florida, Los Angeles,
                        Chicago, and other sports markets can each produce very different compensation conversations.
                        Compare salary bands against cost of living, onsite requirements, commute time, and whether the
                        role is team-side, media-side, betting-side, or sports technology.
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        {locationCards.map((item) => (
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
                        What Increases Sports Analytics Salaries
                    </Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        {skillCards.map(([title, text]) => (
                            <Box key={title} bg="gray.800" borderWidth="1px" borderColor="gray.600" borderRadius="md" p={5}>
                                <Heading as="h3" size="sm" color="white" mb={2}>
                                    {title}
                                </Heading>
                                <Text color="gray.300" fontSize="sm">
                                    {text}
                                </Text>
                            </Box>
                        ))}
                    </Grid>
                </Box>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        Salary Growth and Career Outlook
                    </Heading>
                    <Stack spacing={4} color="gray.300">
                        <Text>
                            Five-year earning potential is strongest for analysts who move from reporting into ownership:
                            owning a model, a data product, a decision workflow, or a revenue outcome. A junior analyst who
                            starts at $60K can plausibly move toward $90K-$120K by becoming a reliable mid-level sports data
                            analyst, and toward $130K-$180K by specializing in data science, predictive modeling, analytics
                            engineering, betting, or leadership.
                        </Text>
                        <Text>
                            Demand trends are positive because teams, leagues, sportsbooks, media companies, health and
                            fitness companies, and fan engagement platforms all need better data analysis. AI and automation
                            will reduce some manual reporting work, but it should increase the premium for analysts who can
                            validate data, frame good questions, interpret model output, and communicate decisions clearly.
                        </Text>
                    </Stack>
                </Box>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={4}>
                        Frequently Asked Questions About Sports Analytics Salaries
                    </Heading>
                    <VStack spacing={4} align="stretch">
                        {salaryFaqItems.map((item) => (
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

                <Box as="section" bg="gray.800" borderWidth="1px" borderColor="teal.500" borderRadius="md" p={{ base: 6, md: 8 }} textAlign="center">
                    <Heading as="h2" size="lg" color="white" mb={3}>
                        Compare Salaries Against Real Sports Analytics Jobs
                    </Heading>
                    <Text color="gray.300" maxW="3xl" mx="auto" mb={5}>
                        Use salary ranges as a starting point, then compare against live roles, employer type, location,
                        and the exact skills requested in the posting.
                    </Text>
                    <HStack justify="center" spacing={4} flexWrap="wrap">
                        <Button as={NextLink} href="/" colorScheme="purple" rightIcon={<FaExternalLinkAlt />}>
                            Browse sports analytics jobs
                        </Button>
                        <Button as={NextLink} href="/sports-analytics-internships" variant="outline" colorScheme="teal">
                            See internships
                        </Button>
                    </HStack>
                </Box>
            </VStack>
        </Container>
    );
}
