import { describe, it, expect } from 'vitest';
import { demoCafes, getCafeById, calculateDistance, formatDistance, sortCafesByDistance } from '../data/cafes';
import { learningCategories, getCategoryById, getArticleById } from '../data/learning';

// Test cafe data structure
describe('Cafe Data', () => {
  it('should have valid cafe data', () => {
    expect(demoCafes).toBeDefined();
    expect(Array.isArray(demoCafes)).toBe(true);
    expect(demoCafes.length).toBeGreaterThan(0);
  });

  it('should have required fields for each cafe', () => {
    demoCafes.forEach((cafe) => {
      expect(cafe.id).toBeDefined();
      expect(cafe.name).toBeDefined();
      expect(typeof cafe.rating).toBe('number');
      expect(cafe.rating).toBeGreaterThanOrEqual(0);
      expect(cafe.rating).toBeLessThanOrEqual(5);
      expect(cafe.address).toBeDefined();
      expect(typeof cafe.latitude).toBe('number');
      expect(typeof cafe.longitude).toBe('number');
      expect(Array.isArray(cafe.features)).toBe(true);
    });
  });

  it('should find cafe by id', () => {
    const cafe = getCafeById('espresso-embassy');
    expect(cafe).toBeDefined();
    expect(cafe?.name).toBe('Espresso Embassy');
    
    const nonExistent = getCafeById('non-existent');
    expect(nonExistent).toBeUndefined();
  });

  it('should calculate distance correctly', () => {
    // Test distance calculation (Budapest center to nearby point)
    const distance = calculateDistance(47.4979, 19.0402, 47.5025, 19.0512);
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(10); // Should be less than 10km
  });

  it('should format distance correctly', () => {
    expect(formatDistance(0.5)).toBe('500 m');
    expect(formatDistance(1.5)).toBe('1.5 km');
    expect(formatDistance(0.1)).toBe('100 m');
    expect(formatDistance(2.0)).toBe('2.0 km');
  });

  it('should sort cafes by distance', () => {
    const userLat = 47.4979;
    const userLon = 19.0402;
    
    const sorted = sortCafesByDistance(demoCafes, userLat, userLon);
    
    expect(sorted.length).toBe(demoCafes.length);
    expect(sorted[0].distance).toBeDefined();
    
    // Verify sorting order
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].distance).toBeGreaterThanOrEqual(sorted[i - 1].distance);
    }
  });

  it('should have unique ids for all cafes', () => {
    const ids = demoCafes.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

// Test learning data structure
describe('Learning Data', () => {
  it('should have valid learning categories', () => {
    expect(learningCategories).toBeDefined();
    expect(Array.isArray(learningCategories)).toBe(true);
    expect(learningCategories.length).toBeGreaterThan(0);
  });

  it('should have required fields for each category', () => {
    learningCategories.forEach((category) => {
      expect(category.id).toBeDefined();
      expect(category.title).toBeDefined();
      expect(category.description).toBeDefined();
      expect(category.emoji).toBeDefined();
      expect(Array.isArray(category.articles)).toBe(true);
      expect(category.articles.length).toBeGreaterThan(0);
      
      // Check articles
      category.articles.forEach((article) => {
        expect(article.id).toBeDefined();
        expect(article.title).toBeDefined();
        expect(article.content).toBeDefined();
        expect(article.content.length).toBeGreaterThan(100);
      });
    });
  });

  it('should find category by id', () => {
    const category = getCategoryById('brewing-basics');
    expect(category).toBeDefined();
    expect(category?.title).toBe('Brewing Basics');
    
    const nonExistent = getCategoryById('non-existent');
    expect(nonExistent).toBeUndefined();
  });

  it('should find article by id', () => {
    const article = getArticleById('brewing-basics', 'what-is-specialty-coffee');
    expect(article).toBeDefined();
    expect(article?.title).toBe('What is Specialty Coffee?');
    
    const nonExistent = getArticleById('brewing-basics', 'non-existent');
    expect(nonExistent).toBeUndefined();
  });

  it('should have unique ids for all categories', () => {
    const ids = learningCategories.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have unique article ids within each category', () => {
    learningCategories.forEach((category) => {
      const articleIds = category.articles.map((a) => a.id);
      const uniqueArticleIds = new Set(articleIds);
      expect(uniqueArticleIds.size).toBe(articleIds.length);
    });
  });
});
