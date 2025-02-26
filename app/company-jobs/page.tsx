'use client';
import { useState, useEffect, useRef } from "react";
import { Box, Container, Heading, SimpleGrid, LinkBox, LinkOverlay, Text, Alert, AlertIcon } from '@chakra-ui/react';
import { fetchCompanies } from '@/lib/fetchCompanies';

// export async function generateMetadata() {
//     return {
//         title: 'Sports Industry Companies - SportsJobs Online',
//         description: 'Browse companies hiring in sports analytics, data science, and software engineering. Find your next career opportunity in the sports industry.',
//         keywords: 'sports companies, sports employers, sports industry jobs, sports analytics companies',
//     };
// }

interface Company {
    company: string;
    count: number;
}

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedCompanies = await fetchCompanies();
                if (Array.isArray(fetchedCompanies)) {
                    setCompanies(fetchedCompanies);
                    sessionStorage.setItem('companiesList', JSON.stringify({
                        data: fetchedCompanies,
                        timestamp: Date.now()
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
                setCompanies([]); // Set empty array on error
            }
        };

        fetchData();
    }, []);

    return (
        <Container maxW="container.xl" py={8}>
            <Heading as="h1" size="xl" mb={8} textAlign="center">
                Sports Industry Companies
            </Heading>
            <Text textAlign="center" mb={8}>
                Discover companies hiring in sports analytics, data science, and software engineering
            </Text>

            {!companies ? (
                <Alert status="error">
                    <AlertIcon />
                    Unable to load companies. Please try again later.
                </Alert>
            ) : companies.length === 0 ? (
                <Alert status="info">
                    <AlertIcon />
                    No companies found.
                </Alert>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {companies.map((company: Company) => (
                        <LinkBox
                            key={company.company}
                            p={5}
                            borderWidth="1px"
                            borderRadius="lg"
                            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                        >
                            <LinkOverlay href={`/company/${company.company.toLowerCase().replace(/\s+/g, '-')}`}>
                                <Heading size="md" mb={2}>{company.company}</Heading>
                                <Text fontSize="sm" color="gray.600">
                                    {company.count} historical position{company.count !== 1 ? 's' : ''}
                                </Text>
                            </LinkOverlay>
                        </LinkBox>
                    ))}
                </SimpleGrid>
            )}
        </Container>
    );
}