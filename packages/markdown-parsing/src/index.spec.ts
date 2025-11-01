import { describe, expect, it } from '@jest/globals';
import { add } from './index';

describe('index.ts re-export', () => {
    it('should re-export add function correctly', () => {
        expect(typeof add).toBe('function');
        expect(add(2, 3)).toBe(5);
    });
});
