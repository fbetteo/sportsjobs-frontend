"use client";

import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Text,
    Textarea,
    VStack,
    useToast,
    HStack,
    Icon,
} from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState, useEffect } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const TestimonialPageContent = () => {
    const searchParams = useSearchParams();
    const toast = useToast();

    const prefilledEmail = useMemo(() => searchParams?.get('email')?.trim() ?? '', [searchParams]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        roleCompany: '',
        content: '',
        email: '',
        website: '',
        rating: 5,
    });

    useEffect(() => {
        if (!prefilledEmail) return;
        setFormData((prev) => (prev.email ? prev : { ...prev, email: prefilledEmail }));
    }, [prefilledEmail]);

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/testimonials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Failed to submit testimonial.');
            }

            setIsSent(true);
            setFormData((prev) => ({
                ...prev,
                name: '',
                roleCompany: '',
                content: '',
                website: '',
                rating: 5,
            }));
        } catch (error) {
            toast({
                title: 'Submission error',
                description: error instanceof Error ? error.message : 'Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSent) {
        return (
            <Container maxW="container.md" py={16}>
                <Box bg="gray.800" borderWidth="1px" borderColor="gray.700" borderRadius="xl" p={8} textAlign="center">
                    <Heading size="lg" mb={4}>Thank you for your testimonial.</Heading>
                    <Text color="gray.300">Your feedback helps more people discover SportsJobs.</Text>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxW="container.md" py={16}>
            <VStack spacing={8} align="stretch">
                <Box textAlign="center">
                    <Heading as="h1" size="xl" mb={3}>Share your SportsJobs testimonial</Heading>
                    <Text color="gray.300">
                        A short note goes a long way. It usually takes less than 30 seconds.
                    </Text>
                </Box>

                <Box
                    as="form"
                    onSubmit={handleSubmit}
                    bg="gray.800"
                    borderWidth="1px"
                    borderColor="gray.700"
                    borderRadius="xl"
                    p={8}
                >
                    <VStack spacing={5} align="stretch">
                        <FormControl isRequired>
                            <FormLabel>Your name</FormLabel>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleFieldChange}
                                placeholder="John Doe"
                                bg="black"
                                borderColor="gray.600"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Role / Company</FormLabel>
                            <Input
                                name="roleCompany"
                                value={formData.roleCompany}
                                onChange={handleFieldChange}
                                placeholder="Senior Analyst at Club Name"
                                bg="black"
                                borderColor="gray.600"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Testimonial</FormLabel>
                            <Textarea
                                name="content"
                                value={formData.content}
                                onChange={handleFieldChange}
                                placeholder="How did SportsJobs help you?"
                                minH="160px"
                                bg="black"
                                borderColor="gray.600"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Rating</FormLabel>
                            <HStack spacing={2}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Button
                                        key={i}
                                        variant="ghost"
                                        onClick={() => setFormData((prev) => ({ ...prev, rating: i }))}
                                        aria-label={`${i} star${i > 1 ? 's' : ''}`}
                                        colorScheme={formData.rating >= i ? 'yellow' : undefined}
                                        p={0}
                                        minW="32px"
                                        _hover={{ bg: 'transparent' }}
                                    >
                                        <Icon as={formData.rating >= i ? AiFillStar : AiOutlineStar} boxSize={6} color={formData.rating >= i ? 'yellow.400' : 'gray.400'} />
                                    </Button>
                                ))}
                            </HStack>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Email (optional)</FormLabel>
                            <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleFieldChange}
                                placeholder="you@email.com"
                                bg="black"
                                borderColor="gray.600"
                            />
                        </FormControl>

                        <Input
                            name="website"
                            value={formData.website}
                            onChange={handleFieldChange}
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden="true"
                            position="absolute"
                            left="-9999px"
                            opacity={0}
                            h="1px"
                            w="1px"
                            p={0}
                            m={0}
                            border={0}
                        />

                        <Button
                            type="submit"
                            colorScheme="teal"
                            isLoading={isSubmitting}
                            loadingText="Submitting"
                        >
                            Submit testimonial
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

const TestimonialPage = () => {
    return (
        <Suspense fallback={<Container maxW="container.md" py={16}><Text color="gray.300">Loading testimonial form...</Text></Container>}>
            <TestimonialPageContent />
        </Suspense>
    );
};

export default TestimonialPage;
