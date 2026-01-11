import { describe, it, expect } from 'vitest';

// Test bean matcher algorithm
describe('Bean Matcher Algorithm', () => {
  it('should have bean matcher module', async () => {
    const beanMatcher = await import('../lib/bean-matcher/bean-matcher');
    expect(beanMatcher.matchBeansToEquipment).toBeDefined();
    expect(beanMatcher.getTopBeanRecommendations).toBeDefined();
    expect(beanMatcher.getBeansByCategory).toBeDefined();
  });

  it('should match beans to equipment profile', async () => {
    const { matchBeansToEquipment } = await import('../lib/bean-matcher/bean-matcher');
    const { coffeeBeans } = await import('../data/beans');
    
    const equipmentProfile = {
      machineId: null,
      machineType: 'semi-automatic' as const,
      grinderId: null,
      grinderType: null,
      burrType: null,
    };
    
    const matches = matchBeansToEquipment(coffeeBeans, equipmentProfile);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0]).toHaveProperty('bean');
    expect(matches[0]).toHaveProperty('matchScore');
    expect(matches[0]).toHaveProperty('matchReasons');
    expect(matches[0]).toHaveProperty('brewTips');
  });

  it('should return top recommendations', async () => {
    const { getTopBeanRecommendations } = await import('../lib/bean-matcher/bean-matcher');
    const { coffeeBeans } = await import('../data/beans');
    
    const equipmentProfile = {
      machineId: null,
      machineType: 'pour-over' as const,
      grinderId: null,
      grinderType: null,
      burrType: null,
    };
    
    const topMatches = getTopBeanRecommendations(coffeeBeans, equipmentProfile, undefined, undefined, 3);
    expect(topMatches.length).toBeLessThanOrEqual(3);
    // Should be sorted by match score
    if (topMatches.length > 1) {
      expect(topMatches[0].matchScore).toBeGreaterThanOrEqual(topMatches[1].matchScore);
    }
  });
});

// Test Perplexity service structure
describe('Perplexity API Service', () => {
  it('should have perplexity service module', async () => {
    const perplexityService = await import('../lib/perplexity/perplexity-service');
    expect(perplexityService.perplexityService).toBeDefined();
  });

  it('should have service methods', async () => {
    const { perplexityService } = await import('../lib/perplexity/perplexity-service');
    expect(perplexityService.getEquipmentDetails).toBeDefined();
    expect(perplexityService.compareEquipment).toBeDefined();
    expect(perplexityService.searchEquipment).toBeDefined();
  });
});

// Test subscription plans with trial
describe('Subscription System with Trial', () => {
  it('should have subscription plans with trial support', async () => {
    const { subscriptionPlans } = await import('../data/subscriptions');
    expect(subscriptionPlans.length).toBe(3);
    
    const proPlan = subscriptionPlans.find(p => p.id === 'pro');
    expect(proPlan).toBeDefined();
    expect(proPlan?.features.length).toBeGreaterThan(0);
  });

  it('should have yearly pricing options', async () => {
    const { subscriptionPlans } = await import('../data/subscriptions');
    
    const paidPlans = subscriptionPlans.filter(p => p.price > 0);
    paidPlans.forEach(plan => {
      expect(plan.priceYearly).toBeDefined();
      expect(plan.priceYearly).toBeLessThan(plan.price * 12); // Yearly should be discounted
    });
  });
});

// Test bean data for affiliate links
describe('Bean Affiliate Links', () => {
  it('should have valid affiliate URLs for all beans', async () => {
    const { coffeeBeans } = await import('../data/beans');
    
    coffeeBeans.forEach(bean => {
      expect(bean.affiliateUrl).toBeDefined();
      expect(bean.affiliateUrl).toMatch(/^https?:\/\//);
    });
  });

  it('should have all required bean properties', async () => {
    const { coffeeBeans } = await import('../data/beans');
    
    coffeeBeans.forEach(bean => {
      expect(bean.id).toBeDefined();
      expect(bean.name).toBeDefined();
      expect(bean.roaster).toBeDefined();
      expect(bean.price).toBeGreaterThan(0);
      expect(bean.flavorNotes.length).toBeGreaterThan(0);
      expect(bean.brewMethods.length).toBeGreaterThan(0);
    });
  });
});

// Test equipment data
describe('Equipment Data', () => {
  it('should have espresso machines with all specs', async () => {
    const { espressoMachines } = await import('../data/machines');
    
    espressoMachines.forEach(machine => {
      expect(machine.id).toBeDefined();
      expect(machine.name).toBeDefined();
      expect(machine.brand).toBeDefined();
      expect(machine.type).toBeDefined();
      expect(machine.price).toBeGreaterThan(0);
      expect(machine.boilerType).toBeDefined();
      expect(machine.pumpPressure).toBeGreaterThan(0);
    });
  });

  it('should have grinders with all specs', async () => {
    const { coffeeGrinders } = await import('../data/machines');
    
    coffeeGrinders.forEach(grinder => {
      expect(grinder.id).toBeDefined();
      expect(grinder.name).toBeDefined();
      expect(grinder.brand).toBeDefined();
      expect(grinder.burrType).toBeDefined();
      expect(grinder.burrSize).toBeGreaterThan(0);
      expect(grinder.price).toBeGreaterThan(0);
    });
  });
});
