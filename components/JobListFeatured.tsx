'use client';

import { useEffect, useState } from 'react';
import { Box, List, ListItem, Spinner } from '@chakra-ui/react';
import { fetchJobs } from '../lib/fetchJobs';
import { JobCard } from './JobCard';
interface JobListProps {
    jobs: any[];
}
const JobList: React.FC<JobListProps> = ({ jobs }) => {
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
            // maxW="800px" // Constrain the width of the list on large screens
            mx="auto" // Center the list horizontally
            mb={4}
        >
            {jobs.map((job) => (
                <ListItem
                    key={job.id}
                    width="100%"
                    // display="flex"
                    justifyContent="center" // Center the JobCard within the ListItem
                >
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
                        // static parameters. they will be featured and the user status doesn't matter
                        isFeatured={true}
                        user={undefined}
                        scrollToPricing={() => { }}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default JobList;
