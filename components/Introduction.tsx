// components/Introduction.tsx
import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const Introduction = () => {
    return (
        <VStack spacing={4} align="center" p={4} mb={1} >
            <Heading as="h1" size="2xl" textAlign="center">
                Find Your Dream Job in Sports Analytics and Betting
            </Heading>
            <Text fontSize="2xl" textAlign="center">
                All in one place. Stop wasting time with a dozen tabs.
            </Text>
            <Text fontSize="md" textAlign="center">
                Search hundreds of sports analytics, engineering, data, and marketing jobs. Search by location, skills, and seniority.
            </Text>
            <Text fontSize="md" textAlign="center">
                Join hundreds of people getting the latest news and content related to working in sports.
            </Text>
        </VStack>
    );
};

export default Introduction;
