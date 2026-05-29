'use client';

import NextLink from 'next/link';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    Container,
    Divider,
    Heading,
    HStack,
    Link,
    SimpleGrid,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import {
    dataScientistInterviewQuestions,
    interviewPrepCards,
} from '@/lib/sportsDataScientistInterviewContent';

export default function SportsDataScientistInterviewContent() {
    return (
        <Container maxW="7xl" py={{ base: 8, md: 12 }}>
            <VStack spacing={{ base: 10, md: 14 }} align="stretch">
                <Box>
                    <Button
                        as={NextLink}
                        href="/resources"
                        leftIcon={<FaArrowLeft />}
                        variant="ghost"
                        colorScheme="teal"
                        mb={5}
                    >
                        Back to Resources
                    </Button>
                    <Box textAlign="center" maxW="4xl" mx="auto">
                        <Badge colorScheme="teal" mb={4} px={3} py={1} borderRadius="md">
                            Interview prep
                        </Badge>
                        <Heading as="h1" size={{ base: 'xl', md: '2xl' }} color="white" mb={4}>
                            Sports Data Scientist Interview Questions
                        </Heading>
                        <Text color="gray.300" fontSize={{ base: 'md', md: 'lg' }}>
                            Prepare for sports data science, analytics, betting, team, league, media, and sports
                            technology interviews with practical questions and answer directions. The goal is not to
                            memorize scripts, but to show how you think through data, decisions, and sports context.
                        </Text>
                    </Box>
                </Box>

                <SimpleGrid as="section" columns={{ base: 1, md: 3 }} spacing={5}>
                    {interviewPrepCards.map((item) => (
                        <Card key={item.title} bg="gray.800" borderColor="gray.600" borderWidth="1px" borderRadius="md">
                            <CardBody>
                                <Heading as="h2" size="md" color="white" mb={3}>
                                    {item.title}
                                </Heading>
                                <Text color="gray.300" fontSize="sm">
                                    {item.text}
                                </Text>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>

                <Box as="section">
                    <Heading as="h2" size="lg" color="white" mb={3}>
                        Interview Question Bank
                    </Heading>
                    <Text color="gray.300" mb={6} maxW="4xl">
                        Use these prompts to practice concise, evidence-based answers. The best responses usually include
                        a real example, a tradeoff you considered, and how the work helped a stakeholder make a better
                        decision.
                    </Text>

                    <Accordion allowMultiple>
                        <VStack spacing={4} align="stretch">
                            {dataScientistInterviewQuestions.map((item, index) => (
                                <AccordionItem
                                    key={item.question}
                                    borderWidth="1px"
                                    borderColor="gray.600"
                                    borderRadius="md"
                                    bg="gray.800"
                                    overflow="hidden"
                                >
                                    <h3>
                                        <AccordionButton
                                            py={5}
                                            px={{ base: 4, md: 5 }}
                                            _hover={{ bg: 'gray.700' }}
                                            _expanded={{ bg: 'gray.700' }}
                                        >
                                            <HStack flex="1" spacing={4} textAlign="left" align="start">
                                                <Badge colorScheme="purple" flexShrink={0}>
                                                    {index + 1}
                                                </Badge>
                                                <Heading as="span" size="sm" color="white" lineHeight="1.4">
                                                    {item.question}
                                                </Heading>
                                            </HStack>
                                            <AccordionIcon color="teal.300" />
                                        </AccordionButton>
                                    </h3>
                                    <AccordionPanel px={{ base: 4, md: 5 }} pb={5}>
                                        <Stack spacing={4}>
                                            <Box>
                                                <Text color="teal.300" fontWeight="semibold" mb={2}>
                                                    What they are testing
                                                </Text>
                                                <Text color="gray.300">{item.testing}</Text>
                                            </Box>
                                            <Box>
                                                <Text color="teal.300" fontWeight="semibold" mb={2}>
                                                    Sample answer direction
                                                </Text>
                                                <Text color="gray.300">{item.answer}</Text>
                                            </Box>
                                        </Stack>
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </VStack>
                    </Accordion>
                </Box>

                <Divider borderColor="gray.700" />

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
                        Turn Interview Prep Into Real Applications
                    </Heading>
                    <Text color="gray.300" maxW="3xl" mx="auto" mb={5}>
                        Practice with the roles you actually want. Compare these questions against live sports data
                        scientist, analyst, betting, business intelligence, and sports technology jobs.
                    </Text>
                    <HStack justify="center" spacing={4} flexWrap="wrap">
                        <Button as={NextLink} href="/" colorScheme="purple" rightIcon={<FaExternalLinkAlt />}>
                            Browse sports data science jobs
                        </Button>
                        <Button as={NextLink} href="/sports-analytics-internships" variant="outline" colorScheme="teal">
                            See sports analytics internships
                        </Button>
                    </HStack>
                    <Text color="gray.400" fontSize="sm" mt={5}>
                        Also useful with our{' '}
                        <Link as={NextLink} href="/sports-analytics-salaries" color="teal.300">
                            sports analytics salary guide
                        </Link>
                        .
                    </Text>
                </Box>
            </VStack>
        </Container>
    );
}
