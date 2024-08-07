// components/SignupPopup.tsx (updated)

import React, { useEffect, useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useUser } from '@auth0/nextjs-auth0/client'; //

const SignupPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const toast = useToast();
    const { user, isLoading: userLoading } = useUser(); // Adjust according to your auth implementation

    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => {
                if (!localStorage.getItem('signupPopupShown')) {
                    setIsOpen(true);
                }
            }, 7000); // 10 seconds

            return () => clearTimeout(timer);
        }
    }, [user]);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('signupPopupShown', 'true');
    };

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
            handleClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size='xl'>
            <ModalOverlay />
            <ModalContent bg='purple.900'>
                <ModalHeader>Join hundreds of people getting the latest news and content related to working in sports.</ModalHeader>
                <ModalCloseButton />
                <ModalBody >
                    <Box as="form" onSubmit={handleSubmit}>
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
                        <Button mt={4} colorScheme="yellow" type="submit">
                            Subscribe to the newsletter
                        </Button>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={handleClose} colorScheme='black'>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default SignupPopup;
