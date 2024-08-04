'use client';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Head from 'next/head';

const JobDetailsPage = () => {
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndSetJob = async () => {
            try {
                // Simulating fetching job details
                const jobDetails = {
                    id: '123',
                    title: 'Software Engineer',
                    description: 'We are looking for a software engineer...',
                    location: 'San Francisco, CA',
                    salary: '120000',
                    country: 'USA',
                    seniority: 'Senior',
                    remote: true,
                    skills: 'JavaScript, React',
                    logo_permanent_url: 'https://example.com/logo.png',
                    remote_string: 'Yes',
                    days_ago_text: '3 days ago',
                };
                setJob(jobDetails);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndSetJob();
    }, []);

    useEffect(() => {
        if (job) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.text = JSON.stringify({
                "@context": "http://schema.org",
                "@type": "JobPosting",
                "title": job.title,
                "description": job.description,
                "identifier": {
                    "@type": "PropertyValue",
                    "name": "Example Company",
                    "value": job.id
                },
                "datePosted": "2023-07-28T09:00:00Z",
                "validThrough": "2025-12-31T23:59:59Z",
                "employmentType": "FULL_TIME",
                "hiringOrganization": {
                    "@type": "Organization",
                    "name": "Example Company",
                    "sameAs": "https://example.com",
                    "logo": job.logo_permanent_url
                },
                "jobLocation": {
                    "@type": "Place",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "123 Example St",
                        "addressLocality": job.location,
                        "addressRegion": "CA",
                        "postalCode": "94105",
                        "addressCountry": job.country
                    }
                },
                "applicantLocationRequirements": {
                    "@type": "Country",
                    "name": "USA"
                },
                "baseSalary": {
                    "@type": "MonetaryAmount",
                    "currency": "USD",
                    "value": {
                        "@type": "QuantitativeValue",
                        "value": 120000,
                        "unitText": "YEAR"
                    }
                },
                "jobLocationType": job.remote ? "TELECOMMUTE" : "ONSITE",
                "remote": job.remote
            });
            document.head.appendChild(script);
        }
    }, [job]);


    if (!job) {
        return (
            <Box p={5}>
                <Heading as="h1" size="xl" mb={5}>
                    Job Not Found
                </Heading>
            </Box>
        );
    }

    const jsonLD = {
        "@context": "http://schema.org",
        "@type": "JobPosting",
        "title": "Example Title",
        "description": "Example Description",
        "identifier": {
            "@type": "PropertyValue",
            "name": "Example Company",
            "value": "123"
        },
        "datePosted": "2023-07-28T09:00:00Z",
        "validThrough": "2025-12-31T23:59:59Z",
        "employmentType": "FULL_TIME",
        "hiringOrganization": {
            "@type": "Organization",
            "name": "Example Company",
            "sameAs": "https://example.com",
            "logo": "https://example.com/logo.png"
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Example St",
                "addressLocality": "San Francisco",
                "addressRegion": "CA",
                "postalCode": "94105",
                "addressCountry": "US"
            }
        },
        "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": {
                "@type": "QuantitativeValue",
                "value": 120000,
                "unitText": "YEAR"
            }
        },
        "jobLocationType": "TELECOMMUTE",
        "remote": true
    };

    return (
        <>
            <Head>
                <title>{job.title}</title>
                <meta name="description" content={job.description} />
            </Head>
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
        </>
    );
};

export default JobDetailsPage;
