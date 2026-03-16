'use client';

import {
    Avatar,
    Badge,
    Box,
    HStack,
    Heading,
    Icon,
    SimpleGrid,
    Skeleton,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

let testimonialsCache: DbTestimonial[] | null = null;
let testimonialsRequest: Promise<DbTestimonial[]> | null = null;

type DbTestimonial = {
    id?: string | number;
    name?: string;
    role?: string | null;
    company?: string | null;
    content?: string;
    avatar_url?: string | null;
    rating?: number | null;
    created_at?: string | null;
    creation_date?: string | null;
    date?: string | null;
    submitted_at?: string | null;
};

function formatTestimonialDate(item: DbTestimonial): string | null {
    const rawDate = item.created_at || item.creation_date || item.date || item.submitted_at;
    if (!rawDate) return null;

    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) return null;

    return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

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
        <HStack spacing={1}>
            {[1, 2, 3, 4, 5].map((index) => (
                <Icon
                    key={index}
                    as={safeRating && index <= safeRating ? AiFillStar : AiOutlineStar}
                    color={safeRating && index <= safeRating ? 'yellow.400' : 'gray.600'}
                    boxSize={6}
                />
            ))}
        </HStack>
    );
}

export default function TestimonialsWallFromDB() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<DbTestimonial[]>([]);

    useEffect(() => {
        let cancelled = false;

        const loadTestimonials = async () => {
            setIsLoading(true);
            setError(null);

            try {
                if (testimonialsCache) {
                    if (!cancelled) {
                        setItems(testimonialsCache);
                    }
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

                if (!cancelled) {
                    setItems(normalized);
                }
            } catch (err) {
                testimonialsRequest = null;
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Could not load testimonials');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadTestimonials();

        return () => {
            cancelled = true;
        };
    }, []);

    const hasItems = useMemo(() => items.length > 0, [items]);

    return (
        <VStack align="stretch" spacing={5} mt={8}>
            <Heading size="2xl" textAlign="center" w="100%" mb={8}>Wall of Love</Heading>

            {isLoading && (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {[1, 2, 3, 4].map((i) => (
                        <Box key={i} borderWidth="1px" borderColor="gray.700" borderRadius="xl" p={5} bg="gray.900">
                            <Skeleton height="20px" mb={3} />
                            <Skeleton height="16px" mb={2} />
                            <Skeleton height="16px" mb={2} />
                            <Skeleton height="16px" w="70%" />
                        </Box>
                    ))}
                </SimpleGrid>
            )}

            {!isLoading && error && (
                <Box borderWidth="1px" borderColor="red.500" borderRadius="xl" p={4} bg="red.900" color="red.100">
                    {error}
                </Box>
            )}

            {!isLoading && !error && !hasItems && (
                <Box borderWidth="1px" borderColor="gray.700" borderRadius="xl" p={4} bg="gray.900" color="gray.300">
                    No testimonials available yet.
                </Box>
            )}

            {!isLoading && !error && hasItems && (
                <Box
                    sx={{
                        columnCount: { base: 1, md: 2, xl: 3 },
                        columnGap: '16px',
                    }}
                >
                    {items.map((item, index) => {
                        const who = [item.role, item.company].filter(Boolean).join(' at ');
                        const displayDate = formatTestimonialDate(item);
                        const displayName = item.name || 'Anonymous';
                        const fallbackLetter = displayName.trim().charAt(0).toUpperCase() || 'A';
                        return (
                            <Box
                                key={item.id ?? `${displayName}-testimonial-${index}`}
                                borderWidth="1px"
                                borderColor="gray.700"
                                borderRadius="xl"
                                p={5}
                                bg="gray.900"
                                mb={4}
                                sx={{
                                    breakInside: 'avoid',
                                    pageBreakInside: 'avoid',
                                    WebkitColumnBreakInside: 'avoid',
                                }}
                            >
                                <HStack spacing={3} align="flex-start">
                                    <Avatar
                                        size="md"
                                        name={displayName}
                                        src={item.avatar_url || undefined}
                                        bg="green.200"
                                        color="gray.900"
                                        getInitials={() => fallbackLetter}
                                    />
                                    <VStack align="stretch" spacing={0.5}>
                                        <Text fontWeight="bold" color="white" lineHeight="short">
                                            {displayName}
                                        </Text>
                                        {who && (
                                            <Text fontSize="sm" color="gray.400" lineHeight="short">
                                                {who}
                                            </Text>
                                        )}
                                    </VStack>
                                </HStack>

                                <Box mt={3}>
                                    <RatingStars rating={item.rating} />
                                </Box>

                                <Text mt={3} color="gray.100" fontSize={{ base: 'sm', md: 'md' }} lineHeight="tall" fontWeight="normal">
                                    &quot;{item.content || 'No testimonial text provided.'}&quot;
                                </Text>

                                {displayDate && (
                                    <Text mt={4} fontSize="sm" color="gray.500">
                                        {displayDate}
                                    </Text>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            )}
        </VStack>
    );
}
