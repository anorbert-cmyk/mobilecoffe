import { describe, it, expect } from 'vitest';

const formatShortRatio = (ratio: string) => {
  return ratio.replace(/\s*\(.*\)/g, '');
};

const formatShortExtractionTime = (time: string) => {
  return time.replace(/\s*seconds?/i, 's');
};

describe('Coffee String Formatting Helpers', () => {
  describe('formatShortRatio', () => {
    it('should strip parentheses and parenthetical detail', () => {
      expect(formatShortRatio('1:1:1 (espresso:milk:foam)')).toBe('1:1:1');
      expect(formatShortRatio('1:4 (espresso to milk)')).toBe('1:4');
      expect(formatShortRatio('1:2')).toBe('1:2');
      expect(formatShortRatio('1:3 to 1:4')).toBe('1:3 to 1:4');
    });
  });

  describe('formatShortExtractionTime', () => {
    it('should replace "seconds" or "second" with "s"', () => {
      expect(formatShortExtractionTime('25-30 seconds')).toBe('25-30s');
      expect(formatShortExtractionTime('15-20 second')).toBe('15-20s');
      expect(formatShortExtractionTime('30 sec')).toBe('30 sec');
    });
  });
});
