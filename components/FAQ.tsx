// Import necessary components from Chakra UI
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, Heading } from '@chakra-ui/react';

const FAQ = () => {
    return (

        <Box p={4} maxW="container.lg" mx="auto" width="100%">
            <Accordion allowMultiple>
                <Heading as="h2" size="2xl" mb={8} textAlign="left" >
                    Frequently Asked Questions
                </Heading>

                {/* First FAQ Item */}
                <AccordionItem>
                    <h2>
                        <AccordionButton justifyContent="space-between">
                            <Box flex="1" textAlign="left" fontSize="xl" fontWeight="bold" maxW="3xl" width="100%">
                                Why using SportsJobs?
                            </Box>
                            <AccordionIcon textAlign="right" />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel width="100%" maxW="3xl" pb={4} fontSize="md" transition="max-height 0.5s ease-in-out" overflow="hidden">
                        SportsJobs exists because looking for sports analytics or software/engineering in sports jobs can be truly uncomfortable. The jobs are scattered across the web, and it's often hard to find them. You need to look in each team's website or different companies that you might not know about. Opportunities in this area are hard to find as there is a limited amount of teams and sports, but there are more than you think and it's a growing field.
                    </AccordionPanel>
                </AccordionItem>

                {/* Second FAQ Item */}
                <AccordionItem>
                    <h2>
                        <AccordionButton justifyContent="space-between">
                            <Box flex="1" textAlign="left" fontSize="xl" fontWeight="bold" maxW="3xl" width="100%">
                                Why is there a fee to use it?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel width="100%" maxW="3xl" pb={4} fontSize="md" transition="max-height 0.5s ease-in-out" overflow="hidden">
                        We charge an affordable fee because our focus is the job seeker and that requires time and effort. We want to keep a high quality curated list of jobs, increase the sports list, research and answer questions, create content around sports analytics and grow the community. The time you save by using SportsJobs is worth the fee (~ 1 hour wage per year) compared to the time of going through all the websites multiple times a month.
                    </AccordionPanel>
                </AccordionItem>

                {/* Third FAQ Item */}
                <AccordionItem>
                    <h2>
                        <AccordionButton justifyContent="space-between">
                            <Box flex="1" textAlign="left" fontSize="xl" fontWeight="bold" maxW="3xl" width="100%">
                                How many jobs do you add?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel width="100%" maxW="3xl" pb={4} fontSize="md" transition="max-height 0.5s ease-in-out" overflow="hidden">
                        Currently, we are adding around 200 jobs per month. We are committed to increasing that by adding more sports and scanning more companies. We scan daily all major sports teams and companies, and we manually include ones that we get from our network or from specific posts that might not be present on their website (LinkedIn announcements, Twitter/X, Discord channels, etc.).
                    </AccordionPanel>
                </AccordionItem>

                {/* Fourth FAQ Item */}
                <AccordionItem>
                    <h2>
                        <AccordionButton justifyContent="space-between">
                            <Box flex="1" textAlign="left" fontSize="xl" fontWeight="bold" maxW="3xl" width="100%">
                                Why many of the job posts don't have a salary range?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel width="100%" maxW="3xl" pb={4} fontSize="md" transition="max-height 0.5s ease-in-out" overflow="hidden">
                        It's a problem of the industry. Most companies/teams don't provide a salary range in the job description. We prioritize the ones that include the salary, but the information is lacking in general. We are considering adding some estimated salary based on historical data.
                    </AccordionPanel>
                </AccordionItem>

                {/* Fifth FAQ Item */}
                <AccordionItem>
                    <h2>
                        <AccordionButton justifyContent="space-between">
                            <Box flex="1" textAlign="left" fontSize="xl" fontWeight="bold" maxW="3xl" width="100%">
                                What kind of jobs do you list?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel width="100%" maxW="3xl" pb={4} fontSize="md" transition="max-height 0.5s ease-in-out" overflow="hidden">
                        We focus on data-related jobs in sports. This includes sports analytics, software engineering, data science, data engineering, data analysis, business intelligence, machine learning, AI, etc. We also include some jobs that are related to sports but not directly data-related, such as sports marketing, sports business, sports management, etc.
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <h2>
                        <AccordionButton justifyContent="space-between">
                            <Box flex="1" textAlign="left" fontSize="xl" fontWeight="bold" maxW="3xl" width="100%">
                                Are my payments and password secure?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel width="100%" maxW="3xl" pb={4} fontSize="md" transition="max-height 0.5s ease-in-out" overflow="hidden">
                        Absolutely! We don't store anything related to your confidential information, everything is handled by top third parties. Payments are done through Stripe payment system and the user management is done with Auth0. Rest assured!
                    </AccordionPanel>
                </AccordionItem>


            </Accordion>
        </Box>
    );
};

export default FAQ;
