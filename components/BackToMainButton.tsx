'use client';


import { Button, Flex, Icon, Text } from '@chakra-ui/react';
import { FaBriefcase, FaHome } from 'react-icons/fa';
import { BRAND_PRIMARY, BRAND_PRIMARY_COLOR_SCHEME, BRAND_PRIMARY_LIGHT } from '@/lib/uiTokens';
import Link from 'next/link';


interface BackToMainButtonProps {
    variant?: 'compact' | 'full';
}

const BackToMainButton = ({ variant = 'full' }: BackToMainButtonProps) => {
    if (variant === 'compact') {
        return (
            <Link href="/" passHref>
                <Button
                    colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
                    bg="black"
                    border="1px solid"
                    borderColor={BRAND_PRIMARY_LIGHT}
                    _hover={{
                        bg: BRAND_PRIMARY,
                        borderColor: BRAND_PRIMARY_LIGHT,
                        transform: "translateY(-2px)",
                    }}
                    size="md"
                    leftIcon={<Icon as={FaHome} />}
                    transition="all 0.2s"
                >
                    Browse Jobs
                </Button>
            </Link>
        );
    }

    return (
        <Flex direction="column" alignItems="center" py={6}>
            <Text fontSize="lg" mb={4} textAlign="center" color="gray.300">
                Discover hundreds of sports analytics jobs
            </Text>
            <Link href="/" passHref>
                <Button
                    colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
                    bg="black"
                    border="2px solid"
                    borderColor={BRAND_PRIMARY_LIGHT}
                    _hover={{
                        bg: BRAND_PRIMARY,
                        borderColor: BRAND_PRIMARY_LIGHT,
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(128, 90, 213, 0.3)",
                    }}
                    size="lg"
                    leftIcon={<Icon as={FaBriefcase} w={5} h={5} />}
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    transition="all 0.3s"
                    borderRadius="lg"
                >
                    Explore All Jobs
                </Button>
            </Link>
        </Flex>
    );
};

export default BackToMainButton;
