import { describe, it, expect } from 'vitest';
import {
	strengthColor,
	strengthIndicator,
	validatePasswordCriteria,
	inputValuesFit
} from './validateInputValue';

describe('validateInputValue', () => {
	describe('strengthColor', () => {
		it('should return red for strength less than 4', () => {
			expect(strengthColor(0)).toBe('red');
			expect(strengthColor(1)).toBe('red');
			expect(strengthColor(2)).toBe('red');
			expect(strengthColor(3)).toBe('red');
		});

		it('should return green for strength 4 or greater', () => {
			expect(strengthColor(4)).toBe('green');
			expect(strengthColor(5)).toBe('green');
		});
	});

	describe('strengthIndicator', () => {
		it('should return 0 for an empty string', () => {
			expect(strengthIndicator('')).toBe(0);
		});

		it('should return 0 for a short lowercase-only string', () => {
			expect(strengthIndicator('abcde')).toBe(0);
		});

		it('should increment for length > 8', () => {
			expect(strengthIndicator('abcdefghi')).toBe(1);
		});

		it('should increment for having numbers', () => {
			expect(strengthIndicator('abc123')).toBe(1);
		});

		it('should increment for mixed case letters', () => {
			expect(strengthIndicator('abcDEF')).toBe(1);
		});

		it('should increment for special characters', () => {
			expect(strengthIndicator('abc!')).toBe(1);
		});

		it('should return 4 for a strong password', () => {
			// > 8 chars, has number, mixed case, special char
			expect(strengthIndicator('Abcdef1!aa')).toBe(4);
		});
	});

	describe('validatePasswordCriteria', () => {
		it('should return all false for an empty string', () => {
			const result = validatePasswordCriteria('');
			expect(result.hasUpperLowerCase).toBe(false);
			expect(result.hasNumber).toBe(false);
			expect(result.hasSpecialChar).toBe(false);
			expect(result.hasMinLength).toBe(false);
		});

		it('should detect mixed case', () => {
			const result = validatePasswordCriteria('aB');
			expect(result.hasUpperLowerCase).toBe(true);
		});

		it('should detect numbers', () => {
			const result = validatePasswordCriteria('abc123');
			expect(result.hasNumber).toBe(true);
		});

		it('should detect special characters', () => {
			const result = validatePasswordCriteria('abc!');
			expect(result.hasSpecialChar).toBe(true);
		});

		it('should detect minimum length (> 8)', () => {
			const result = validatePasswordCriteria('123456789');
			expect(result.hasMinLength).toBe(true);
		});

		it('should not flag min length for exactly 8 chars', () => {
			const result = validatePasswordCriteria('12345678');
			expect(result.hasMinLength).toBe(false);
		});

		it('should return all true for a strong password', () => {
			const result = validatePasswordCriteria('Abcdef1!aa');
			expect(result.hasUpperLowerCase).toBe(true);
			expect(result.hasNumber).toBe(true);
			expect(result.hasSpecialChar).toBe(true);
			expect(result.hasMinLength).toBe(true);
		});

		it('should handle German umlauts as mixed case', () => {
			const result = validatePasswordCriteria('äÖ');
			expect(result.hasUpperLowerCase).toBe(true);
		});
	});

	describe('inputValuesFit', () => {
		it('should return true when both values are equal', () => {
			expect(inputValuesFit('test', 'test')).toBe(true);
		});

		it('should return false when values differ', () => {
			expect(inputValuesFit('test', 'Test')).toBe(false);
		});

		it('should return true for empty strings', () => {
			expect(inputValuesFit('', '')).toBe(true);
		});
	});
});
