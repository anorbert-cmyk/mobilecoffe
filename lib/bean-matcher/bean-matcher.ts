// Bean Matcher Algorithm
// Recommends coffee beans based on user's equipment (machine + grinder)

import { CoffeeBean, RoastLevel, BrewMethod } from '@/data/beans';
import { EspressoMachine, CoffeeGrinder } from '@/data/machines';

export interface EquipmentProfile {
  machineId: string | null;
  machineType: 'manual' | 'semi-automatic' | 'automatic' | 'super-automatic' | 'pour-over' | 'french-press' | 'moka-pot' | 'aeropress' | null;
  grinderId: string | null;
  grinderType: 'manual' | 'electric' | null;
  burrType: 'flat' | 'conical' | null;
}

export interface BeanMatch {
  bean: CoffeeBean;
  matchScore: number; // 0-100
  matchReasons: string[];
  brewTips: string[];
}

// Roast level preferences by machine type
const MACHINE_ROAST_PREFERENCES: Record<string, RoastLevel[]> = {
  'super-automatic': ['medium', 'medium-dark', 'dark'],
  'automatic': ['medium', 'medium-dark'],
  'semi-automatic': ['medium-light', 'medium', 'medium-dark'],
  'manual': ['light', 'medium-light', 'medium'],
  'pour-over': ['light', 'medium-light'],
  'french-press': ['medium', 'medium-dark', 'dark'],
  'moka-pot': ['medium-dark', 'dark'],
  'aeropress': ['light', 'medium-light', 'medium'],
};

// Brew method mapping
const MACHINE_BREW_METHOD: Record<string, BrewMethod> = {
  'super-automatic': 'espresso',
  'automatic': 'espresso',
  'semi-automatic': 'espresso',
  'manual': 'espresso',
  'pour-over': 'filter',
  'french-press': 'french-press',
  'moka-pot': 'moka-pot',
  'aeropress': 'filter',
};

// Grinder quality affects bean recommendations
const GRINDER_QUALITY_SCORE: Record<string, number> = {
  'budget': 1,
  'mid-range': 2,
  'premium': 3,
};

