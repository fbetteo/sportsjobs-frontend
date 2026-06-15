export type UserPlan = 'free' | 'monthly_subscription' | 'yearly_subscription' | 'lifetime';

export type SubscriptionStatus = 'none' | 'trialing' | 'active' | 'past_due' | 'canceled';

export interface OnboardingAnswers {
  sportsInterests: string[];
  jobSearchDuration: string;
  hardestPart: string;
  country: string;
  roleInterests: string[];
  roleUnsure: boolean;
}

export interface UserProfile {
  auth0Sub: string;
  email: string;
  name: string;
  plan: UserPlan;
  subscriptionStatus: SubscriptionStatus;
  onboardingCompletedAt: string | null;
  onboarding?: Partial<OnboardingAnswers>;
  backendStatus?: 'synced' | 'pending_backend';
}

export function hasPremiumAccess(profile?: Pick<UserProfile, 'plan' | 'subscriptionStatus'> | null) {
  if (!profile) return false;
  if (profile.plan === 'lifetime') return true;
  return profile.plan !== 'free' && ['active', 'trialing'].includes(profile.subscriptionStatus);
}
