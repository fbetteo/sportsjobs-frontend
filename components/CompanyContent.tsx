'use client';

import { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    HStack,
    Text,
    VStack
} from '@chakra-ui/react';
import { BRAND_PRIMARY_COLOR_SCHEME } from '@/lib/uiTokens';
import { fetchJobs } from '@/lib/fetchJobs';
import { fetchJobsFeatured } from '@/lib/fetchJobsFeatured';
import JobList from './JobList';
import { useUser } from '@auth0/nextjs-auth0/client';
import NewsletterSignupForm from './NewsletterSignupForm';
import MixedPricingCard from './MixedPriceCard';
import SenjaWallOfLove from './WallOfLove';
import JobListFeatured from './JobListFeatured';
import FAQ from './FAQ';
import PostJobLink from './PostJobLink';

interface Job {
    id: string;
    title: string;
    company: string;
}

interface CompanyContentProps {
    companyName: string;
    companyFilter: string;
    initialJobs: Job[];
    initialFeaturedJobs: Job[];
}

const SIGNED_IN_JOB_LIMIT = 250;

export default function CompanyContent({ companyName, companyFilter, initialJobs, initialFeaturedJobs }: CompanyContentProps) {
    const [jobs, setJobs] = useState<Job[]>(initialJobs);
    const [featuredJobs, setFeaturedJobs] = useState<Job[]>(initialFeaturedJobs);
    const { user } = useUser();

    const pricingSectionRef = useRef<HTMLDivElement>(null);
    const scrollToPricing = () => {
        pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    // Anonymous visitors (and crawlers) see the server-rendered lists; members get the longer lists.
    useEffect(() => {
        if (!user) return;
        const fetchMemberLists = async () => {
            try {
                const [memberJobs, memberFeaturedJobs] = await Promise.all([
                    fetchJobs(SIGNED_IN_JOB_LIMIT, JSON.stringify({ company: companyFilter })),
                    fetchJobsFeatured(SIGNED_IN_JOB_LIMIT),
                ]);
                if (Array.isArray(memberJobs)) setJobs(memberJobs);
                if (Array.isArray(memberFeaturedJobs)) setFeaturedJobs(memberFeaturedJobs);
            } catch (error) {
                console.error('Failed to fetch member job lists:', error);
            }
        };
        fetchMemberLists();
    }, [user, companyFilter]);

    return (
        <VStack spacing={10} align="stretch">
            <Flex direction="column" width="100%" mb={-15}>
                <VStack spacing={4} align="center" p={4} mb={1} >
                    <Heading as="h1" size="2xl" textAlign="center">
                        {companyName} Jobs &amp; Careers
                    </Heading>
                    <Text fontSize="md" textAlign="center">
                        {jobs.length > 0
                            ? `Browse ${jobs.length} recent ${companyName} job openings and internships in analytics, data, engineering, operations, and marketing.`
                            : `No ${companyName} openings are listed right now. New sports jobs are added daily, so set up an alert or browse similar roles below.`}
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
                        spacing={4}
                        flexWrap="wrap"
                        justify="center"
                    >
                        <Button
                            as="a"
                            href="https://applyall.com/?ref=sportsjobs"
                            target="_blank"
                            colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
                            w={{ base: "70%", md: "auto" }}
                        >
                            <Box display={{ base: 'none', md: 'block' }}>
                                📝 Automate your job applications with AI
                            </Box>
                            <Box display={{ base: 'block', md: 'none' }}>
                                📝 Auto-Apply with AI
                            </Box>
                        </Button>
                    </HStack>
                </Center>
                <Center width="100%">
                    <Box width="100%" px={4} maxW="container.lg">
                        <Box mb={4}>
                            <PostJobLink />
                        </Box>
                        <JobListFeatured jobs={featuredJobs} />
                        <JobList jobs={jobs} user={user} free_job_limit={100} scrollToPricing={scrollToPricing} />
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
