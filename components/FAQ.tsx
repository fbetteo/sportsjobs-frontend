// Import necessary components from Chakra UI
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, Heading } from '@chakra-ui/react';
import Script from 'next/script';

// Define FAQ data once - single source of truth
const faqData = [
    {
        question: "Why use SportsJobs?",
        answer: "SportsJobs exists because looking for sports analytics or software/engineering in sports jobs can be truly uncomfortable. The jobs are scattered across the web, and it's often hard to find them. You need to look in each team's website or different companies that you might not know about. Opportunities in this area are hard to find as there is a limited amount of teams and sports, but there are more than you think and it's a growing field."
    },
    {
        question: "How much time do I need to find a job?",
        answer: "In the current job market, it can take up to 6 months to find a job in this niche. The time can vary depending on the specific sport, your skills, experience and the location you are looking for. SportsJobs can help you save time by providing a curated list of jobs, daily alerts, and advanced filters to find the job that fits you the best. If you are serious about finding a job in sports analytics, Sportsjobs will save you an enormous amount of time."
    },
    {
        question: "Why is there a fee to use it?",
        answer: "We charge an affordable fee because our focus is the job seeker and that requires time and effort. We want to keep a high quality curated list of jobs, increase the sports list, research and answer questions, create content around sports analytics and grow the community. The time you save by using SportsJobs is worth the fee (~ 1 hour wage per year) compared to the time of going through all the websites multiple times a month."
    },
    {
        question: "How many jobs do you add?",
        answer: "Currently, we are adding around 200 jobs per month. We are committed to increasing that by adding more sports and scanning more companies. We scan daily all major sports teams and companies, and we manually include ones that we get from our network or from specific posts that might not be present on their website (LinkedIn announcements, Twitter/X, Discord channels, etc.)."
    },
    {
        question: "Why many of the job posts don't have a salary range?",
        answer: "It's a problem of the industry. Most companies/teams don't provide a salary range in the job description. We prioritize the ones that include the salary, but the information is lacking in general. We are considering adding some estimated salary based on historical data."
    },
    {
        question: "What kind of jobs do you list?",
        answer: "We focus on data-related jobs in sports. This includes sports analytics, software engineering, data science, data engineering, data analysis, business intelligence, machine learning, AI, etc. We also include some jobs that are related to sports but not directly data-related, such as sports marketing, sports business, sports management, etc."
    },
    {
        question: "Are my payments and password secure?",
        answer: "Absolutely! We don't store anything related to your confidential information, everything is handled by top third parties. Payments are done through Stripe payment system and the user management is done with Auth0. Rest assured!"
    }
];

const FAQ = () => {
    // Generate structured data from the same source
    const faqStructuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (

        <Box p={4} maxW="container.lg" mx="auto" width="100%" id="faq">
            {/* Add structured data for SEO and LLM understanding */}
            <Script
                id="faq-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
            />

            <Accordion allowMultiple>
                <Heading as="h2" size="2xl" mb={8} textAlign="left" >
                    Frequently Asked Questions
                </Heading>

                {/* Dynamically render FAQ items from single source */}
                {faqData.map((faq, index) => (
                    <AccordionItem key={index}>
                        <h2>
                            <AccordionButton justifyContent="space-between">
                                <Box flex="1" textAlign="left" fontSize="xl" fontWeight="bold" maxW="3xl" width="100%">
                                    {faq.question}
                                </Box>
                                <AccordionIcon textAlign="right" />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel width="100%" pb={4} fontSize="md" transition="max-height 0.5s ease-in-out" overflow="hidden">
                            {faq.answer}
                        </AccordionPanel>
                    </AccordionItem>
                ))}

            </Accordion>
        </Box>
    );
};

export default FAQ;
