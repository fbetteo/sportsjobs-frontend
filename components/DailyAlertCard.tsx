'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Heading, Icon, Spinner, Text, useToast } from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { BRAND_PRIMARY_COLOR_SCHEME, BRAND_SECONDARY_COLOR_SCHEME, BRAND_SECONDARY_LIGHT } from '../lib/uiTokens';
import { trackAnalyticsEvent } from '../lib/analyticsClient';

function formatCountry(country: string) {
  return country.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function DailyAlertCard({ country }: { country?: string }) {
  const router = useRouter();
  const toast = useToast();
  const [alertCount, setAlertCount] = useState<number | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/alerts', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((alerts) => { if (active) setAlertCount(Array.isArray(alerts) ? alerts.length : 0); })
      .catch(() => { if (active) setLoadFailed(true); });
    return () => { active = false; };
  }, []);

  async function enableDailyAlert() {
    if (saving) return;
    setSaving(true);
    try {
      // Sport stays unfiltered: about half of all jobs have no sport tag, so a sport filter would hide them.
      const response = await fetch('/api/create-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: country ? [country] : [], seniority: [], remote_office: [], sport_list: [] }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || 'Unable to create alert');
      setAlertCount((current) => (current || 0) + (data?.duplicate ? 0 : 1));
      trackAnalyticsEvent('daily_alert_enabled', { source: 'dashboard', has_country: Boolean(country) });
      toast({ title: 'Daily alerts are on', description: 'New matching jobs will arrive at your login email.', status: 'success', duration: 5000, isClosable: true });
    } catch (error) {
      toast({ title: 'Unable to turn on alerts', description: error instanceof Error ? error.message : '', status: 'error', duration: 6000, isClosable: true });
    } finally {
      setSaving(false);
    }
  }

  if (loadFailed) return null;

  const hasAlerts = (alertCount || 0) > 0;
  const scope = country ? ` in ${formatCountry(country)}` : '';

  return (
    <Box borderWidth="1px" borderColor="gray.700" bg="gray.900" borderRadius="md" p={6}>
      <Icon as={FaBell} color={BRAND_SECONDARY_LIGHT} boxSize={5} mb={3} />
      {alertCount === null ? <Spinner size="sm" /> : hasAlerts ? (
        <>
          <Heading size="md" mb={2}>Daily job alerts are on</Heading>
          <Text color="gray.300" mb={5}>
            You have {alertCount} {alertCount === 1 ? 'alert' : 'alerts'}. Each day we email you the new jobs that match.
          </Text>
          <Button variant="outline" colorScheme={BRAND_SECONDARY_COLOR_SCHEME} onClick={() => router.push('/settings')}>
            Manage alerts
          </Button>
        </>
      ) : (
        <>
          <Heading size="md" mb={2}>Get new jobs in your inbox every day</Heading>
          <Text color="gray.300" mb={5}>
            One email a day with the jobs added in the last 24 hours{scope}, so you can apply in the first days. You can narrow it by sport or work mode in settings.
          </Text>
          <Button colorScheme={BRAND_PRIMARY_COLOR_SCHEME} isLoading={saving} onClick={enableDailyAlert}>
            Turn on daily alerts
          </Button>
        </>
      )}
    </Box>
  );
}
