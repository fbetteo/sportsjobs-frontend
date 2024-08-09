// app/jobs/[id]/page.tsx

'use client';
import { Box, Heading, Text, Image, Badge, HStack, VStack, Flex, Spinner, Button, SimpleGrid } from '@chakra-ui/react';
import Head from 'next/head';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchJobDetails } from '../../../lib/fetchJobDetails';
import { Providers } from '@/app/providers';
import { marked } from 'marked';
import { addMonths, format } from 'date-fns';
import styles from '../../../markdown.module.css';
import PricingCard from '../../../components/PricingCard';
import { pricingPlans } from '../../../pricingPlans';
import MixedPricingCard from '@/components/MixedPriceCard';

const JobDetailsPage = () => {
    const { id } = useParams();
    const [job, setJob] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mappedIndustryjobType, setMappedIndustryjobType] = useState('');

    useEffect(() => {
        const fetchAndSetJob = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const jobDetails = await fetchJobDetails(id as string);
                setJob(jobDetails);

                const industryjobTypeMapping: { [key: string]: string } = {
                    Sports: '🥅 sports',
                    Betting: '🎲 betting',
                    Esports: '🎮 esports',
                    // Add more mappings if necessary
                };
                const industryType = industryjobTypeMapping[jobDetails.industry] || '🥅 sports';
                setMappedIndustryjobType(industryType);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndSetJob();
    }, [id]);


    useEffect(() => {
        if (!job) return;

        const jobTypeMapping: { [key: string]: string } = {
            fulltime: 'FULL_TIME',
            "part time": 'PART_TIME',
            // Add more mappings if necessary
        };



        const descriptionHtml = marked(job.description);

        const datePosted = new Date(job.start_date);
        const validThrough = addMonths(datePosted, 2);




        if (job) {
            console.log(job);

            let mappedJobType;

            if (job.seniority && job.seniority.toLowerCase() === 'internship') {
                mappedJobType = 'INTERN';
            } else {
                mappedJobType = jobTypeMapping[job.hours[0].toLowerCase()] || job.hours[0];
            }




            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.text = JSON.stringify({
                "@context": "http://schema.org",
                "@type": "JobPosting",
                "title": job.title,
                "description": descriptionHtml,
                "identifier": {
                    "@type": "PropertyValue",
                    "name": job.company,
                    "value": job.id
                },
                "datePosted": job.start_date,
                "validThrough": format(validThrough, 'yyyy-MM-dd'),
                "employmentType": mappedJobType,
                "hiringOrganization": {
                    "@type": "Organization",
                    "name": job.company,
                    // "sameAs": "https://example.com",
                    "logo": job.logo_permanent_url
                },
                "jobLocation": {
                    "@type": "Place",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "",
                        "addressLocality": job.location,
                        "addressRegion": "",
                        "postalCode": "",
                        "addressCountry": job.country_code
                    }
                },
                "applicantLocationRequirements": {
                    "@type": "Country",
                    "name": job.country
                },
                "baseSalary": {
                    "@type": "MonetaryAmount",
                    "currency": "USD",
                    "value": {
                        "@type": "QuantitativeValue",
                        "value": job.salary,
                        "unitText": "YEAR"
                    }
                },
                "jobLocationType": job.remote === "Yes" ? "TELECOMMUTE" : "",
            });
            document.head.appendChild(script);
        }
    }, [job]);


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

    // return (
    //     <>
    //         <Head>
    //             <title>{job.title}</title>
    //             <meta name="description" content={job.description} />
    //         </Head>
    //         <Providers>
    //             <Box p={5}>

    //                 <Heading as="h1" size="xl" mb={5}>
    //                     {job.title}
    //                 </Heading>
    //                 <Text>{job.description}</Text>
    //                 <Text><strong>Location:</strong> {job.location}</Text>
    //                 <Text><strong>Salary:</strong> {job.salary}</Text>
    //                 <Text><strong>Country:</strong> {job.country}</Text>
    //                 <Text><strong>Seniority:</strong> {job.seniority}</Text>
    //                 <Text><strong>Remote:</strong> {job.remote ? 'Yes' : 'No'}</Text>
    //                 <Text><strong>Skills:</strong> {job.skills}</Text>
    //                 <Text><strong>Days ago:</strong> {job.days_ago_text}</Text>
    //                 <Text><strong>Remote string:</strong> {job.remote_string}</Text>
    //             </Box>
    //         </Providers >
    //     </>
    // );

    const descriptionHtml = marked(job.description);

    return (
        <>
            <Head>
                <title>{job.title}</title>
                <meta name="description" content={job.description} />
            </Head>
            <Box p={5} color="white" bg="black" minHeight="100vh">
                <Flex direction="column" align="center" justify="center" textAlign="center">
                    <Image src={job.logo_permanent_url} alt={`Logo of ${job.company}`} boxSize="100px" objectFit="contain" mb={4} />
                    <Heading as="h1" size="lg" mb={2}>
                        {job.title}
                    </Heading>
                    <Heading as="h2" size="lg" mb={2}>
                        {job.company}
                    </Heading>
                    <HStack spacing={4} mb={4} justify="center">
                        <Badge colorScheme="teal" border="1px" borderColor="gray.200" px={4} py={2}>{job.hours}</Badge>
                        <Badge colorScheme="orange" border="1px" borderColor="gray.200" px={4} py={2}>{job.remote_string}</Badge>
                        <Badge colorScheme="orange" border="1px" borderColor="gray.200" px={4} py={2}>{job.seniority}</Badge>
                    </HStack>
                    <Flex wrap="wrap" justify="flex-start" align="center" mb={4} >
                        <Button
                            as="a"
                            href={job.apply_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            colorScheme="purple"
                            size="lg"
                            px={4}
                            py={2}
                            m={1}
                        >
                            Apply Now
                        </Button>
                    </Flex>
                    <Flex>
                        <Box display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" ml={4}>
                            <Badge border="1px" borderColor="gray.200" px={4} py={2} m={1}>
                                <Text><strong>{job.location}</strong></Text>
                            </Badge>
                            <Badge border="1px" borderColor="gray.200" px={4} py={2} m={1}>
                                <Text><strong>Salary:</strong> {job.salary}</Text>
                            </Badge>
                            <Badge border="1px" borderColor="gray.200" px={4} py={2} m={1}>
                                <Text><strong>{mappedIndustryjobType}</strong></Text>
                            </Badge>
                            <Badge border="1px" borderColor="gray.200" px={4} py={2} m={1}>
                                <Text><strong>{job.job_area}</strong></Text>
                            </Badge>
                        </Box>
                    </Flex>

                    <Box mt={4} textAlign="left" width="80%">
                        <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                    </Box>
                    <Button
                        as="a"
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        colorScheme="purple"
                        size="lg"
                        px={4}
                        py={2}
                        m={1}
                        mt={5}
                    >
                        Apply Now
                    </Button>
                </Flex>
            </Box>
            <Flex direction="column" width="100%" flexDirection="column" alignItems="center">
                {/* <Box width="100%"> */}
                {/* <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} width='100%' justifyContent="center">
                    {pricingPlans.map((plan, index) => (
                        <PricingCard key={index} {...plan} />
                    ))}
                </SimpleGrid> */}
                {/* </Box> */}
                <Flex direction="column" width="100%" flexDirection="column" alignItems="center">
                    {/* <Heading as="h2" size="lg" mb={5}>
          Choose a Plan
        </Heading> */}
                    {/* <SimpleGrid ml={400} columns={{ base: 1, md: 3 }} spacing={8} width='80%' justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </SimpleGrid> */}
                    <MixedPricingCard />
                </Flex>
            </Flex>
        </>
    );
};

export default JobDetailsPage;
