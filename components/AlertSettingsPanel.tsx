'use client';

import { useEffect, useState } from 'react';
import {
  Box, Button, Checkbox, Heading, HStack, Menu, MenuButton, MenuItem,
  MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter,
  ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast, VStack,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { BRAND_PRIMARY_COLOR_SCHEME, BRAND_SECONDARY_COLOR_SCHEME, BRAND_SECONDARY_SURFACE } from '../lib/uiTokens';

const FILTERS = [
  ['country', 'Country', 'countries'],
  ['remote_office', 'Work mode', 'remotes'],
  ['sport_list', 'Sport', 'sport_list'],
] as const;

type FilterKey = typeof FILTERS[number][0];
type Filters = Record<FilterKey | 'seniority', string[]>;
type Alert = Filters & {
  alert_id: number; hours?: string[]; skills?: string[];
  industry?: string[]; job_area?: string[]; type?: string[];
};
type DropdownOptions = Record<typeof FILTERS[number][2], string[]>;

const LEGACY_FILTERS = [
  ['hours', 'Hours'], ['skills', 'Skills'], ['industry', 'Industry'],
  ['job_area', 'Job area'], ['type', 'Job type'],
] as const;

function emptyFilters(): Filters {
  return {
    country: [], seniority: [], remote_office: [], sport_list: [],
  };
}

async function readResponse(response: Response) {
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || 'Unable to manage alerts');
  return data;
}

export default function AlertSettingsPanel() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [options, setOptions] = useState<Partial<DropdownOptions>>({});
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        await readResponse(await fetch('/api/me', { method: 'POST', cache: 'no-store' }));
        const [alertsResponse, optionsResponse] = await Promise.all([
          fetch('/api/alerts', { cache: 'no-store' }),
          fetch('/api/dropdown-options'),
        ]);
        const [currentAlerts, filterOptions] = await Promise.all([
          readResponse(alertsResponse), readResponse(optionsResponse),
        ]);
        if (!active) return;
        setAlerts(currentAlerts);
        setOptions(filterOptions);
      } catch (error) {
        if (active) setLoadError(error instanceof Error ? error.message : 'Unable to load alerts');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  function toggleFilter(key: FilterKey, value: string) {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  }

  function toggleInternship() {
    setFilters((current) => ({
      ...current,
      seniority: current.seniority.length ? [] : ['Internship'],
    }));
  }

  async function createAlert() {
    if (saving) return;
    setSaving(true);
    try {
      const data = await readResponse(await fetch('/api/create-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      }));
      if (!data.duplicate && data.alert) {
        setAlerts((current) => [data.alert, ...current]);
      }
      toast({
        title: data.duplicate ? 'Alert already exists' : 'Alert created',
        status: 'success', duration: 4000, isClosable: true,
      });
      setFilters(emptyFilters());
      onClose();
    } catch (error) {
      toast({ title: 'Unable to create alert', description: error instanceof Error ? error.message : '',
        status: 'error', duration: 6000, isClosable: true });
    } finally {
      setSaving(false);
    }
  }

  async function deleteAlert(alertId: number) {
    if (deletingId !== null || !window.confirm('Delete this job alert?')) return;
    setDeletingId(alertId);
    try {
      await readResponse(await fetch(`/api/alerts?id=${alertId}`, { method: 'DELETE' }));
      setAlerts((current) => current.filter((alert) => alert.alert_id !== alertId));
      toast({ title: 'Alert deleted', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      toast({ title: 'Unable to delete alert', description: error instanceof Error ? error.message : '',
        status: 'error', duration: 6000, isClosable: true });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Box mt={10}>
      <HStack justify="space-between" align="start" mb={4}>
        <Box>
          <Heading as="h2" size="md">Job alerts</Heading>
          <Text mt={1} fontSize="sm">New job matches are sent to your login email.</Text>
        </Box>
        <Button colorScheme={BRAND_PRIMARY_COLOR_SCHEME} onClick={onOpen}
          isDisabled={loading || Boolean(loadError)}>
          Create alert
        </Button>
      </HStack>

      {loading && <Spinner />}
      {loadError && <Text>{loadError}</Text>}
      {!loading && !loadError && alerts.length === 0 && <Text>No alerts yet.</Text>}
      <VStack spacing={3} align="stretch">
        {alerts.map((alert) => {
          const selected = FILTERS.flatMap(([key, label]) =>
            (alert[key] || []).length ? [`${label}: ${alert[key].join(', ')}`] : []);
          if (alert.seniority?.length) {
            selected.push(alert.seniority.length === 1 && alert.seniority[0].toLowerCase() === 'internship'
              ? 'Internship' : `Seniority: ${alert.seniority.join(', ')}`);
          }
          for (const [key, label] of LEGACY_FILTERS) {
            if (alert[key]?.length) selected.push(`${label}: ${alert[key].join(', ')}`);
          }
          return (
            <Box key={alert.alert_id} p={4} borderRadius="md" bg={BRAND_SECONDARY_SURFACE}>
              <HStack justify="space-between" align="start">
                <Text fontSize="sm">{selected.length ? selected.join(' · ') : 'All new jobs'}</Text>
                <Button size="sm" variant="outline" colorScheme={BRAND_SECONDARY_COLOR_SCHEME}
                  isLoading={deletingId === alert.alert_id} onClick={() => deleteAlert(alert.alert_id)}>
                  Delete
                </Button>
              </HStack>
            </Box>
          );
        })}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg={BRAND_SECONDARY_SURFACE}>
          <ModalHeader>Create job alert</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4} fontSize="sm">A job must match every filter you choose. If you select multiple countries or sports, any one within that filter counts. Empty filters match any new job.</Text>
            <VStack spacing={3} align="stretch">
              <Checkbox isChecked={filters.seniority.includes('Internship')} onChange={toggleInternship}>
                Internship
              </Checkbox>
              {FILTERS.map(([key, label, optionKey]) => (
                <Menu key={key} closeOnSelect={false}>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" textAlign="left">
                    {label}{filters[key].length ? ` (${filters[key].length})` : ''}
                  </MenuButton>
                  <MenuList maxH="240px" overflowY="auto" bg={BRAND_SECONDARY_SURFACE}>
                    {(options[optionKey] || []).map((value) => (
                      <MenuItem key={value} onClick={() => toggleFilter(key, value)} bg={BRAND_SECONDARY_SURFACE}>
                        <Checkbox isChecked={filters[key].includes(value)} pointerEvents="none" mr={2} />{value}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose} mr={3}>Cancel</Button>
            <Button colorScheme={BRAND_PRIMARY_COLOR_SCHEME} isLoading={saving} onClick={createAlert}>Create alert</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
