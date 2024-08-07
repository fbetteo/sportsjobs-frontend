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
import NewsletterSignupForm from "@/components/NewsletterSignupForm";
import UserFormPopup from "../components/AlertsPopupForm";

export default function Home() {
  const [filters, setFilters] = useState<{ country?: string; remote?: string; seniority?: string; industry?: string; sport?: string; }>({});
  const [jobs, setJobs] = useState([]);
  const { user, isLoading: userLoading } = useUser();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dropdownOptions, setDropwdownOptions] = useState<{ countries: string[]; seniorities: string[]; remotes: string[]; hours: string[]; sport_list: string[]; skills: string[] }>({ countries: [], seniorities: [], remotes: [], hours: [], sport_list: [], skills: [] } as { countries: string[]; seniorities: string[]; remotes: string[]; hours: string[]; sport_list: string[]; skills: string[] });


  const handleFilterChange = (newFilters: { country?: string; remote?: string; seniority?: string; industry?: string; sport?: string; }) => {
    setFilters(newFilters);

  };

  interface DropdownData {
    countries: string[];
    seniorities: string[];
    remotes: string[];
    hours: string[];
    skills: string[];
    sport_list: string[];
  }

  useEffect(() => {
    const getOptions = async () => {
      const localOptions = localStorage.getItem('dropdownOptions');
      if (localOptions) {
        setDropwdownOptions(JSON.parse(localOptions));
      } else {
        const res = await fetch('/api/dropdown-options');
        const fetchedOptions: DropdownData = await res.json();
        const sortedOptions = Object.keys(fetchedOptions).reduce((acc, key) => {
          acc[key as keyof DropdownData] = fetchedOptions[key as keyof DropdownData].sort((a: string, b: string) => a.localeCompare(b));
          return acc;
        }, {} as DropdownData);
        setDropwdownOptions(sortedOptions);
        localStorage.setItem('dropdownOptions', JSON.stringify(sortedOptions));
      }
    };

    getOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobLimit = user ? 100 : 5;
        const fetchedJobs = await fetchJobs(jobLimit, JSON.stringify(filters));
        console.log(filters)
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchData();
  }, [user, filters]);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <VStack spacing={10} align="stretch">
      <Flex direction="column" width="100%" mb={10}>
        <Introduction />
        <Center>
          <HStack>
            <Button onClick={handleOpenForm} colorScheme="teal">
              Open Form
            </Button>
            <Button onClick={handleOpenForm} colorScheme="teal">
              Open Form
            </Button>
          </HStack>
          <UserFormPopup isOpen={isFormOpen} onClose={handleCloseForm} options={dropdownOptions} />
        </Center>
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
