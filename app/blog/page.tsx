// app/blog/page.tsx

import { fetchBlogPosts } from '../../lib/fetchBlogPosts';
import {
    Box,
    Container,
    Heading,
    Text,
    Link as ChakraLink,
    Flex,
    VStack,
    useColorModeValue,
    Grid,
    GridItem,
    Image, // Add the import statement for the 'Image' component
} from '@chakra-ui/react';
import Link from 'next/link';
import { parse, format } from 'date-fns';

export default async function BlogPage() {
    const blogPosts = await fetchBlogPosts(100, JSON.stringify(""));

    return (
        <Container maxW="container.lg" py={8}>
            <Heading as="h1" size="xl" mb={8} textAlign="center">
                Blog
            </Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
                {blogPosts.map((post: any) => {
                    // const parsedDate = parse(post.post_date, 'M/d/yyyy', new Date());
                    // const formattedDate = format(parsedDate, 'MMMM d, yyyy');
                    return (
                        <GridItem
                            key={post.id}
                            p={5}
                            shadow="md"
                            borderWidth="1px"
                            borderRadius="md"
                            _hover={{ shadow: 'lg' }}
                        >
                            <Link href={`/blogposts/${post.id}`} passHref>
                                <ChakraLink _hover={{ textDecor: 'none' }}>
                                    <VStack spacing={4} align="stretch">
                                        {post.cover && (
                                            <Image
                                                src={post.cover[0].url} // Assuming cover is an array with image objects
                                                alt={post.title}
                                                borderRadius="md"
                                                objectFit="cover"
                                                w="100%"
                                                h="200px"
                                            />
                                        )}
                                        <Box flex="1">
                                            <Heading as="h2" size="md" mb={2}>
                                                {post.title}
                                            </Heading>
                                            <Text fontSize="sm" color="gray.500">
                                                {/* {formattedDate} */}
                                            </Text>
                                            <Text mt={2}>{post.summary}</Text>
                                        </Box>
                                    </VStack>
                                </ChakraLink>
                            </Link>
                        </GridItem>
                    )
                })}
            </Grid>
        </Container>
    );
}
