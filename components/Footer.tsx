// components/Footer.tsx
import { Box, Text, Link, HStack, IconButton } from '@chakra-ui/react';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <Box as="footer" py={4} textAlign="center" bg="gray.700" color="white">
            <Text mb={2}>
                © 2024 Calibrated AI LLC | Built by{' '}
                <Link href="https://twitter.com/franbetteo" isExternal color="teal.200">
                    @franbetteo
                </Link>. I&apos;d love to hear your feedback — Get in touch via DM or{' '}
                <Link href="mailto:franco@sportsjobs.online" color="teal.200">
                    franco@sportsjobs.online
                </Link>
            </Text>
            <HStack justify="center" spacing={4}>
                <IconButton
                    as="a"
                    href="https://x.com/SportsjobsBoard"
                    target="_blank"
                    aria-label="Twitter"
                    icon={<FaTwitter />}
                    bg="teal.500"
                    _hover={{ bg: "teal.400" }}
                />
                <IconButton
                    as="a"
                    href="https://www.linkedin.com/company/sportsjobs-online"
                    target="_blank"
                    aria-label="LinkedIn"
                    icon={<FaLinkedin />}
                    bg="teal.500"
                    _hover={{ bg: "teal.400" }}
                />
            </HStack>
            <Text mt={2} fontSize="sm">
                <Link href="/privacy-policy" color="teal.200" >
                    Privacy Policy
                </Link>
            </Text>
        </Box>
    );
};

export default Footer;
