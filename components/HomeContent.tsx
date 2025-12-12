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
import FeaturedCompanies from './FeaturedCompanies';
import MixedPricingCard from './MixedPriceCard';
import JourneyLink from './JourneyLink';
import FeedbackButton from './FeedbackButton';

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

// Pricing card is now directly imported

interface CachedData {
    data: any;
    timestamp: number;
}

interface Job {
    id: string;
    title: string;
    company: string;
    salary?: string;
    location?: string;
    logo_permanent_url?: string;
    description?: string; // Optional for list view
    seniority?: string;
    days_ago_text?: string;
    remote_string?: string;
    // ...add other job properties you need
}

export default function HomeContent() {
    const [filters, setFilters] = useState<{ country?: string; remote?: string; seniority?: string; industry?: string; sport?: string; job_area?: string }>({});
    const [jobs, setJobs] = useState<Job[]>([]);  // properly type the jobs state
    const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]); // properly type featured jobs
    const [totalJobCount, setTotalJobCount] = useState<number>(0); // Total jobs in database
    const [newJobsToday, setNewJobsToday] = useState<number>(0); // Jobs added today
    const { user, isLoading: userLoading } = useUser();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [dropdownOptions, setDropwdownOptions] = useState<{ countries: string[]; seniorities: string[]; remotes: string[]; hours: string[]; sport_list: string[]; skills: string[]; industries: string[]; job_area: string[] }>({ countries: [], seniorities: [], remotes: [], hours: [], sport_list: [], skills: [], industries: [], job_area: [] } as { countries: string[]; seniorities: string[]; remotes: string[]; hours: string[]; sport_list: string[]; skills: string[]; industries: string[]; job_area: string[] });

    // Track previous user to prevent unnecessary refetches
    const prevUserRef = useRef<typeof user>(undefined);
    const userChanged = user?.sub !== prevUserRef.current?.sub;

    // Debounce timeout refs
    const featuredJobsTimeoutRef = useRef<NodeJS.Timeout>();
    const regularJobsTimeoutRef = useRef<NodeJS.Timeout>();

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
        // Clear existing timeout
        if (featuredJobsTimeoutRef.current) {
            clearTimeout(featuredJobsTimeoutRef.current);
        }

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

        // Only fetch when user actually changes (not just Auth0 state updates)
        if (userChanged || !prevUserRef.current) {
            // Debounce the API calls by 300ms
            featuredJobsTimeoutRef.current = setTimeout(() => {
                getOptions();
                fetchFeaturedData();
                prevUserRef.current = user; // Update the ref
            }, 300);
        }

        // Cleanup timeout on unmount
        return () => {
            if (featuredJobsTimeoutRef.current) {
                clearTimeout(featuredJobsTimeoutRef.current);
            }
        };
    }, [user, userChanged]);

    // Fetch job stats on mount (total count and new jobs today)
    useEffect(() => {
        const fetchJobStats = async () => {
            try {
                // Fetch a larger batch to get accurate stats (without filters)
                const response = await fetch('/api/get-jobs?limit=500');
                const data = await response.json();
                if (data.jobs && Array.isArray(data.jobs)) {
                    setTotalJobCount(3000);

                    // Calculate jobs posted today
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const newToday = data.jobs.filter((job: any) => {
                        const jobDate = new Date(job.start_date);
                        jobDate.setHours(0, 0, 0, 0);
                        return jobDate.getTime() === today.getTime();
                    }).length;
                    setNewJobsToday(newToday);
                }
            } catch (error) {
                console.error("Failed to fetch job stats:", error);
                // Fallback values
                setTotalJobCount(300);
                setNewJobsToday(0);
            }
        };

        fetchJobStats();
    }, []);

    useEffect(() => {
        // Clear existing timeout
        if (regularJobsTimeoutRef.current) {
            clearTimeout(regularJobsTimeoutRef.current);
        }

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

        // Debounce regular jobs fetch
        regularJobsTimeoutRef.current = setTimeout(() => {
            // Only fetch when user actually changes OR filters change
            if (userChanged || !prevUserRef.current) {
                fetchData();
                prevUserRef.current = user; // Update the ref
            } else {
                // If only filters changed (not user), still fetch
                fetchData();
            }
        }, 300);

        // Cleanup timeout on unmount
        return () => {
            if (regularJobsTimeoutRef.current) {
                clearTimeout(regularJobsTimeoutRef.current);
            }
        };
    }, [user, filters, userChanged]);

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
                <Introduction totalJobs={totalJobCount} newJobsToday={newJobsToday} />
                <Center minHeight="150px"> {/* Reserve space for NewsletterSignupForm */}
                    <NewsletterSignupForm />
                </Center>                <Center minHeight="80px"> {/* Reserve space for buttons */}
                    <HStack
                        mb={10}
                        spacing={4}
                        justify="center"
                        minHeight="40px"
                    >
                        <Button
                            as="a"
                            href="/signup"
                            colorScheme="purple"
                            size="lg"
                            w={{ base: "90%", md: "auto" }}
                            px={8}
                            py={6}
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight="bold"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                            transition="all 0.2s"
                        >
                            🚀 Get Full Access {totalJobCount > 0 ? `to ${totalJobCount}+ Jobs` : ''}
                        </Button>
                        <Button
                            onClick={handleOpenForm}
                            variant="outline"
                            colorScheme="purple"
                            w={{ base: "90%", md: "auto" }}
                            px={6}
                            py={6}
                            fontSize={{ base: "sm", md: "md" }}
                            _hover={{ bg: 'purple.900' }}
                        >
                            🔔 Free Job Alerts
                        </Button>
                        {/* <Button
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
                        </Button> */}
                    </HStack>
                    <UserFormPopup isOpen={isFormOpen} onClose={handleCloseForm} options={dropdownOptions} />
                </Center>
                <Center width="100%">
                    <Box
                        width="100%"
                        px={4}
                        maxW="container.lg"
                        minHeight={{ base: "500px", md: "600px" }} /* Reserve space for job listings */
                    >                        <JobFilter onFilterChange={handleFilterChange} user={user} />
                        <Box mb={4}>
                            <PostJobLink />
                        </Box>
                        <FeaturedCompanies />
                        <JobListFeatured jobs={featuredJobs} />                        <JobList jobs={jobs} user={user} scrollToPricing={scrollToPricing} totalJobCount={totalJobCount} />
                        <Box
                            ref={pricingSectionRef}
                            width="100%"
                        >
                            {/* MixedPricingCard already handles user authentication internally */}
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

                        <Suspense fallback={<Box minH="200px" />}>
                            <FAQ />
                        </Suspense>

                        {/* Feedback Section */}
                        <Center py={8}>
                            <VStack spacing={3}>
                                <FeedbackButton
                                    size="lg"
                                    variant="solid"
                                    colorScheme="purple"
                                />
                            </VStack>
                        </Center>

                        <Box mb={8}>
                            <JourneyLink />
                        </Box>

                    </Box>

                </Center>
            </Flex>
        </VStack>
    );
}