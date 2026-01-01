// pricingPlans.ts
export const pricingPlans = [
  {
    planName: 'Monthly',
    airtablePlanName: 'monthly_subscription',
    price: '$6.99',
    period: 'per month',
    ctaText: 'Start for $6.99',
    features: [
      '✓ Flexible monthly billing',
      '✓ Unlimited access to all jobs',
      '✓ Advanced filtering tools',
      '✓ Daily job alerts',
      '✓ Exclusive discount codes',
      '✓ Cancel anytime',
    ],
  },
  {
    planName: 'Yearly',
    airtablePlanName: 'yearly_subscription',
    price: '$39',
    period: 'per year • Only $3.25/mo',
    ctaText: 'Get Best Value',
    features: [
      '✓ Save 50% vs monthly',
      '✓ Unlimited access to all jobs',
      '✓ Advanced filtering tools',
      '✓ Daily job alerts',
      '✓ Exclusive discount codes',
      '✓ Cancel anytime',
    ],
  },
  {
    planName: 'Lifetime',
    airtablePlanName: 'lifetime',
    price: '$59',
    period: 'one-time • forever',
    ctaText: 'Lock In Forever',
    features: [
      '✓ Pay once, access forever',
      '✓ Unlimited access to all jobs',
      '✓ Advanced filtering tools',
      '✓ Daily job alerts',
      '✓ Exclusive discount codes',
      '✓ Best long-term value',
    ],
  },
];
