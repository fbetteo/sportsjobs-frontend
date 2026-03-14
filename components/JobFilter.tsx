// components/JobFilter.tsx

import React, { useState, useEffect } from 'react';
import { Select, VStack, Box, Button, HStack, Flex } from '@chakra-ui/react';
import { UserProfile } from '@auth0/nextjs-auth0/client';

interface JobFilterProps {
    onFilterChange: (filters: { country?: string; seniority?: string; remote?: string; industry: string; sport: string; job_area: string }) => void;
    user: UserProfile | undefined;
}

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

const sanitizeOptions = (values: string[] = []) => {
    return Array.from(
        new Set(
            values
                .map((value) => value?.trim())
                .filter((value): value is string => Boolean(value))
        )
    );
};

// const fetchFilterOptions = async () => {
//     // Fetch options from Airtable. Replace with your actual fetching logic.
//     // For example:
//     // const response = await fetch('/api/getFilterOptions');
//     // const data = await response.json();
//     const data = {
//         countries: ['USA', 'Canada', 'UK'],
//         remotes: ['Yes', 'No'],
//         seniorities: ['With Experience', 'Junior', 'Intern'],
//         industries: ['Tech', 'Finance', 'Healthcare', 'Education'],
//         sports: ['Football', 'Basketball', 'Baseball']

//     };
//     return data;
// };


