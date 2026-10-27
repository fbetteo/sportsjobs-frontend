'use client';

import { useEffect, useState } from 'react';
import {
    Badge,
    Box,
    Card,
    CardBody,
    Heading,
    ListItem,
    SimpleGrid,
    Stack,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    UnorderedList,
} from '@chakra-ui/react';
import NewsletterSignupForm from '@/components/NewsletterSignupForm';
import { isNewsletterSubscribed } from '@/lib/newsletterPopup';
import { salaryReport, type SalaryReportRow } from '@/lib/salaryReportData';
import { BRAND_SECONDARY, BRAND_SECONDARY_COLOR_SCHEME } from '@/lib/uiTokens';

const formatK = (value: number) => `$${Math.round(value / 1000)}K`;

const formatMonth = (isoDate: string) =>
    new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

const periodLabel = `${formatMonth(salaryReport.periodStart)} to ${formatMonth(salaryReport.periodEnd)}`;

const groupRow = (group: string) => salaryReport.byGroup.find((row) => row.group === group);

const teamsMedian = groupRow('Teams, leagues & orgs')?.median ?? 0;
const otherMedians = salaryReport.byGroup.filter((row) => row.group !== 'Teams, leagues & orgs').map((row) => row.median);
const teamsGap = otherMedians.length ? Math.min(...otherMedians) - teamsMedian : 0;
const bettingCompanies = groupRow('Betting & fantasy')?.companies;

// Segments as rows, employer groups as columns; each cell shows the median and the middle 50%.
function SegmentTable({ segmentLabel, rows }: { segmentLabel: string; rows: readonly SalaryReportRow[] }) {
    const segments = Array.from(new Set(rows.map((row) => row.segment)));
    return (
        <TableContainer borderWidth="1px" borderColor="gray.600" borderRadius="md">
            <Table variant="simple" size="sm">
                <Thead bg="gray.800">
                    <Tr>
                        <Th color="gray.300">{segmentLabel}</Th>
                        {salaryReport.groups.map((group) => (
                            <Th key={group} color="gray.300">{group}</Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {segments.map((segment) => (
                        <Tr key={segment}>
                            <Td color="white" fontWeight="semibold">{segment}</Td>
                            {salaryReport.groups.map((group) => {
                                const row = rows.find((r) => r.group === group && r.segment === segment);
                                return (
                                    <Td key={group}>
                                        {row ? (
                                            <>
                                                <Text color="white" fontWeight="semibold">{formatK(row.median)}</Text>
                                                <Text color="gray.400" fontSize="xs">
                                                    {formatK(row.p25)}-{formatK(row.p75)}
                                                </Text>
                                            </>
                                        ) : (
                                            <Text color="gray.500">Not enough data</Text>
                                        )}
                                    </Td>
                                );
                            })}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}

export default function SalaryReportSection() {
    const [unlocked, setUnlocked] = useState(false);

    useEffect(() => {
        setUnlocked(isNewsletterSubscribed());
    }, []);

    return (
        <Box as="section" id="salary-report">
            <Badge colorScheme={BRAND_SECONDARY_COLOR_SCHEME} mb={3} px={3} py={1} borderRadius="md">
                SportsJobs data
            </Badge>
            <Heading as="h2" size="lg" color="white" mb={3}>
                What Sports Analytics Jobs Actually Pay
            </Heading>
            <Text color="gray.300" mb={6}>
                Median base pay from {salaryReport.postings.toLocaleString('en-US')} U.S. job postings with advertised
                pay, published on SportsJobs Online by {salaryReport.companies} sports employers from {periodLabel}.
                {teamsGap > 0 && (
                    <> Teams and leagues pay about {formatK(teamsGap)} less than betting and sports tech companies.</>
                )}
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={8}>
                {salaryReport.byGroup.map((row) => (
                    <Card key={row.group} bg="gray.800" borderColor="gray.600" borderWidth="1px" borderRadius="md">
                        <CardBody>
                            <Stat>
                                <StatLabel color="gray.400">{row.group}</StatLabel>
                                <StatNumber color="white">{formatK(row.median)}</StatNumber>
                                <StatHelpText color="gray.300" mb={0}>
                                    Middle 50%: {formatK(row.p25)}-{formatK(row.p75)}
                                    <br />
                                    {row.postings} postings, {row.companies} employers
                                </StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>

            <Heading as="h3" size="md" color="white" mb={3}>
                Median Pay by Role and Employer Type
            </Heading>
            <SegmentTable segmentLabel="Role" rows={salaryReport.byGroupJobArea} />

            <Box mt={8}>
                {unlocked ? (
                    <Stack spacing={8}>
                        <Box>
                            <Heading as="h3" size="md" color="white" mb={3}>
                                Mid-Level vs Senior Pay
                            </Heading>
                            <SegmentTable segmentLabel="Level" rows={salaryReport.byGroupLevel} />
                        </Box>
                        <Box>
                            <Heading as="h3" size="md" color="white" mb={3}>
                                Remote vs Not Remote
                            </Heading>
                            <SegmentTable segmentLabel="Work setup" rows={salaryReport.byGroupRemote} />
                        </Box>
                    </Stack>
                ) : (
                    <Box bg="gray.800" borderWidth="1px" borderColor={BRAND_SECONDARY} borderRadius="md" p={{ base: 5, md: 7 }}>
                        <Heading as="h3" size="md" color="white" mb={3}>
                            Unlock the Full Breakdown
                        </Heading>
                        <Text color="gray.300" mb={2}>
                            Join the free weekly newsletter to see on this page:
                        </Text>
                        <UnorderedList color="gray.300" mb={4} spacing={1}>
                            <ListItem>Mid-level vs senior pay at teams, betting, and sports tech companies</ListItem>
                            <ListItem>How much more remote roles pay, by employer type</ListItem>
                        </UnorderedList>
                        <NewsletterSignupForm source="salary-report" onSubscribed={() => setUnlocked(true)} />
                    </Box>
                )}
            </Box>

            <Box mt={8}>
                <Heading as="h3" size="sm" color="white" mb={2}>
                    How These Numbers Are Calculated
                </Heading>
                <UnorderedList color="gray.400" fontSize="sm" spacing={1}>
                    <ListItem>
                        Each posting counts once: the midpoint of its advertised pay range, or the single figure when no
                        range is given. Base pay only, without bonus or equity.
                    </ListItem>
                    <ListItem>Reposts of the same role are removed. Hourly, non-USD, and implausible values are dropped.</ListItem>
                    <ListItem>
                        Employers are grouped by company: teams, leagues, federations, and college athletics; sportsbooks,
                        fantasy, and betting data providers; and sports technology, media, ticketing, wearables, and gaming.
                    </ListItem>
                    <ListItem>
                        Level comes from the job title. Cells with fewer than 20 postings or 5 employers are not shown.
                        {bettingCompanies && <> The betting group comes from {bettingCompanies} employers, so a few large companies weigh heavily.</>}
                    </ListItem>
                    <ListItem>Last updated {formatMonth(salaryReport.updatedAt)}.</ListItem>
                </UnorderedList>
            </Box>
        </Box>
    );
}
