// components/Header.tsx

// import { Box, Flex, Button, Image } from '@chakra-ui/react';
// import Link from 'next/link';

// const Header = () => {
//   return (
//     <Box bg="teal.500" color="white" px={4} py={2}>
//       <Flex justify="space-between" align="center">
//         {/* <Link href="/">
//           <Image src="/path-to-your-logo.png" alt="Logo" boxSize="50px" />
//         </Link> */}
//         <Link href="/api/auth/login">
//           <Button colorScheme="teal" variant="outline" as="a">
//             Login
//           </Button>
//         </Link>
//         <Link href="/api/auth/logout">
//           <Button colorScheme="teal" variant="outline" as="a">
//             Logout
//           </Button>
//         </Link>
//       </Flex>
//     </Box>
//   );
// };

// export default Header;
// components/Header.tsx

'use client';

import { Box, Flex, Button, Image, Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <Box bg="black" color="white" px={4} py={2}>
      <Flex justify="space-between" align="center">
        <Link href="/">
          <Image src="https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png?width=256&height=256&frame=1&auto=webp&crop=256:256,smart&s=73ad289af04d9404eaff59edab90872229e4a75a" alt="Sportsjobs Online Logo" boxSize="80px" />
        </Link>
        {user ? (
          <Menu>
            <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
              <Avatar size="sm" src={user.picture ?? ""} />
            </MenuButton>
            <MenuList>
              {/* <MenuItem color='black'>
                <Link href="/profile">Profile</Link>
              </MenuItem> */}
              <MenuItem color='black'>
                <Link href="/api/auth/logout">Logout</Link>
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Box>
            <Link href="/api/auth/login">
              <Button colorScheme="gray.700" bg='purple' variant="outline" as="a" mr={5}>
                Login
              </Button>
            </Link>
            <Button colorScheme="gray.700" bg='purple' variant="outline" onClick={() => router.push('/signup')}>
              SignUp
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
