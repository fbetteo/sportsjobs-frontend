// components/SignupForm.tsx

import React, { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, useToast, Flex, Text } from '@chakra-ui/react';

const NewsletterSignupForm = () => {
    const [email, setEmail] = useState('');
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/subscribe-newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
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
                description: 'You have been subscribed!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setEmail('');
        }
    };

    return (
        <Box as="form" onSubmit={handleSubmit} p={4} boxShadow="md" borderRadius="md" mb={4}>
            <Text mb={2} fontSize="sm" color="gray.300">
                Do you want to keep updated with jobs and news? 💡
            </Text>
            <Flex alignItems="center">
                <FormControl>
                    <FormLabel htmlFor="email" srOnly>Email</FormLabel>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        mr={0}
                        borderRightRadius="0"
                    />
                </FormControl>
                <Button bg="#D4A017" color="white"
                    _hover={{ bg: '#B8860B' }}
                    _active={{ bg: '#A67C00' }} type="submit" borderLeftRadius="0"
                    borderRightRadius="md">
                    Join
                </Button>
            </Flex>
        </Box>
    );
};

export default NewsletterSignupForm;
