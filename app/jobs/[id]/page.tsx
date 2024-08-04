// app/jobs/[id]/page.tsx

'use client';
import { Box, Heading, Text, Spinner } from '@chakra-ui/react';
import Head from 'next/head';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchJobDetails } from '../../../lib/fetchJobDetails';
import { Providers } from '@/app/providers';

const generateJobPostingJSONLD = (job) => {
    return {
        "@context": "http://schema.org",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "identifier": {
            "@type": "PropertyValue",
            "name": "Your Company Name",
            "value": job.id
        },
        "datePosted": new Date().toISOString(),
        "validThrough": "2025-12-31T23:59:59Z",
        "employmentType": "FULL_TIME",
        "hiringOrganization": {
            "@type": "Organization",
            "name": "Your Company Name",
            "sameAs": "https://www.yourcompanysite.com",
            "logo": job.logo_permanent_url
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Your Street Address",
                "addressLocality": job.location,
                "addressRegion": "Your Region",
                "postalCode": "Your Postal Code",
                "addressCountry": job.country
            }
        },
        "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": {
                "@type": "QuantitativeValue",
                "value": job.salary || 0,
                "unitText": "YEAR"
            }
        },
        "jobLocationType": job.remote ? "TELECOMMUTE" : "ONSITE",
        "remote": job.remote
    };
};

const JobDetailsPage = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndSetJob = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const jobDetails = await fetchJobDetails(id as string);
                setJob(jobDetails);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndSetJob();
    }, [id]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (!job) {
        return (
            <Box p={5}>
                <Heading as="h1" size="xl" mb={5}>
                    Job Not Found
                </Heading>
            </Box>
        );
    }

    return (
        <>
            <Head>
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "http://schema.org",
                        "@type": "JobPosting",
                        "title": "Example Title",
                        "description": "Example Description"
                    })}
                </script>
            </Head>
            {/* <Providers> */}
            <Box p={5}>

                <Heading as="h1" size="xl" mb={5}>
                    {job.title}
                </Heading>
                <Text>{job.description}</Text>
                <Text><strong>Location:</strong> {job.location}</Text>
                <Text><strong>Salary:</strong> {job.salary}</Text>
                <Text><strong>Country:</strong> {job.country}</Text>
                <Text><strong>Seniority:</strong> {job.seniority}</Text>
                <Text><strong>Remote:</strong> {job.remote ? 'Yes' : 'No'}</Text>
                <Text><strong>Skills:</strong> {job.skills}</Text>
                <Text><strong>Days ago:</strong> {job.days_ago_text}</Text>
                <Text><strong>Remote string:</strong> {job.remote_string}</Text>
            </Box>
            {/* </Providers > */}
        </>
    );
};

export default JobDetailsPage;
