'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    SimpleGrid,
    Skeleton,
    Text,
    VStack
} from '@chakra-ui/react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {
    BRAND_BACKGROUND_TOKEN,
    BRAND_FOREGROUND,
    BRAND_PRIMARY,
    BRAND_PRIMARY_LIGHT,
    BRAND_SECONDARY,
    BRAND_SECONDARY_LIGHT,
    BRAND_SECONDARY_SURFACE,
    BRAND_SECONDARY_SURFACE_HOVER
} from '@/lib/uiTokens';

type DbTestimonial = {
    id?: string | number;
    name?: string;
    role?: string | null;
    company?: string | null;
    content?: string;
    avatar_url?: string | null;
    rating?: number | null;
};

let testimonialsCache: DbTestimonial[] | null = null;
let testimonialsRequest: Promise<DbTestimonial[]> | null = null;

function normalizeTestimonials(payload: unknown): DbTestimonial[] {
    if (Array.isArray(payload)) return payload as DbTestimonial[];

    if (payload && typeof payload === 'object') {
        const source = payload as Record<string, unknown>;

        if (Array.isArray(source.testimonials)) return source.testimonials as DbTestimonial[];
        if (Array.isArray(source.data)) return source.data as DbTestimonial[];
        if (Array.isArray(source.items)) return source.items as DbTestimonial[];
    }

    return [];
}

function RatingStars({ rating }: { rating?: number | null }) {
    const safeRating = Number.isFinite(rating) ? Math.min(5, Math.max(1, Number(rating))) : null;

    return (
        <HStack spacing={0.5}>
            {[1, 2, 3, 4, 5].map((index) => (
                <Icon
                    key={index}
                    as={safeRating && index <= safeRating ? AiFillStar : AiOutlineStar}
                    color={safeRating && index <= safeRating ? BRAND_PRIMARY : BRAND_SECONDARY_LIGHT}
                    boxSize={5}
                />
            ))}
        </HStack>
    );
}

function TestimonialCard({ item }: { item: DbTestimonial }) {
    const who = [item.role, item.company].filter(Boolean).join(' at ');
    const displayName = item.name || 'Anonymous';
    const fallbackLetter = displayName.trim().charAt(0).toUpperCase() || 'A';

    return (
        <Box
            position="relative"
            overflow="hidden"
            borderWidth="1px"
            borderColor={BRAND_SECONDARY_SURFACE_HOVER}
            borderRadius="md"
            bgGradient={`linear(to-br, ${BRAND_SECONDARY_SURFACE_HOVER}, ${BRAND_SECONDARY_SURFACE}, ${BRAND_BACKGROUND_TOKEN})`}
            p={{ base: 5, md: 6 }}
            pt={{ base: 6, md: 7 }}
            minH={{ base: '280px', md: '320px' }}
            display="flex"
            flexDirection="column"
            boxShadow="xl"
            transition="transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease"
            _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                h: '5px',
                bg: BRAND_PRIMARY,
            }}
            _after={{
                content: '"\\201C"',
                position: 'absolute',
                top: 3,
                right: 5,
                color: BRAND_PRIMARY_LIGHT,
                fontSize: { base: '52px', md: '64px' },
                lineHeight: 1,
                opacity: 0.22,
                pointerEvents: 'none',
            }}
            _hover={{
                transform: 'translateY(-4px)',
                borderColor: BRAND_PRIMARY_LIGHT,
                boxShadow: '2xl',
            }}
        >
            <HStack spacing={3} align="center">
                <Avatar
                    size="md"
                    name={displayName}
                    src={item.avatar_url || undefined}
                    bg={BRAND_SECONDARY}
                    color={BRAND_FOREGROUND}
                    borderWidth="2px"
                    borderColor={BRAND_PRIMARY}
                    getInitials={() => fallbackLetter}
                />
                <VStack align="stretch" spacing={0}>
                    <Text fontWeight="bold" color={BRAND_FOREGROUND} lineHeight="short">
                        {displayName}
                    </Text>
                    {who && (
                        <Text fontSize="sm" color="gray.300" lineHeight="short" noOfLines={1}>
                            {who}
                        </Text>
                    )}
                </VStack>
            </HStack>

            <Box mt={4}>
                <RatingStars rating={item.rating} />
            </Box>

            <Text
                mt={4}
                color={BRAND_FOREGROUND}
                fontSize={{ base: 'md', md: 'lg' }}
                lineHeight="tall"
                noOfLines={{ base: 6, md: 7 }}
                flex="1"
            >
                &quot;{item.content || 'No testimonial text provided.'}&quot;
            </Text>
        </Box>
    );
}

