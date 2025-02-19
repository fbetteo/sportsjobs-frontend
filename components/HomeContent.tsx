'use client';
import { useState, useEffect, useRef, Suspense } from "react";
import dynamic from 'next/dynamic';
import { fetchJobs } from "../lib/fetchJobs";
import { fetchJobsFeatured } from "@/lib/fetchJobsFeatured";
import { Box, Button, Center, Flex, HStack, VStack } from "@chakra-ui/react";
import JobList from "./JobList";
import JobFilter from './JobFilter';
import { useUser } from '@auth0/nextjs-auth0/client';
import Introduction from './Introduction';
import NewsletterSignupForm from "./NewsletterSignupForm";
import UserFormPopup from "./AlertsPopupForm";
import PostJobLink from './PostJobLink';
import JobListFeatured from './JobListFeatured';

// Lazy load non-critical components
const FAQ = dynamic(() => import('./FAQ'), {
    loading: () => <Box minH="200px" />,
    ssr: false
});

const SenjaWallOfLove = dynamic(() => import('./WallOfLove'), {
    loading: () => (
        <Box
            minH={{ base: "1000px", md: "800px" }}
            width="100%"
            bg="gray.800"
            borderRadius="xl"
        />
    ),
    ssr: false
});

const MixedPricingCard = dynamic(() => import('./MixedPriceCard'), {
    loading: () => (
        <Box
            minH={{ base: "1000px", md: "800px" }}
            width="100%"
            bg="gray.800"
            borderRadius="xl"
        />
    ),
    ssr: false
});

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

export default function HomeContent() {
    const [filters, setFilters] = useState<{ country?: string; remote?: string; seniority?: string; industry?: string; sport?: string; job_area?: string }>({});
    const [jobs, setJobs] = useState<Job[]>([]);  // properly type the jobs state
    const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]); // properly type featured jobs
    const { user, isLoading: userLoading } = useUser();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [dropdownOptions, setDropwdownOptions] = useState<{ countries: string[]; seniorities: string[]; remotes: string[]; hours: string[]; sport_list: string[]; skills: string[]; industries: string[]; job_area: string[] }>({ countries: [], seniorities: [], remotes: [], hours: [], sport_list: [], skills: [], industries: [], job_area: [] } as { countries: string[]; seniorities: string[]; remotes: string[]; hours: string[]; sport_list: string[]; skills: string[]; industries: string[]; job_area: string[] });

    const pricingSectionRef = useRef<HTMLDivElement>(null);
    const scrollToPricing = () => {
        if (pricingSectionRef.current) {
            pricingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    const handleFilterChange = (newFilters: { country?: string; remote?: string; seniority?: string; industry?: string; sport?: string; job_area?: string }) => {
        setFilters(newFilters);
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
        const getOptions = async () => {
            const localOptions = localStorage.getItem('dropdownOptions');
            if (localOptions) {
                setDropwdownOptions(JSON.parse(localOptions));
            } else {
                const res = await fetch('/api/dropdown-options');
                const fetchedOptions: DropdownData = await res.json();
                const sortedOptions = Object.keys(fetchedOptions).reduce((acc, key) => {
                    acc[key as keyof DropdownData] = fetchedOptions[key as keyof DropdownData].sort((a: string, b: string) => a.localeCompare(b));
                    return acc;
                }, {} as DropdownData);
                setDropwdownOptions(sortedOptions);
                localStorage.setItem('dropdownOptions', JSON.stringify(sortedOptions));
            }
        };

        const fetchFeaturedData = async () => {
            try {
                const jobLimit = user ? 300 : 5;
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

        getOptions();
        fetchFeaturedData();
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobLimit = user ? 300 : 8;
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
    }, [user, filters]);

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
        <VStack spacing={10} align="stretch" minHeight="100vh">
            <Flex direction="column" width="100%" mb={-15}>
                <Introduction />
                <Center minHeight="150px"> {/* Reserve space for NewsletterSignupForm */}
                    <NewsletterSignupForm />
                </Center>
                <Center minHeight="80px"> {/* Reserve space for buttons */}
                    <HStack
                        mb={10}
                        spacing={4} // Adjust spacing for better wrapping
                        flexWrap="wrap" // Allow buttons to wrap if needed
                        justify="center" // Center them when they wrap
                        minHeight="40px"
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
                    <UserFormPopup isOpen={isFormOpen} onClose={handleCloseForm} options={dropdownOptions} />
                </Center>
                <Center width="100%">
                    <Box
                        width="100%"
                        px={4}
                        maxW="container.lg"
                        minHeight={{ base: "500px", md: "600px" }} /* Reserve space for job listings */
                    >
                        <JobFilter onFilterChange={handleFilterChange} user={user} />
                        <Box mb={4}>
                            <PostJobLink />
                        </Box>
                        <JobListFeatured jobs={featuredJobs} />
                        <JobList jobs={jobs} user={user} scrollToPricing={scrollToPricing} />
                        <Box
                            ref={pricingSectionRef}
                            minH={{ base: "1000px", md: "800px" }}
                            width="100%"
                        >
                            <Suspense fallback={
                                <Box
                                    minH={{ base: "1000px", md: "800px" }}
                                    width="100%"
                                    bg="gray.800"
                                    borderRadius="xl"
                                />
                            }>
                                <MixedPricingCard />
                            </Suspense>
                        </Box>
                        <Suspense fallback={<Box minH="200px" />}>
                            <FAQ />
                        </Suspense>
                        <Suspense fallback={
                            <Box
                                minH={{ base: "1000px", md: "800px" }}
                                width="100%"
                                bg="gray.800"
                                borderRadius="xl"
                            />
                        }>
                            <SenjaWallOfLove />
                        </Suspense>
                    </Box>
                </Center>
            </Flex>
        </VStack>
    );
}