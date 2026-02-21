import { describe, it, expect } from 'vitest';
import { handleNumericTranslation } from './translate';

describe('handleNumericTranslation', () => {
	it('should create a translation key from topic, value, and number', () => {
		const result = handleNumericTranslation('topic', 'value', 1);
		expect(result).toBe('topic.value.1');
	});

	it('should handle zero', () => {
		const result = handleNumericTranslation('app', 'count', 0);
		expect(result).toBe('app.count.0');
	});

	it('should handle complex topic and value strings', () => {
		const result = handleNumericTranslation('my.topic', 'sub.value', 42);
		expect(result).toBe('my.topic.sub.value.42');
	});
});
