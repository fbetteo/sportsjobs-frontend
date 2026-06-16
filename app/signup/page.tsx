'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  FaArrowLeft,
  FaArrowRight,
  FaBell,
  FaBolt,
  FaBookmark,
  FaCheckCircle,
  FaClock,
  FaLockOpen,
  FaMapMarkerAlt,
  FaSearch,
  FaShieldAlt,
  FaTimes
} from 'react-icons/fa';
import { BRAND_PRIMARY, SIGNUP_ACCENT_COLOR_SCHEME, SIGNUP_ACCENT_PROGRESS, SIGNUP_ACCENT_SURFACE } from '@/lib/uiTokens';
import type { ElementType } from 'react';
import { useToast } from '@chakra-ui/react';
import TestimonialsMarqueeFromDB from '../../components/TestimonialsMarqueeFromDB';

const STORAGE_KEY = 'sportsjobs_signup_funnel';
const PROMO_CODE = 'SPORTS25';
const PROMO_DISCOUNT = '25%';

const sportsOptions = [
  { value: 'football', label: 'Football', jobSport: 'Football - NFL' },
  { value: 'soccer', label: 'Soccer', jobSport: 'Football - Soccer' },
  { value: 'basketball', label: 'Basketball', jobSport: 'Basketball' },
  { value: 'hockey', label: 'Hockey', jobSport: 'Hockey' },
  { value: 'baseball', label: 'Baseball', jobSport: 'Baseball' },
  { value: 'tennis', label: 'Tennis', jobSport: 'Tennis' },
  { value: 'golf', label: 'Golf', jobSport: 'Golf' },
  { value: 'formula_1', label: 'Formula 1', jobSport: 'Formula 1' },
];

const durationOptions = [
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
  'united states', 'united kingdom', 'argentina', 'australia', 'austria', 'belgium', 'brazil', 'bulgaria', 'cameroon', 'canada',
  'colombia', 'cyprus', 'czechia', 'denmark', 'egypt', 'estonia', 'france', 'germany', 'greece',
  'hungary', 'india', 'ireland', 'italy', 'lithuania', 'malta', 'mexico', 'netherlands',
  'philippines', 'poland', 'portugal', 'serbia', 'spain', 'switzerland', 'ukraine',
  'united arab emirates', 'vietnam',
];

const planOptions = [
  {
    name: 'Monthly',
    price: '$6.99',
    period: 'per month',
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
    priceValue: 6.99,
    summary: 'Great if you are actively searching this month.',
    features: ['Fresh jobs every week', 'Cleaner niche sports board', 'Cancel anytime'],
  },
  {
    name: 'Yearly',
    price: '$39',
    period: 'per year',
    priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID,
    priceValue: 39,
    highlighted: true,
    summary: 'Best for staying visible to new opportunities all year.',
    features: ['Best value', 'Always-on job discovery', 'Future saved-search upgrades'],
  },
  {
    name: 'Lifetime',
    price: '$59',
    period: 'one time',
    priceId: process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID,
    priceValue: 59,
    summary: 'Pay once and keep SportsJobs in your career toolkit.',
    features: ['One payment', 'Long-term sports career access', 'Future feature access'],
  },
];

type Answers = {
  sportsInterests: string[];
  jobSearchDuration: string;
  hardestPart: string;
  country: string;
  roleInterests: string[];
  roleUnsure: boolean;
};

type Contact = {
  name: string;
  email: string;
};

type JobPreview = {
  id: string;
  title: string;
  company: string;
  location: string;
  remote_string?: string;
  sport_list?: string;
  job_area?: string;
  days_ago_text?: string;
  logo_permanent_url?: string;
};

const defaultAnswers: Answers = {
  sportsInterests: [],
  jobSearchDuration: '',
  hardestPart: '',
  country: '',
  roleInterests: [],
  roleUnsure: false,
};

const totalSteps = 10;
const stepSlugs = [
  'sports',
  'sports-context',
  'duration',
  'duration-context',
  'hardest-part',
  'country',
  'jobs',
  'contact',
  'paid-product',
  'plans',
];

function getStepFromUrl() {
  if (typeof window === 'undefined') return 0;

  const slug = new URLSearchParams(window.location.search).get('step');
  const index = slug ? stepSlugs.indexOf(slug) : 0;
  return index >= 0 ? index : 0;
}

function writeStepToUrl(step: number, mode: 'push' | 'replace' = 'push') {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.set('step', stepSlugs[step] || stepSlugs[0]);

  if (mode === 'replace') {
    window.history.replaceState({ step }, '', url);
    return;
  }

  window.history.pushState({ step }, '', url);
}

