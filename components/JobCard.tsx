// app/components/JobCard.tsx
import { Box, Heading, Text, Flex, Tag, Image, VStack, HStack, Divider, Link as ChakraLink } from "@chakra-ui/react";
import Link from 'next/link';

interface JobCardProps {
    id: string;
    title: string;
    company: string;
    salary: string;
    location: string;
    logo_permanent_url: string;
    description: string;
    seniority: string;
    days_ago_text: string;
    remote_string: string;
}

export function JobCard({ id, title, company, salary, location, logo_permanent_url, description, seniority, days_ago_text, remote_string }: JobCardProps) {
    return (
        <Link href={`/jobs/${id}`} passHref>
            <ChakraLink _hover={{ textDecoration: 'none' }}>
                <Box
                    p={5}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="md"
                    width="100%"
                    maxW="800px"
                    margin="auto"
                    bg="gray.300"
                    color="black"
                >
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        align="center"
                        mb={4}
                        textAlign={{ base: "center", md: "left" }}
                    >
                        {logo_permanent_url && (
                            <Image
                                src={logo_permanent_url}
                                alt={`${title} logo`}
                                boxSize="80px"
                                objectFit="contain"
                                mr={{ base: 0, md: 4 }}
                                mb={{ base: 4, md: 0 }}
                                alignSelf={{ base: "center", md: "flex-start" }}
                            />
                        )}
                        <Box flex="1">
                            <Text fontSize="md" color="gray.700">{company}</Text>
                            <Heading fontSize="xl">{title}</Heading>
                        </Box>
                    </Flex>
                    <Divider mb={4} />
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        justifyContent="space-between"
                        alignItems="flex-start"
                    >
                        <HStack
                            spacing={8}
                            wrap={{ base: "wrap", md: "nowrap" }}
                            justify={{ base: "center", md: "flex-start" }}
                            width="100%"
                        >
                            <VStack align="start" spacing={1} width={{ base: "100%", md: "auto" }}>
                                <Text fontWeight="bold">Location</Text>
                                <Text>{location}</Text>
                            </VStack>
                            <VStack align="start" spacing={1} width={{ base: "100%", md: "auto" }}>
                                <Text fontWeight="bold">Remote</Text>
                                <Text>{remote_string}</Text>
                            </VStack>
                            <VStack align="start" spacing={1} width={{ base: "100%", md: "auto" }}>
                                <Text fontWeight="bold">Salary</Text>
                                <Text>{salary || "-"}</Text>
                            </VStack>
                            <VStack align="start" spacing={1} width={{ base: "100%", md: "auto" }}>
                                <Text fontWeight="bold">Seniority</Text>
                                <Text>{seniority}</Text>
                            </VStack>
                        </HStack>
                        <Tag colorScheme="green" size="lg" mt={{ base: 4, md: 0 }} alignSelf={{ base: "center", md: "flex-end" }}>
                            {days_ago_text}
                        </Tag>
                    </Flex>
                </Box>
            </ChakraLink>
        </Link>
    );
}