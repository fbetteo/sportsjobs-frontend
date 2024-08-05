// components/JobFilter.tsx

import React, { useState, useEffect } from 'react';
import { Select, VStack, Box, Button, HStack } from '@chakra-ui/react';

interface JobFilterProps {
    onFilterChange: (filters: { country?: string; seniority?: string; remote?: string; industry: string; sport: string; }) => void;
}


const fetchFilterOptions = async () => {
    // Fetch options from Airtable. Replace with your actual fetching logic.
    // For example:
    // const response = await fetch('/api/getFilterOptions');
    // const data = await response.json();
    const data = {
        countries: ['USA', 'Canada', 'UK'],
        remotes: ['Yes', 'No'],
        seniorities: ['With Experience', 'Junior', 'Intern'],
        industries: ['Tech', 'Finance', 'Healthcare', 'Education'],
        sports: ['Football', 'Basketball', 'Baseball']

    };
    return data;
};


const JobFilter: React.FC<JobFilterProps> = ({ onFilterChange }) => {
    const [country, setCountry] = useState('');
    const [seniority, setSeniority] = useState('');
    const [remote, setRemote] = useState('');
    const [industry, setIndustry] = useState('');
    const [sport, setSport] = useState('');
    const [options, setOptions] = useState<{ countries: string[]; remotes: string[]; seniorities: string[]; industries: string[]; sports: string[] }>({ countries: [], remotes: [], seniorities: [], industries: [], sports: [] });

    useEffect(() => {
        const getOptions = async () => {
            const data = await fetchFilterOptions();
            setOptions(data);
        };

        getOptions();
    }, []);

    useEffect(() => {
        onFilterChange({ country, remote, seniority, industry, sport });
    }, [country, remote, seniority, industry, sport]);

    return (
        <HStack spacing={2} marginBottom={10}>
            <Select size="md"
                borderRadius="full" fontWeight="bold"
                bg="gray.700" _hover={{ bg: 'gray.600' }} _placeholder={{ color: "white" }}
                _focus={{ bg: 'gray.600' }} placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)}>
                {options.countries.map((country) => (
                    <option key={country} value={country} style={{ backgroundColor: 'black', color: 'white' }}>
                        {country}
                    </option>
                ))}
            </Select>
            <Select size="md"
                borderRadius="full" fontWeight="bold"
                bg="gray.700" _hover={{ bg: 'gray.600' }} _placeholder={{ color: "white" }}
                _focus={{ bg: 'gray.600' }} placeholder="Remote" value={remote} onChange={(e) => setRemote(e.target.value)}>
                {options.remotes.map((remoteOption) => (
                    <option key={remoteOption} value={remoteOption} style={{ backgroundColor: 'black', color: 'white' }}>
                        {remoteOption}
                    </option>
                ))}
            </Select>
            <Select size="md"
                borderRadius="full" fontWeight="bold"
                bg="gray.700" _hover={{ bg: 'gray.600' }} _placeholder={{ color: "white" }}
                _focus={{ bg: 'gray.600' }} placeholder="Seniority" value={seniority} onChange={(e) => setSeniority(e.target.value)}>
                {options.seniorities.map((seniorityOption) => (
                    <option key={seniorityOption} value={seniorityOption} style={{ backgroundColor: 'black', color: 'white' }}>
                        {seniorityOption}
                    </option>
                ))}
            </Select>
            <Select size="md"
                borderRadius="full" fontWeight="bold"
                bg="gray.700" _hover={{ bg: 'gray.600' }} _placeholder={{ color: "white" }}
                _focus={{ bg: 'gray.600' }} placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                {options.industries.map((industryOption) => (
                    <option key={industryOption} value={industryOption} style={{ backgroundColor: 'black', color: 'white' }}>
                        {industryOption}
                    </option>
                ))}
            </Select>
            <Select size="md"
                borderRadius="full" fontWeight="bold"
                bg="gray.700" _hover={{ bg: 'gray.600' }} _placeholder={{ color: "white" }}
                _focus={{ bg: 'gray.600' }} placeholder="Sport" value={sport} onChange={(e) => setSport(e.target.value)}>
                {options.sports.map((sportOption) => (
                    <option key={sportOption} value={sportOption} style={{ backgroundColor: 'black', color: 'white' }}>
                        {sportOption}
                    </option>
                ))}
            </Select>
        </HStack>
    );
};

export default JobFilter;