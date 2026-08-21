'use client';

import { Button } from '@chakra-ui/react';
import { BRAND_FOREGROUND, BRAND_PRIMARY, BRAND_PRIMARY_COLOR_SCHEME } from '@/lib/uiTokens';
import { trackAnalyticsEvent } from '@/lib/analyticsClient';
import { buildAttributedOutboundUrl, getOutboundDestinationDomain } from '@/lib/outboundAttribution';

type JobApplyButtonProps = {
    applyUrl: string;
    jobId: string;
    jobSlug?: string;
    company: string;
    buttonLocation: 'hero' | 'bottom';
};

export default function JobApplyButton({
    applyUrl,
    jobId,
    jobSlug,
    company,
    buttonLocation,
}: JobApplyButtonProps) {
    const destinationUrl = buildAttributedOutboundUrl(applyUrl, {
        medium: 'job_board',
        campaign: 'job_application',
        content: jobSlug || jobId,
    });
    const destinationDomain = getOutboundDestinationDomain(applyUrl) || 'invalid';
    const isHero = buttonLocation === 'hero';

    const handleApplyClick = () => {
        trackAnalyticsEvent('apply_click', {
            job_id: jobId,
            company,
            destination_domain: destinationDomain,
            button_location: buttonLocation,
        });
    };

    return (
        <Button
            as="a"
            href={destinationUrl}
            target="_blank"
            rel="noopener"
            referrerPolicy="origin"
            onClick={handleApplyClick}
            colorScheme={BRAND_PRIMARY_COLOR_SCHEME}
            {...(isHero ? {
                bg: BRAND_PRIMARY,
                color: BRAND_FOREGROUND,
                size: 'lg',
                px: { base: 10, md: 14 },
                py: { base: 6, md: 7 },
                borderRadius: 'full',
                fontSize: { base: '24px', md: '30px' },
                textTransform: 'uppercase',
                flexShrink: 0,
                _hover: { bg: BRAND_PRIMARY },
            } : {
                size: 'lg',
                px: 4,
                py: 2,
                m: 1,
                mt: 5,
            })}
        >
            Apply Now
        </Button>
    );
}
