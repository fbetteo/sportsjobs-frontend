'use client';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Grid,
    Button,
    Image,
    Flex
} from '@chakra-ui/react';
import Link from 'next/link';

const AdvertisePage = () => {
    const advertisingOptions = [
        {
            title: "Advertise your product",
            price: "$99 per month",
            description: "Highlight your company in the homepage.\n\nAdvertise your product to our niche audience of sports analytics and software professionals.",
            buttonText: "Email us",
            buttonColor: "blue",
            buttonLink: "mailto:franco@sportsjobs.online?subject=Product Advertisement Inquiry"
        },
        {
            title: "Highlight your company",
            price: "$349 per month",
            description: "* Unlimited job posts.\n* Highlight your company in the homepage.\n* Feature your jobs posts in the website and newsletter.\n* Get promoted in LinkedIn.\n* Reach thousands of professionals in the sports industry.",
            buttonText: "Email us to get all the details",
            buttonColor: "teal",
            buttonLink: "mailto:franco@sportsjobs.online?subject=Company Highlighting Inquiry"
        },
        {
            title: "Hire professionals",
            price: "$50 per job",
            description: "Distribute your open positions to our audience of sports industry professionals.\n\nYou get your job post featured at the top for 30 days and we share it in the newsletter and all our social media channels.",
            buttonText: "Post a job",
            buttonColor: "orange",
            buttonLink: "/post-job"
        }
    ];

    return (
        <Box minH="100vh" bg="gray.900" color="white" py={20}>
            <Container maxW="container.xl">
                <VStack spacing={16} align="center">
                    {/* Header Section */}
                    <VStack spacing={8} textAlign="center" maxW="4xl">                        <Heading
                        as="h1"
                        size="2xl"
                        fontWeight="bold"
                        lineHeight="shorter"
                    >
                        Connect with top talent in sports technology, analytics and data science.
                    </Heading>

                        {/* <HStack spacing={4} align="center">
                            <Text fontSize="lg" color="gray.300">
                                Trusted by sports brands like
                            </Text>
                            <HStack spacing={4}>
                                <Box
                                    w={12}
                                    h={12}
                                    bg="blue.600"
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    color="white"
                                    fontWeight="bold"
                                >
                                    PSG
                                </Box>
                                <Box
                                    w={12}
                                    h={12}
                                    bg="purple.600"
                                    borderRadius="lg"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    color="white"
                                    fontWeight="bold"
                                    fontSize="sm"
                                >
                                    Kognia
                                </Box>
                                <Box
                                    w={12}
                                    h={12}
                                    bg="gray.600"
                                    borderRadius="lg"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    color="white"
                                    fontWeight="bold"
                                    fontSize="xs"
                                >
                                    FF
                                </Box>
                            </HStack>
                        </HStack> */}

                        <VStack spacing={4} maxW="3xl">
                            <Text fontSize="lg" textAlign="center">
                                SportsJobs Online is the premier destination for sports industry professionals seeking career opportunities.
                            </Text>
                            <Text fontSize="lg" textAlign="center">
                                Our community includes engineers, data scientists, analysts, marketers, and executives from leading sports organizations.
                            </Text>
                            <Text fontSize="lg" textAlign="center">
                                Whether you need to showcase your brand, recruit talent, or promote your services,
                            </Text>
                            <Text fontSize="lg" textAlign="center" fontWeight="bold">
                                we will help you reach the right audience.
                            </Text>
                        </VStack>
                    </VStack>

                    {/* Pricing Cards */}
                    <Grid
                        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                        gap={8}
                        w="full"
                        maxW="6xl"
                    >
                        {advertisingOptions.map((option, index) => (<Box
                            key={index}
                            p={8}
                            bg="gray.100"
                            borderRadius="xl"
                            border="2px"
                            borderColor="gray.300"
                            textAlign="left"
                            color="gray.900"
                            h="full"
                            display="flex"
                            flexDirection="column"
                        >
                            <VStack spacing={6} align="stretch" flex={1}>
                                <VStack spacing={3} align="start">
                                    <Heading as="h3" size="lg" color="gray.900">
                                        {option.title}
                                    </Heading>
                                    <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                                        {option.price}
                                    </Text>
                                </VStack>                                <Text fontSize="md" color="gray.700" flex={1} whiteSpace="pre-line">
                                    {option.description}
                                </Text>

                                <VStack spacing={3}>
                                    <Button
                                        as={option.buttonLink.startsWith('/') ? Link : 'a'}
                                        href={option.buttonLink}
                                        colorScheme={option.buttonColor}
                                        size="lg"
                                        w="full"
                                        mt="auto"
                                    >
                                        {option.buttonText}
                                    </Button>

                                    {option.buttonLink.includes('mailto:') && (
                                        <Text fontSize="sm" color="gray.600" textAlign="center">
                                            franco@sportsjobs.online
                                        </Text>
                                    )}
                                </VStack>
                            </VStack>
                        </Box>
                        ))}
                    </Grid>

                    {/* Additional Info */}
                    <VStack spacing={4} textAlign="center" maxW="2xl">
                        <Text fontSize="md" color="gray.400">
                            Have questions about our advertising options?
                        </Text>
                        <Button
                            as="a"
                            href="mailto:franco@sportsjobs.online?subject=Advertising Inquiry"
                            variant="outline"
                            colorScheme="purple"
                            size="lg"
                        >
                            Contact us directly
                        </Button>
                    </VStack>
                </VStack>
            </Container>
        </Box>
    );
};

export default AdvertisePage;