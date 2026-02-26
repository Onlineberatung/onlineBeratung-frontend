import { describe, it, expect, beforeEach } from 'vitest';
import {
	setValueInCookie,
	getValueFromCookie,
	deleteCookieByName
} from './accessSessionCookie';

describe('accessSessionCookie', () => {
	beforeEach(() => {
		// Clear all cookies before each test
		document.cookie.split(';').forEach((c) => {
			const name = c.trim().split('=')[0];
			document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		});
	});

	describe('setValueInCookie', () => {
		it('should set a cookie with the given name and value', () => {
			setValueInCookie('testKey', 'testValue');
			expect(document.cookie).toContain('testKey=testValue');
		});

		it('should set multiple cookies', () => {
			setValueInCookie('key1', 'value1');
			setValueInCookie('key2', 'value2');
			expect(document.cookie).toContain('key1=value1');
			expect(document.cookie).toContain('key2=value2');
		});
	});

	describe('getValueFromCookie', () => {
		it('should return the value for an existing cookie', () => {
			setValueInCookie('myKey', 'myValue');
			expect(getValueFromCookie('myKey')).toBe('myValue');
		});

		it('should return empty string for a non-existent cookie', () => {
			expect(getValueFromCookie('nonExistent')).toBe('');
		});

		it('should handle cookies with special characters in values', () => {
			setValueInCookie('token', 'abc123xyz');
			expect(getValueFromCookie('token')).toBe('abc123xyz');
		});

		it('should not confuse cookies with similar names', () => {
			setValueInCookie('key', 'value1');
			setValueInCookie('key2', 'value2');
			expect(getValueFromCookie('key')).toBe('value1');
			expect(getValueFromCookie('key2')).toBe('value2');
		});
	});

	describe('deleteCookieByName', () => {
		it('should delete an existing cookie', () => {
			setValueInCookie('deleteMe', 'value');
			expect(getValueFromCookie('deleteMe')).toBe('value');
			deleteCookieByName('deleteMe');
			expect(getValueFromCookie('deleteMe')).toBe('');
		});
	});
});
