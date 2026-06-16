'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Badge,
    Box,
    Button,
    Container,
    Flex,
    Heading,
    HStack,
    Icon,
    SimpleGrid,
    Spinner,
    Text,
    useToast,
    VStack
} from '@chakra-ui/react';
import { FaArrowRight, FaBell, FaBookmark, FaCreditCard, FaFileAlt, FaSearch } from 'react-icons/fa';
import { BRAND_PRIMARY_COLOR_SCHEME, BRAND_SECONDARY_COLOR_SCHEME, BRAND_SECONDARY_LIGHT, BRAND_SECONDARY_SURFACE } from '@/lib/uiTokens';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import OnboardingModal from '../../components/OnboardingModal';
import { OnboardingAnswers, UserProfile, hasPremiumAccess } from '../../lib/userProfile';
const upgradePlans = [
  {
    name: 'Monthly',
    price: '$6.99',
    period: 'per month',
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
  },
  {
    name: 'Yearly',
    price: '$39',
    period: 'per year',
    priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID,
    highlighted: true,
  },
  {
    name: 'Lifetime',
    price: '$59',
    period: 'one time',
    priceId: process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID,
  },
];

const featureCards = [
  {
    title: 'Saved jobs',
    description: 'Keep a shortlist of roles you want to revisit and compare.',
    icon: FaBookmark,
    status: 'Planned next',
  },
  {
    title: 'Saved searches',
    description: 'Turn your filters into repeatable searches and alerts.',
    icon: FaSearch,
    status: 'Planned',
  },
  {
    title: 'CV review',
    description: 'Upload a CV and get sports analytics role-specific feedback.',
    icon: FaFileAlt,
    status: 'Premium preview',
  },
  {
    title: 'Job alerts',
    description: 'Use your onboarding answers to tune alerts around your goals.',
    icon: FaBell,
    status: 'Personalized',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, isLoading: isUserLoading, error } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const didSyncCheckoutRef = useRef(false);

  const isPremium = useMemo(() => hasPremiumAccess(profile), [profile]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/api/auth/login?returnTo=/dashboard');
    }
  }, [isUserLoading, router, user]);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const ensureProfile = async () => {
      try {
        setIsProfileLoading(true);
        const response = await fetch('/api/me', { method: 'POST' });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load profile');
        }

        if (!isMounted) return;
        setProfile(data);
        setIsOnboardingOpen(!data.onboardingCompletedAt);
      } catch (profileError) {
        toast({
          title: 'Dashboard profile unavailable',
          description: profileError instanceof Error ? profileError.message : 'Please refresh and try again.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        if (isMounted) {
          setIsProfileLoading(false);
        }
      }
    };

    ensureProfile();

    return () => {
      isMounted = false;
    };
  }, [toast, user]);

  useEffect(() => {
    if (!user || didSyncCheckoutRef.current) return;

    const currentSearchParams = new URLSearchParams(window.location.search);
    const upgradeStatus = currentSearchParams.get('upgrade');
    const sessionId = currentSearchParams.get('session_id');
    if (upgradeStatus !== 'success' || !sessionId) return;

    didSyncCheckoutRef.current = true;

    const syncUpgrade = async () => {
      try {
        const syncResponse = await fetch('/api/checkout-session-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const syncData = await syncResponse.json().catch(() => null);

        if (!syncResponse.ok) {
          throw new Error(syncData?.error || 'Could not verify checkout.');
        }

        const profileResponse = await fetch('/api/me', { method: 'POST' });
        const profileData = await profileResponse.json().catch(() => null);

        if (profileResponse.ok && profileData) {
          setProfile(profileData);
        }

        toast({
          title: 'Checkout verified',
          description: 'Your account access has been refreshed.',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        router.replace('/dashboard');
      } catch (upgradeError) {
        toast({
          title: 'Checkout verification pending',
          description: upgradeError instanceof Error ? upgradeError.message : 'Please refresh or contact support if access does not update.',
          status: 'warning',
          duration: 6000,
          isClosable: true,
        });
      }
    };

    syncUpgrade();
  }, [router, toast, user]);

  const handleOnboardingComplete = async (answers: OnboardingAnswers) => {
    const response = await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onboarding: answers }),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error || 'Failed to save onboarding answers');
    }

    setProfile({
      ...data,
      onboardingCompletedAt: data.onboardingCompletedAt || new Date().toISOString(),
    });
    setIsOnboardingOpen(false);
  };

  const handleUpgrade = async (planName: string, priceId?: string) => {
    if (!priceId) {
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
      setCheckoutPlan(planName);
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          referral: typeof window !== 'undefined' ? (window as any).promotekit_referral || null : null,
          planName,
        }),
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data?.error || 'Failed to start checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (checkoutError) {
      toast({
        title: 'Checkout unavailable',
        description: checkoutError instanceof Error ? checkoutError.message : 'Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setCheckoutPlan(null);
    }
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <Flex minH="60vh" align="center" justify="center">
        <Spinner color={BRAND_SECONDARY_LIGHT} size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={12}>
        <Text color="red.300">{error.message}</Text>
      </Container>
    );
  }

  if (!user || !profile) return null;

  return (
    <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align={{ base: 'start', md: 'center' }} gap={4} direction={{ base: 'column', md: 'row' }}>
          <Box>
            <HStack spacing={3} mb={3}>
              <Badge colorScheme={isPremium ? 'green' : BRAND_SECONDARY_COLOR_SCHEME}>{isPremium ? 'Premium' : 'Free'}</Badge>
              {profile.backendStatus === 'pending_backend' && (
                <Badge colorScheme="yellow">Profile sync pending</Badge>
              )}
            </HStack>
            <Heading size="xl">Welcome back{profile.name ? `, ${profile.name.split(' ')[0]}` : ''}</Heading>
            <Text color="gray.300" mt={2}>
              Track your sports analytics search, save opportunities, and upgrade when you need deeper tools.
            </Text>
          </Box>
          <Button
            leftIcon={<FaCreditCard />}
            colorScheme={BRAND_SECONDARY_COLOR_SCHEME}
            variant={isPremium ? 'outline' : 'solid'}
            onClick={() => document.getElementById('upgrade-plans')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {isPremium ? 'Manage plan' : 'Upgrade'}
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          {featureCards.map((feature) => (
            <Box
              key={feature.title}
              borderWidth="1px"
              borderColor="gray.700"
              bg="gray.900"
              borderRadius="md"
              p={5}
              minH="190px"
            >
              <Icon as={feature.icon} color={BRAND_SECONDARY_LIGHT} boxSize={5} mb={4} />
              <Heading size="sm" mb={2}>{feature.title}</Heading>
              <Text color="gray.300" fontSize="sm" minH="60px">{feature.description}</Text>
              <Badge mt={4} colorScheme={feature.status.includes('Premium') ? BRAND_PRIMARY_COLOR_SCHEME : 'gray'}>
                {feature.status}
              </Badge>
            </Box>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Box borderWidth="1px" borderColor="gray.700" bg="gray.900" borderRadius="md" p={6}>
            <Heading size="md" mb={3}>Your search profile</Heading>
            <Text color="gray.300" mb={5}>
              Onboarding answers will power saved searches, job alerts, and CV review context.
            </Text>
            <Button variant="outline" colorScheme={BRAND_SECONDARY_COLOR_SCHEME} onClick={() => setIsOnboardingOpen(true)}>
              Edit onboarding
            </Button>
          </Box>

          <Box borderWidth="1px" borderColor="gray.700" bg="gray.900" borderRadius="md" p={6}>
            <Heading size="md" mb={3}>Latest matches</Heading>
            <Text color="gray.300" mb={5}>
              Start from the live job board while personalized matching is connected.
            </Text>
            <Button rightIcon={<FaArrowRight />} colorScheme={BRAND_SECONDARY_COLOR_SCHEME} variant="outline" onClick={() => router.push('/')}>
              Browse jobs
            </Button>
          </Box>
        </SimpleGrid>

        <Box id="upgrade-plans">
          <Heading size="lg" mb={4}>Upgrade plan</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {upgradePlans.map((plan) => (
              <Box
                key={plan.name}
                borderWidth="1px"
                borderColor={plan.highlighted ? BRAND_SECONDARY_LIGHT : 'gray.700'}
                bg={plan.highlighted ? BRAND_SECONDARY_SURFACE : 'gray.900'}
                borderRadius="md"
                p={6}
              >
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">{plan.name}</Heading>
                  {plan.highlighted && <Badge colorScheme={BRAND_SECONDARY_COLOR_SCHEME}>Best value</Badge>}
                </Flex>
                <Text fontSize="3xl" fontWeight="bold">{plan.price}</Text>
                <Text color="gray.300" mb={6}>{plan.period}</Text>
                <Button
                  w="full"
                  colorScheme={BRAND_SECONDARY_COLOR_SCHEME}
                  rightIcon={<FaArrowRight />}
                  onClick={() => handleUpgrade(plan.name, plan.priceId)}
                  isLoading={checkoutPlan === plan.name}
                  isDisabled={isPremium}
                >
                  {isPremium ? 'Active' : 'Choose plan'}
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        onSkip={() => setIsOnboardingOpen(false)}
      />
    </Container>
  );
}
