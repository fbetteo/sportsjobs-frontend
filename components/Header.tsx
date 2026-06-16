'use client';


import { memo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { BRAND_BACKGROUND, BRAND_FOREGROUND, BRAND_PRIMARY, BRAND_PRIMARY_COLOR_SCHEME, BRAND_PRIMARY_SURFACE_HOVER, BRAND_SECONDARY, BRAND_SECONDARY_COLOR_SCHEME } from '@/lib/uiTokens';
import { useRouter } from 'next/navigation';
import { HamburgerIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
// Memoized Logo Component
const Logo = memo(() => (
  <Link href="/">
    <Image
      src="/sportsjobs_logo_color_rectangular_202606.png"
      alt="Sportsjobs Online Logo"
      h="60px"
      w="120px"
      objectFit="contain"
      mr={{ base: 2, md: 5 }}
    />
  </Link>
));

Logo.displayName = 'Logo';

// Memoized Browse Jobs Button
const BrowseJobsButton = memo(() => (
  <Link href="/" passHref>
    <Button
      colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
      bg={BRAND_FOREGROUND}
      color={BRAND_BACKGROUND}
      mr={5}
      size="md"
      _hover={{ bg: BRAND_SECONDARY, color: BRAND_BACKGROUND }}
    >
      Browse Jobs
    </Button>
  </Link>
));

BrowseJobsButton.displayName = 'BrowseJobsButton';

// Memoized Blog Button
const BlogButton = memo(() => (
  <Link href="/blog" passHref>
    <Button
      colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
      bg={BRAND_FOREGROUND}
      color={BRAND_BACKGROUND}
      mr={5}
      size="md"
      _hover={{ bg: BRAND_SECONDARY, color: BRAND_BACKGROUND }}
    >
      Blog
    </Button>
  </Link>
));

BlogButton.displayName = 'BlogButton';

// Memoized Resources Button
const ResourcesButton = memo(() => (
  <Link href="/resources" passHref>
    <Button
      bg={BRAND_FOREGROUND}
      color={BRAND_BACKGROUND}
      mr={5}
      size="md"
      _hover={{ bg: BRAND_SECONDARY, color: BRAND_BACKGROUND }}
    >
      Resources
    </Button>
  </Link>
));

ResourcesButton.displayName = 'ResourcesButton';

const DashboardButton = memo(() => (
  <Link href="/dashboard" passHref>
    <Button
      colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
      bg={BRAND_PRIMARY}
      color={BRAND_BACKGROUND}
      mr={5}
      size="md"
      _hover={{ bg: BRAND_PRIMARY }}
    >
      Dashboard
    </Button>
  </Link>
));

DashboardButton.displayName = 'DashboardButton';

// Memoized Advertise Button
const AdvertiseButton = memo(() => (
  <Link href="/advertise" passHref>
    <Button
      colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
      bg={BRAND_FOREGROUND}
      color={BRAND_BACKGROUND}
      mr={5}
      size="md"
      _hover={{ bg: BRAND_SECONDARY, color: BRAND_BACKGROUND }}
    >
      Advertise
    </Button>
  </Link>
));

AdvertiseButton.displayName = 'AdvertiseButton';

// Memoized Affiliates Button
const AffiliatesButton = memo(() => (
  <Link href="/affiliates" passHref>
    <Button
      colorScheme={BRAND_SECONDARY_COLOR_SCHEME}
      bg={BRAND_FOREGROUND}
      color={BRAND_BACKGROUND}
      mr={5}
      size="md"
      _hover={{ bg: BRAND_SECONDARY, color: BRAND_BACKGROUND }}
    >
      Earn $
    </Button>
  </Link>
));

AffiliatesButton.displayName = 'AffiliatesButton';

const Header = () => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <Box bg={BRAND_FOREGROUND} color="white" px={4} py={2}>
      <Flex justify="space-between" align="center">
        <Logo />

        {/* Desktop Navigation */}
        <Flex align="center" display={{ base: 'none', lg: 'flex' }}>
          {user ? (
            <>
              <BrowseJobsButton />
              <BlogButton />
              <ResourcesButton />
              <DashboardButton />
              <Menu>
                <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
                  <Avatar size="sm" src={user.picture ?? ""} />
                </MenuButton>
                <MenuList>
                  <MenuItem color="black">
                    <Link href="/dashboard">Dashboard</Link>
                  </MenuItem>
                  <MenuItem color="black">
                    <Link href="/settings">Settings</Link>
                  </MenuItem>
                  <MenuItem color="black">
                    <Link href="/api/auth/logout">Logout</Link>
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <BrowseJobsButton />
              <BlogButton />
              <ResourcesButton />
              <Link href="/api/auth/login" passHref>
                <Button
                  variant="ghost"
                  color={BRAND_BACKGROUND}
                  _hover={{ bg: BRAND_SECONDARY, color: BRAND_BACKGROUND }}
                  mr={{ base: 2, md: 3 }}
                  size="md"
                >
                  Login
                </Button>
              </Link>
              <Button
                colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
                bg={BRAND_PRIMARY}
                _hover={{ bg: BRAND_PRIMARY }}
                size="md"
                onClick={() => router.push('/signup')}
              >
                Sign up
              </Button>
            </>
          )}
        </Flex>

        {/* Mobile Hamburger */}
        <IconButton
          display={{ base: 'flex', lg: 'none' }}
          onClick={onOpen}
          icon={<HamburgerIcon />}
          variant="outline"
          aria-label="Open Menu"
          colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
        />

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="black" color="white">
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align="stretch">
                <Link href="/" onClick={onClose}>
                  <Button w="full" variant="ghost" justifyContent="flex-start" color="white" _hover={{ bg: BRAND_SECONDARY, color: BRAND_BACKGROUND }}>
                    Browse Jobs
                  </Button>
                </Link>
                <Link href="/blog" onClick={onClose}>
                  <Button w="full" variant="ghost" justifyContent="flex-start" color="white" _hover={{ bg: BRAND_SECONDARY, color: BRAND_BACKGROUND }}>
                    Blog
                  </Button>
                </Link>
                <Link href="/resources" onClick={onClose}>
                  <Button w="full" variant="ghost" justifyContent="flex-start" color="white" _hover={{ bg: BRAND_SECONDARY, color: BRAND_BACKGROUND }}>
                    Resources
                  </Button>
                </Link>

                <Button
                  w="full"
                  variant="ghost"
                  justifyContent="flex-start"
                  color="white"
                  _hover={{ bg: BRAND_SECONDARY, color: BRAND_BACKGROUND }}
                  onClick={() => {
                    window.open('https://sportsjobsonline.featurebase.app/', '_blank', 'noopener,noreferrer');
                    onClose();
                  }}
                >
                  💬 Feedback
                </Button>

                {user ? (
                  <>
                    <Link href="/dashboard" onClick={onClose}>
                      <Button w="full" variant="ghost" justifyContent="flex-start" color="white" _hover={{ bg: BRAND_SECONDARY, color: BRAND_BACKGROUND }}>
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/settings" onClick={onClose}>
                      <Button w="full" variant="ghost" justifyContent="flex-start" color="white" _hover={{ bg: BRAND_SECONDARY, color: BRAND_BACKGROUND }}>
                        Settings
                      </Button>
                    </Link>
                    <Link href="/api/auth/logout" onClick={onClose}>
                      <Button w="full" variant="ghost" justifyContent="flex-start" color="white" _hover={{ bg: BRAND_SECONDARY, color: BRAND_BACKGROUND }}>
                        Logout
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/api/auth/login" onClick={onClose}>
                      <Button w="full" colorScheme={BRAND_PRIMARY_COLOR_SCHEME} variant="solid">
                        Login
                      </Button>
                    </Link>
                    <Button
                      w="full"
                      colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
                      variant="outline"
                      color="white"
                      borderColor={BRAND_PRIMARY}
                      _hover={{ bg: BRAND_PRIMARY_SURFACE_HOVER }}
                      onClick={() => {
                        router.push('/signup');
                        onClose();
                      }}
                    >
                      Sign up
                    </Button>
                  </>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
};

export default Header;
