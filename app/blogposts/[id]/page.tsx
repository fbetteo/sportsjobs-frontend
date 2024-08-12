// app/jobs/[id]/page.tsx

import { fetchJobDetails } from '../../../lib/fetchJobDetails';
import { marked } from 'marked';
import { addMonths, format } from 'date-fns';
import { Box, Heading, Text, Image, Badge, HStack, Flex, Button, Divider } from '@chakra-ui/react';
import MixedPricingCard from '@/components/MixedPriceCard';
import styles from '../../../markdown.module.css';
import { Metadata } from 'next';
import { fetchBlogPostDetails } from '@/lib/fetchBlogPostDetails';
import SenjaWallOfLove from '@/components/WallOfLove';





export default async function BlogPostPage({ params }: { params: { id: string } }) {
    const blogpost = await fetchBlogPostDetails(params.id);

    if (!blogpost) {
        return (
            <Box p={5}>
                <Heading as="h1" size="xl" mb={5}>
                    Blogpost Not Found
                </Heading>
            </Box>
        );
    }

    const descriptionHtml = marked(blogpost.content);

    return (
        <>
            <main>
                <Box p={5} minHeight="100vh">
                    <Flex direction="column" align="center" justify="center" textAlign="center" maxW="800px" mx="auto">
                        <Image
                            src={blogpost.cover[0].url}
                            alt={`Cover of ${blogpost.title}`}
                            borderRadius="lg"
                            objectFit="cover"
                            width="100%"
                            height="auto"
                            maxHeight="400px"
                            mb={6}
                            shadow="lg"
                        />
                        <Heading as="h1" size="2xl" mb={4} fontWeight="bold">
                            {blogpost.title}
                        </Heading>
                        <Divider borderColor="gray.300" mb={6} />
                        <Box mt={4} textAlign="left" width="100%" lineHeight="tall">
                            <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                        </Box>
                    </Flex>
                </Box>
                <Flex direction="column" width="100%" alignItems="center" py={10} >
                    <MixedPricingCard />
                    <SenjaWallOfLove />
                </Flex>
            </main>
        </>
    );
}
