// app/page.tsx
'use client';
import { useState, useEffect } from "react";
import { fetchJobs } from "../lib/fetchJobs";
import { fetchJobsFeatured } from "@/lib/fetchJobsFeatured";
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
import MixedPricingCard from "@/components/MixedPriceCard";
import SenjaWallOfLove from "@/components/WallOfLove";
import JobListFeatured from "@/components/JobListFeatured";



export default function Home() {
  const [filters, setFilters] = useState<{ country?: string; remote?: string; seniority?: string; industry?: string; sport?: string; job_area?: string }>({});
  const [jobs, setJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const { user, isLoading: userLoading } = useUser();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dropdownOptions, setDropwdownOptions] = useState<{ countries: string[]; seniorities: string[]; remotes: string[]; hours: string[]; sport_list: string[]; skills: string[]; industries: string[]; job_area: string[] }>({ countries: [], seniorities: [], remotes: [], hours: [], sport_list: [], skills: [], industries: [], job_area: [] } as { countries: string[]; seniorities: string[]; remotes: string[]; hours: string[]; sport_list: string[]; skills: string[]; industries: string[]; job_area: string[] });


  const handleFilterChange = (newFilters: { country?: string; remote?: string; seniority?: string; industry?: string; sport?: string; job_area?: string }) => {
    setFilters(newFilters);

  };

  interface DropdownData {
    countries: string[];
    seniorities: string[];
    remotes: string[];
    hours: string[];
    skills: string[];
    sport_list: string[];
    job_area: string[];
    industries: string[];
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

    const fetchFeaturedData = async () => {
      try {
        const jobLimit = user ? 250 : 5;
        const fetchedJobsFeatured = await fetchJobsFeatured(jobLimit);
        setFeaturedJobs(fetchedJobsFeatured);
      } catch (error) {
        console.error("Failed to fetch featured jobs:", error);
      }
    };

    getOptions();
    fetchFeaturedData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobLimit = user ? 250 : 5;
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
      <Flex direction="column" width="100%" mb={-15}>
        <Introduction />
        <Center >
          <NewsletterSignupForm />
        </Center>
        <Center>
          <HStack mb={10}>
            <Button onClick={handleOpenForm} colorScheme="purple">
              🔔 Receive Emails For New Jobs
            </Button>
            <Button as="a" href="https://rezi.ai/?via=franco" target="_blank" colorScheme="purple">
              📝 Create your resume with AI
            </Button>
          </HStack>
          <UserFormPopup isOpen={isFormOpen} onClose={handleCloseForm} options={dropdownOptions} />
        </Center>
        <Center>
          <JobFilter onFilterChange={handleFilterChange} />
        </Center>
        <JobListFeatured jobs={featuredJobs} />
        <JobList jobs={jobs} />
      </Flex>
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
        <SenjaWallOfLove />
      </Flex>
    </VStack>
  );
}
