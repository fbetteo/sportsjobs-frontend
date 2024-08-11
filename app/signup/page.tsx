// app/signup/page.tsx

'use client';

import { Suspense, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    VStack,
    Heading,
    Text,
    Container,
    Spinner
} from '@chakra-ui/react';
import { Providers } from '../providers';
import { useSearchParams } from 'next/navigation';
import SenjaWallOfLove from '@/components/WallOfLove';
import MixedPricingCard from '@/components/MixedPriceCard';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CardInput = () => (
    <Box
        p={4}
        borderWidth="1px"
        borderRadius="md"
        borderColor="gray.300"
        bg="white"
    >
        <CardElement options={{ hidePostalCode: true }} />
    </Box>
);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam) {
            setPlan(planParam);
        }
    }, [searchParams]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        if (!stripe || !elements) return;

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)!,
            billing_details: {
                email
            }
        });

        if (error) {
            console.error(error);
            setIsLoading(false);
        } else {
            const response = await fetch('/api/create-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    paymentMethodId: paymentMethod.id,
                    plan,
                    password
                })
            });

            const subscription = await response.json();

            if (subscription.status === 'active') {
                alert('Subscription successful!');
            } else {
                console.error('Subscription failed', subscription);
            }
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
                <FormControl id="email" isRequired>
                    <FormLabel >Email</FormLabel>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </FormControl>
                <FormControl id="plan" isRequired>
                    <FormLabel>Choose a Plan</FormLabel>
                    <Select bg="gray.700" _hover={{ bg: 'gray.600' }} _placeholder={{ color: "white" }}
                        _focus={{ bg: 'gray.600' }} placeholder="Select Plan" value={plan} onChange={(e) => setPlan(e.target.value)}>
                        <option value="Monthly" style={{ backgroundColor: 'black', color: 'white' }}>Monthly - $4.99/month</option>
                        <option value="Yearly" style={{ backgroundColor: 'black', color: 'white' }}>Yearly - $29.99/Year</option>
                    </Select>
                </FormControl>
                <FormControl id="card" isRequired>
                    <FormLabel>Card Details</FormLabel>
                    <CardInput />
                </FormControl>
                <Button
                    mt={4}
                    colorScheme="teal"
                    type="submit"
                    isLoading={isLoading}
                    disabled={!stripe || !elements}
                >
                    Sign Up
                </Button>
            </VStack>
        </form>
    );
};

const SignupPage = () => (
    <Elements stripe={stripePromise}>
        <Container centerContent>
            <Box
                p={8}
                maxWidth="500px"
                width="100%"
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="lg"
                bg="gray.700"
            >
                <VStack spacing={4} align="stretch">
                    <Heading as="h1" size="lg" textAlign="center">
                        Sign Up
                    </Heading>
                    <Text fontSize="lg" textAlign="center">
                        Choose a plan and enter your payment details to get started.
                    </Text>
                    <Suspense fallback={<Spinner size="xl" />}>
                        <CheckoutForm />
                    </Suspense>
                </VStack>
            </Box>
        </Container>
        <MixedPricingCard />
        <SenjaWallOfLove />
    </Elements>
);

export default SignupPage;