export function matchBeansToEquipment(
  beans: CoffeeBean[],
  equipment: EquipmentProfile,
  machine?: EspressoMachine,
  grinder?: CoffeeGrinder
): BeanMatch[] {
  const machineType = equipment.machineType || 'semi-automatic';
  const preferredRoasts = MACHINE_ROAST_PREFERENCES[machineType] || ['medium'];
  const brewMethod = MACHINE_BREW_METHOD[machineType] || 'espresso';
  
  const matches: BeanMatch[] = beans.map(bean => {
    let score = 0;
    const reasons: string[] = [];
    const tips: string[] = [];

    // 1. Roast level match (30 points max)
    if (preferredRoasts.includes(bean.roastLevel)) {
      const roastIndex = preferredRoasts.indexOf(bean.roastLevel);
      const roastScore = 30 - (roastIndex * 5); // First preference gets full score
      score += roastScore;
      reasons.push(`${bean.roastLevel.replace('-', ' ')} roast is ideal for your ${machineType.replace('-', ' ')} machine`);
    } else {
      score += 5; // Minimal score for non-matching roast
    }

    // 2. Brew method compatibility (25 points max)
    if (bean.brewMethods.includes(brewMethod)) {
      score += 25;
      reasons.push(`Optimized for ${brewMethod.replace('-', ' ')} brewing`);
    } else {
      score += 5;
      tips.push(`Consider adjusting grind size for ${brewMethod} brewing`);
    }

    // 3. Grinder compatibility (20 points max)
    if (grinder) {
      const grinderQuality = GRINDER_QUALITY_SCORE[grinder.priceRange] || 1;
      
      // Light roasts need better grinders
      if (bean.roastLevel === 'light' || bean.roastLevel === 'medium-light') {
        if (grinderQuality >= 2) {
          score += 20;
          reasons.push(`Your ${grinder.name} can handle light roast precision grinding`);
        } else {
          score += 10;
          tips.push('Light roasts benefit from a more precise grinder');
        }
      } else {
        score += 15 + (grinderQuality * 2);
        reasons.push(`Great match with your ${grinder.name}`);
      }

      // Flat vs conical burr preferences
      if (equipment.burrType === 'flat' && (bean.roastLevel === 'light' || bean.roastLevel === 'medium-light')) {
        score += 5;
        reasons.push('Flat burrs excel at extracting light roast complexity');
      } else if (equipment.burrType === 'conical' && (bean.roastLevel === 'medium-dark' || bean.roastLevel === 'dark')) {
        score += 5;
        reasons.push('Conical burrs bring out rich body in darker roasts');
      }
    } else {
      score += 10; // Default score if no grinder specified
    }

    // 4. Machine-specific optimizations (15 points max)
    if (machine) {
      // Pressure-based brewing
      if (machine.pumpPressure >= 15 && bean.tasteProfile.body >= 7) {
        score += 10;
        reasons.push('High-pressure extraction enhances the full body');
      }
      
      // Pre-infusion benefits
      if (machine.preInfusion?.available && bean.roastLevel !== 'dark') {
        score += 5;
        tips.push(`Use ${machine.preInfusion.recommendedSeconds || 3}s pre-infusion for better extraction`);
      }
    } else {
      score += 10;
    }

    // 5. Taste profile balance (10 points max)
    const { acidity, body, sweetness, bitterness } = bean.tasteProfile;
    const balance = 10 - Math.abs(acidity - body) - Math.abs(sweetness - bitterness);
    score += Math.max(0, balance);

    // Generate brew tips based on equipment
    if (machineType === 'semi-automatic' || machineType === 'automatic' || machineType === 'super-automatic' || machineType === 'manual') {
      tips.push(`Aim for 18-20g dose, 36-40g yield in 25-30 seconds`);
      if (bean.roastLevel === 'light' || bean.roastLevel === 'medium-light') {
        tips.push('Grind finer and use higher temperature for light roasts');
      }
    } else if (machineType === 'pour-over') {
      tips.push('Use 1:15 ratio (15g coffee to 225ml water)');
      tips.push('Water temperature: 92-96°C for optimal extraction');
    } else if (machineType === 'french-press') {
      tips.push('Coarse grind, 4-minute steep time');
      tips.push('Use 1:12 ratio for stronger brew');
    } else if (machineType === 'moka-pot') {
      tips.push('Fill water to just below the valve');
      tips.push('Use medium-fine grind, not espresso fine');
    }

    return {
      bean,
      matchScore: Math.min(100, Math.round(score)),
      matchReasons: reasons,
      brewTips: tips.slice(0, 3) // Max 3 tips
    };
  });

  // Sort by match score descending
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

// Get top recommendations
export function getTopBeanRecommendations(
  beans: CoffeeBean[],
  equipment: EquipmentProfile,
  machine?: EspressoMachine,
  grinder?: CoffeeGrinder,
  limit: number = 5
): BeanMatch[] {
  const matches = matchBeansToEquipment(beans, equipment, machine, grinder);
  return matches.slice(0, limit);
}

// Get beans by category with equipment optimization
export function getBeansByCategory(
  beans: CoffeeBean[],
  equipment: EquipmentProfile,
  category: 'chocolate-nutty' | 'fruity-bright' | 'floral-tea' | 'sweet-caramel' | 'earthy-spicy'
): BeanMatch[] {
  const categoryKeywords: Record<string, string[]> = {
    'chocolate-nutty': ['chocolate', 'nutty', 'hazelnut', 'almond', 'cocoa'],
    'fruity-bright': ['fruity', 'berry', 'citrus', 'tropical', 'bright'],
    'floral-tea': ['floral', 'tea', 'jasmine', 'lavender', 'delicate'],
    'sweet-caramel': ['caramel', 'honey', 'maple', 'toffee', 'sweet'],
    'earthy-spicy': ['earthy', 'spicy', 'tobacco', 'cedar', 'pepper']
  };

  const keywords = categoryKeywords[category] || [];
  const categoryBeans = beans.filter(bean =>
    bean.flavorNotes.some(note =>
      keywords.some(keyword => note.toLowerCase().includes(keyword))
    )
  );

  return matchBeansToEquipment(categoryBeans, equipment);
}
