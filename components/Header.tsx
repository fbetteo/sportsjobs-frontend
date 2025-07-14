'use client';

import {
  Box,
  Flex,
  Button,
  Image,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { memo } from 'react';

// Memoized Logo Component
const Logo = memo(() => (
  <Link href="/">
    <Image
      src="https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png?width=256&height=256&frame=1&auto=webp&crop=256:256,smart&s=73ad289af04d9404eaff59edab90872229e4a75a"
      alt="Sportsjobs Online Logo"
      boxSize="60px"
      mr={{ base: 2, md: 5 }}
    />
  </Link>
));

Logo.displayName = 'Logo';

// Memoized Browse Jobs Button
const BrowseJobsButton = memo(() => (
  <Link href="/" passHref>
    <Button
      colorScheme="purple"
      bg="black"
      mr={5}
      size="md"
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
      colorScheme="purple"
      bg="black"
      mr={5}
      size="md"
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
      colorScheme="purple"
      bg="black"
      mr={5}
      size="md"
    >
      Resources
    </Button>
  </Link>
));

ResourcesButton.displayName = 'ResourcesButton';

// Memoized Advertise Button
const AdvertiseButton = memo(() => (
  <Link href="/advertise" passHref>
    <Button
      colorScheme="purple"
      bg="black"
      mr={5}
      size="md"
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
      colorScheme="purple"
      bg="black"
      mr={5}
      size="md"
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
    <Box bg="black" color="white" px={4} py={2}>
      <Flex justify="space-between" align="center">
        <Logo />

        {/* Desktop Navigation */}
        <Flex align="center" display={{ base: 'none', lg: 'flex' }}>
          {user ? (
            <>
              <BrowseJobsButton />
              <BlogButton />
              <ResourcesButton />
              <AdvertiseButton />
              <AffiliatesButton />
              <Menu>
                <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
                  <Avatar size="sm" src={user.picture ?? ""} />
                </MenuButton>
                <MenuList>
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
              <AdvertiseButton />
              <AffiliatesButton />
              <Link href="/api/auth/login" passHref>
                <Button
                  colorScheme="gray.700"
                  bg="purple"
                  variant="outline"
                  mr={{ base: 2, md: 5 }}
                  size="md"
                >
                  Login
                </Button>
              </Link>
              <Button
                colorScheme="gray.700"
                bg="purple"
                variant="outline"
                size="md"
                onClick={() => router.push('/signup')}
              >
                SignUp
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
          colorScheme="purple"
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
                  <Button w="full" variant="ghost" justifyContent="flex-start" color="white" _hover={{ bg: "gray.700" }}>
                    Browse Jobs
                  </Button>
                </Link>
                <Link href="/blog" onClick={onClose}>
                  <Button w="full" variant="ghost" justifyContent="flex-start" color="white" _hover={{ bg: "gray.700" }}>
                    Blog
                  </Button>
                </Link>
                <Link href="/resources" onClick={onClose}>
                  <Button w="full" variant="ghost" justifyContent="flex-start" color="white" _hover={{ bg: "gray.700" }}>
                    Resources
                  </Button>
                </Link>
                <Link href="/advertise" onClick={onClose}>
                  <Button w="full" variant="ghost" justifyContent="flex-start" color="white" _hover={{ bg: "gray.700" }}>
                    Advertise
                  </Button>
                </Link>
                <Link href="/affiliates" onClick={onClose}>
                  <Button w="full" variant="ghost" justifyContent="flex-start" color="white" _hover={{ bg: "gray.700" }}>
                    Earn $
                  </Button>
                </Link>

                <Button
                  w="full"
                  variant="ghost"
                  justifyContent="flex-start"
                  color="white"
                  _hover={{ bg: "gray.700" }}
                  onClick={() => {
                    window.open('https://sportsjobsonline.featurebase.app/', '_blank', 'noopener,noreferrer');
                    onClose();
                  }}
                >
                  💬 Feedback
                </Button>

                {user ? (
                  <>
                    <Link href="/settings" onClick={onClose}>
                      <Button w="full" variant="ghost" justifyContent="flex-start" color="white" _hover={{ bg: "gray.700" }}>
                        Settings
                      </Button>
                    </Link>
                    <Link href="/api/auth/logout" onClick={onClose}>
                      <Button w="full" variant="ghost" justifyContent="flex-start" color="white" _hover={{ bg: "gray.700" }}>
                        Logout
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/api/auth/login" onClick={onClose}>
                      <Button w="full" colorScheme="purple" variant="solid">
                        Login
                      </Button>
                    </Link>
                    <Button
                      w="full"
                      colorScheme="purple"
                      variant="outline"
                      color="white"
                      borderColor="purple.500"
                      _hover={{ bg: "purple.600" }}
                      onClick={() => {
                        router.push('/signup');
                        onClose();
                      }}
                    >
                      SignUp
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
