// Subscription Tiers and Features
// Based on monetization strategy research

export type SubscriptionTier = 'free' | 'enthusiast' | 'pro';

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  free: boolean;
  enthusiast: boolean;
  pro: boolean;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  tagline: string;
  price: number; // USD per month
  priceYearly: number; // USD per year (with discount)
  popular?: boolean;
  features: string[];
  limitations?: string[];
}

export const subscriptionFeatures: SubscriptionFeature[] = [
  // Core Features (All Tiers)
  {
    id: 'coffee-library',
    name: 'Coffee Library',
    description: 'Browse 12+ coffee drink recipes',
    free: true,
    enthusiast: true,
    pro: true
  },
  {
    id: 'equipment-recommendations',
    name: 'Equipment Recommendations',
    description: 'Personalized machine and grinder suggestions',
    free: true,
    enthusiast: true,
    pro: true
  },
  {
    id: 'learning-articles',
    name: 'Learning Articles',
    description: 'Access to 11 educational articles',
    free: true,
    enthusiast: true,
    pro: true
  },
  {
    id: 'cafe-finder',
    name: 'Café Finder',
    description: 'Discover specialty coffee shops nearby',
    free: true,
    enthusiast: true,
    pro: true
  },

  // Enthusiast Features
  {
    id: 'bean-marketplace',
    name: 'Coffee Bean Marketplace',
    description: 'Buy specialty beans with personalized recommendations',
    free: false,
    enthusiast: true,
    pro: true
  },
  {
    id: 'favorites',
    name: 'Favorites System',
    description: 'Save and organize your favorite coffees, equipment, and articles',
    free: false,
    enthusiast: true,
    pro: true
  },
  {
    id: 'brewing-timer',
    name: 'Advanced Brewing Timer',
    description: 'Step-by-step timers with notifications',
    free: false,
    enthusiast: true,
    pro: true
  },
  {
    id: 'equipment-comparison',
    name: 'Equipment Comparison',
    description: 'Compare up to 3 machines or grinders side-by-side',
    free: false,
    enthusiast: true,
    pro: true
  },

  // Pro Features
  {
    id: 'video-courses',
    name: 'Video Courses',
    description: 'Full access to 4 premium courses (180+ minutes)',
    free: false,
    enthusiast: false,
    pro: true
  },
  {
    id: 'brewing-journal',
    name: 'Brewing Journal',
    description: 'Track recipes, notes, and improve your technique',
    free: false,
    enthusiast: false,
    pro: true
  },
  {
    id: 'advanced-analytics',
    name: 'Brewing Analytics',
    description: 'Insights and statistics from your journal entries',
    free: false,
    enthusiast: false,
    pro: true
  },
  {
    id: 'offline-access',
    name: 'Offline Access',
    description: 'Download courses and articles for offline viewing',
    free: false,
    enthusiast: false,
    pro: true
  },
  {
    id: 'priority-support',
    name: 'Priority Support',
    description: 'Get help faster with priority email support',
    free: false,
    enthusiast: false,
    pro: true
  }
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Start your coffee journey',
    price: 0,
    priceYearly: 0,
    features: [
      'Coffee drink library (12+ recipes)',
      'Equipment recommendations',
      'Learning articles (11 articles)',
      'Café finder',
      'Basic brewing timer'
    ],
    limitations: [
      'No bean marketplace access',
      'No favorites or comparison',
      'No video courses',
      'No brewing journal'
    ]
  },
  {
    id: 'enthusiast',
    name: 'Enthusiast',
    tagline: 'For passionate home brewers',
    price: 6.99,
    priceYearly: 69.99, // ~16% discount
    popular: true,
    features: [
      'Everything in Free',
      'Coffee bean marketplace',
      'Favorites system',
      'Equipment comparison (up to 3)',
      'Advanced brewing timer with notifications',
      'Ad-free experience'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Master the craft',
    price: 11.99,
    priceYearly: 119.99, // ~17% discount
    features: [
      'Everything in Enthusiast',
      'Full video course library (4 courses)',
      'Brewing journal with analytics',
      'Offline access to all content',
      'Priority email support',
      'Early access to new features'
    ]
  }
];

// Feature gating helpers
export const hasFeatureAccess = (
  feature: string,
  userTier: SubscriptionTier
): boolean => {
  const featureData = subscriptionFeatures.find(f => f.id === feature);
  if (!featureData) return false;
  return featureData[userTier];
};

export const getRequiredTier = (feature: string): SubscriptionTier | null => {
  const featureData = subscriptionFeatures.find(f => f.id === feature);
  if (!featureData) return null;
  
  if (featureData.free) return 'free';
  if (featureData.enthusiast) return 'enthusiast';
  if (featureData.pro) return 'pro';
  return null;
};

export const getPlanByTier = (tier: SubscriptionTier) =>
  subscriptionPlans.find(plan => plan.id === tier);

// Pricing display helpers
export const formatPrice = (price: number) =>
  price === 0 ? 'Free' : `$${price.toFixed(2)}`;

export const getMonthlyPrice = (plan: SubscriptionPlan, yearly: boolean) =>
  yearly ? plan.priceYearly / 12 : plan.price;

export const getYearlySavings = (plan: SubscriptionPlan) =>
  plan.price * 12 - plan.priceYearly;
