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
                    <AccordionPanel width="100%" pb={4} fontSize="md" transition="max-height 0.5s ease-in-out" overflow="hidden">
                        SportsJobs exists because looking for sports analytics or software/engineering in sports jobs can be truly uncomfortable. The jobs are scattered across the web, and it&apos;s often hard to find them. You need to look in each team&apos;s website or different companies that you might not know about. Opportunities in this area are hard to find as there is a limited amount of teams and sports, but there are more than you think and it&apos;s a growing field.
                    </AccordionPanel>
                </AccordionItem>

                {/* Second FAQ Item */}
                <AccordionItem>
                    <h2>
                        <AccordionButton justifyContent="space-between">
                            <Box flex="1" textAlign="left" fontSize="xl" fontWeight="bold" maxW="3xl" width="100%">
                                How much time do I need to find a job?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel width="100%" pb={4} fontSize="md" transition="max-height 0.5s ease-in-out" overflow="hidden">
                        In the current job market, it can take up to 6 months to find a job in this niche. The time can vary depending on the specific sport, your skills, experience and the location you are looking for. SportsJobs can help you save time by providing a curated list of jobs, daily alerts, and advanced filters to find the job that fits you the best. If you are serious about finding a job in sports analytics, Sportsjobs will save you an enormous amount of time.
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
                    <AccordionPanel width="100%" pb={4} fontSize="md" transition="max-height 0.5s ease-in-out" overflow="hidden">
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
                    <AccordionPanel width="100%" pb={4} fontSize="md" transition="max-height 0.5s ease-in-out" overflow="hidden">
                        Currently, we are adding around 200 jobs per month. We are committed to increasing that by adding more sports and scanning more companies. We scan daily all major sports teams and companies, and we manually include ones that we get from our network or from specific posts that might not be present on their website (LinkedIn announcements, Twitter/X, Discord channels, etc.).
                    </AccordionPanel>
                </AccordionItem>

                {/* Fourth FAQ Item */}
                <AccordionItem>
                    <h2>
                        <AccordionButton justifyContent="space-between">
                            <Box flex="1" textAlign="left" fontSize="xl" fontWeight="bold" maxW="3xl" width="100%">
                                Why many of the job posts don&apos;t have a salary range?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel width="100%" pb={4} fontSize="md" transition="max-height 0.5s ease-in-out" overflow="hidden">
                        It&apos;s a problem of the industry. Most companies/teams don&apos;t provide a salary range in the job description. We prioritize the ones that include the salary, but the information is lacking in general. We are considering adding some estimated salary based on historical data.
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
                    <AccordionPanel width="100%" pb={4} fontSize="md" transition="max-height 0.5s ease-in-out" overflow="hidden">
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
                    <AccordionPanel width="100%" pb={4} fontSize="md" transition="max-height 0.5s ease-in-out" overflow="hidden">
                        Absolutely! We don&apos;t store anything related to your confidential information, everything is handled by top third parties. Payments are done through Stripe payment system and the user management is done with Auth0. Rest assured!
                    </AccordionPanel>
                </AccordionItem>


            </Accordion>
        </Box>
    );
};

export default FAQ;
