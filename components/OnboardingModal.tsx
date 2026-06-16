'use client';

import { useState } from 'react';
import {
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    SimpleGrid,
    Text,
    useToast,
    VStack
} from '@chakra-ui/react';
import { SIGNUP_ACCENT_COLOR_SCHEME } from '@/lib/uiTokens';
import { OnboardingAnswers } from '../lib/userProfile';
const sportsOptions = [
  { value: 'football', label: 'Football' },
  { value: 'soccer', label: 'Soccer' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'hockey', label: 'Hockey' },
  { value: 'baseball', label: 'Baseball' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'golf', label: 'Golf' },
  { value: 'formula_1', label: 'Formula 1' },
  { value: 'betting_fantasy', label: 'Betting and fantasy' },
  { value: 'esports', label: 'Esports' },
];

const jobSearchDurationOptions = [
  { value: 'just_started', label: 'Just started' },
  { value: 'few_weeks', label: 'A few weeks' },
  { value: 'few_months', label: 'A few months' },
  { value: 'feels_like_forever', label: 'Feels like forever' },
];

const hardestPartOptions = [
  { value: 'not_hearing_back', label: 'Not hearing back from recruiters' },
  { value: 'not_getting_interviews', label: 'Not getting interviews' },
  { value: 'too_much_competition', label: 'Too much competition' },
  { value: 'not_enough_jobs', label: "Can't find enough jobs" },
  { value: 'lack_of_great_offers', label: 'Lack of great job offers' },
];

const countryOptions = [
  'united states',
  'united kingdom',
  'argentina',
  'australia',
  'austria',
  'belgium',
  'brazil',
  'bulgaria',
  'cameroon',
  'canada',
  'colombia',
  'cyprus',
  'czechia',
  'denmark',
  'egypt',
  'estonia',
  'france',
  'germany',
  'greece',
  'hungary',
  'india',
  'ireland',
  'italy',
  'lithuania',
  'malta',
  'mexico',
  'netherlands',
  'philippines',
  'poland',
  'portugal',
  'serbia',
  'spain',
  'switzerland',
  'ukraine',
  'united arab emirates',
  'vietnam',
];

const defaultAnswers: OnboardingAnswers = {
  sportsInterests: [],
  jobSearchDuration: '',
  hardestPart: '',
  country: '',
  roleInterests: [],
  roleUnsure: false,
};

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (answers: OnboardingAnswers) => Promise<void>;
  onSkip?: () => void;
}

function formatCountry(country: string) {
  return country.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function OnboardingModal({ isOpen, onComplete, onSkip }: OnboardingModalProps) {
  const toast = useToast();
  const [answers, setAnswers] = useState<OnboardingAnswers>(defaultAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleArrayValue = (field: 'sportsInterests', value: string) => {
    setAnswers((current) => {
      const values = current[field];
      const nextValues = values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value];

      return {
        ...current,
        [field]: nextValues,
      };
    });
  };

  const handleSubmit = async () => {
    if (
      answers.sportsInterests.length === 0 ||
      !answers.jobSearchDuration ||
      !answers.hardestPart
    ) {
      toast({
        title: 'Complete onboarding',
        description: 'Answer each required question so we can personalize your dashboard.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onComplete(answers);
      toast({
        title: 'Profile saved',
        description: 'Your dashboard is ready.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Could not save onboarding',
        description: error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onSkip || (() => undefined)} closeOnOverlayClick={false} size="3xl" isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.900" borderColor="gray.700" borderWidth="1px">
        <ModalHeader>Set up your job search</ModalHeader>
        <ModalBody>
          <VStack spacing={6} align="stretch">
            <Text color="gray.300">
              A few quick answers help SportsJobs tailor saved searches, alerts, and upgrade recommendations.
            </Text>

            <FormControl isRequired>
              <FormLabel>What sports are you interested in?</FormLabel>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                {sportsOptions.map((sport) => (
                  <Checkbox
                    key={sport.value}
                    isChecked={answers.sportsInterests.includes(sport.value)}
                    onChange={() => toggleArrayValue('sportsInterests', sport.value)}
                    colorScheme={SIGNUP_ACCENT_COLOR_SCHEME}
                  >
                    {sport.label}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>How long have you been looking for a job?</FormLabel>
                <Select
                  placeholder="Select one"
                  value={answers.jobSearchDuration}
                  onChange={(event) => setAnswers({ ...answers, jobSearchDuration: event.target.value })}
                >
                  {jobSearchDurationOptions.map((option) => (
                    <option key={option.value} value={option.value} style={{ color: 'black' }}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>What is the hardest part right now?</FormLabel>
                <Select
                  placeholder="Select one"
                  value={answers.hardestPart}
                  onChange={(event) => setAnswers({ ...answers, hardestPart: event.target.value })}
                >
                  {hardestPartOptions.map((option) => (
                    <option key={option.value} value={option.value} style={{ color: 'black' }}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>Where are you based?</FormLabel>
              <Select
                placeholder="Skip for now"
                value={answers.country}
                onChange={(event) => setAnswers({ ...answers, country: event.target.value })}
              >
                {countryOptions.map((country) => (
                  <option key={country} value={country} style={{ color: 'black' }}>
                    {formatCountry(country)}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={3}>
          {onSkip && (
            <Button variant="ghost" onClick={onSkip}>
              Later
            </Button>
          )}
          <Button colorScheme={SIGNUP_ACCENT_COLOR_SCHEME} onClick={handleSubmit} isLoading={isSubmitting}>
            Save and continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
