import { Box, Heading, Text, Flex, Tag, Image, VStack, HStack, Divider, Badge, LinkBox, LinkOverlay } from "@chakra-ui/react";
import Link from 'next/link';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import {
    BRAND_PRIMARY_COLOR_SCHEME,
    BRAND_PRIMARY,
    BRAND_PRIMARY_LIGHT,
    BRAND_PRIMARY_SURFACE,
    BRAND_PRIMARY_SURFACE_HOVER,
    BRAND_SECONDARY,
    BRAND_SECONDARY_LIGHT,
    BRAND_SECONDARY_SURFACE,
    BRAND_SECONDARY_SURFACE_HOVER,
} from '@/lib/uiTokens';
// import { encodeJobId } from '@/utils/jobIdEncoder';

interface JobCardProps {
    id: string;
    title: string;
    company: string;
    salary: string;
    location: string;
    logo_permanent_url: string;
    description?: string; // Make optional since it's not used in list view
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
    // const ENCODING_START_ID = 7485; // Adjust this number as needed

    // const shouldEncodeId = () => {
    //     const numericId = parseInt(id, 10);
    //     return numericId >= ENCODING_START_ID;
    // };

    // const displayId = shouldEncodeId() ? encodeJobId(parseInt(id, 10)) : id;

    return (
        <LinkBox>
            <Box
                p={5}
                shadow="md"
                borderWidth={isFeatured ? "2px" : "1px"}
                borderRadius="lg"
                width="100%"
                margin="auto"
                bg={isFeatured ? BRAND_PRIMARY_SURFACE : BRAND_SECONDARY_SURFACE}
                color="white"
                border={isFeatured ? "2px solid" : "1px solid"}
                borderColor={isFeatured ? BRAND_PRIMARY_LIGHT : BRAND_SECONDARY_LIGHT}
                position="relative"
                overflow="hidden"
                transition="all 0.2s"
                cursor="pointer"
                _hover={{
                    bg: isFeatured ? BRAND_PRIMARY_SURFACE_HOVER : BRAND_SECONDARY_SURFACE_HOVER,
                    shadow: "lg",
                    borderColor: isFeatured ? BRAND_PRIMARY : BRAND_SECONDARY,
                }}
            >
                {isFeatured && (
                    <Badge
                        position="absolute"
                        top={2}
                        left={2}
                        bg={BRAND_PRIMARY}
                        color="white"
                        fontSize="sm"
                        px={3}
                        py={1}
                        borderRadius="full"
                        boxShadow="md"
                    >
                        ⭐ Featured
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
                        border={isFeatured ? "2px solid" : "none"}
                        borderColor={isFeatured ? BRAND_PRIMARY_LIGHT : "transparent"}
                        bg="white"
                    />
                    <Box flex="1">
                        <Text fontSize="lg" color={BRAND_PRIMARY_LIGHT} fontWeight="semibold">
                            {company}
                        </Text>
                        <LinkOverlay href={`/jobs/${id}`} as={Link} prefetch={false}>
                            <Heading
                                fontSize="2xl"
                                color="white"
                                fontWeight="bold"
                                lineHeight="shorter"
                                mb={2}
                            >
                                {title}
                            </Heading>
                        </LinkOverlay>
                    </Box>
                </Flex>
                <Divider mb={4} borderColor={isFeatured ? BRAND_PRIMARY_LIGHT : BRAND_SECONDARY_LIGHT} opacity={0.45} />
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
                            <Text fontWeight="bold" color={BRAND_PRIMARY_LIGHT} width="100px">Location</Text>
                            <Text color="white">{location}</Text>
                        </VStack>
                        <VStack align="start" spacing={1} width={{ base: "100%", md: "auto" }}>
                            <Text fontWeight="bold" color={BRAND_PRIMARY_LIGHT} width="100px">Remote</Text>
                            <Text color="white">{remote_string}</Text>
                        </VStack>
                        <VStack align="start" spacing={1} width={{ base: "100%", md: "auto" }}>
                            <Text fontWeight="bold" color={BRAND_PRIMARY_LIGHT} width="100px">Salary</Text>
                            <Text color="white">{salary || "-"}</Text>
                        </VStack>
                        <VStack align="start" spacing={1} width={{ base: "100%", md: "auto" }}>
                            <Text fontWeight="bold" color={BRAND_PRIMARY_LIGHT} width="100px">Seniority</Text>
                            <Text color="white">{seniority}</Text>
                        </VStack>
                    </HStack>
                    <Tag
                        colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
                        size="lg"
                        mt={{ base: 4, md: 0 }}
                        alignSelf={{ base: "center", md: "flex-end" }}
                    >
                        {days_ago_text}
                    </Tag>
                </Flex>
            </Box>
        </LinkBox>
    );
}
