import posthog from 'posthog-js';

const isBrowser = () => typeof window !== 'undefined';

export const trackAnalyticsEvent = (eventName: string, properties: Record<string, unknown> = {}) => {
    if (!isBrowser()) {
        return;
    }

    // Google Analytics 4 (Native)
    if ((window as any).gtag) {
        (window as any).gtag('event', eventName, properties);
    }

    // PostHog
    posthog.capture(eventName, properties);
};