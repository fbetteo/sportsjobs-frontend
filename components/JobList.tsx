'use client';

import { useEffect, useState } from 'react';
import { UserProfile, useUser } from '@auth0/nextjs-auth0/client';
import { Box, List, ListItem, Spinner } from '@chakra-ui/react';
// import { fetchJobs } from '../lib/fetchJobs';
import { JobCard } from './JobCard';
interface JobListProps {
    jobs: any[];
    user: UserProfile | undefined;
    free_job_limit?: number;
    scrollToPricing: () => void;
}
const JobList: React.FC<JobListProps> = ({ jobs, user, free_job_limit = 3, scrollToPricing }) => {
    //  free_job_limit Number of jobs to show unblurred for non-logged in users

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
            {jobs.map((job, index) => (
                <ListItem
                    key={job.id}
                    width="100%"
                    justifyContent="center" // Center the JobCard within the ListItem
                    opacity={!user && index >= free_job_limit ? 0.7 : 1}
                    position="relative"
                >
                    {!user && index >= free_job_limit && (
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bg="blackAlpha.200"
                            backdropFilter="blur(4px)"
                            zIndex={1}
                            borderRadius="lg"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            onClick={scrollToPricing}
                        />
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
            ))}
        </List>
    );
};

export default JobList;
