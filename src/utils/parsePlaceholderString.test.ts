import { describe, it, expect } from 'vitest';
import { parsePlaceholderString } from './parsePlaceholderString';

describe('parsePlaceholderString', () => {
	it('should replace a single placeholder', () => {
		const result = parsePlaceholderString('Hello {name}!', {
			name: 'World'
		});
		expect(result).toBe('Hello World!');
	});

	it('should replace multiple placeholders', () => {
		const result = parsePlaceholderString('{greeting} {name}!', {
			greeting: 'Hello',
			name: 'World'
		});
		expect(result).toBe('Hello World!');
	});

	it('should replace all occurrences of the same placeholder', () => {
		const result = parsePlaceholderString('{name} and {name}', {
			name: 'Test'
		});
		expect(result).toBe('Test and Test');
	});

	it('should leave unmatched placeholders unchanged', () => {
		const result = parsePlaceholderString('{name} {missing}', {
			name: 'Test'
		});
		expect(result).toBe('Test {missing}');
	});

	it('should handle empty placeholders object', () => {
		const result = parsePlaceholderString('Hello {name}', {});
		expect(result).toBe('Hello {name}');
	});

	it('should handle string with no placeholders', () => {
		const result = parsePlaceholderString('Hello World', {
			name: 'Test'
		});
		expect(result).toBe('Hello World');
	});
});
