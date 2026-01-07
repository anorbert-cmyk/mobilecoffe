import { BudgetRange, CoffeePurpose, ExperienceLevel } from './user-profile';
import { espressoMachines, coffeeGrinders, EspressoMachine, CoffeeGrinder } from '@/data/machines';

export interface EquipmentRecommendation {
  machines: EspressoMachine[];
  grinders: CoffeeGrinder[];
  reasoning: string;
  tips: string[];
}

// Map budget ranges to price ranges
const budgetToPriceRange: Record<BudgetRange, ('budget' | 'mid-range' | 'premium' | 'prosumer')[]> = {
  'starter': ['budget'],
  'home-barista': ['budget', 'mid-range'],
  'serious': ['mid-range', 'premium'],
  'prosumer': ['premium', 'prosumer'],
};

/**
 * Equipment recommendation engine based on user profile
 * Uses budget, purpose, and experience level to suggest optimal setups
 */
export function getEquipmentRecommendations(
  budget: BudgetRange | null,
  purposes: CoffeePurpose[] | null,
  experienceLevel: ExperienceLevel | null
): EquipmentRecommendation {
  // Default recommendations if no preferences
  if (!budget || !purposes || purposes.length === 0) {
    return {
      machines: espressoMachines.slice(0, 3),
      grinders: coffeeGrinders.slice(0, 2),
      reasoning: 'Here are some popular options to get you started.',
      tips: ['Consider your daily coffee consumption', 'Quality grinder is as important as the machine'],
    };
  }

  const allowedPriceRanges = budgetToPriceRange[budget];

  // Filter machines by budget
  let recommendedMachines = espressoMachines.filter(
    m => allowedPriceRanges.includes(m.priceRange)
  );

  // Filter by purpose - prioritize certain features
  if (purposes.includes('milk-drinks')) {
    // Prioritize machines with good steam capability (dual boiler or heat exchanger)
    const milkFriendly = recommendedMachines.filter(m => 
      m.boilerType === 'dual' || m.boilerType === 'heat-exchanger'
    );
    if (milkFriendly.length > 0) {
      recommendedMachines = milkFriendly;
    }
  }

  if (purposes.includes('quick-espresso')) {
    // Prioritize machines with fast heat-up (thermoblock)
    const quickMachines = recommendedMachines.filter(m => 
      m.boilerType === 'thermoblock'
    );
    if (quickMachines.length > 0) {
      recommendedMachines = quickMachines;
    }
  }

  // Filter grinders by budget
  let recommendedGrinders = coffeeGrinders.filter(
    g => allowedPriceRanges.includes(g.priceRange)
  );

  // For pour-over, manual grinders are great
  if (purposes.includes('pour-over') && !purposes.includes('quick-espresso')) {
    const manualGrinders = recommendedGrinders.filter(g => g.type === 'manual');
    if (manualGrinders.length > 0) {
      recommendedGrinders = manualGrinders;
    }
  }

  // Limit results
  recommendedMachines = recommendedMachines.slice(0, 4);
  recommendedGrinders = recommendedGrinders.slice(0, 3);

  // If no matches, fall back to closest options
  if (recommendedMachines.length === 0) {
    recommendedMachines = espressoMachines.slice(0, 3);
  }

  if (recommendedGrinders.length === 0) {
    recommendedGrinders = coffeeGrinders.slice(0, 2);
  }

  // Generate reasoning
  const reasoning = generateReasoning(budget, purposes, experienceLevel);
  const tips = generateTips(budget, purposes, experienceLevel);

  return {
    machines: recommendedMachines,
    grinders: recommendedGrinders,
    reasoning,
    tips,
  };
}

function generateReasoning(
  budget: BudgetRange,
  purposes: CoffeePurpose[],
  experienceLevel: ExperienceLevel | null
): string {
  const parts: string[] = [];

  // Budget-based reasoning
  switch (budget) {
    case 'starter':
      parts.push('For your starter budget, we focused on reliable entry-level equipment that delivers great value.');
      break;
    case 'home-barista':
      parts.push('Your home barista budget opens up excellent mid-range options with more features and better build quality.');
      break;
    case 'serious':
      parts.push('With your serious setup budget, you can access prosumer-grade equipment with professional features.');
      break;
    case 'prosumer':
      parts.push('Your prosumer budget allows for café-quality equipment that will last for years.');
      break;
  }

  // Purpose-based reasoning
  if (purposes.includes('milk-drinks')) {
    parts.push('Since you enjoy milk-based drinks, we prioritized machines with capable steam wands.');
  }
  if (purposes.includes('quick-espresso')) {
    parts.push('For quick morning espresso, we selected machines with fast heat-up times.');
  }
  if (purposes.includes('pour-over')) {
    parts.push('For pour-over brewing, grind consistency is key, so we included versatile grinders.');
  }

  return parts.join(' ');
}

function generateTips(
  budget: BudgetRange,
  purposes: CoffeePurpose[],
  experienceLevel: ExperienceLevel | null
): string[] {
  const tips: string[] = [];

  // General tips
  tips.push('Invest in a quality grinder - it makes more difference than the machine.');
  tips.push('Use freshly roasted beans (within 2-4 weeks of roast date).');

  // Budget-specific tips
  if (budget === 'starter') {
    tips.push('Consider buying used equipment from reputable sellers to stretch your budget.');
    tips.push('A pressurized portafilter is forgiving for beginners.');
  }

  if (budget === 'home-barista' || budget === 'serious') {
    tips.push('Non-pressurized baskets give you more control but require precise grinding.');
    tips.push('Consider a bottomless portafilter to diagnose your shots.');
  }

  if (budget === 'prosumer') {
    tips.push('Plumb-in options can improve convenience and temperature stability.');
    tips.push('Consider a water filtration system to protect your investment.');
  }

  // Purpose-specific tips
  if (purposes.includes('milk-drinks')) {
    tips.push('Practice steaming with water first to save milk while learning.');
    tips.push('Whole milk (3.5% fat) is easiest to steam for beginners.');
  }

  if (purposes.includes('pour-over')) {
    tips.push('A gooseneck kettle gives you better control for pour-over.');
    tips.push('Use a scale for consistent results.');
  }

  // Experience-specific tips
  if (experienceLevel === 'beginner') {
    tips.push("Don't chase perfection - enjoy the learning process!");
    tips.push('Start with a medium roast to learn extraction basics.');
  }

  return tips.slice(0, 5); // Limit to 5 tips
}

/**
 * Get a single best recommendation for quick display
 */
export function getBestMatch(
  budget: BudgetRange | null,
  purposes: CoffeePurpose[] | null
): { machine: EspressoMachine | null; grinder: CoffeeGrinder | null } {
  const recommendations = getEquipmentRecommendations(budget, purposes, null);
  
  return {
    machine: recommendations.machines[0] || null,
    grinder: recommendations.grinders[0] || null,
  };
}
