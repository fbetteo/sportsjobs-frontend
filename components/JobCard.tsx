import { Box, Heading, Text, Flex, Tag, Image, VStack, HStack, Divider, Link as ChakraLink, Badge } from "@chakra-ui/react";
import Link from 'next/link';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import { encodeJobId } from '@/utils/jobIdEncoder';

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
    isFeatured?: boolean;
    user: UserProfile | undefined;
    scrollToPricing: () => void;
    url?: string;
}

export function JobCard({
    id,
    title,
    company,
    salary,
    location,
    logo_permanent_url,
    description,
    seniority,
    days_ago_text,
    remote_string,
    isFeatured,
    user,
    scrollToPricing,
    url
}: JobCardProps) {
    // Only encode IDs greater than this threshold
    const ENCODING_START_ID = 7485; // Adjust this number as needed

    const shouldEncodeId = () => {
        const numericId = parseInt(id, 10);
        return numericId >= ENCODING_START_ID;
    };

    const displayId = shouldEncodeId() ? encodeJobId(parseInt(id, 10)) : id;

    return (
        <Link href={`/jobs/${displayId}`} passHref>
            <ChakraLink _hover={{ textDecoration: 'none' }}
                onClick={(e) => {
                    // if (!user && !isFeatured) {
                    //     e.preventDefault(); // Prevent link navigation if the user is not logged in
                    //     scrollToPricing();
                    // }
                }}
            >
                {/* Use motion.div from framer-motion for subtle hover effects */}
                <Box
                    // as={motion.div}
                    p={5}
                    shadow="md"
                    borderWidth={isFeatured ? "2px" : "1px"}
                    borderRadius="lg"
                    width="100%"
                    // maxW="800px"
                    margin="auto"
                    bg={isFeatured ? "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" : "gray.300"}
                    color={isFeatured ? "black" : "black"}
                    border={isFeatured ? "2px solid orange" : "1px solid gray"}
                    // whileHover={{ scale: 1.02 }} // Small scale effect on hover
                    // transition="0.3s"
                    position="relative"
                    overflow="hidden"
                    _hover={{
                        bg: isFeatured ? "linear-gradient(135deg, #fda085 0%, #f6d365 100%)" : "gray.400", // Hover color change
                        shadow: "lg", // Increase shadow on hover for a subtle depth effect

                    }}
                    pointerEvents={'none'}
                >
                    {isFeatured && (
                        <Badge
                            position="absolute"
                            top={2}
                            left={2}
                            colorScheme="yellow"
                            fontSize="sm"
                            px={3}
                            py={1}
                            borderRadius="full"
                            boxShadow="md"
                        >
                            Featured
                        </Badge>
                    )}
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        align="center"
                        mb={4}
                        textAlign={{ base: "center", md: "left" }}
                    >
                        <Image
                            src={logo_permanent_url || "https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png"}
                            alt={`${title} logo`}
                            boxSize="80px"
                            objectFit="contain"
                            mr={{ base: 0, md: 4 }}
                            mb={{ base: 4, md: 0 }}
                            alignSelf={{ base: "center", md: "flex-start" }}
                            borderRadius="full"
                            border={isFeatured ? "2px solid orange" : "none"}
                            filter="none"
                        />
                        <Box flex="1">
                            <Text fontSize="lg" color="gray.600" fontWeight="semibold">
                                {company}
                            </Text>
                            <Heading
                                fontSize="2xl"
                                color={isFeatured ? "orange.800" : "black"}
                                fontWeight="bold"
                                lineHeight="shorter"
                                mb={2}
                            >
                                {title}
                            </Heading>
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
                            alignItems="flex-start" // Add this line to ensure alignment
                        >
                            <VStack align="start" spacing={1} width={{ base: "100%", md: "auto" }}>
                                <Text fontWeight="bold" color="gray.700" width="100px">Location</Text>
                                <Text>{location}</Text>
                            </VStack>
                            <VStack align="start" spacing={1} width={{ base: "100%", md: "auto" }}>
                                <Text fontWeight="bold" color="gray.700" width="100px" >Remote</Text>
                                <Text>{remote_string}</Text>
                            </VStack>
                            <VStack align="start" spacing={1} width={{ base: "100%", md: "auto" }}>
                                <Text fontWeight="bold" color="gray.700" width="100px">Salary</Text>
                                <Text>{salary || "-"}</Text>
                            </VStack>
                            <VStack align="start" spacing={1} width={{ base: "100%", md: "auto" }}>
                                <Text fontWeight="bold" color="gray.700" width="100px">Seniority</Text>
                                <Text>{seniority}</Text>
                            </VStack>
                        </HStack>
                        <Tag colorScheme={isFeatured ? "orange" : "green"} size="lg" mt={{ base: 4, md: 0 }} alignSelf={{ base: "center", md: "flex-end" }}>
                            {days_ago_text}
                        </Tag>
                    </Flex>
                </Box>
            </ChakraLink>
        </Link>
    );
}
