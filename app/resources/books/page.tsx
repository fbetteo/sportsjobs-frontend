'use client';

import {
    Box,
    Container,
    Heading,
    Text,
    Grid,
    VStack,
    HStack,
    Badge,
    Link,
    Card,
    CardBody,
    Button,
    Image,
    Divider
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaBook, FaArrowLeft, FaStar } from 'react-icons/fa';
import { useUser } from '@auth0/nextjs-auth0/client';

const BookCard = ({
    title,
    author,
    description,
    amazonUrl,
    difficulty,
    rating,
    focus,
    imageUrl,
    isAuthenticated
}: {
    title: string;
    author: string;
    description: string;
    amazonUrl: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    rating: number;
    focus: string[];
    imageUrl?: string;
    isAuthenticated?: boolean;
}) => {
    const getDifficultyColor = () => {
        switch (difficulty) {
            case 'Beginner': return 'green';
            case 'Intermediate': return 'orange';
            case 'Advanced': return 'red';
        }
    };

    return (
        <Card bg="gray.800" borderColor="gray.600" _hover={{ borderColor: 'teal.400' }}>
            <CardBody>
                <HStack align="start" spacing={4}>
                    {imageUrl && (
                        <Image
                            src={imageUrl}
                            alt={`${title} book cover`}
                            boxSize="120px"
                            objectFit="contain"
                            bg="white"
                            p={2}
                            borderRadius="md"
                            flexShrink={0}
                        />
                    )}
                    <VStack align="start" spacing={3} flex={1}>
                        <VStack align="start" spacing={2}>
                            <HStack wrap="wrap">
                                {/* <Badge colorScheme="blue" variant="subtle">
                                    <FaBook style={{ marginRight: '4px' }} />
                                    BOOK
                                </Badge> */}
                                {/* <Badge colorScheme={getDifficultyColor()} variant="solid">
                                    {difficulty}
                                </Badge> */}
                                <HStack spacing={1}>
                                    <FaStar color="gold" size="12px" />
                                    <Text fontSize="xs" color="gray.300">{rating}/5</Text>
                                </HStack>
                            </HStack>
                            <Heading size="md" color="white">{title}</Heading>
                            <Text color="gray.400" fontSize="sm" fontWeight="semibold">by {author}</Text>
                        </VStack>

                        <Text color="gray.300" fontSize="sm">{description}</Text>

                        {/* <VStack align="start" spacing={2} w="full">
                            <Text fontSize="xs" color="gray.400" fontWeight="semibold">Focus Areas:</Text>
                            <HStack wrap="wrap">
                                {focus.map((area, index) => (
                                    <Badge key={index} colorScheme="purple" variant="outline" fontSize="xs">
                                        {area}
                                    </Badge>
                                ))}
                            </HStack>
                        </VStack> */}

                        <Button
                            as={Link}
                            href={amazonUrl}
                            isExternal
                            size="sm"
                            colorScheme="teal"
                            rightIcon={<FaExternalLinkAlt />}
                            _hover={{ textDecoration: 'none' }}
                        >
                            View on Amazon
                        </Button>
                    </VStack>
                </HStack>
            </CardBody>
        </Card>
    );
};

