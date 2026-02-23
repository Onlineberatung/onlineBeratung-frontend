import { describe, it, expect } from 'vitest';
import { isNumber } from './isNumber';

describe('isNumber', () => {
	it('should return true for a string of digits', () => {
		expect(isNumber('123')).toBe(true);
	});

	it('should return true for single digit', () => {
		expect(isNumber('0')).toBe(true);
	});

	it('should return false for empty string', () => {
		expect(isNumber('')).toBe(false);
	});

	it('should return false for string with letters', () => {
		expect(isNumber('abc')).toBe(false);
		expect(isNumber('12a3')).toBe(false);
	});

	it('should return false for string with special characters', () => {
		expect(isNumber('12.3')).toBe(false);
		expect(isNumber('12-3')).toBe(false);
		expect(isNumber('-5')).toBe(false);
	});

	it('should return false for string with spaces', () => {
		expect(isNumber('1 2')).toBe(false);
		expect(isNumber(' 12')).toBe(false);
	});
});
