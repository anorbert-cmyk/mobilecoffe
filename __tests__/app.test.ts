import { describe, it, expect, vi } from 'vitest';

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

// Mock image requires
vi.mock('@/assets/images/espresso.png', () => ({ default: 'espresso.png' }));
vi.mock('@/assets/images/double_espresso.png', () => ({ default: 'double_espresso.png' }));
vi.mock('@/assets/images/ristretto.png', () => ({ default: 'ristretto.png' }));
vi.mock('@/assets/images/lungo.png', () => ({ default: 'lungo.png' }));
vi.mock('@/assets/images/americano.png', () => ({ default: 'americano.png' }));
vi.mock('@/assets/images/flat_white.png', () => ({ default: 'flat_white.png' }));
vi.mock('@/assets/images/cappuccino.png', () => ({ default: 'cappuccino.png' }));
vi.mock('@/assets/images/latte.png', () => ({ default: 'latte.png' }));
vi.mock('@/assets/images/macchiato.png', () => ({ default: 'macchiato.png' }));
vi.mock('@/assets/images/latte_macchiato.png', () => ({ default: 'latte_macchiato.png' }));
vi.mock('@/assets/images/cortado.png', () => ({ default: 'cortado.png' }));
vi.mock('@/assets/images/moka_pot_coffee.png', () => ({ default: 'moka_pot_coffee.png' }));

// Mock @/data/machines for equipment recommender
vi.mock('@/data/machines', () => ({
  espressoMachines: [
    {
      id: 'test-machine-1',
      name: 'Test Machine',
      brand: 'Test Brand',
      type: 'semi-automatic',
      priceRange: 'budget',
      boilerType: 'thermoblock',
      pumpPressure: 15,
      waterTankMl: 1000,
      brewTemperature: { celsius: 93, fahrenheit: 200 },
      grindSetting: { min: 1, max: 5, sweet_spot: 3, note: 'Test' },
      tips: ['Tip 1'],
      maintenance: { backflush: false, descaleFrequency: 'Monthly', groupHeadClean: 'Daily' },
    },
    {
      id: 'test-machine-2',
      name: 'Pro Machine',
      brand: 'Pro Brand',
      type: 'semi-automatic',
      priceRange: 'prosumer',
      boilerType: 'dual',
      pumpPressure: 9,
      waterTankMl: 2500,
      brewTemperature: { celsius: 94, fahrenheit: 201 },
      grindSetting: { min: 1, max: 5, sweet_spot: 3, note: 'Test' },
      tips: ['Pro tip'],
      maintenance: { backflush: true, descaleFrequency: 'Monthly', groupHeadClean: 'Daily' },
    },
  ],
  coffeeGrinders: [
    {
      id: 'test-grinder-1',
      name: 'Test Grinder',
      brand: 'Test Brand',
      type: 'manual',
      burrType: 'conical',
      burrSize: 48,
      priceRange: 'budget',
      tips: ['Grinder tip'],
    },
  ],
}));