export default function BooksPage() {
    const { user } = useUser();
    const isAuthenticated = !!user;

    return (
        <Container maxW="7xl" py={8}>
            <VStack spacing={8} align="start">
                {/* Header */}
                <Box w="full">
                    <Button
                        as={Link}
                        href="/resources"
                        leftIcon={<FaArrowLeft />}
                        variant="ghost"
                        colorScheme="teal"
                        mb={4}
                        _hover={{ textDecoration: 'none' }}
                    >
                        Back to Resources
                    </Button>
                    <Heading size="2xl" mb={4} color="white">
                        📚 Essential Sports Analytics Books
                    </Heading>
                    <Text fontSize="lg" color="gray.300" maxW="3xl">
                        Curated collection of must-read books for sports analytics professionals,
                        data scientists, and anyone looking to break into the sports industry.
                        From foundational concepts to advanced analytics techniques.
                    </Text>
                </Box>

                <Divider borderColor="gray.600" />

                {/* Books Grid */}
                <Box w="full">
                    <Grid templateColumns={{ base: '1fr' }} gap={6}>
                        <BookCard
                            title="Moneyball: The Art of Winning an Unfair Game"
                            author="Michael Lewis"
                            description="The classic book that started the sports analytics revolution. Follow the Oakland Athletics as they use data and statistics to compete against teams with much larger budgets. Essential reading for understanding how analytics changed baseball forever."
                            amazonUrl="https://amazon.com/Moneyball-Art-Winning-Unfair-Game/dp/0393324818?utm_source=sportsjobs.online&utm_medium=books&utm_campaign=resources"
                            difficulty="Beginner"
                            rating={4.6}
                            focus={["Baseball Analytics", "Team Management", "Statistics", "Sports History"]}
                            imageUrl="https://m.media-amazon.com/images/I/61Sr5X1vAQL._SY466_.jpg"
                            isAuthenticated={isAuthenticated}
                        />

                        <BookCard
                            title="The Numbers Game: Why Everything You Know About Soccer Is Wrong"
                            author="Chris Anderson & David Sally"
                            description="Groundbreaking analysis of soccer using data and statistics. Challenges conventional wisdom about the beautiful game and reveals hidden patterns that determine success. Perfect introduction to soccer analytics and statistical thinking in sports."
                            amazonUrl="https://amazon.com/Numbers-Game-Everything-About-Soccer/dp/0143124560?utm_source=sportsjobs.online&utm_medium=books&utm_campaign=resources"
                            difficulty="Beginner"
                            rating={4.3}
                            focus={["Soccer Analytics", "Statistics", "Performance Analysis", "Team Strategy"]}
                            imageUrl="https://m.media-amazon.com/images/I/61mlASFVStL._SY466_.jpg"
                            isAuthenticated={isAuthenticated}
                        />

                        <BookCard
                            title="Basketball Beyond Paper"
                            author="Dean Oliver"
                            description="A pioneer in the field of basketball analytics, Dean Oliver introduced a framework to understand basketball through the use of statistics in his book Basketball on Paper. In his follow-up, Basketball beyond Paper, Oliver lays out both the technical and personal aspects of his twenty-year experience in the NBA as he helped build the analytics that changed the game. He also looks at the people and technology that pushed those analytics forward."
                            amazonUrl="https://www.amazon.com/Basketball-beyond-Paper-Analytics-Revolution/dp/1496240499?utm_source=sportsjobs.online&utm_medium=books&utm_campaign=resources"
                            difficulty="Beginner"
                            rating={4.9}
                            focus={["Soccer Analytics", "Statistics", "Performance Analysis", "Team Strategy"]}
                            imageUrl="https://m.media-amazon.com/images/I/71RUkz3zb3L._SY466_.jpg"
                            isAuthenticated={isAuthenticated}
                        />

                        <BookCard
                            title="The Midrange Theory"
                            author="Seth Partnow"
                            description="At its core, the goal of any basketball team is relatively simple: take and make good shots while preventing the opponent from doing the same. But what is a “good” shot? Are all good shots created equally? And how might one identify players who are more or less likely to make and prevent those shots in the first place?"
                            amazonUrl="https://www.amazon.com/Midrange-Theory-Seth-Partnow/dp/1629379212?utm_source=sportsjobs.online&utm_medium=books&utm_campaign=resources"
                            difficulty="Beginner"
                            rating={4.5}
                            focus={["Soccer Analytics", "Statistics", "Performance Analysis", "Team Strategy"]}
                            imageUrl="https://m.media-amazon.com/images/I/61gglKlLK3L._SY466_.jpg"
                            isAuthenticated={isAuthenticated}
                        />

                        <BookCard
                            title="Visualize This: The FlowingData Guide to Design, Visualization, and Statistics"
                            author="Nathan Yau"
                            description="At its core, the goal of any basketball team is relatively simple: take and make good shots while preventing the opponent from doing the same. But what is a “good” shot? Are all good shots created equally? And how might one identify players who are more or less likely to make and prevent those shots in the first place?"
                            amazonUrl="https://www.amazon.com/Midrange-Theory-Seth-Partnow/dp/1629379212?utm_source=sportsjobs.online&utm_medium=books&utm_campaign=resources"
                            difficulty="Beginner"
                            rating={4.4}
                            focus={["Soccer Analytics", "Statistics", "Performance Analysis", "Team Strategy"]}
                            imageUrl="https://m.media-amazon.com/images/I/814wWVYUFNL._SY385_.jpg"
                            isAuthenticated={isAuthenticated}
                        />
                    </Grid>
                </Box>

                {/* Coming Soon Section */}
                <Box w="full" bg="gray.900" p={6} borderRadius="lg" borderWidth="1px" borderColor="gray.600">
                    <Heading size="lg" mb={4} color="white">📖 More Books Coming Soon</Heading>
                    <Text color="gray.300" mb={4}>
                        We&apos;re building a comprehensive library of sports analytics books covering:
                    </Text>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <VStack align="start" spacing={2}>
                            <Text color="gray.400" fontSize="sm">• Advanced Statistical Methods</Text>
                            <Text color="gray.400" fontSize="sm">• Machine Learning in Sports</Text>
                            <Text color="gray.400" fontSize="sm">• Basketball Analytics</Text>
                            <Text color="gray.400" fontSize="sm">• Hockey Analytics</Text>
                        </VStack>
                        <VStack align="start" spacing={2}>
                            <Text color="gray.400" fontSize="sm">• Sports Betting & Odds</Text>
                            <Text color="gray.400" fontSize="sm">• Data Visualization</Text>
                            <Text color="gray.400" fontSize="sm">• Programming for Sports</Text>
                            <Text color="gray.400" fontSize="sm">• Industry Career Guides</Text>
                        </VStack>
                    </Grid>
                    <Text color="teal.300" fontSize="sm" mt={4} fontStyle="italic">
                        💡 Have a book recommendation? Contact us and we&apos;ll add it to our collection!
                    </Text>
                </Box>

                {/* Call to Action */}
                {!isAuthenticated && (
                    <Box
                        w="full"
                        bg="purple.900"
                        p={6}
                        borderRadius="lg"
                        textAlign="center"
                        borderWidth="1px"
                        borderColor="purple.600"
                    >
                        <Heading size="lg" mb={3} color="white">
                            📚 Get More Learning Resources
                        </Heading>
                        <Text color="gray.300" mb={4}>
                            Join SportsJobs to access all the jobs and exclusive discount codes on courses and tools. All other resources are free.
                        </Text>
                        <Button
                            as={Link}
                            href="/signup"
                            colorScheme="purple"
                            size="lg"
                            _hover={{ textDecoration: 'none' }}
                        >
                            Sign Up Now
                        </Button>
                    </Box>
                )}
            </VStack>
        </Container>
    );
}
