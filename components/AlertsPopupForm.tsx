// components/UserFormPopup.tsx

import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
    Box, Button, Input, FormControl, FormLabel, useToast,
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalFooter, ModalBody, ModalCloseButton, Select, Text,
    Wrap,
    WrapItem,
    TagLabel,
    Tag,
    TagCloseButton,
    MenuButton,
    MenuList,
    MenuItem,
    Checkbox,
    Menu
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

type UserFormPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    options: {
        countries: string[];
        remotes: string[];
        seniorities: string[];
        hours: string[];
        sport_list: string[];
        skills: string[];
    };
};


const UserFormPopup = ({ isOpen, onClose, options }: UserFormPopupProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState<string[]>([]);
    const [remote_office, setRemoteOffice] = useState<string[]>([]);
    const [seniority, setSeniority] = useState<string[]>([]);
    const [hours, setHours] = useState<string[]>([]);
    const [sport_list, setSportList] = useState<string[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const toast = useToast();

    const handleSelectChange = (setState: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setState(prevState => {
            if (prevState.includes(value)) {
                return prevState.filter(item => item !== value);
            } else {
                return [...prevState, value];
            }
        });
    };
    const handleRemoveOption = (option: string, selectedOptions: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
        const newOptions = selectedOptions.filter(selected => selected !== option);
        setState(newOptions);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/create-alert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, country, seniority, sport_list, skills, remote_office, hours }),
        });

        const { error } = await res.json();

        if (error) {
            toast({
                title: 'Error',
                description: error,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Success',
                description: 'Your information has been submitted!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setName('');
            setEmail('');
            setCountry([]);
            setRemoteOffice([]);
            setSeniority([]);
            setHours([]);
            setSportList([])
            setSkills([]);
            onClose();
        }
    };

    const renderSelectedOptions = (selectedOptions: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => (
        <Wrap mt={2}>
            {selectedOptions.map(option => (
                <WrapItem key={option}>
                    <Tag size="sm" borderRadius="full" variant="solid" colorScheme="teal">
                        <TagLabel>{option}</TagLabel>
                        <TagCloseButton onClick={() => handleRemoveOption(option, selectedOptions, setState)} />
                    </Tag>
                </WrapItem>
            ))}
        </Wrap>
    );


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg='purple.900'>
                <ModalHeader>Submit Your Information</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box as="form" onSubmit={handleSubmit}>
                        <FormControl>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <Text mt={4} fontSize="lg" fontWeight="bold">Filters (Optional)</Text>
                            <FormLabel htmlFor="country">Country </FormLabel>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg='gray.700' color='white'>
                                    Select Country
                                </MenuButton>
                                <MenuList bg='gray.700' maxH="200px" overflowY="auto">
                                    {options.countries.map(option => (
                                        <MenuItem key={option} onClick={() => handleSelectChange(setCountry, option)} bg='gray.700' color='white'>
                                            <Checkbox isChecked={country.includes(option)} onChange={() => handleSelectChange(setCountry, option)}
                                                mr={2} />
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                            {renderSelectedOptions(country, setCountry)}
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor="remote">Remote </FormLabel>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg='gray.700' color='white'>
                                    Select Remote
                                </MenuButton>
                                <MenuList bg='gray.700' maxH="200px" overflowY="auto">
                                    {options.remotes.map(option => (
                                        <MenuItem key={option} onClick={() => handleSelectChange(setRemoteOffice, option)} bg='gray.700' color='white'>
                                            <Checkbox isChecked={remote_office.includes(option)} onChange={() => handleSelectChange(setRemoteOffice, option)}
                                                mr={2} />
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                            {renderSelectedOptions(remote_office, setRemoteOffice)}
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor="seniority">Seniority </FormLabel>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg='gray.700' color='white'>
                                    Select Seniority
                                </MenuButton>
                                <MenuList bg='gray.700' maxH="200px" overflowY="auto">
                                    {options.seniorities.map(option => (
                                        <MenuItem key={option} onClick={() => handleSelectChange(setSeniority, option)} bg='gray.700' color='white'>
                                            <Checkbox isChecked={seniority.includes(option)} onChange={() => handleSelectChange(setSeniority, option)}
                                                mr={2} />
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                            {renderSelectedOptions(seniority, setSeniority)}
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor="hours">Hours </FormLabel>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg='gray.700' color='white'>
                                    Select Hours
                                </MenuButton>
                                <MenuList bg='gray.700' maxH="200px" overflowY="auto">
                                    {options.hours.map(option => (
                                        <MenuItem key={option} onClick={() => handleSelectChange(setHours, option)} bg='gray.700' color='white'>
                                            <Checkbox isChecked={hours.includes(option)} onChange={() => handleSelectChange(setHours, option)}
                                                mr={2} />
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                            {renderSelectedOptions(hours, setHours)}
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor="sports">Sports </FormLabel>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg='gray.700' color='white'>
                                    Select Sports
                                </MenuButton>
                                <MenuList bg='gray.700' maxH="200px" overflowY="auto">
                                    {options.sport_list.map(option => (
                                        <MenuItem key={option} onClick={() => handleSelectChange(setSportList, option)} bg='gray.700' color='white'>
                                            <Checkbox isChecked={sport_list.includes(option)} onChange={() => handleSelectChange(setSportList, option)}
                                                mr={2} />
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                            {renderSelectedOptions(sport_list, setSportList)}
                        </FormControl>
                        <Button mt={4} colorScheme="teal" type="submit">
                            Submit
                        </Button>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default UserFormPopup;
