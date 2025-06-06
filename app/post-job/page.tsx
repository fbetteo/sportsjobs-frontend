'use client';

import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    VStack,
    Heading,
    useToast,
    Checkbox,
    Text,
    Divider,
    Wrap,
    WrapItem,
    Tag,
    TagLabel,
    TagCloseButton,
    Image,
    Icon,
    SimpleGrid,
    HStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { countries } from '@/utils/countries';
import { skillsList } from '@/utils/skills';  // Add this import
import { FiUpload } from 'react-icons/fi';
import { ImQuotesLeft } from 'react-icons/im';
import SenjaRecruiterWidget from '@/components/SenjaRecruiterWidget';

interface FormData {
    company: string;
    name: string;
    description: string;
    location: string;
    salary: string;
    remote_office: string;
    applicationUrl: string;
    country: string;
    skills: string[];
    companyLogo: boolean;
    featuredListing: boolean;
    highlightedListing: boolean;
    socialMediaPromotion: boolean;
    logoFile: string | null;
    logoPreview: string;
    seniority: string;
}

const PostJobPage = () => {
    const router = useRouter();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        company: '',
        name: '',
        description: '',
        location: '',
        salary: '',
        remote_office: 'Office', // Set default
        applicationUrl: '',
        country: 'united states',
        skills: [],
        companyLogo: false,
        featuredListing: false,
        highlightedListing: false,
        socialMediaPromotion: false,
        logoFile: null,
        logoPreview: '',
        seniority: 'With Experience', // Set default
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/create-job-posting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Something went wrong',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked,
                // Clear logo data if unchecking companyLogo
                ...(name === 'companyLogo' && !checked ? {
                    logoFile: null,
                    logoPreview: ''
                } : {})
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSkillClick = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    // Add new handler for skills dropdown
    const handleSkillSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const skill = e.target.value;
        if (skill && !formData.skills.includes(skill)) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skill]
            }));
        }
        // Reset select value after selection
        e.target.value = '';
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast({
                    title: 'Error',
                    description: 'Image size should be less than 2MB',
                    status: 'error',
                    duration: 3000,
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({
                    ...prev,
                    logoFile: base64String,
                    logoPreview: base64String
                }));
            };
            reader.onerror = () => {
                toast({
                    title: 'Error',
                    description: 'Failed to read image file',
                    status: 'error',
                    duration: 3000,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const calculateTotal = () => {
        let total = 50; // Base price
        if (formData.companyLogo) total += 49; // Logo price
        return total;
    };

    return (
        <Container maxW="container.lg" py={10}>
            {/* Hero Section */}
            <VStack spacing={6} mb={12} textAlign="center">
                <Heading
                    size="2xl"
                    color="white"
                >
                    Hire your next top employee
                </Heading>
                <Text fontSize="xl" color="gray.300" maxW="2xl">
                    Distribute your open positions to our audience of sports industry professionals. Get seen by 2000 monthly niche job seekers including a selected group that pays for premium access.
                    You get your job post featured at the top for 30 days and we share it in the newsletter and all our social media channels.
                </Text>

                {/* Testimonial Card */}
                <VStack spacing={4} mt={8} maxW="2xl">
                    {/* <Text fontSize="md" color="gray.400" fontStyle="italic">
                        &quot;Within 48 hours of posting our Data Analyst role, we received applications from highly qualified candidates. Franco was super helpful all the way.&quot;
                    </Text> */}
                    <SenjaRecruiterWidget />
                    {/* <Text fontSize="sm" color="gray.500">
                        Sarah Thompson, HR Director, Premier League Club
                    </Text> */}
                </VStack>
            </VStack>

            {/* Form Section */}
            <Box
                bg="gray.800"
                p={8}
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.700"
            >
                <VStack spacing={8} as="form" onSubmit={handleSubmit}>
                    <Heading size="lg" color="teal.300">Post Your Job</Heading>

                    <FormControl isRequired>
                        <FormLabel>Company Name</FormLabel>
                        <Input
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            bg="black"
                            borderColor="gray.600"
                        />
                        <Text fontSize="sm" color="gray.400" mt={1}>
                            Your organization&apos;s official name as you&apos;d like it to appear
                        </Text>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Job Title</FormLabel>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            bg="black"
                            borderColor="gray.600"
                        />
                        <Text fontSize="sm" color="gray.400" mt={1}>
                            Be specific — e.g., &quot;Performance Analyst&quot; rather than just &quot;Analyst&quot;
                        </Text>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Location</FormLabel>
                        <Input
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            bg="black"
                            borderColor="gray.600"
                        />
                        <Text fontSize="sm" color="gray.400" mt={1}>
                            Free format. Can be remote, city, country, continent,  specific Timezone. E.g., &quot;Remote&quot;, &quot;New York, USA&quot;, &quot;Europe&quot;, &quot;PST Timezone&quot;
                        </Text>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Country</FormLabel>
                        <Select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            bg="black"
                            borderColor="gray.600"
                            _hover={{
                                borderColor: "gray.500"
                            }}
                            sx={{
                                "& option": {
                                    bg: "black",
                                    color: "white"
                                }
                            }}
                        >
                            {countries.map(country => (
                                <option key={country.code} value={country.name}>
                                    {country.name}
                                </option>
                            ))}
                        </Select>
                        <Text fontSize="sm" color="gray.400" mt={1}>
                            If you can&apos;t find the country in the list (or it&apos;s fully remote), please select &quot;Other&quot; and specify in the location field or the remote field.
                        </Text>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Seniority Level</FormLabel>
                        <Select
                            name="seniority"
                            value={formData.seniority}
                            onChange={handleInputChange}
                            bg="black"
                            borderColor="gray.600"
                            _hover={{
                                borderColor: "gray.500"
                            }}
                            sx={{
                                "& option": {
                                    bg: "black",
                                    color: "white"
                                }
                            }}
                        >
                            <option value="Internship">Internship</option>
                            <option value="Junior">Junior</option>
                            <option value="With Experience">With Experience</option>
                        </Select>
                        <Text fontSize="sm" color="gray.400" mt={1}>
                            Select the experience level required for this position
                        </Text>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Remote</FormLabel>
                        <Select
                            name="remote_office"
                            value={formData.remote_office}
                            onChange={handleInputChange}
                            bg="black"
                            borderColor="gray.600"
                            _hover={{
                                borderColor: "gray.500"
                            }}
                            sx={{
                                "& option": {
                                    bg: "black",
                                    color: "white"
                                }
                            }}
                        >
                            <option value="Office">Office</option>
                            <option value="Remote">Remote</option>
                            <option value="Global Remote">Global Remote</option>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Salary Range</FormLabel>
                        <Input
                            name="salary"
                            value={formData.salary}
                            onChange={handleInputChange}
                            placeholder="e.g., $50,000 - $70,000 / £30k-£40k"
                            bg="black"
                            borderColor="gray.600"
                        />
                        <Text fontSize="sm" color="gray.400" mt={1}>
                            Adding a salary range typically increases applications.
                        </Text>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Job Description</FormLabel>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            minHeight="200px"
                            bg="black"
                            borderColor="gray.600"
                        />
                        <Text fontSize="sm" color="gray.400" mt={1}>
                            Include key responsibilities, requirements, benefits, and what makes this role unique
                        </Text>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Application URL</FormLabel>
                        <Input
                            name="applicationUrl"
                            value={formData.applicationUrl}
                            onChange={handleInputChange}
                            type="url"
                            placeholder="https://..."
                            bg="black"
                            borderColor="gray.600"
                        />
                        <Text fontSize="sm" color="gray.400" mt={1}>
                            Apply URL to your ATS is typical but any url as your in-house job board or even linkedin job post is accepted. Please reach out to franco@sportsjobs.online if you need something custom.
                        </Text>
                    </FormControl>

                    {/* <FormControl>
                        <FormLabel>Required Skills ({formData.skills.length} selected)</FormLabel>
                        <Box mb={4}>
                            <Wrap spacing={2}>
                                {formData.skills.map(skill => (
                                    <WrapItem key={skill}>
                                        <Tag
                                            size="lg"
                                            borderRadius="full"
                                            variant="solid"
                                            colorScheme="teal"
                                        >
                                            <TagLabel>{skill}</TagLabel>
                                            <TagCloseButton
                                                onClick={() => handleSkillClick(skill)}
                                            />
                                        </Tag>
                                    </WrapItem>
                                ))}
                            </Wrap>
                        </Box>
                        <Select
                            placeholder="Add a skill..."
                            onChange={handleSkillSelect}
                            bg="black"
                            borderColor="gray.600"
                            _hover={{
                                borderColor: "gray.500"
                            }}
                            sx={{
                                "& option": {
                                    bg: "black",
                                    color: "white"
                                }
                            }}
                        >
                            {skillsList
                                .filter(skill => !formData.skills.includes(skill))
                                .map(skill => (
                                    <option key={skill} value={skill}>
                                        {skill}
                                    </option>
                                ))}
                        </Select>
                        <Text fontSize="sm" color="gray.400" mt={1}>
                           Optional.  
                        </Text>
                    </FormControl> */}

                    <Divider />

                    <Box width="100%">
                        <Heading size="md" mb={4}>Enhance Your Listing</Heading>

                        <VStack align="start" spacing={4}>
                            <Checkbox
                                name="companyLogo"
                                isChecked={formData.companyLogo}
                                onChange={handleInputChange}
                            >
                                Company Logo (+$49) - Display your company logo
                            </Checkbox>

                            {formData.companyLogo && (
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        display="none"
                                        id="logo-upload"
                                    />
                                    <Box
                                        border="2px dashed"
                                        borderColor="gray.500"
                                        borderRadius="md"
                                        p={4}
                                        textAlign="center"
                                        cursor="pointer"
                                        onClick={() => document.getElementById('logo-upload')?.click()}
                                    >
                                        {formData.logoPreview ? (
                                            <Image
                                                src={formData.logoPreview}
                                                alt="Logo preview"
                                                maxH="100px"
                                                mx="auto"
                                            />
                                        ) : (
                                            <VStack spacing={2}>
                                                <Icon as={FiUpload} w={8} h={8} />
                                                <Text>Click to upload company logo</Text>
                                                <Text fontSize="sm" color="gray.500">
                                                    Recommended: 400x400px, max 2MB
                                                </Text>
                                            </VStack>
                                        )}
                                    </Box>
                                </FormControl>
                            )}

                            <Divider my={2} />

                            <Text color="teal.300" fontWeight="bold">
                                Included Benefits:
                            </Text>

                            <Checkbox
                                isChecked={true}
                                isReadOnly
                                colorScheme="teal"
                                iconColor="teal.300"
                            >
                                Pinned job post - Featured at the top of the job list
                            </Checkbox>

                            <Checkbox
                                isChecked={true}
                                isReadOnly
                                colorScheme="teal"
                                iconColor="teal.300"
                            >
                                Highlighted post - Stand out with special formatting
                            </Checkbox>

                            <Checkbox
                                isChecked={true}
                                isReadOnly
                                colorScheme="teal"
                                iconColor="teal.300"
                            >
                                Social Media Promotion - Shared on our Newsletter and LinkedIn networks
                            </Checkbox>
                        </VStack>
                    </Box>

                    {/* Stats Section */}
                    {/* <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full" my={8}>
                        {[
                            { number: "2K+", label: "Monthly Views" },
                            { number: "48hrs", label: "Avg. Time to First Application" },
                            { number: "89%", label: "Positions Filled" }
                        ].map(stat => (
                            <VStack
                                key={stat.label}
                                p={4}
                                bg="gray.700"
                                borderRadius="lg"
                            >
                                <Text fontSize="2xl" fontWeight="bold" color="teal.300">
                                    {stat.number}
                                </Text>
                                <Text color="gray.300">{stat.label}</Text>
                            </VStack>
                        ))}
                    </SimpleGrid> */}

                    <Button
                        type="submit"
                        colorScheme="purple"
                        size="lg"
                        width="full"
                        isLoading={isLoading}
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                        }}
                        transition="all 0.2s"
                    >
                        Start Hiring - ${calculateTotal()}
                    </Button>
                </VStack>
            </Box>
        </Container>
    );
};

export default PostJobPage;
