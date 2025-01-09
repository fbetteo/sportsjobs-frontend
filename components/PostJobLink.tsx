import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import Link from 'next/link';

const PostJobLink: React.FC = () => {
    return (
        <Box mt={4} mb={8} textAlign="center">
            <Link href="/post-job" passHref>
                <Text color="gray.500" fontSize="sm" _hover={{ textDecoration: 'underline' }}>
                    Post a Job. Start Hiring.
                </Text>
            </Link>
        </Box>
    );
};

export default PostJobLink;