function formatCountry(country: string) {
  return country.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function selectedLabels(options: Array<{ value: string; label: string }>, selected: string[]) {
  return options.filter((option) => selected.includes(option.value)).map((option) => option.label);
}

function saveFunnelState(answers: Answers, contact?: Contact, paidProductAcknowledgedAt?: string) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      answers,
      contact,
      paidProductAcknowledgedAt,
      savedAt: new Date().toISOString(),
    }),
  );
}

function OptionButton({
  children,
  isSelected,
  onClick,
}: {
  children: ReactNode;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={isSelected ? 'solid' : 'outline'}
      colorScheme={SIGNUP_ACCENT_COLOR_SCHEME}
      minH="56px"
      h="auto"
      whiteSpace="normal"
      textAlign="left"
      justifyContent="flex-start"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default function SignupPage() {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(defaultAnswers);
  const [contact, setContact] = useState<Contact>({ name: '', email: '' });
  const [jobs, setJobs] = useState<JobPreview[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [paidProductAcknowledgedAt, setPaidProductAcknowledgedAt] = useState('');
  const [isSyncingContact, setIsSyncingContact] = useState(false);
  const [isAcknowledging, setIsAcknowledging] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState('');
  const [selectedPlanName, setSelectedPlanName] = useState('Yearly');
  const [offerSecondsLeft, setOfferSecondsLeft] = useState(9 * 60 + 25);
  const [hasLoadedFunnel, setHasLoadedFunnel] = useState(false);

  const selectedSports = useMemo(
    () => selectedLabels(sportsOptions, answers.sportsInterests),
    [answers.sportsInterests],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.answers) setAnswers({ ...defaultAnswers, ...parsed.answers });
        if (parsed.contact) setContact(parsed.contact);
        if (parsed.paidProductAcknowledgedAt) setPaidProductAcknowledgedAt(parsed.paidProductAcknowledgedAt);
      } catch (error) {
        console.error('Failed to restore signup funnel state:', error);
      }
    }

    setStep(getStepFromUrl());

    const handlePopState = () => {
      setStep(getStepFromUrl());
    };

    window.addEventListener('popstate', handlePopState);
    setHasLoadedFunnel(true);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedFunnel) return;
    saveFunnelState(answers, contact.email ? contact : undefined, paidProductAcknowledgedAt || undefined);
  }, [answers, contact, hasLoadedFunnel, paidProductAcknowledgedAt]);

  useEffect(() => {
    if (step < 8) return;

    const intervalId = window.setInterval(() => {
      setOfferSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [step]);

  useEffect(() => {
    if (step !== 6) return;

    const loadJobs = async () => {
      const params = new URLSearchParams({ limit: '4' });
      const sport = sportsOptions.find((option) => answers.sportsInterests.includes(option.value));

      if (sport?.jobSport) params.set('sport', sport.jobSport);
      if (answers.country) params.set('country', answers.country);

      try {
        setIsLoadingJobs(true);
        setJobsError('');
        const response = await fetch(`/api/get-jobs?${params.toString()}`);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error || 'Could not load job preview');
        }

        setJobs(data?.jobs || []);
      } catch (error) {
        setJobs([]);
        setJobsError(error instanceof Error ? error.message : 'Could not load job preview');
      } finally {
        setIsLoadingJobs(false);
      }
    };

    loadJobs();
  }, [answers.country, answers.sportsInterests, step]);

  const goToStep = (nextStep: number, mode: 'push' | 'replace' = 'push') => {
    const boundedStep = Math.max(0, Math.min(nextStep, totalSteps - 1));
    setStep(boundedStep);
    writeStepToUrl(boundedStep, mode);
  };
  const goNext = () => goToStep(step + 1);
  const goBack = () => goToStep(step - 1, 'replace');

  const toggleAnswer = (field: 'sportsInterests' | 'roleInterests', value: string) => {
    setAnswers((current) => {
      const values = current[field];
      const nextValues = values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value];

      return {
        ...current,
        roleUnsure: field === 'roleInterests' && nextValues.length > 0 ? false : current.roleUnsure,
        [field]: nextValues,
      };
    });
  };

  const continueFromContact = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!contact.name.trim() || !emailRegex.test(contact.email)) {
      toast({
        title: 'Add your contact details',
        description: 'Enter your name and a valid email to save your job-search profile.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSyncingContact(true);
      saveFunnelState(answers, contact, paidProductAcknowledgedAt || undefined);

      const response = await fetch('/api/signup-funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contact,
          onboarding: answers,
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Could not save your setup');
      }
    } catch (error) {
      toast({
        title: 'Saved in this browser',
        description: error instanceof Error ? error.message : 'We could not sync with the server yet.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSyncingContact(false);
    }

    goNext();
  };

  const handlePaidProductAcknowledgement = async () => {
    const acknowledgedAt = new Date().toISOString();
    setPaidProductAcknowledgedAt(acknowledgedAt);
    saveFunnelState(answers, contact, acknowledgedAt);

    try {
      setIsAcknowledging(true);
      const response = await fetch('/api/signup-funnel', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contact.email }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Could not record acknowledgement');
      }
    } catch (error) {
      toast({
        title: 'Acknowledgement saved locally',
        description: error instanceof Error ? error.message : 'We could not sync with the server yet.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsAcknowledging(false);
    }

    goNext();
  };

  const handleCheckout = async (plan: typeof planOptions[number]) => {
    if (!plan.priceId) {
      toast({
        title: 'Plan unavailable',
        description: 'The Stripe price ID is missing for this plan.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      setCheckoutPlan(plan.name);
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          planName: plan.name,
          priceValue: plan.priceValue,
        }),
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data?.error || 'Failed to start checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: 'Checkout unavailable',
        description: error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setCheckoutPlan('');
    }
  };

  const questionProgressSteps = 6;
  const showProgress = step < questionProgressSteps;
  const progress = Math.round(((Math.min(step, questionProgressSteps - 1) + 1) / questionProgressSteps) * 100);
  const selectedPlan = planOptions.find((plan) => plan.name === selectedPlanName) || planOptions[1];

  return (
    <Container maxW={step >= 8 ? 'container.lg' : 'container.md'} py={{ base: 6, md: 10 }}>
      <VStack spacing={6} align="stretch">
        <HStack justify="center">
          <Image
            src="/sportsjobs_logo_white_rectangular_202606.png"
            alt="SportsJobs Online"
            h="60px"
            w='120px'
            borderRadius="full"
          />
        </HStack>

        {showProgress && (
          <Box bg="gray.800" borderRadius="full" h="8px" overflow="hidden">
            <Box bg={SIGNUP_ACCENT_PROGRESS} h="full" w={`${progress}%`} transition="width 0.2s ease" />
          </Box>
        )}

        <Box px={{ base: 1, md: 4 }} py={{ base: 4, md: 8 }}>
          {step === 0 && (
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="xl" mb={3}>What sports are you interested in?</Heading>
                <Text color="gray.300">Pick as many as you want. We will use this to shape the rest of your setup.</Text>
              </Box>
              <VStack align="stretch" spacing={3}>
                {sportsOptions.map((sport) => (
                  <OptionButton
                    key={sport.value}
                    isSelected={answers.sportsInterests.includes(sport.value)}
                    onClick={() => toggleAnswer('sportsInterests', sport.value)}
                  >
                    {sport.label}
                  </OptionButton>
                ))}
              </VStack>
              <Button alignSelf="flex-end" colorScheme={SIGNUP_ACCENT_COLOR_SCHEME} rightIcon={<FaArrowRight />} onClick={goNext} isDisabled={answers.sportsInterests.length === 0}>
                Continue
              </Button>
            </VStack>
          )}

          {step === 1 && (
            <InsightStep
              eyebrow="Why this helps"
              title={`Sports analytics roles are scattered across LinkedIn, Teamwork Online, teams, leagues, other boards`}
              body="SportsJobs pulls niche roles into one place so you are not checking club sites, league boards and generic job boards one by one."
              points={['Role titles vary wildly by organization', 'Many relevant jobs never say sports analytics directly', 'Saved filters can make the search repeatable']}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 2 && (
            <SingleChoiceStep
              title="How long have you been looking for a job?"
              options={durationOptions}
              value={answers.jobSearchDuration}
              onChange={(value) => setAnswers({ ...answers, jobSearchDuration: value })}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 3 && (
            <InsightStep
              eyebrow="Search reality"
              title="The longer the search runs, the more organization matters"
              body="A good system should help you find fresh roles quickly, avoid duplicate checking, and remember what kind of opportunities are actually worth your time."
              points={['Freshness matters because sports roles close quickly', 'Tracking saves energy during long searches', 'Better matching beats more tabs']}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 4 && (
            <SingleChoiceStep
              title="What is the hardest part right now?"
              options={hardestPartOptions}
              value={answers.hardestPart}
              onChange={(value) => setAnswers({ ...answers, hardestPart: value })}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 5 && (
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="xl" mb={3}>Where are you based?</Heading>
                <Text color="gray.300">This is optional. It helps us prioritize remote, country, and region-specific jobs.</Text>
              </Box>
              <FormControl>
                <FormLabel color="gray.200">Country</FormLabel>
                <Box
                  bg="gray.800"
                  borderWidth="1px"
                  borderColor={answers.country ? SIGNUP_ACCENT_PROGRESS : 'gray.600'}
                  borderRadius="md"
                  px={4}
                  py={2}
                  boxShadow={answers.country ? `0 0 0 1px var(--chakra-colors-${SIGNUP_ACCENT_PROGRESS.replace('.', '-')})` : 'none'}
                >
                  <HStack spacing={3}>
                    <Icon as={FaMapMarkerAlt} color={SIGNUP_ACCENT_PROGRESS} boxSize={5} flexShrink={0} />
                    <Select
                      variant="unstyled"
                      placeholder="Select country"
                      value={answers.country}
                      onChange={(event) => setAnswers({ ...answers, country: event.target.value })}
                      h="46px"
                      fontWeight="semibold"
                      color="white"
                    >
                      {countryOptions.map((country) => (
                        <option key={country} value={country} style={{ color: 'black' }}>
                          {formatCountry(country)}
                        </option>
                      ))}
                    </Select>
                  </HStack>
                </Box>
              </FormControl>
              <StepActions
                onBack={goBack}
                onNext={goNext}
                isNextDisabled={!answers.country}
                secondaryAction={() => {
                  setAnswers({ ...answers, country: '' });
                  goNext();
                }}
                secondaryLabel="Skip for now"
              />
            </VStack>
          )}

          {step === 6 && (
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="xl" mb={3}>A few jobs that match your setup</Heading>
                <Text color="gray.300">
                  Based on {selectedSports.join(', ') || 'your sports'}{answers.country ? ` and ${formatCountry(answers.country)}` : ''}.
                </Text>
              </Box>
              {isLoadingJobs && (
                <Flex minH="220px" align="center" justify="center">
                  <Spinner color={SIGNUP_ACCENT_PROGRESS} size="xl" />
                </Flex>
              )}
              {!isLoadingJobs && jobsError && (
                <Box borderWidth="1px" borderColor="yellow.600" bg="yellow.900" borderRadius="md" p={4}>
                  <Text color="yellow.100">The live preview is unavailable right now, but your answers were saved in this browser.</Text>
                </Box>
              )}
              {!isLoadingJobs && !jobsError && (
                <VStack align="stretch" spacing={4}>
                  {jobs.length > 0 ? jobs.map((job) => (
                    <Box key={job.id} borderWidth="1px" borderColor="gray.700" bg="gray.800" borderRadius="md" p={4}>
                      <HStack spacing={4} align="start">
                        <Image
                          src={job.logo_permanent_url || 'https://styles.redditmedia.com/t5_7z0so/styles/profileIcon_dgkx9ubgaqrc1.png'}
                          alt={`${job.company} logo`}
                          boxSize="52px"
                          borderRadius="full"
                          bg="white"
                          objectFit="contain"
                          flexShrink={0}
                        />
                        <Box flex="1">
                          <HStack justify="space-between" align="start" mb={2} gap={3}>
                            <Box>
                              <Heading size="sm">{job.title}</Heading>
                              <Text color="gray.300">{job.company}</Text>
                            </Box>
                            {job.days_ago_text && <Badge colorScheme="green" flexShrink={0}>{job.days_ago_text}</Badge>}
                          </HStack>
                          <Text color="gray.300" fontSize="sm">{job.location || job.remote_string || 'Location flexible'}</Text>
                        </Box>
                      </HStack>
                    </Box>
                  )) : (
                    <Box borderWidth="1px" borderColor="gray.700" bg="gray.800" borderRadius="md" p={4}>
                      <Text color="gray.300">No exact matches in the preview. SportsJobs can still track broader roles and alert you when new ones appear.</Text>
                    </Box>
                  )}
                </VStack>
              )}
              <StepActions onBack={goBack} onNext={goNext} nextLabel="Save my setup" />
            </VStack>
          )}

          {step === 7 && (
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="xl" mb={3}>Who should we build this job feed for?
                </Heading>
                <Text color="gray.300">We&apos;ll use this to save your results and address your job alerts.</Text>
              </Box>
              <VStack align="stretch" spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} autoComplete="name" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} autoComplete="email" />
                </FormControl>
              </VStack>
              <StepActions onBack={goBack} onNext={continueFromContact} nextLabel="Continue" isNextLoading={isSyncingContact} />
            </VStack>
          )}

          {step === 8 && (
            <VStack align="stretch" spacing={6}>
              <Box>
                <Badge colorScheme={SIGNUP_ACCENT_COLOR_SCHEME} mb={4}>Setup saved</Badge>
                <Heading size="2xl" mb={4}>Our systems and founder are constantly working for you</Heading>
                <Text color="gray.300" fontSize="lg" mb={6}>
                  SportsJobs is always finding the latest jobs, cleaning the board, removing scam jobs, checking relevance, and improving how niche sports roles are surfaced.
                </Text>
                <VStack align="stretch" spacing={4}>
                  <BenefitBullet icon={FaSearch} text="Fresh sports jobs across teams, leagues, betting, media, agencies, and startups." />
                  <BenefitBullet icon={FaShieldAlt} text="Low-quality, irrelevant, expired, and suspicious posts should not waste your search time." />
                  <BenefitBullet icon={FaBell} text="Your answers help shape alerts, saved filters, and recommendations as the product improves." />
                </VStack>
              </Box>
              <Box bg="gray.800" borderWidth="1px" borderColor="gray.700" borderRadius="md" p={5}>
                <Heading size="md" mb={3}>Because this takes real work, SportsJobs is a paid product.</Heading>
                <Text color="gray.300">
                  The goal is simple: spend less time digging through generic boards and more time applying to roles that actually belong in sports.
                </Text>
              </Box>
              <HStack justify="space-between" flexWrap="wrap" gap={3}>
                <Button variant="ghost" leftIcon={<FaArrowLeft />} onClick={goBack}>
                  Back
                </Button>
                <Button colorScheme={SIGNUP_ACCENT_COLOR_SCHEME} rightIcon={<FaArrowRight />} onClick={handlePaidProductAcknowledgement} isLoading={isAcknowledging}>
                  That&apos;s fair
                </Button>
              </HStack>
            </VStack>
          )}

          {step === 9 && (
            <VStack align="stretch" spacing={10}>
              <VStack align="center" spacing={6}>
                <Box textAlign="center">
                  <Heading size="2xl" mb={4}>You&apos;re closer than it feels...</Heading>
                  <Text color="gray.300" fontSize="lg" maxW="620px" mx="auto">
                    The issue usually is not your ambition. It is getting in front of the right sports roles before they disappear into scattered team sites, leagues, agencies, and betting companies.
                  </Text>
                </Box>
                <VStack align="center" spacing={4} w="full">
                  <ComparisonPanel
                    title="Without SportsJobs"
                    tone="muted"
                    points={[
                      { icon: FaTimes, text: 'Scattered job boards' },
                      { icon: FaClock, text: 'Slow, repetitive searching' },
                      { icon: FaSearch, text: 'Easy to miss hidden roles' },
                    ]}
                  />
                  <Flex bg="black" borderRadius="full" boxSize="48px" align="center" justify="center" borderWidth="1px" borderColor={SIGNUP_ACCENT_PROGRESS}>
                    <Icon as={FaArrowRight} color={SIGNUP_ACCENT_PROGRESS} transform="rotate(90deg)" />
                  </Flex>
                  <ComparisonPanel
                    title="With SportsJobs"
                    tone="accent"
                    imageSrc="https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80"
                    points={[
                      { icon: FaCheckCircle, text: 'Curated sports matches' },
                      { icon: FaBolt, text: 'Faster discovery' },
                      { icon: FaBell, text: 'Better alerts and filters next' },
                    ]}
                  />
                </VStack>
                <PromoTicket secondsLeft={offerSecondsLeft} />
                <Box textAlign="center">
                  <Heading size="2xl" mb={4}>Choose your plan</Heading>
                  <Text color="gray.300" fontSize="lg" maxW="620px" mx="auto">
                    Your profile is ready. Pick the access that fits your search and use {PROMO_CODE} at checkout for {PROMO_DISCOUNT} off.
                  </Text>
                </Box>
                <VStack align="stretch" spacing={4} w="full" maxW="640px">
                  {planOptions.map((plan) => (
                    <PlanSelectionRow
                      key={plan.name}
                      plan={plan}
                      isSelected={selectedPlan.name === plan.name}
                      onSelect={() => setSelectedPlanName(plan.name)}
                    />
                  ))}
                </VStack>
                <BenefitBullet icon={FaShieldAlt} text="No commitment. Stripe checkout. Cancel anytime on subscription plans." />
                <Button
                  w="full"
                  maxW="640px"
                  size="lg"
                  colorScheme={SIGNUP_ACCENT_COLOR_SCHEME}
                  leftIcon={<FaLockOpen />}
                  onClick={() => handleCheckout(selectedPlan)}
                  isLoading={checkoutPlan === selectedPlan.name}
                >
                  Access all jobs
                </Button>
                <Badge bg="gray.800" color="white" px={4} py={2} borderRadius="full">
                  <Icon as={FaCheckCircle} mr={2} />
                  200+ jobs added monthly
                </Badge>
              </VStack>

              <ProofCard />

              <Box>
                <Heading size="xl" mb={5} textAlign="center">Job seekers use SportsJobs to save time</Heading>
                <TestimonialsMarqueeFromDB />
              </Box>

              <SignupFaq />

              <VStack align="center" spacing={4} bg="gray.800" borderWidth="1px" borderColor="gray.700" borderRadius="md" p={{ base: 5, md: 8 }}>
                <Heading size="xl" textAlign="center">The right sports role is easier to find with a sharper board</Heading>
                <Text color="gray.300" textAlign="center" maxW="640px">
                  Keep your setup, unlock the curated board, and use {PROMO_CODE} before the timer runs out.
                </Text>
                <Button
                  size="lg"
                  colorScheme={SIGNUP_ACCENT_COLOR_SCHEME}
                  leftIcon={<FaLockOpen />}
                  onClick={() => handleCheckout(selectedPlan)}
                  isLoading={checkoutPlan === selectedPlan.name}
                >
                  Unlock SportsJobs
                </Button>
              </VStack>

              <Button alignSelf="flex-start" variant="ghost" leftIcon={<FaArrowLeft />} onClick={goBack}>
                Back
              </Button>
            </VStack>
          )}
        </Box>
      </VStack>
    </Container>
  );
}

function SingleChoiceStep({
  title,
  options,
  value,
  onChange,
  onNext,
  onBack,
}: {
  title: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <VStack align="stretch" spacing={6}>
      <Heading size="xl">{title}</Heading>
      <VStack align="stretch" spacing={3}>
        {options.map((option) => (
          <OptionButton key={option.value} isSelected={value === option.value} onClick={() => onChange(option.value)}>
            {option.label}
          </OptionButton>
        ))}
      </VStack>
      <StepActions onBack={onBack} onNext={onNext} isNextDisabled={!value} />
    </VStack>
  );
}

function InsightStep({
  eyebrow,
  title,
  body,
  points,
  onNext,
  onBack,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Badge colorScheme={SIGNUP_ACCENT_COLOR_SCHEME} mb={4}>{eyebrow}</Badge>
        <Heading size="xl" mb={4}>{title}</Heading>
        <Text color="gray.300" fontSize="lg">{body}</Text>
      </Box>
      <VStack align="stretch" spacing={3}>
        {points.map((point) => (
          <HStack key={point} align="start" spacing={3}>
            <Icon as={FaCheckCircle} color={SIGNUP_ACCENT_PROGRESS} boxSize={5} mt={1} flexShrink={0} />
            <Text color="white" fontSize={{ base: 'md', md: 'lg' }} fontWeight="semibold">
              {point}
            </Text>
          </HStack>
        ))}
      </VStack>
      <StepActions onBack={onBack} onNext={onNext} />
    </VStack>
  );
}

function StepActions({
  onBack,
  onNext,
  nextLabel = 'Continue',
  isNextDisabled = false,
  isNextLoading = false,
  secondaryAction,
  secondaryLabel,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
  secondaryAction?: () => void;
  secondaryLabel?: string;
}) {
  return (
    <HStack justify="space-between" flexWrap="wrap" gap={3}>
      <Button variant="ghost" leftIcon={<FaArrowLeft />} onClick={onBack}>
        Back
      </Button>
      <HStack spacing={3}>
        {secondaryAction && secondaryLabel && (
          <Button bg="gray.700" color="white" _hover={{ bg: 'gray.600' }} onClick={secondaryAction}>
            {secondaryLabel}
          </Button>
        )}
        <Button colorScheme={SIGNUP_ACCENT_COLOR_SCHEME} rightIcon={<FaArrowRight />} onClick={onNext} isDisabled={isNextDisabled} isLoading={isNextLoading}>
          {nextLabel}
        </Button>
      </HStack>
    </HStack>
  );
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function formatDiscountedPrice(priceValue: number) {
  return `$${(priceValue * 0.75).toFixed(2).replace(/\.00$/, '')}`;
}

function PromoTicket({ secondsLeft }: { secondsLeft: number }) {
  return (
    <Box w="full" maxW="640px" borderRadius="md" overflow="hidden" bg={SIGNUP_ACCENT_SURFACE} borderWidth="1px" borderColor={SIGNUP_ACCENT_PROGRESS}>
      <Box bg={SIGNUP_ACCENT_PROGRESS} color="gray.950" textAlign="center" py={4} fontWeight="bold">
        Your {PROMO_DISCOUNT} promo code is unlocked
      </Box>
      <Box borderTopWidth="2px" borderTopStyle="dashed" borderTopColor="gray.900" p={5}>
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
          <HStack bg="white" color="gray.900" borderRadius="md" p={4} spacing={3}>
            <Icon as={FaCheckCircle} color={BRAND_PRIMARY} />
            <Text fontWeight="bold">{PROMO_CODE}</Text>
          </HStack>
          <Box bg="white" color="gray.900" borderRadius="md" p={4} textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" lineHeight="1">{formatCountdown(secondsLeft)}</Text>
            <Text fontSize="xs" fontWeight="bold">min sec</Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
}

function ComparisonPanel({
  title,
  tone,
  imageSrc,
  points,
}: {
  title: string;
  tone: 'muted' | 'accent';
  imageSrc?: string;
  points: Array<{ icon: ElementType; text: string }>;
}) {
  const isAccent = tone === 'accent';

  return (
    <Box
      w="full"
      maxW="660px"
      bg={isAccent ? 'gray.900' : 'gray.950'}
      borderWidth="1px"
      borderColor={isAccent ? SIGNUP_ACCENT_PROGRESS : 'gray.700'}
      borderRadius="md"
      p={{ base: 4, md: 6 }}
      boxShadow={isAccent ? `0 0 18px var(--chakra-colors-${SIGNUP_ACCENT_PROGRESS.replace('.', '-')})` : 'none'}
    >
      <Heading size="xl" textAlign="center" mb={5}>
        {title === 'With SportsJobs' ? (
          <>
            With <Text as="span" color={SIGNUP_ACCENT_PROGRESS}>SportsJobs</Text>
          </>
        ) : title === 'Without SportsJobs' ? (
          <>
            Without <Text as="span" color={isAccent ? SIGNUP_ACCENT_PROGRESS : 'gray.300'}>SportsJobs</Text>
          </>
        ) : title}
      </Heading>
      <SimpleGrid columns={{ base: 1, md: imageSrc ? 2 : 1 }} spacing={5} alignItems="center">
        <VStack align="stretch" spacing={3}>
          {points.map((point) => (
            <HStack key={point.text} bg="whiteAlpha.100" borderWidth="1px" borderColor="whiteAlpha.200" borderRadius="md" p={4} spacing={3}>
              <Flex align="center" justify="center" bg={isAccent ? SIGNUP_ACCENT_SURFACE : 'gray.700'} borderRadius="md" boxSize="40px" flexShrink={0}>
                <Icon as={point.icon} color={isAccent ? SIGNUP_ACCENT_PROGRESS : 'gray.300'} />
              </Flex>
              <Text color="white" fontWeight="bold">{point.text}</Text>
            </HStack>
          ))}
        </VStack>
        {imageSrc && (
          <Image src={imageSrc} alt="" w="full" h="220px" objectFit="cover" borderRadius="md" opacity={isAccent ? 1 : 0.65} />
        )}
      </SimpleGrid>
    </Box>
  );
}

function BenefitBullet({ icon, text }: { icon: ElementType; text: string }) {
  return (
    <HStack align="start" spacing={3}>
      <Flex
        align="center"
        justify="center"
        bg={SIGNUP_ACCENT_SURFACE}
        color={SIGNUP_ACCENT_PROGRESS}
        borderRadius="md"
        boxSize="34px"
        flexShrink={0}
      >
        <Icon as={icon} boxSize={4} />
      </Flex>
      <Text color="gray.100" fontWeight="semibold">{text}</Text>
    </HStack>
  );
}

function PlanSelectionRow({
  plan,
  isSelected,
  onSelect,
}: {
  plan: typeof planOptions[number];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const discountedPrice = formatDiscountedPrice(plan.priceValue);
  const periodLabel = plan.name === 'Lifetime' ? 'one time' : plan.name === 'Yearly' ? 'per year' : 'per month';

  return (
    <Button
      onClick={onSelect}
      variant="unstyled"
      h="auto"
      whiteSpace="normal"
      textAlign="left"
      display="block"
    >
      <HStack
        align="center"
        justify="space-between"
        gap={4}
        borderWidth="1px"
        borderColor={isSelected ? SIGNUP_ACCENT_PROGRESS : 'gray.700'}
        bg={isSelected ? SIGNUP_ACCENT_SURFACE : 'gray.900'}
        borderRadius="md"
        p={{ base: 4, md: 5 }}
        position="relative"
      >
        {plan.highlighted && (
          <Badge position="absolute" top="-14px" left="50%" transform="translateX(-50%)" colorScheme={SIGNUP_ACCENT_COLOR_SCHEME} px={4} py={1} borderRadius="full">
            Special for you
          </Badge>
        )}
        <HStack spacing={4} minW={0}>
          <Flex align="center" justify="center" boxSize="24px" borderRadius="full" borderWidth="1px" borderColor={isSelected ? SIGNUP_ACCENT_PROGRESS : 'gray.500'} bg={isSelected ? SIGNUP_ACCENT_PROGRESS : 'transparent'} flexShrink={0}>
            {isSelected && <Icon as={FaCheckCircle} color="gray.950" boxSize={3} />}
          </Flex>
          <Box>
            <Heading size="md">{plan.name}</Heading>
            <HStack spacing={2} flexWrap="wrap">
              <Text color="gray.400" as="s" fontSize="sm">{plan.price}</Text>
              <Text color="white" fontWeight="bold">{discountedPrice}/{periodLabel}</Text>
              <Badge colorScheme={SIGNUP_ACCENT_COLOR_SCHEME}>{PROMO_DISCOUNT} off</Badge>
            </HStack>
          </Box>
        </HStack>
        <Box textAlign="right" flexShrink={0}>
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" lineHeight="1">{discountedPrice}</Text>
          <Text color="gray.300" fontSize="xs">{periodLabel}</Text>
        </Box>
      </HStack>
    </Button>
  );
}

function ProofCard() {
  return (
    <Box
      borderWidth="1px"
      borderColor={SIGNUP_ACCENT_PROGRESS}
      bg="gray.900"
      borderRadius="md"
      p={{ base: 5, md: 8 }}
      textAlign="center"
      maxW="640px"
      mx="auto"
      w="full"
    >
      <Heading size="xl" mb={4}>The right match is waiting for you</Heading>
      <Text color="gray.300" mb={6}>Unlock company names, apply links, saved search groundwork, and a cleaner sports-first board.</Text>
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
        <Box>
          <Text color={SIGNUP_ACCENT_PROGRESS} fontSize="3xl" fontWeight="bold">200+</Text>
          <Text color="gray.300" fontSize="sm">jobs added monthly</Text>
        </Box>
        <Box>
          <Text color={SIGNUP_ACCENT_PROGRESS} fontSize="3xl" fontWeight="bold">1</Text>
          <Text color="gray.300" fontSize="sm">sports-focused board</Text>
        </Box>
        <Box>
          <Text color={SIGNUP_ACCENT_PROGRESS} fontSize="3xl" fontWeight="bold">25%</Text>
          <Text color="gray.300" fontSize="sm">off with {PROMO_CODE}</Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

function SignupFaq() {
  const items = [
    {
      question: 'Why is SportsJobs paid?',
      answer: 'Because keeping a focused sports job board clean takes ongoing research, filtering, and product work.',
    },
    {
      question: 'Can I cancel?',
      answer: 'Yes. Monthly and yearly subscriptions can be canceled; checkout and billing are handled by Stripe.',
    },
    {
      question: 'What happens after checkout?',
      answer: 'You will get access to the paid SportsJobs experience and the setup you completed can guide future alerts and saved-search features.',
    },
  ];

  return (
    <Box maxW="760px" mx="auto" w="full">
      <Heading size="xl" mb={5} textAlign="center">Quick questions</Heading>
      <VStack align="stretch" spacing={3}>
        {items.map((item) => (
          <Box key={item.question} bg="gray.900" borderWidth="1px" borderColor="gray.700" borderRadius="md" p={5}>
            <Heading size="sm" mb={2}>{item.question}</Heading>
            <Text color="gray.300">{item.answer}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