const JobFilter: React.FC<JobFilterProps> = ({ onFilterChange, user }) => {
    const [country, setCountry] = useState('');
    const [seniority, setSeniority] = useState('');
    const [remote, setRemote] = useState('');
    const [industry, setIndustry] = useState('');
    const [sport, setSport] = useState('');
    const [job_area, setJobArea] = useState('');
    const [options, setOptions] = useState<{ countries: string[]; remotes: string[]; seniorities: string[]; industries: string[]; sports: string[]; job_areas: string[] }>({ countries: [], remotes: [], seniorities: [], industries: [], sports: [], job_areas: [] });

    useEffect(() => {
        const getOptions = async () => {
            const localOptions = localStorage.getItem('dropdownOptions');
            if (localOptions) {
                const parsedLocalOptions = JSON.parse(localOptions);
                const filterOptions = {
                    countries: sanitizeOptions(parsedLocalOptions.countries),
                    remotes: sanitizeOptions(parsedLocalOptions.remotes),
                    seniorities: sanitizeOptions(parsedLocalOptions.seniorities),
                    industries: sanitizeOptions(parsedLocalOptions.industries),
                    sports: sanitizeOptions(parsedLocalOptions.sport_list),
                    job_areas: sanitizeOptions(parsedLocalOptions.job_area)
                }
                setOptions(filterOptions);
            } else {
                const res = await fetch('/api/dropdown-options');
                const fetchedOptions: DropdownData = await res.json();
                const sortedOptions = Object.keys(fetchedOptions).reduce((acc, key) => {
                    acc[key as keyof DropdownData] = fetchedOptions[key as keyof DropdownData].sort((a: string, b: string) => a.localeCompare(b));
                    return acc;
                }, {} as DropdownData);

                const filterOptions = {
                    countries: sanitizeOptions(sortedOptions.countries),
                    remotes: sanitizeOptions(sortedOptions.remotes),
                    seniorities: sanitizeOptions(sortedOptions.seniorities),
                    industries: sanitizeOptions(sortedOptions.industries),
                    sports: sanitizeOptions(sortedOptions.sport_list),
                    job_areas: sanitizeOptions(sortedOptions.job_area)
                }
                setOptions(filterOptions);
                localStorage.setItem('dropdownOptions', JSON.stringify(sortedOptions));
            }
        };

        getOptions();
    }, []);

    useEffect(() => {
        onFilterChange({ country, remote, seniority, industry, sport, job_area });
    }, [country, remote, seniority, industry, sport, job_area]);

    return (
        <Flex
            direction={{ base: 'column', md: 'row' }}
            wrap="nowrap"
            marginBottom={10}
            justify="space-between"
            filter={user ? 'none' : 'blur(2px)'}
            pointerEvents={user ? 'auto' : 'none'}
            cursor={user ? 'pointer' : 'not-allowed'}
            opacity={user ? 1 : 0.7}
        >
            <Select
                flex="1"
                marginBottom={{ base: 2, md: 0 }}
                marginRight={{ base: 0, md: 2 }}
                size="md"
                borderRadius="full"
                fontWeight="bold"
                bg="gray.700"
                _hover={{ bg: 'gray.600' }}
                _focus={{ bg: 'gray.600' }}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
            >
                <option value="" disabled hidden style={{ backgroundColor: 'black', color: 'white' }}>
                    Country
                </option>
                {country && (
                    <option value="" style={{ backgroundColor: 'black', color: 'white' }}>
                        Clear country filter
                    </option>
                )}
                {options.countries.map((country) => (
                    <option key={country} value={country} style={{ backgroundColor: 'black', color: 'white' }}>
                        {country}
                    </option>
                ))}
            </Select>
            <Select
                flex="1"
                marginBottom={{ base: 2, md: 0 }}
                marginRight={{ base: 0, md: 2 }}
                size="md"
                borderRadius="full"
                fontWeight="bold"
                bg="gray.700"
                _hover={{ bg: 'gray.600' }}
                _focus={{ bg: 'gray.600' }}
                value={remote}
                onChange={(e) => setRemote(e.target.value)}
            >
                <option value="" disabled hidden style={{ backgroundColor: 'black', color: 'white' }}>
                    Remote
                </option>
                {remote && (
                    <option value="" style={{ backgroundColor: 'black', color: 'white' }}>
                        Clear remote filter
                    </option>
                )}
                {options.remotes.map((remoteOption) => (
                    <option key={remoteOption} value={remoteOption} style={{ backgroundColor: 'black', color: 'white' }}>
                        {remoteOption}
                    </option>
                ))}
            </Select>
            <Select
                flex="1"
                marginBottom={{ base: 2, md: 0 }}
                marginRight={{ base: 0, md: 2 }}
                size="md"
                borderRadius="full"
                fontWeight="bold"
                bg="gray.700"
                _hover={{ bg: 'gray.600' }}
                _focus={{ bg: 'gray.600' }}
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
            >
                <option value="" disabled hidden style={{ backgroundColor: 'black', color: 'white' }}>
                    Seniority
                </option>
                {seniority && (
                    <option value="" style={{ backgroundColor: 'black', color: 'white' }}>
                        Clear seniority filter
                    </option>
                )}
                {options.seniorities.map((seniorityOption) => (
                    <option key={seniorityOption} value={seniorityOption} style={{ backgroundColor: 'black', color: 'white' }}>
                        {seniorityOption}
                    </option>
                ))}
            </Select>
            <Select
                flex="1"
                marginBottom={{ base: 2, md: 0 }}
                marginRight={{ base: 0, md: 2 }}
                size="md"
                borderRadius="full"
                fontWeight="bold"
                bg="gray.700"
                _hover={{ bg: 'gray.600' }}
                _focus={{ bg: 'gray.600' }}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
            >
                <option value="" disabled hidden style={{ backgroundColor: 'black', color: 'white' }}>
                    Industry
                </option>
                {industry && (
                    <option value="" style={{ backgroundColor: 'black', color: 'white' }}>
                        Clear industry filter
                    </option>
                )}
                {options.industries.map((industryOption) => (
                    <option key={industryOption} value={industryOption} style={{ backgroundColor: 'black', color: 'white' }}>
                        {industryOption}
                    </option>
                ))}
            </Select>
            <Select
                flex="1"
                marginBottom={{ base: 2, md: 0 }}
                marginRight={{ base: 0, md: 2 }}
                size="md"
                borderRadius="full"
                fontWeight="bold"
                bg="gray.700"
                _hover={{ bg: 'gray.600' }}
                _focus={{ bg: 'gray.600' }}
                value={sport}
                onChange={(e) => setSport(e.target.value)}
            >
                <option value="" disabled hidden style={{ backgroundColor: 'black', color: 'white' }}>
                    Sport
                </option>
                {sport && (
                    <option value="" style={{ backgroundColor: 'black', color: 'white' }}>
                        Clear sport filter
                    </option>
                )}
                {options.sports.map((sportOption) => (
                    <option key={sportOption} value={sportOption} style={{ backgroundColor: 'black', color: 'white' }}>
                        {sportOption}
                    </option>
                ))}
            </Select>
            <Select
                flex="1"
                marginBottom={{ base: 2, md: 0 }}
                marginRight={{ base: 0, md: 2 }}
                size="md"
                borderRadius="full"
                fontWeight="bold"
                bg="gray.700"
                _hover={{ bg: 'gray.600' }}
                _focus={{ bg: 'gray.600' }}
                value={job_area}
                onChange={(e) => setJobArea(e.target.value)}
            >
                <option value="" disabled hidden style={{ backgroundColor: 'black', color: 'white' }}>
                    Job Area
                </option>
                {job_area && (
                    <option value="" style={{ backgroundColor: 'black', color: 'white' }}>
                        Clear job area filter
                    </option>
                )}
                {options.job_areas.map((jobAreaOption) => (
                    <option key={jobAreaOption} value={jobAreaOption} style={{ backgroundColor: 'black', color: 'white' }}>
                        {jobAreaOption}
                    </option>
                ))}
            </Select>
        </Flex>
    );
};
export default JobFilter;