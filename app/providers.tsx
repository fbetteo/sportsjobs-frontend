// app/providers.tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import posthog from 'posthog-js';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import Header from '../components/Header';
import theme from '../theme';
import NewsletterSignupPopup from '../components/NewsletterSignupPopup';
import Footer from "@/components/Footer";

function PostHogPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const posthog = usePostHog();

    useEffect(() => {
        if (pathname && posthog) {
            let url = window.origin + pathname;
            if (searchParams.toString()) {
                url = url + "?" + searchParams.toString();
            }
            posthog.capture('$pageview', { '$current_url': url });
        }
    }, [pathname, searchParams, posthog]);

    return null;
}

function SuspendedPostHogPageView() {
    return (
        <Suspense fallback={null}>
            <PostHogPageView />
        </Suspense>
    );
}

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        try {
            // Log to verify env variables
            // console.log('PostHog Key:', !!process.env.NEXT_PUBLIC_POSTHOG_KEY);
            // console.log('PostHog Host:', process.env.NEXT_PUBLIC_POSTHOG_HOST);

            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
                person_profiles: 'identified_only',
                capture_pageview: false,
                loaded: (posthog) => {
                    console.log('PostHog loaded successfully');
                    // Test event after confirmed loading
                    // posthog.capture('test_event', {
                    //     property: 'test_value'
                    // });
                }
            });
        } catch (error) {
            console.error('PostHog initialization error:', error);
        }
    }, []);

    return (<PostHogProvider client={posthog}> <ChakraProvider theme={theme}><UserProvider><Header />{children} <Footer /> <NewsletterSignupPopup /></UserProvider></ChakraProvider ></PostHogProvider>);
}
