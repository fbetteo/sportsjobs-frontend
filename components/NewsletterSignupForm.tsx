// components/SignupForm.tsx

import React, { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, useToast } from '@chakra-ui/react';

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
        <Box as="form" onSubmit={handleSubmit} p={4} boxShadow="md" borderRadius="md">
            <FormControl>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </FormControl>
            <Button mt={4} colorScheme="teal" type="submit">
                Subscribe
            </Button>
        </Box>
    );
};

export default NewsletterSignupForm;
