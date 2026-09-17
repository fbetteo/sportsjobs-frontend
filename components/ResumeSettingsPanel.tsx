'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Heading, HStack, Input, Text, useToast, VStack } from '@chakra-ui/react';
import { BRAND_SECONDARY_COLOR_SCHEME } from '../lib/uiTokens';

type Resume = { filename: string; sizeBytes: number; uploadedAt: string };

export default function ResumeSettingsPanel({
  profile,
  profileReady,
}: {
  profile: { linkedinUrl?: string | null } | null;
  profileReady: boolean;
}) {
  const toast = useToast();
  const [resume, setResume] = useState<Resume | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedinUrl || '');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileReady) setLinkedinUrl(profile?.linkedinUrl || '');
  }, [profile, profileReady]);

  useEffect(() => {
    let active = true;
    fetch('/api/resume')
      .then(async (resumeResponse) => {
        if (!resumeResponse.ok) throw new Error('Could not load your resume');
        const savedResume = await resumeResponse.json();
        if (active) {
          setResume(savedResume);
        }
      })
      .catch(() => {
        if (active) toast({ title: 'Could not load resume settings', status: 'error' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [toast]);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') || file.size === 0 || file.size > 4 * 1024 * 1024) {
      toast({ title: 'Choose a PDF under 4 MB', status: 'error' });
      return;
    }
    const form = new FormData();
    form.set('resume', file);
    setBusy(true);
    try {
      const response = await fetch('/api/resume', { method: 'POST', body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');
      setResume(data);
      toast({ title: 'Resume saved', status: 'success' });
    } catch (error) {
      toast({ title: error instanceof Error ? error.message : 'Upload failed', status: 'error' });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm('Delete your saved resume?')) return;
    setBusy(true);
    try {
      const response = await fetch('/api/resume', { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Delete failed');
      setResume(null);
      toast({ title: 'Resume deleted', status: 'success' });
    } catch (error) {
      toast({ title: error instanceof Error ? error.message : 'Delete failed', status: 'error' });
    } finally {
      setBusy(false);
    }
  }

  async function saveLinkedin() {
    setBusy(true);
    try {
      const response = await fetch('/api/linkedin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedinUrl: linkedinUrl.trim() || null }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save LinkedIn URL');
      setLinkedinUrl(data.linkedinUrl || '');
      toast({ title: 'LinkedIn URL saved', status: 'success' });
    } catch (error) {
      toast({ title: error instanceof Error ? error.message : 'Could not save LinkedIn URL', status: 'error' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box borderWidth="1px" borderColor="gray.700" bg="gray.900" borderRadius="md" p={6} mt={8}>
      <Heading size="md" mb={2}>Resume and LinkedIn</Heading>
      <Text color="gray.300" mb={5}>
        Save your resume here for future CV feedback features. Your file is private and is not shared with companies.
      </Text>
      {loading ? <Text>Loading...</Text> : (
        <VStack align="stretch" spacing={5}>
          <Box>
            {resume ? (
              <Text mb={3}>Saved: {resume.filename} ({(resume.sizeBytes / 1024 / 1024).toFixed(1)} MB)</Text>
            ) : <Text mb={3}>No resume saved yet.</Text>}
            <HStack flexWrap="wrap">
              <Button as="label" htmlFor="resume-upload" colorScheme={BRAND_SECONDARY_COLOR_SCHEME} isDisabled={busy} cursor="pointer">
                {resume ? 'Replace PDF' : 'Upload PDF'}
              </Button>
              <Input id="resume-upload" type="file" accept=".pdf,application/pdf" display="none" onChange={upload} disabled={busy} />
              {resume && (
                <>
                  <Button as="a" href="/api/resume?download=1" variant="outline" isDisabled={busy}>Download</Button>
                  <Button variant="outline" colorScheme="red" onClick={remove} isDisabled={busy}>Delete</Button>
                </>
              )}
            </HStack>
            <Text color="gray.400" fontSize="sm" mt={2}>PDF only, maximum 4 MB.</Text>
          </Box>
          <FormControl>
            <FormLabel>LinkedIn profile (optional)</FormLabel>
            <Input type="url" placeholder="https://www.linkedin.com/in/your-name" value={linkedinUrl}
              onChange={(event) => setLinkedinUrl(event.target.value)} isDisabled={!profileReady} />
            <Button mt={3} variant="outline" colorScheme={BRAND_SECONDARY_COLOR_SCHEME} onClick={saveLinkedin} isDisabled={busy || !profileReady}>
              Save LinkedIn
            </Button>
          </FormControl>
        </VStack>
      )}
    </Box>
  );
}