describe('Cafe Data', () => {
  it('should have valid cafe entries with required fields', async () => {
    const { demoCafes } = await import('../data/cafes');
    
    expect(demoCafes.length).toBeGreaterThan(0);
    
    demoCafes.forEach(cafe => {
      expect(cafe.id).toBeDefined();
      expect(cafe.name).toBeDefined();
      expect(cafe.address).toBeDefined();
      expect(cafe.rating).toBeGreaterThanOrEqual(0);
      expect(cafe.rating).toBeLessThanOrEqual(5);
      expect(cafe.latitude).toBeDefined();
      expect(cafe.longitude).toBeDefined();
    });
  });

  it('should have unique cafe IDs', async () => {
    const { demoCafes } = await import('../data/cafes');
    const ids = demoCafes.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('Learning Data', () => {
  it('should have valid learning categories', async () => {
    const { learningCategories } = await import('../data/learning');
    
    expect(learningCategories.length).toBeGreaterThan(0);
    
    learningCategories.forEach(category => {
      expect(category.id).toBeDefined();
      expect(category.title).toBeDefined();
      expect(category.description).toBeDefined();
      expect(Array.isArray(category.articles)).toBe(true);
      expect(category.articles.length).toBeGreaterThan(0);
    });
  });

  it('should have valid articles in each category', async () => {
    const { learningCategories } = await import('../data/learning');
    
    learningCategories.forEach(category => {
      category.articles.forEach(article => {
        expect(article.id).toBeDefined();
        expect(article.title).toBeDefined();
        expect(article.content).toBeDefined();
        expect(article.content.length).toBeGreaterThan(100); // Meaningful content
      });
    });
  });
});

describe('Machine Data', () => {
  it('should have valid espresso machines', async () => {
    const { espressoMachines } = await import('../data/machines');
    
    expect(espressoMachines.length).toBeGreaterThan(0);
    
    espressoMachines.forEach(machine => {
      expect(machine.id).toBeDefined();
      expect(machine.name).toBeDefined();
      expect(machine.brand).toBeDefined();
      expect(machine.type).toBeDefined();
      expect(machine.priceRange).toBeDefined();
      expect(machine.boilerType).toBeDefined();
      expect(machine.pumpPressure).toBeGreaterThan(0);
      expect(machine.waterTankMl).toBeGreaterThan(0);
      expect(machine.brewTemperature).toBeDefined();
      expect(machine.grindSetting).toBeDefined();
      expect(Array.isArray(machine.tips)).toBe(true);
    });
  });

  it('should have valid coffee grinders', async () => {
    const { coffeeGrinders } = await import('../data/machines');
    
    expect(coffeeGrinders.length).toBeGreaterThan(0);
    
    coffeeGrinders.forEach(grinder => {
      expect(grinder.id).toBeDefined();
      expect(grinder.name).toBeDefined();
      expect(grinder.brand).toBeDefined();
      expect(grinder.type).toBeDefined();
      expect(grinder.burrType).toBeDefined();
      expect(grinder.burrSize).toBeGreaterThan(0);
      expect(grinder.priceRange).toBeDefined();
      expect(Array.isArray(grinder.tips)).toBe(true);
    });
  });

  it('should have unique machine and grinder IDs', async () => {
    const { espressoMachines, coffeeGrinders } = await import('../data/machines');
    
    const machineIds = espressoMachines.map(m => m.id);
    const grinderIds = coffeeGrinders.map(g => g.id);
    
    expect(new Set(machineIds).size).toBe(machineIds.length);
    expect(new Set(grinderIds).size).toBe(grinderIds.length);
  });
});

describe('Equipment Recommender', () => {
  it('should return recommendations for starter budget', async () => {
    const { getEquipmentRecommendations } = await import('../lib/equipment-recommender');
    
    const recommendations = getEquipmentRecommendations(
      'starter',
      ['quick-espresso'],
      'beginner'
    );
    
    expect(recommendations.machines.length).toBeGreaterThan(0);
    expect(recommendations.grinders.length).toBeGreaterThan(0);
    expect(recommendations.reasoning).toBeDefined();
    expect(recommendations.tips.length).toBeGreaterThan(0);
  });

  it('should return recommendations for prosumer budget', async () => {
    const { getEquipmentRecommendations } = await import('../lib/equipment-recommender');
    
    const recommendations = getEquipmentRecommendations(
      'prosumer',
      ['milk-drinks', 'quick-espresso'],
      'advanced'
    );
    
    expect(recommendations.machines.length).toBeGreaterThan(0);
    expect(recommendations.grinders.length).toBeGreaterThan(0);
    expect(recommendations.reasoning).toContain('prosumer');
  });

  it('should return default recommendations when no preferences', async () => {
    const { getEquipmentRecommendations } = await import('../lib/equipment-recommender');
    
    const recommendations = getEquipmentRecommendations(null, null, null);
    
    expect(recommendations.machines.length).toBeGreaterThan(0);
    expect(recommendations.grinders.length).toBeGreaterThan(0);
  });

  it('should return best match for quick lookup', async () => {
    const { getBestMatch } = await import('../lib/equipment-recommender');
    
    const match = getBestMatch('home-barista', ['milk-drinks']);
    
    expect(match.machine).toBeDefined();
    expect(match.grinder).toBeDefined();
  });
});

describe('User Profile Types', () => {
  it('should export valid experience labels', async () => {
    const { getExperienceLabel } = await import('../lib/user-profile');
    
    // Check that labels are defined and non-empty
    expect(getExperienceLabel('beginner')).toBeDefined();
    expect(getExperienceLabel('beginner').length).toBeGreaterThan(0);
    expect(getExperienceLabel('intermediate')).toBeDefined();
    expect(getExperienceLabel('advanced')).toBeDefined();
  });

  it('should export valid budget labels', async () => {
    const { getBudgetLabel } = await import('../lib/user-profile');
    
    expect(getBudgetLabel('starter')).toContain('$');
    expect(getBudgetLabel('home-barista')).toContain('$');
    expect(getBudgetLabel('serious')).toContain('$');
    expect(getBudgetLabel('prosumer')).toContain('$');
  });

  it('should export valid purpose labels', async () => {
    const { getPurposeLabel } = await import('../lib/user-profile');
    
    expect(getPurposeLabel('quick-espresso')).toBeDefined();
    expect(getPurposeLabel('milk-drinks')).toBeDefined();
    expect(getPurposeLabel('pour-over')).toBeDefined();
  });
});

describe('Theme Configuration', () => {
  it('should have required color tokens', async () => {
    const { themeColors } = await import('../theme.config');
    
    // Required color tokens
    const requiredTokens = [
      'primary', 'background', 'surface', 'foreground', 
      'muted', 'border', 'success', 'warning', 'error'
    ] as const;
    
    requiredTokens.forEach(token => {
      const colorToken = themeColors[token as keyof typeof themeColors];
      expect(colorToken).toBeDefined();
      expect(colorToken.light).toBeDefined();
      expect(colorToken.dark).toBeDefined();
    });
  });

  it('should have light and dark values for all tokens', async () => {
    const { themeColors } = await import('../theme.config');
    
    Object.values(themeColors).forEach((token) => {
      expect(token.light).toBeDefined();
      expect(token.dark).toBeDefined();
      // Values can be hex or rgba
      expect(typeof token.light).toBe('string');
      expect(typeof token.dark).toBe('string');
    });
  });
});
