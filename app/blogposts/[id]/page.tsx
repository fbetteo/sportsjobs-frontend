// app/jobs/[id]/page.tsx

import { marked } from 'marked';
import { Box, Heading, Text, Image, Badge, HStack, Flex, Button, Divider } from '@chakra-ui/react';
import MixedPricingCard from '@/components/MixedPriceCard';
import BackToMainButton from '@/components/BackToMainButton';
import styles from '../../../markdown.module.css';
import { Metadata } from 'next';
import { fetchBlogPostDetails } from '@/lib/fetchBlogPostDetails';
import SenjaWallOfLove from '@/components/WallOfLove';



export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const blog_details = await fetchBlogPostDetails(params.id);

    if (!blog_details) {
        return {
            title: 'Job Not Found - SportsJobs Online',
            description: 'The job you are looking for does not exist.',
        };
    }

    return {
        title: `${blog_details.title} - SportsJobs Online`,
        description: `${blog_details.short_description}. Find more great sports analytics jobs like this on Sportsjobs Online. Sports and betting analytics careers`,
        openGraph: {
            title: `${blog_details.title} - SportsJobs Online`,
            description: `${blog_details.short_description}. Find more great sports analytics jobs like this on Sportsjobs Online. Sports and betting analytics careers`,
            url: `https://www.sportsjobs.online/blogposts/${params.id}`,
            type: 'website',
            siteName: 'SportsJobs Online',
            images: [
                {
                    url: blog_details.cover || 'https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png',
                    width: 800,
                    height: 600,
                    alt: `Cover of ${blog_details.title}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${blog_details.title} - SportsJobs Online`,
            description: `${blog_details.short_description}. Find more great sports analytics jobs like this on Sportsjobs Online. Sports and betting analytics careers`,
            images: [
                blog_details.cover || 'https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png',
            ],
        },
    };
}




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
                <head>
                    <link rel="canonical" href={`https://www.sportsjobs.online/blogposts/${params.id}`} />
                </head>
                <Box p={5} minHeight="100vh">
                    <Flex direction="column" align="center" justify="center" textAlign="center" maxW="800px" mx="auto">
                        <Image
                            src={blogpost.cover}
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
                        <Flex justify="center" mb={4}>
                            <BackToMainButton variant="compact" />
                        </Flex>
                        <Divider borderColor="gray.300" mb={6} />
                        <Box mt={4} textAlign="left" width="100%" lineHeight="tall">
                            <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                        </Box>
                    </Flex>
                </Box>
                <Flex direction="column" width="100%" alignItems="center" py={10} >
                    <BackToMainButton />
                    <MixedPricingCard />
                    <SenjaWallOfLove />
                </Flex>
            </main>
        </>
    );
}
