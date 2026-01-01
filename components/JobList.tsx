'use client';

import { useEffect, useState } from 'react';
import { UserProfile, useUser } from '@auth0/nextjs-auth0/client';
import { Box, List, ListItem, Spinner, Text, VStack, Icon, Flex } from '@chakra-ui/react';
import { FaLock } from 'react-icons/fa';
// import { fetchJobs } from '../lib/fetchJobs';
import { JobCard } from './JobCard';
interface JobListProps {
    jobs: any[];
    user: UserProfile | undefined;
    free_job_limit?: number;
    scrollToPricing: () => void;
    totalJobCount?: number;
}
const JobList: React.FC<JobListProps> = ({ jobs, user, free_job_limit = 5, scrollToPricing, totalJobCount }) => {
    // free_job_limit: Number of fully visible jobs for non-logged in users (default: 5)

    const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     const fetchAndSetJobs = async () => {
    //         setIsLoading(true);
    //         const jobLimit = user ? 10 : 5; // For example, 10 jobs for logged-in users, 5 for non-logged-in users
    //         try {
    //             const query = new URLSearchParams(filters as any).toString();
    //             const jobs = await fetchJobs(jobLimit, query);
    //             setJobs(jobs);
    //         } catch (error) {
    //             console.error(error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchAndSetJobs();
    // }, [user]);

    // if (userLoading || isLoading) {
    //     return (
    //         <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    //             <Spinner size="xl" />
    //         </Box>
    //     );
    // }

    return (
        <List
            spacing={5}
            width="100%"
            // maxW="5xl" // Constrain the width of the list on large screens
            mx="auto" // Center the list horizontally
        >
            {jobs.map((job, index) => {
                const isLocked = !user && index >= free_job_limit;
                const lockIntensity = isLocked ? Math.min((index - free_job_limit) * 0.15 + 0.3, 0.85) : 0;

                return (
                    <ListItem
                        key={job.id}
                        width="100%"
                        justifyContent="center"
                        position="relative"
                    >
                        {isLocked && (
                            <Box
                                position="absolute"
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                bg={`rgba(0, 0, 0, ${lockIntensity})`}
                                backdropFilter={`blur(${Math.min((index - free_job_limit) * 1 + 2, 6)}px)`}
                                zIndex={1}
                                borderRadius="lg"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                cursor="pointer"
                                onClick={scrollToPricing}
                                transition="all 0.2s"
                                _hover={{ bg: `rgba(128, 90, 213, ${lockIntensity + 0.1})` }}
                            >
                                <VStack spacing={2} color="white" textAlign="center" px={4}>
                                    <Icon as={FaLock} boxSize={6} />
                                    <Text fontWeight="bold" fontSize="lg">
                                        Unlock to View
                                    </Text>
                                    <Text fontSize="sm" opacity={0.9}>
                                        Get full access to all {totalJobCount || 'available'} jobs
                                    </Text>
                                </VStack>
                            </Box>
                        )}
                        <JobCard
                            id={job.id}
                            company={job.company}
                            title={job.title}
                            salary={job.salary}
                            location={job.location}
                            logo_permanent_url={job.logo_permanent_url}
                            description={job.description}
                            seniority={job.seniority}
                            days_ago_text={job.days_ago_text}
                            remote_string={job.remote_string}
                            isFeatured={false}
                            user={user}
                            scrollToPricing={scrollToPricing}
                            url={job.url}
                        />
                    </ListItem>
                )
            })}
        </List>
    );
};

export default JobList;
