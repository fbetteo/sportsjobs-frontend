import NextLink from 'next/link';
import {
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    Code,
    Container,
    Heading,
    HStack,
    Image,
    Link,
    SimpleGrid,
    Stack,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack
} from '@chakra-ui/react';
import { FaDownload } from 'react-icons/fa';
import { skillsReport } from '@/lib/skillsReportData';
import { BRAND_PRIMARY_COLOR_SCHEME, BRAND_SECONDARY, BRAND_SECONDARY_COLOR_SCHEME, BRAND_SECONDARY_LIGHT } from '@/lib/uiTokens';

type Skill = (typeof skillsReport.skills)[number];
type ReportRow = (typeof skillsReport.trend)[number] | (typeof skillsReport.comparison)[number];

const ALL_TEAMS = 'Soccer + US major leagues';
const SOCCER = 'Soccer';
const SOCCER_UK = 'Soccer, UK employers';
const US_LEAGUES = 'US major leagues';

const CSV_URL = '/statistics/sports-data-skills.csv';
const AI_CHART_URL = '/statistics/ai-vs-machine-learning-sports-jobs.png';
const SKILLS_CHART_URL = '/statistics/soccer-vs-us-leagues-skills.png';

const trendAll = skillsReport.trend.filter((row) => row.segment === ALL_TEAMS);
const firstHalf = trendAll[0];
const latestHalf = trendAll[trendAll.length - 1];
const comparison = (segment: string) => skillsReport.comparison.find((row) => row.segment === segment);
const soccer = comparison(SOCCER);
const soccerUk = comparison(SOCCER_UK);
const usLeagues = comparison(US_LEAGUES);
const comparisonRows = [soccer, soccerUk, usLeagues].filter((row): row is NonNullable<typeof row> => Boolean(row));

const pct = (value: number) => `${Math.round(value)}%`;
const share = (row: ReportRow | undefined, skill: Skill) => (row ? pct(row[skill]) : 'n/a');

const statCards = [
    {
        label: 'Job ads mentioning AI',
        value: share(latestHalf, 'AI'),
        help: `${latestHalf.period}, up from ${share(firstHalf, 'AI')} in ${firstHalf.period}`,
    },
    {
        label: 'Job ads mentioning machine learning',
        value: share(latestHalf, 'Machine learning'),
        help: `${latestHalf.period}, ${share(firstHalf, 'Machine learning')} in ${firstHalf.period}`,
    },
    {
        label: 'Soccer ads asking for Tableau / Power BI',
        value: share(soccer, 'Tableau / Power BI'),
        help: `vs ${share(usLeagues, 'Tableau / Power BI')} at MLB, NBA, NFL, and NHL employers`,
    },
    {
        label: 'Soccer ads asking for video analysis',
        value: share(soccer, 'Video analysis'),
        help: `vs ${share(usLeagues, 'Video analysis')} at MLB, NBA, NFL, and NHL employers`,
    },
];

const trendSkills: Skill[] = ['AI', 'Machine learning', 'Python', 'SQL', 'Tableau / Power BI'];

function StatsTable({ caption, children }: { caption: string; children: React.ReactNode }) {
    return (
        <TableContainer bg="gray.800" borderWidth="1px" borderColor="gray.600" borderRadius="md">
            <Table size="sm" variant="simple" color="gray.200">
                <TableCaption placement="top" textAlign="left" color="gray.400" mt={0} py={3}>
                    {caption}
                </TableCaption>
                {children}
            </Table>
        </TableContainer>
    );
}

