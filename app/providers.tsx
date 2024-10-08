// app/providers.tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Header from '../components/Header';
import theme from '../theme';
import NewsletterSignupPopup from '../components/NewsletterSignupPopup';
import Footer from "@/components/Footer";

export function Providers({ children }: { children: React.ReactNode }) {
    return <ChakraProvider theme={theme}><UserProvider><Header />{children} <Footer /> <NewsletterSignupPopup /></UserProvider></ChakraProvider >;
}
