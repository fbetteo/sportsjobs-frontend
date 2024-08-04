// app/components/JobCard.tsx
import { Box, Heading, Text, Flex, Tag, Image, VStack, HStack, Divider, Link as ChakraLink } from "@chakra-ui/react";
import Link from 'next/link';

interface JobCardProps {
    id: string;
    title: string;
    salary: string;
    location: string;
    logo_permanent_url: string;
    description: string;
    seniority: string;
    days_ago_text: string;
    remote_string: string;
}

export function JobCard({ id, title, salary, location, logo_permanent_url, description, seniority, days_ago_text, remote_string }: JobCardProps) {
    return (
        <Link href={`/jobs/${id}`} passHref>
            <ChakraLink _hover={{ textDecoration: 'none' }}>
                <Box
                    p={5}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="md"
                    width={{ base: "100%", md: "80%", lg: "60%" }}
                    margin="auto"
                    bg="white"
                >
                    <Flex direction={{ base: "column", md: "row" }} align="center" mb={4}>
                        {logo_permanent_url && <Image src={logo_permanent_url} alt={`${title} logo`} boxSize="50px" objectFit="contain" mr={{ base: 0, md: 4 }} mb={{ base: 4, md: 0 }} />}
                        <Box textAlign={{ base: "center", md: "left" }} flex="1">
                            <Heading fontSize="xl">{title}</Heading>
                            {/* <Text fontSize="md" color="gray.500">{description}</Text> */}
                        </Box>
                    </Flex>
                    <Divider mb={4} />
                    <Flex justifyContent="space-between" alignItems="center">
                        <HStack spacing={4}>
                            <VStack align="start">
                                <Text fontWeight="bold">Location</Text>
                                <Text>{location}</Text>
                            </VStack>
                            <VStack align="start">
                                <Text fontWeight="bold">Remote</Text>
                                <Text>{remote_string}</Text>
                            </VStack>
                            <VStack align="start">
                                <Text fontWeight="bold">Salary</Text>
                                <Text>{salary || "-"}</Text>
                            </VStack>
                            <VStack align="start">
                                <Text fontWeight="bold">Seniority</Text>
                                <Text>{seniority}</Text>
                            </VStack>
                        </HStack>
                        <Tag colorScheme="green" size="lg">{days_ago_text}</Tag>
                    </Flex>
                </Box>
            </ChakraLink>
        </Link>
    );
}