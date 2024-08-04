// app/providers.tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Header from '../components/Header';

export function Providers({ children }: { children: React.ReactNode }) {
    return <UserProvider><ChakraProvider><Header />{children}</ChakraProvider></UserProvider>;
}
