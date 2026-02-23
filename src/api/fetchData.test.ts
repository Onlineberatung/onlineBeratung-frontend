import { describe, it, expect } from 'vitest';
import {
	FETCH_METHODS,
	FETCH_ERRORS,
	FETCH_SUCCESS,
	X_REASON,
	FetchErrorWithOptions
} from './fetchData';

describe('fetchData constants and types', () => {
	describe('FETCH_METHODS', () => {
		it('should define all HTTP methods', () => {
			expect(FETCH_METHODS.GET).toBe('GET');
			expect(FETCH_METHODS.POST).toBe('POST');
			expect(FETCH_METHODS.PUT).toBe('PUT');
			expect(FETCH_METHODS.DELETE).toBe('DELETE');
			expect(FETCH_METHODS.PATCH).toBe('PATCH');
		});
	});

	describe('FETCH_ERRORS', () => {
		it('should define all error types', () => {
			expect(FETCH_ERRORS.ABORT).toBe('ABORT');
			expect(FETCH_ERRORS.BAD_REQUEST).toBe('BAD_REQUEST');
			expect(FETCH_ERRORS.CONFLICT).toBe('CONFLICT');
			expect(FETCH_ERRORS.EMPTY).toBe('EMPTY');
			expect(FETCH_ERRORS.FORBIDDEN).toBe('FORBIDDEN');
			expect(FETCH_ERRORS.NO_MATCH).toBe('NO_MATCH');
			expect(FETCH_ERRORS.TIMEOUT).toBe('TIMEOUT');
			expect(FETCH_ERRORS.UNAUTHORIZED).toBe('UNAUTHORIZED');
			expect(FETCH_ERRORS.GATEWAY_TIMEOUT).toBe('GATEWAY_TIMEOUT');
			expect(FETCH_ERRORS.CATCH_ALL).toBe('CATCH_ALL');
			expect(FETCH_ERRORS.CATCH_ALL_WITH_RESPONSE).toBe(
				'CATCH_ALL_WITH_RESPONSE'
			);
		});
	});

	describe('FETCH_SUCCESS', () => {
		it('should define success types', () => {
			expect(FETCH_SUCCESS.CONTENT).toBe('CONTENT');
		});
	});

	describe('X_REASON', () => {
		it('should define X-Reason types', () => {
			expect(X_REASON.EMAIL_NOT_AVAILABLE).toBe('EMAIL_NOT_AVAILABLE');
			expect(X_REASON.USERNAME_NOT_AVAILABLE).toBe(
				'USERNAME_NOT_AVAILABLE'
			);
		});
	});

	describe('FetchErrorWithOptions', () => {
		it('should create an error with message and options', () => {
			const error = new FetchErrorWithOptions('test error', {
				status: 400
			});
			expect(error.message).toBe('test error');
			expect(error.options).toEqual({ status: 400 });
		});

		it('should be an instance of Error', () => {
			const error = new FetchErrorWithOptions('test', {});
			expect(error).toBeInstanceOf(Error);
		});

		it('should be an instance of FetchErrorWithOptions', () => {
			const error = new FetchErrorWithOptions('test', {});
			expect(error).toBeInstanceOf(FetchErrorWithOptions);
		});
	});
});
