// app/page.tsx
'use client';
import { useState, useEffect } from "react";
import { fetchJobs } from "../lib/fetchJobs";
import { Box, Heading, List, ListItem, Text, SimpleGrid, VStack, Container, Flex, HStack, Select, Button, Input, Center } from "@chakra-ui/react";
import { Providers } from "./providers";
import { JobCard } from "../components/JobCard";
import LoginButton from '../components/Header';
import JobList from "../components/JobList";
import PricingCard from '../components/PricingCard';
import { pricingPlans } from '../pricingPlans';
import JobFilter from '../components/JobFilter';
import { useUser } from '@auth0/nextjs-auth0/client';
import Introduction from '../components/Introduction';

export default function Home() {
  const [filters, setFilters] = useState<{ country?: string; remote?: string; seniority?: string; industry?: string; sport?: string; }>({});
  const [jobs, setJobs] = useState([]);
  const { user, isLoading: userLoading } = useUser();

  const handleFilterChange = (newFilters: { country?: string; remote?: string; seniority?: string; industry?: string; sport?: string; }) => {
    setFilters(newFilters);

  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobLimit = user ? 10 : 5;
        const fetchedJobs = await fetchJobs(jobLimit, JSON.stringify(filters));
        console.log(filters)
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchData();
  }, [filters]);

  return (
    <VStack spacing={10} align="stretch">
      <Flex direction="column" width="100%" mb={10}>
        <Introduction />
        <Center>
          <JobFilter onFilterChange={handleFilterChange} />
        </Center>
        <JobList jobs={jobs} />
      </Flex>
      <Flex direction="column" width="100%" flexDirection="column" alignItems="center">
        <Heading as="h2" size="lg" mb={5}>
          Choose a Plan
        </Heading>
        <SimpleGrid ml={400} columns={{ base: 1, md: 3 }} spacing={8} width='80%' justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </SimpleGrid>
      </Flex>
    </VStack>
  );
}
