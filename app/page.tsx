// app/page.tsx
import { fetchJobs } from "../lib/fetchJobs";
import { Box, Heading, List, ListItem, Text } from "@chakra-ui/react";
import { Providers } from "./providers";
import { JobCard } from "../components/JobCard";
import LoginButton from '../components/Header';
import JobList from "../components/JobList";

export default async function Home() {

  return (
    <Providers>
      <Box p={5}>
        <Heading as="h1" size="xl" mb={5}>
          Job Listings
        </Heading>
        <JobList />
      </Box>
    </Providers>
  );
}