export default function TestimonialsPagedWallFromDB() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<DbTestimonial[]>([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const loadTestimonials = async () => {
            setIsLoading(true);
            setError(null);

            try {
                if (testimonialsCache) {
                    if (!cancelled) setItems(testimonialsCache);
                    return;
                }

                if (!testimonialsRequest) {
                    testimonialsRequest = (async () => {
                        const response = await fetch('/api/testimonials', {
                            method: 'GET',
                            cache: 'no-store',
                        });

                        const data = await response.json();

                        if (!response.ok) {
                            throw new Error(data?.error || 'Failed to load testimonials');
                        }

                        return normalizeTestimonials(data);
                    })();
                }

                const normalized = await testimonialsRequest;
                testimonialsCache = normalized;

                if (!cancelled) setItems(normalized);
            } catch (err) {
                testimonialsRequest = null;
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Could not load testimonials');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        loadTestimonials();

        return () => {
            cancelled = true;
        };
    }, []);

    const pages = useMemo(() => {
        const chunks: DbTestimonial[][] = [];
        for (let index = 0; index < items.length; index += 3) {
            chunks.push(items.slice(index, index + 3));
        }
        return chunks;
    }, [items]);

    const activeItems = pages[page] ?? pages[0] ?? [];
    const canPage = pages.length > 1;

    const goPrevious = () => {
        setPage((current) => (current === 0 ? pages.length - 1 : current - 1));
    };

    const goNext = () => {
        setPage((current) => (current + 1) % pages.length);
    };

    return (
        <VStack align="stretch" spacing={5}>
            <Flex align="center" justify="space-between" gap={4}>
                <Heading size="2xl">300+ professionals are saying</Heading>
                {canPage && (
                    <HStack spacing={2}>
                        <IconButton
                            aria-label="Previous testimonials"
                            icon={<FaChevronLeft />}
                            size="sm"
                            variant="outline"
                            color={BRAND_FOREGROUND}
                            borderColor={BRAND_SECONDARY_LIGHT}
                            bg={BRAND_SECONDARY_SURFACE}
                            _hover={{ bg: BRAND_PRIMARY, borderColor: BRAND_PRIMARY }}
                            onClick={goPrevious}
                        />
                        <IconButton
                            aria-label="Next testimonials"
                            icon={<FaChevronRight />}
                            size="sm"
                            variant="outline"
                            color={BRAND_FOREGROUND}
                            borderColor={BRAND_SECONDARY_LIGHT}
                            bg={BRAND_SECONDARY_SURFACE}
                            _hover={{ bg: BRAND_PRIMARY, borderColor: BRAND_PRIMARY }}
                            onClick={goNext}
                        />
                    </HStack>
                )}
            </Flex>

            {isLoading && (
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    {[1, 2, 3].map((i) => (
                        <Box key={i} borderWidth="1px" borderColor={BRAND_SECONDARY_SURFACE_HOVER} borderRadius="md" p={6} bg={BRAND_SECONDARY_SURFACE}>
                            <Skeleton height="20px" mb={3} />
                            <Skeleton height="16px" mb={2} />
                            <Skeleton height="16px" mb={2} />
                            <Skeleton height="16px" w="70%" />
                        </Box>
                    ))}
                </SimpleGrid>
            )}

            {!isLoading && error && (
                <Box borderWidth="1px" borderColor="red.500" borderRadius="md" p={4} bg="red.900" color="red.100">
                    {error}
                </Box>
            )}

            {!isLoading && !error && !items.length && (
                <Box borderWidth="1px" borderColor={BRAND_SECONDARY_LIGHT} borderRadius="md" p={4} bg={BRAND_SECONDARY_SURFACE} color="gray.300">
                    No testimonials available yet.
                </Box>
            )}

            {!isLoading && !error && !!items.length && (
                <>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        {activeItems.map((item, index) => (
                            <TestimonialCard
                                key={item.id ?? `${item.name ?? 'testimonial'}-${page}-${index}`}
                                item={item}
                            />
                        ))}
                    </SimpleGrid>

                    {canPage && (
                        <HStack justify="center" spacing={2}>
                            {pages.map((_, index) => (
                                <Button
                                    key={index}
                                    aria-label={`Show testimonial page ${index + 1}`}
                                    minW={index === page ? '22px' : '8px'}
                                    h="8px"
                                    p={0}
                                    borderRadius="full"
                                    bg={index === page ? BRAND_PRIMARY : BRAND_SECONDARY_LIGHT}
                                    transition="all 0.2s ease"
                                    _hover={{ bg: BRAND_PRIMARY }}
                                    onClick={() => setPage(index)}
                                />
                            ))}
                        </HStack>
                    )}
                </>
            )}
        </VStack>
    );
}
