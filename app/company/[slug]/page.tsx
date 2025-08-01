'use client';
import { useState, useEffect, useRef } from "react";
import { fetchJobs } from "../../../lib/fetchJobs";
import { fetchJobsFeatured } from "@/lib/fetchJobsFeatured";
import { Box, Button, Center, Flex, Heading, HStack, VStack, Text } from "@chakra-ui/react";
import JobList from "../../../components/JobList";
import JobFilter from '../../../components/JobFilter';
import { useUser } from '@auth0/nextjs-auth0/client';
import Introduction from '../../../components/Introduction';
import NewsletterSignupForm from "../../../components/NewsletterSignupForm";
import UserFormPopup from "../../../components/AlertsPopupForm";
import MixedPricingCard from "../../../components/MixedPriceCard";
import SenjaWallOfLove from "../../../components/WallOfLove";
import JobListFeatured from "../../../components/JobListFeatured";
import FAQ from "../../../components/FAQ";
import PostJobLink from "../../../components/PostJobLink";

type Props = {
    params: { slug: string }
}

interface CachedData {
    data: any;
    timestamp: number;
}

interface Job {
    id: string;
    title: string;
    company: string;
    // ...add other job properties you need
}

export default function CompanyContent({ params }: Props) {
    const companyName = params.slug.replace(/-/g, ' ');
    const companyNameFormatted = companyName.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const filters = { company: companyName };
    const [jobs, setJobs] = useState<Job[]>([]);  // properly type the jobs state
    const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]); // properly type featured jobs
    const { user, isLoading: userLoading } = useUser();
    const [isFormOpen, setIsFormOpen] = useState(false);
    // const [dropdownOptions, setDropwdownOptions] = useState<{ countries: string[]; seniorities: string[]; remotes: string[]; hours: string[]; sport_list: string[]; skills: string[]; industries: string[]; job_area: string[] }>({ countries: [], seniorities: [], remotes: [], hours: [], sport_list: [], skills: [], industries: [], job_area: [] } as { countries: string[]; seniorities: string[]; remotes: string[]; hours: string[]; sport_list: string[]; skills: string[]; industries: string[]; job_area: string[] });

    const pricingSectionRef = useRef<HTMLDivElement>(null);
    const scrollToPricing = () => {
        if (pricingSectionRef.current) {
            pricingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };


    interface DropdownData {
        countries: string[];
        seniorities: string[];
        remotes: string[];
        hours: string[];
        skills: string[];
        sport_list: string[];
        job_area: string[];
        industries: string[];
    }

    const [scrollPosition, setScrollPosition] = useState(0);

    const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

    const isDataStale = (timestamp: number) => {
        return Date.now() - timestamp > CACHE_DURATION;
    };

    useEffect(() => {
        // Load saved jobs from sessionStorage first with timestamp check
        try {
            const savedJobsData = sessionStorage.getItem('jobsList');
            const savedFeaturedJobsData = sessionStorage.getItem('featuredJobsList');

            if (savedJobsData && savedFeaturedJobsData) {
                const jobsCache: CachedData = JSON.parse(savedJobsData);
                const featuredJobsCache: CachedData = JSON.parse(savedFeaturedJobsData);

                if (!isDataStale(jobsCache.timestamp) && Array.isArray(jobsCache.data)) {
                    setJobs(jobsCache.data);
                } else {
                    sessionStorage.removeItem('jobsList');
                }

                if (!isDataStale(featuredJobsCache.timestamp) && Array.isArray(featuredJobsCache.data)) {
                    setFeaturedJobs(featuredJobsCache.data);
                } else {
                    sessionStorage.removeItem('featuredJobsList');
                }
            }

            // Restore scroll position after jobs are loaded
            const savedPosition = sessionStorage.getItem('scrollPosition');
            if (savedPosition) {
                setTimeout(() => {
                    window.scrollTo(0, parseInt(savedPosition));
                    sessionStorage.removeItem('scrollPosition');
                }, 100);
            }
        } catch (error) {
            console.error('Error loading cached jobs:', error);
            sessionStorage.removeItem('jobsList');
            sessionStorage.removeItem('featuredJobsList');
        }
    }, []);

    useEffect(() => {
        // const getOptions = async () => {
        //     const localOptions = localStorage.getItem('dropdownOptions');
        //     if (localOptions) {
        //         setDropwdownOptions(JSON.parse(localOptions));
        //     } else {
        //         const res = await fetch('/api/dropdown-options');
        //         const fetchedOptions: DropdownData = await res.json();
        //         const sortedOptions = Object.keys(fetchedOptions).reduce((acc, key) => {
        //             acc[key as keyof DropdownData] = fetchedOptions[key as keyof DropdownData].sort((a: string, b: string) => a.localeCompare(b));
        //             return acc;
        //         }, {} as DropdownData);
        //         setDropwdownOptions(sortedOptions);
        //         localStorage.setItem('dropdownOptions', JSON.stringify(sortedOptions));
        //     }
        // };

        const fetchFeaturedData = async () => {
            try {
                const jobLimit = user ? 250 : 5;
                const fetchedJobsFeatured = await fetchJobsFeatured(jobLimit);
                if (Array.isArray(fetchedJobsFeatured)) {
                    setFeaturedJobs(fetchedJobsFeatured);
                    sessionStorage.setItem('featuredJobsList', JSON.stringify({
                        data: fetchedJobsFeatured,
                        timestamp: Date.now()
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch featured jobs:", error);
                setFeaturedJobs([]); // Set empty array on error
            }
        };

        // getOptions();
        fetchFeaturedData();
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobLimit = user ? 250 : 8;
                const fetchedJobs = await fetchJobs(jobLimit, JSON.stringify(filters));
                console.log(filters)
                if (Array.isArray(fetchedJobs)) {
                    setJobs(fetchedJobs);
                    sessionStorage.setItem('jobsList', JSON.stringify({
                        data: fetchedJobs,
                        timestamp: Date.now()
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
                setJobs([]); // Set empty array on error
            }
        };

        fetchData();
    }, []);

    // Save scroll position before navigation
    useEffect(() => {
        const handleBeforeUnload = () => {
            sessionStorage.setItem('scrollPosition', window.scrollY.toString());
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleOpenForm = () => {
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    return (
        <VStack spacing={10} align="stretch">
            <Flex direction="column" width="100%" mb={-15}>
                <VStack spacing={4} align="center" p={4} mb={1} >
                    <Heading as="h1" size="2xl" textAlign="center">
                        Jobs in {companyNameFormatted} | {companyNameFormatted} careers | Sports Analytics jobs
                    </Heading>
                    <Text fontSize="md" textAlign="center">
                        Search sports analytics, engineering, data, and marketing jobs in {companyNameFormatted}.
                    </Text>
                    <Text fontSize="md" textAlign="center">
                        Join hundreds of people getting the latest news and content related to working in sports.
                    </Text>
                </VStack>
                <Center >
                    <NewsletterSignupForm />
                </Center>
                <Center>
                    <HStack
                        mb={10}
                        spacing={4} // Adjust spacing for better wrapping
                        flexWrap="wrap" // Allow buttons to wrap if needed
                        justify="center" // Center them when they wrap
                    >
                        <Button
                            onClick={handleOpenForm}
                            colorScheme="purple"
                            w={{ base: "70%", md: "auto" }} // Full width on mobile, auto on larger screens
                        >
                            🔔 Receive Emails For New Jobs
                        </Button>
                        <Button
                            as="a"
                            href="https://applyall.com/?ref=sportsjobs"
                            target="_blank"
                            colorScheme="purple"
                            w={{ base: "70%", md: "auto" }} // Full width on mobile, auto on larger screens
                        >
                            <Box display={{ base: 'none', md: 'block' }}>
                                📝 Automate your job applications with AI
                            </Box>
                            <Box display={{ base: 'block', md: 'none' }}>
                                📝 Auto-Apply with AI
                            </Box>
                        </Button>
                    </HStack>
                    {/* <UserFormPopup isOpen={isFormOpen} onClose={handleCloseForm} options={dropdownOptions} /> */}
                </Center>
                <Center width="100%">
                    <Box width="100%" px={4} maxW="container.lg"> {/* Consistent wrapper with padding */}
                        {/* <JobFilter onFilterChange={handleFilterChange} user={user} /> */}
                        <Box mb={4}>
                            <PostJobLink />
                        </Box>
                        <JobListFeatured jobs={featuredJobs} />
                        <JobList jobs={jobs} user={user} free_job_limit={1} scrollToPricing={scrollToPricing} />
                        <div ref={pricingSectionRef}>
                            <MixedPricingCard />
                        </div>
                        <FAQ />
                        <SenjaWallOfLove />
                    </Box>
                </Center>
            </Flex>
        </VStack>
    );
}
