import Link from 'next/link';


import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { BRAND_PRIMARY_LIGHT } from '@/lib/uiTokens';
const PostJobLink: React.FC = () => {
    return (
        <Box mt={4} mb={8} textAlign="center">
            <Link href="/post-job" passHref>
                <Text color={BRAND_PRIMARY_LIGHT} fontSize="sm" _hover={{ textDecoration: 'underline' }}>
                    Post a Job. Start Hiring.
                </Text>
            </Link>
        </Box>
    );
};

export default PostJobLink;
