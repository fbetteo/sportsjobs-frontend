export type OutboundAttribution = {
    medium: 'job_board' | 'company_directory';
    campaign: 'job_application' | 'company_profile';
    content: string;
};

const ATTRIBUTION_HOST_ALLOWLIST = [
    'greenhouse.io',
    'lever.co',
    'ashbyhq.com',
    'athlyticz.com',
] as const;

const SIGNED_OR_TOKENIZED_QUERY_KEYS = new Set([
    'access_token',
    'auth',
    'authorization',
    'expires',
    'hmac',
    'jwt',
    'sig',
    'signature',
    'token',
    'x-amz-signature',
    'x-goog-signature',
]);

function isAllowlistedHostname(hostname: string): boolean {
    const normalizedHostname = hostname.toLowerCase();

    return ATTRIBUTION_HOST_ALLOWLIST.some((allowedHostname) => (
        normalizedHostname === allowedHostname
        || normalizedHostname.endsWith(`.${allowedHostname}`)
    ));
}

function hasExistingUtm(url: URL): boolean {
    return Array.from(url.searchParams.keys()).some((key) => key.toLowerCase().startsWith('utm_'));
}

function hasSignedOrTokenizedQuery(url: URL): boolean {
    return Array.from(url.searchParams.keys()).some((key) => (
        SIGNED_OR_TOKENIZED_QUERY_KEYS.has(key.toLowerCase())
    ));
}

export function getOutboundDestinationDomain(rawUrl: string): string | null {
    try {
        const url = new URL(rawUrl);
        return url.protocol === 'http:' || url.protocol === 'https:' ? url.hostname.toLowerCase() : null;
    } catch {
        return null;
    }
}

export function buildAttributedOutboundUrl(
    rawUrl: string,
    attribution: OutboundAttribution,
): string {
    try {
        const url = new URL(rawUrl);

        if (
            (url.protocol !== 'http:' && url.protocol !== 'https:')
            || !isAllowlistedHostname(url.hostname)
            || hasExistingUtm(url)
            || hasSignedOrTokenizedQuery(url)
        ) {
            return rawUrl;
        }

        url.searchParams.set('utm_source', 'sportsjobs.online');
        url.searchParams.set('utm_medium', attribution.medium);
        url.searchParams.set('utm_campaign', attribution.campaign);
        url.searchParams.set('utm_content', attribution.content);

        return url.toString();
    } catch {
        return rawUrl;
    }
}
