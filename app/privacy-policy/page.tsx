import { Box, Heading, Text } from '@chakra-ui/react';

export async function generateMetadata() {
    return {
        title: 'Privacy Policy - SportsJobs Online',
        description: 'Read the privacy policy of SportsJobs Online.',
    };
}

const PrivacyPolicyPage = () => {
    return (
        <Box p={8} maxW="800px" mx="auto">
            <Heading as="h1" mb={6}>
                Privacy Policy for Sportsjobs
            </Heading>
            <Text fontSize="sm" color="gray.500" mb={6}>
                Last Updated: 2024-01-03
            </Text>

            <Heading as="h2" size="md" mt={6} mb={4}>
                1. Introduction
            </Heading>
            <Text mb={4}>
                Welcome to Sportsjobs.online. We are committed to protecting the privacy and security of our users. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={4}>
                2. Information Collection and Use
            </Heading>
            <Text mb={4}>
                We collect only the essential information required to provide our services. This includes:
            </Text>
            <Text mb={4}>
                <strong>Email Addresses:</strong> We collect your email address when you sign up for our services or subscribe to our newsletters. We use your email to communicate with you about job opportunities, updates, and other relevant information.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={4}>
                3. Payment Processing
            </Heading>
            <Text mb={4}>
                Payment processing on our site is handled by Stripe. We do not store or have access to your credit card information. Stripe&apos;s use of your personal information is governed by their Privacy Policy.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={4}>
                4. Cookies and Tracking Technologies
            </Heading>
            <Text mb={4}>
                We do not use cookies or similar tracking technologies on our website.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={4}>
                5. Data Sharing and Disclosure
            </Heading>
            <Text mb={4}>
                We do not share your personal information with third parties, except as required by law.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={4}>
                6. Data Security
            </Heading>
            <Text mb={4}>
                We take reasonable measures to protect the information you provide against loss, theft, and unauthorized use, disclosure, or modification. However, no internet or email transmission is ever fully secure or error-free.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={4}>
                7. User Rights and Choices
            </Heading>
            <Text mb={4}>
                You have the right to access, update, or delete your email information. If you wish to exercise these rights, please contact us.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={4}>
                8. Changes to the Privacy Policy
            </Heading>
            <Text mb={4}>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={4}>
                9. Contact Information
            </Heading>
            <Text mb={4}>
                If you have any questions about this Privacy Policy, please contact us using the Contact page.
            </Text>
        </Box>
    );
};

export default PrivacyPolicyPage;
