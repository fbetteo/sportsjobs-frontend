import { Box, Container, Heading, SimpleGrid, LinkBox, LinkOverlay, Text } from '@chakra-ui/react';
import { fetchCompanies } from '@/lib/fetchCompanies';

export async function generateMetadata() {
    return {
        title: 'Sports Industry Companies - SportsJobs Online',
        description: 'Browse companies hiring in sports analytics, data science, and software engineering. Find your next career opportunity in the sports industry.',
        keywords: 'sports companies, sports employers, sports industry jobs, sports analytics companies',
    };
}

interface Company {
    company: string;
    count: number;
}

export default async function CompaniesPage() {
    const companies = await fetchCompanies();

    return (
        <Container maxW="container.xl" py={8}>
            <Heading as="h1" size="xl" mb={8} textAlign="center">
                Sports Industry Companies
            </Heading>
            <Text textAlign="center" mb={8}>
                Discover companies hiring in sports analytics, data science, and software engineering
            </Text>

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
        </Container>
    );
}