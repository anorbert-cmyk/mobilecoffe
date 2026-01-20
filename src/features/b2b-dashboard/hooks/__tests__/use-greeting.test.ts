import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { useGreeting } from '../use-greeting';

describe('useGreeting', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns "Good morning" before 12:00', () => {
        const date = new Date(2024, 0, 1, 10, 0, 0);
        vi.setSystemTime(date);
        expect(useGreeting()).toBe('Good morning');
    });

    it('returns "Good afternoon" between 12:00 and 18:00', () => {
        const date = new Date(2024, 0, 1, 14, 0, 0);
        vi.setSystemTime(date);
        expect(useGreeting()).toBe('Good afternoon');
    });

    it('returns "Good evening" after 18:00', () => {
        const date = new Date(2024, 0, 1, 19, 0, 0);
        vi.setSystemTime(date);
        expect(useGreeting()).toBe('Good evening');
    });
});