export default function SportsAnalyticsStatisticsContent() {
    return (
        <Container maxW="7xl" py={{ base: 8, md: 12 }}>
            <VStack spacing={{ base: 10, md: 14 }} align="stretch">
                <Box textAlign="center" maxW="4xl" mx="auto">
                    <Badge colorScheme={BRAND_SECONDARY_COLOR_SCHEME} mb={4} px={3} py={1} borderRadius="md">
                        Data report · updated {skillsReport.updatedAt}
                    </Badge>
                    <Heading as="h1" size={{ base: 'xl', md: '2xl' }} color="white" mb={4}>
                        Sports Analytics Hiring Statistics: The Skills Teams Want
                    </Heading>
                    <Text color="gray.300" fontSize={{ base: 'md', md: 'lg' }}>
                        In {latestHalf.period}, {share(latestHalf, 'AI')} of data and analytics job ads at soccer clubs
                        and US major-league teams mentioned AI, up from {share(firstHalf, 'AI')} in {firstHalf.period}.
                        Machine learning went from {share(firstHalf, 'Machine learning')} to{' '}
                        {share(latestHalf, 'Machine learning')}. Soccer clubs ask for dashboards and video analysis far
                        more often than MLB, NBA, NFL, and NHL employers. The numbers come from {skillsReport.postings.toLocaleString('en-US')}{' '}
                        postings collected by SportsJobs Online in {skillsReport.period}.
                    </Text>
                </Box>

                <SimpleGrid as="section" columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                    {statCards.map((card) => (
                        <Card key={card.label} bg="gray.800" borderColor="gray.600" borderWidth="1px" borderRadius="md">
                            <CardBody>
                                <Stat>
                                    <StatLabel color="gray.400">{card.label}</StatLabel>
                                    <StatNumber color="white">{card.value}</StatNumber>
                                    <StatHelpText color="gray.300">{card.help}</StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={3}>
                        AI mentions have quadrupled. Machine learning has barely moved.
                    </Heading>
                    <Text color="gray.300" mb={5}>
                        Many of the new AI mentions ask analysts and engineers to use AI tools, such as coding agents or
                        AI-assisted analytics, rather than to build machine learning models. Sentences about AI in the
                        hiring process are excluded.
                    </Text>
                    <Image
                        src={AI_CHART_URL}
                        alt={`Line chart: share of sports data job ads mentioning AI rose from ${share(firstHalf, 'AI')} to ${share(latestHalf, 'AI')}; machine learning stayed near ${share(latestHalf, 'Machine learning')}.`}
                        borderRadius="md"
                        w="100%"
                        mb={5}
                    />
                    <StatsTable caption="Share of postings that mention each skill, by half-year">
                        <Thead>
                            <Tr>
                                <Th color="gray.400">Employers</Th>
                                <Th color="gray.400">Period</Th>
                                <Th color="gray.400" isNumeric>Postings</Th>
                                {trendSkills.map((skill) => (
                                    <Th key={skill} color="gray.400" isNumeric>{skill}</Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {skillsReport.trend.map((row) => (
                                <Tr key={`${row.segment}-${row.period}`}>
                                    <Td>{row.segment}</Td>
                                    <Td>{row.period}</Td>
                                    <Td isNumeric>{row.postings.toLocaleString('en-US')}</Td>
                                    {trendSkills.map((skill) => (
                                        <Td key={skill} isNumeric>{share(row, skill)}</Td>
                                    ))}
                                </Tr>
                            ))}
                        </Tbody>
                    </StatsTable>
                </Box>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={3}>
                        Soccer clubs want dashboards and video. US leagues don&apos;t.
                    </Heading>
                    <Text color="gray.300" mb={5}>
                        Python, SQL, R, and machine learning appear at similar rates in both groups. The difference is in
                        reporting and performance analysis: soccer postings ask for Tableau or Power BI{' '}
                        {share(soccer, 'Tableau / Power BI')} of the time, against {share(usLeagues, 'Tableau / Power BI')}{' '}
                        in US major leagues, and for video analysis tools such as Sportscode{' '}
                        {share(soccer, 'Video analysis')} of the time, against {share(usLeagues, 'Video analysis')}.
                    </Text>
                    <Image
                        src={SKILLS_CHART_URL}
                        alt={`Bar chart comparing skills in soccer and US major-league data job ads, ${skillsReport.period}.`}
                        borderRadius="md"
                        w="100%"
                        mb={5}
                    />
                    <StatsTable caption={`Share of postings that mention each skill, ${skillsReport.period}`}>
                        <Thead>
                            <Tr>
                                <Th color="gray.400">Skill</Th>
                                {comparisonRows.map((row) => (
                                    <Th key={row.segment} color="gray.400" isNumeric>
                                        {row.segment}
                                        <Text as="span" display="block" textTransform="none" fontWeight="normal">
                                            {row.postings.toLocaleString('en-US')} postings, {row.employers} employers
                                        </Text>
                                    </Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {skillsReport.skills.map((skill) => (
                                <Tr key={skill}>
                                    <Td>{skill}</Td>
                                    {comparisonRows.map((row) => (
                                        <Td key={row.segment} isNumeric>{share(row, skill)}</Td>
                                    ))}
                                </Tr>
                            ))}
                        </Tbody>
                    </StatsTable>
                </Box>

                <Box as="section" bg="gray.800" borderWidth="1px" borderColor={BRAND_SECONDARY} borderRadius="md" p={{ base: 5, md: 7 }}>
                    <Heading as="h2" size="lg" color="white" mb={3}>
                        Methodology
                    </Heading>
                    <Stack spacing={3} color="gray.300">
                        <Text>
                            SportsJobs Online collects data, analytics, and technology job postings from sports employers&apos;
                            career pages and applicant tracking systems. This report uses postings from soccer clubs, leagues,
                            and federations, and from MLB, NBA, NFL, and NHL teams and league offices.
                        </Text>
                        <Text>
                            A posting counts toward a skill when its description mentions it. &quot;AI&quot; means AI,
                            artificial intelligence, or LLMs; sentences about AI in the recruitment or interview process are
                            ignored. A role reposted by the same employer with the same title in the same half-year counts
                            once. Coverage before July 2025 was thinner, so the trend starts there. The latest half-year is
                            partial and ends on the last full month.
                        </Text>
                        <Text>
                            The data describes employers whose postings SportsJobs Online tracks, not every sports employer.
                            Shares are of data and analytics postings only, not of all jobs at those employers.
                        </Text>
                    </Stack>
                </Box>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={3}>
                        Download and Cite the Data
                    </Heading>
                    <Text color="gray.300" mb={4}>
                        Journalists and researchers can use the charts and numbers with a link to this page.
                    </Text>
                    <HStack spacing={3} flexWrap="wrap" mb={4}>
                        <Button as="a" href={CSV_URL} download leftIcon={<FaDownload />} colorScheme={BRAND_PRIMARY_COLOR_SCHEME}>
                            Data (CSV)
                        </Button>
                        <Button as="a" href={AI_CHART_URL} download leftIcon={<FaDownload />} variant="outline" colorScheme={BRAND_SECONDARY_COLOR_SCHEME}>
                            AI trend chart (PNG)
                        </Button>
                        <Button as="a" href={SKILLS_CHART_URL} download leftIcon={<FaDownload />} variant="outline" colorScheme={BRAND_SECONDARY_COLOR_SCHEME}>
                            Skills chart (PNG)
                        </Button>
                    </HStack>
                    <Text color="gray.400" fontSize="sm">
                        Suggested citation:{' '}
                        <Code colorScheme="gray">SportsJobs Online, Sports Analytics Hiring Statistics, sportsjobs.online/statistics</Code>
                    </Text>
                </Box>

                <Box as="section" bg="gray.800" borderWidth="1px" borderColor={BRAND_SECONDARY} borderRadius="md" p={{ base: 6, md: 8 }} textAlign="center">
                    <Heading as="h2" size="lg" color="white" mb={3}>
                        See the Jobs Behind the Numbers
                    </Heading>
                    <HStack justify="center" spacing={4} flexWrap="wrap">
                        <Button as={NextLink} href="/" colorScheme={BRAND_PRIMARY_COLOR_SCHEME}>
                            Browse sports analytics jobs
                        </Button>
                        <Link as={NextLink} href="/sports-analytics-salaries" color={BRAND_SECONDARY_LIGHT}>
                            Sports analytics salaries
                        </Link>
                    </HStack>
                </Box>
            </VStack>
        </Container>
    );
}
