'use client';

import {
    Avatar,
    Box,
    HStack,
    Icon,
    Skeleton,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

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
                    color={safeRating && index <= safeRating ? 'yellow.400' : 'gray.600'}
                    boxSize={4}
                />
            ))}
        </HStack>
    );
}

export default function TestimonialsMarqueeFromDB() {
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

    const { topRowItems, bottomRowItems } = useMemo(() => {
        if (!items.length) {
            return { topRowItems: [] as DbTestimonial[], bottomRowItems: [] as DbTestimonial[] };
        }

        const top = items.filter((_, index) => index % 2 === 0);
        const bottom = items.filter((_, index) => index % 2 !== 0);

        // Ensure both rows always have content.
        const safeTop = top.length ? top : items;
        const safeBottom = bottom.length ? bottom : items;

        // Duplicate for seamless loop.
        return {
            topRowItems: [...safeTop, ...safeTop],
            bottomRowItems: [...safeBottom, ...safeBottom],
        };
    }, [items]);

    if (isLoading) {
        return (
            <HStack spacing={4} overflow="hidden" w="100%">
                {[1, 2, 3].map((n) => (
                    <Box key={n} minW={{ base: '85%', md: '380px' }} bg="gray.900" borderWidth="1px" borderColor="gray.700" borderRadius="xl" p={4}>
                        <Skeleton height="16px" mb={2} />
                        <Skeleton height="16px" mb={2} />
                        <Skeleton height="16px" w="70%" />
                    </Box>
                ))}
            </HStack>
        );
    }

    if (error) {
        return (
            <Box borderWidth="1px" borderColor="red.500" borderRadius="xl" p={4} bg="red.900" color="red.100" w="100%">
                {error}
            </Box>
        );
    }

    if (!items.length) {
        return (
            <Box borderWidth="1px" borderColor="gray.700" borderRadius="xl" p={4} bg="gray.900" color="gray.300" w="100%">
                No testimonials available yet.
            </Box>
        );
    }

    const renderRow = (rowItems: DbTestimonial[], animationName: string, duration: string, reverse = false) => (
        <Box
            w="100%"
            overflow="hidden"
            position="relative"
            sx={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            }}
        >
            <HStack
                spacing={4}
                align="stretch"
                w="max-content"
                sx={{
                    [`@keyframes ${animationName}`]: {
                        from: { transform: reverse ? 'translateX(-50%)' : 'translateX(0)' },
                        to: { transform: reverse ? 'translateX(0)' : 'translateX(-50%)' },
                    },
                    animation: `${animationName} ${duration} linear infinite`,
                    '&:hover': {
                        animationPlayState: 'paused',
                    },
                }}
            >
                {rowItems.map((item, index) => {
                    const who = [item.role, item.company].filter(Boolean).join(' at ');
                    const displayName = item.name || 'Anonymous';
                    const fallbackLetter = displayName.trim().charAt(0).toUpperCase() || 'A';

                    return (
                        <Box
                            key={`${animationName}-${item.id ?? displayName}-${index}`}
                            minW={{ base: '85vw', md: '400px' }}
                            maxW={{ base: '85vw', md: '400px' }}
                            borderWidth="1px"
                            borderColor="gray.700"
                            borderRadius="xl"
                            bg="gray.900"
                            p={5}
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
                                <VStack align="stretch" spacing={0}>
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

                            <Text mt={3} color="gray.100" fontSize={{ base: 'sm', md: 'md' }} lineHeight="tall" noOfLines={5}>
                                &quot;{item.content || 'No testimonial text provided.'}&quot;
                            </Text>
                        </Box>
                    );
                })}
            </HStack>
        </Box>
    );

    return (
        <VStack spacing={4} w="100%" align="stretch">
            {renderRow(topRowItems, 'testimonialsMarqueeTop', '90s')}
            {renderRow(bottomRowItems, 'testimonialsMarqueeBottom', '110s', true)}
        </VStack>
    );
}
