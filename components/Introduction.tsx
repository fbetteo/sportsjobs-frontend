// components/Introduction.tsx
'use client';
import React from 'react';
import { Box, Heading, Text, VStack, HStack, Flex, Icon, Divider } from '@chakra-ui/react';
import { FaBriefcase, FaBolt, FaCheckCircle } from 'react-icons/fa';

interface IntroductionProps {
    totalJobs?: number;
    newJobsToday?: number;
}

const Introduction: React.FC<IntroductionProps> = ({ totalJobs, newJobsToday }) => {
    return (
        <VStack spacing={6} align="center" p={4} mb={1}>
            {/* Main Headline */}
            <Heading
                as="h1"
                size="2xl"
                textAlign="center"
                bgGradient="linear(to-r, white, purple.200)"
                bgClip="text"
                fontWeight="extrabold"
            >
                Find Your Dream Job in Sports Analytics
            </Heading>

            {/* Subheadline with value prop */}
            <Text fontSize={{ base: "lg", md: "xl" }} textAlign="center" color="gray.300" maxW="600px">
                The #1 job board for sports data, analytics & tech roles.
                <Text as="span" color="white" fontWeight="semibold"> Stop searching. Start applying.</Text>
            </Text>

            {/* Clean Stats Row - Minimal Design */}
            <HStack
                spacing={{ base: 4, md: 8 }}
                justify="center"
                align="center"
                py={3}
                flexWrap="wrap"
            >
                <HStack spacing={2}>
                    <Icon as={FaBriefcase} color="purple.400" boxSize={5} />
                    <Text color="white" fontWeight="bold" fontSize="lg">
                        {totalJobs ? `${totalJobs}+` : '300+'}
                        <Text as="span" color="gray.400" fontWeight="normal" ml={1}>jobs</Text>
                    </Text>
                </HStack>

                <Divider orientation="vertical" h="20px" borderColor="gray.600" display={{ base: 'none', md: 'block' }} />

                {newJobsToday !== undefined && newJobsToday > 0 && (
                    <>
                        <HStack spacing={2}>
                            <Icon as={FaBolt} color="green.400" boxSize={5} />
                            <Text color="white" fontWeight="bold" fontSize="lg">
                                {newJobsToday}
                                <Text as="span" color="gray.400" fontWeight="normal" ml={1}>new today</Text>
                            </Text>
                        </HStack>
                        <Divider orientation="vertical" h="20px" borderColor="gray.600" display={{ base: 'none', md: 'block' }} />
                    </>
                )}

                <HStack spacing={2}>
                    <Icon as={FaCheckCircle} color="purple.400" boxSize={5} />
                    <Text color="gray.400" fontSize="md">
                        Updated daily
                    </Text>
                </HStack>
            </HStack>

            {/* Brief description */}
            <Text fontSize="sm" textAlign="center" color="gray.500" maxW="500px">
                Sports analytics, engineering, data science, betting & marketing roles from top teams and companies worldwide.
            </Text>
        </VStack>
    );
};

export default Introduction;
