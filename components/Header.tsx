'use client';

import { Box, Flex, Button, Image, Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
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
      mr={{ base: 2, md: 5 }}
      size={{ base: 'sm', md: 'md' }}
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
      mr={{ base: 2, md: 5 }}
      size={{ base: 'sm', md: 'md' }}
    >
      Blog
    </Button>
  </Link>
));

BlogButton.displayName = 'BlogButton';

const Header = () => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <Box bg="black" color="white" px={4} py={2}>
      <Flex justify="space-between" align="center" wrap="wrap">
        <Logo />
        {/* Menu for logged-in users */}
        {user ? (
          <Flex align="center" wrap="wrap" justify="flex-end">
            <BrowseJobsButton />
            <BlogButton />
            <Button
              as={Link}
              href="/post-job"
              colorScheme="yellow"
              size="md"
              mr={{ base: 2, md: 5 }}
            >
              Post a Job
            </Button>
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
          </Flex>
        ) : (
          <Flex align="center" wrap="wrap" justify="flex-end">
            <BrowseJobsButton />
            <BlogButton />
            <Button
              as={Link}
              href="/post-job"
              colorScheme="yellow"
              size="md"
              mr={{ base: 2, md: 5 }}
            >
              Post a Job
            </Button>
            <Link href="/api/auth/login" passHref>
              <Button
                colorScheme="gray.700"
                bg="purple"
                variant="outline"
                mr={{ base: 2, md: 5 }}
                size={{ base: 'sm', md: 'md' }} // Reduce size on mobile
              >
                Login
              </Button>
            </Link>

            <Button
              colorScheme="gray.700"
              bg="purple"
              variant="outline"
              size={{ base: 'sm', md: 'md' }} // Reduce size on mobile
              onClick={() => router.push('/signup')}
            >
              SignUp
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
