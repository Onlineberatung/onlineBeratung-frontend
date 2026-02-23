import { describe, it, expect } from 'vitest';
import { capitalizeFirstLetter } from './capitalizeFirstLetter';

describe('capitalizeFirstLetter', () => {
	it('should capitalize the first letter of a lowercase string', () => {
		expect(capitalizeFirstLetter('hello')).toBe('Hello');
	});

	it('should keep already capitalized strings unchanged', () => {
		expect(capitalizeFirstLetter('Hello')).toBe('Hello');
	});

	it('should handle single character strings', () => {
		expect(capitalizeFirstLetter('a')).toBe('A');
	});

	it('should handle strings starting with a number', () => {
		expect(capitalizeFirstLetter('1abc')).toBe('1abc');
	});

	it('should not modify the rest of the string', () => {
		expect(capitalizeFirstLetter('hELLO WORLD')).toBe('HELLO WORLD');
	});
});
