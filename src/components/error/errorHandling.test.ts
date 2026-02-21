import { describe, it, expect } from 'vitest';
import { ERROR_TYPES, getErrorCaseForStatus } from './errorHandling';

describe('errorHandling', () => {
	describe('ERROR_TYPES', () => {
		it('should define correct error type codes', () => {
			expect(ERROR_TYPES.UNAUTHORIZED).toBe(401);
			expect(ERROR_TYPES.NOT_FOUND).toBe(404);
			expect(ERROR_TYPES.SERVER).toBe(500);
		});
	});

	describe('getErrorCaseForStatus', () => {
		it('should return UNAUTHORIZED for 401', () => {
			expect(getErrorCaseForStatus(401)).toBe(ERROR_TYPES.UNAUTHORIZED);
		});

		it('should return UNAUTHORIZED for 403', () => {
			expect(getErrorCaseForStatus(403)).toBe(ERROR_TYPES.UNAUTHORIZED);
		});

		it('should return SERVER for 400', () => {
			expect(getErrorCaseForStatus(400)).toBe(ERROR_TYPES.SERVER);
		});

		it('should return SERVER for 409', () => {
			expect(getErrorCaseForStatus(409)).toBe(ERROR_TYPES.SERVER);
		});

		it('should return SERVER for 500', () => {
			expect(getErrorCaseForStatus(500)).toBe(ERROR_TYPES.SERVER);
		});

		it('should return NOT_FOUND for 404', () => {
			expect(getErrorCaseForStatus(404)).toBe(ERROR_TYPES.NOT_FOUND);
		});

		it('should return NOT_FOUND for unknown status codes', () => {
			expect(getErrorCaseForStatus(503)).toBe(ERROR_TYPES.NOT_FOUND);
			expect(getErrorCaseForStatus(418)).toBe(ERROR_TYPES.NOT_FOUND);
		});
	});
});
