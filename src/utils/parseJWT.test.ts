import { describe, it, expect } from 'vitest';
import { parseJwt } from './parseJWT';

describe('parseJwt', () => {
	it('should parse a valid JWT and return the payload', () => {
		// Create a simple JWT with a known payload
		const payload = { sub: '1234567890', name: 'Test User', iat: 1516239022 };
		const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
		const body = btoa(JSON.stringify(payload));
		const token = `${header}.${body}.signature`;

		const result = parseJwt(token);
		expect(result.sub).toBe('1234567890');
		expect(result.name).toBe('Test User');
		expect(result.iat).toBe(1516239022);
	});

	it('should return an empty object for an invalid token', () => {
		const result = parseJwt('not-a-jwt');
		expect(result).toEqual({});
	});

	it('should return an empty object for an empty string', () => {
		const result = parseJwt('');
		expect(result).toEqual({});
	});

	it('should handle tokens with URL-safe base64 characters', () => {
		// JWT tokens may use - and _ instead of + and /
		const payload = { data: 'test+value/here' };
		const body = btoa(JSON.stringify(payload))
			.replace(/\+/g, '-')
			.replace(/\//g, '_');
		const token = `header.${body}.signature`;

		const result = parseJwt(token);
		expect(result.data).toBe('test+value/here');
	});

	it('should handle tokens with unicode content', () => {
		const payload = { name: 'Ünîcödé' };
		const jsonStr = JSON.stringify(payload);
		const body = btoa(
			encodeURIComponent(jsonStr).replace(
				/%([0-9A-F]{2})/g,
				(_, p1) => String.fromCharCode(parseInt(p1, 16))
			)
		);
		const token = `header.${body}.signature`;

		const result = parseJwt(token);
		expect(result.name).toBe('Ünîcödé');
	});
});
