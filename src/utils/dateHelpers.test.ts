import { describe, it, expect } from 'vitest';
import {
	MILLISECONDS_PER_SECOND,
	MILLISECONDS_PER_MINUTE,
	MILLISECONDS_PER_HOUR,
	formatToDDMMYYYY,
	formatToHHMM,
	prettyPrintTimeDifference,
	convertISO8601ToMSSinceEpoch,
	dateToLocalISO,
	addMissingZero,
	getDurationTimeBySeconds,
	getPrettyDateFromMessageDate
} from './dateHelpers';

describe('dateHelpers', () => {
	describe('constants', () => {
		it('should define correct millisecond constants', () => {
			expect(MILLISECONDS_PER_SECOND).toBe(1000);
			expect(MILLISECONDS_PER_MINUTE).toBe(60000);
			expect(MILLISECONDS_PER_HOUR).toBe(3600000);
		});
	});

	describe('formatToDDMMYYYY', () => {
		it('should format a unix timestamp to German date format', () => {
			// Jan 15, 2023
			const timestamp = new Date(2023, 0, 15).getTime();
			const result = formatToDDMMYYYY(timestamp);
			expect(result).toBe('15.1.2023');
		});

		it('should format with two digits when twoDigits is true', () => {
			const timestamp = new Date(2023, 0, 5).getTime();
			const result = formatToDDMMYYYY(timestamp, true);
			expect(result).toBe('05.01.2023');
		});

		it('should format without leading zeros by default', () => {
			const timestamp = new Date(2023, 2, 3).getTime();
			const result = formatToDDMMYYYY(timestamp);
			expect(result).toBe('3.3.2023');
		});
	});

	describe('formatToHHMM', () => {
		it('should format a timestamp string to HH:MM', () => {
			// Create a date at 14:30
			const date = new Date(2023, 0, 15, 14, 30);
			const result = formatToHHMM(date.getTime().toString());
			expect(result).toBe('14:30');
		});

		it('should pad minutes with leading zero', () => {
			const date = new Date(2023, 0, 15, 9, 5);
			const result = formatToHHMM(date.getTime().toString());
			expect(result).toBe('9:05');
		});
	});

	describe('prettyPrintTimeDifference', () => {
		it('should return "jetzt" for zero difference', () => {
			const now = Date.now();
			expect(prettyPrintTimeDifference(now, now)).toBe('jetzt');
		});

		it('should format minutes only when less than an hour', () => {
			const t1 = 0;
			const t2 = 30 * MILLISECONDS_PER_MINUTE;
			expect(prettyPrintTimeDifference(t1, t2)).toBe('vor 30 min');
		});

		it('should format hours and minutes', () => {
			const t1 = 0;
			const t2 = 2 * MILLISECONDS_PER_HOUR + 15 * MILLISECONDS_PER_MINUTE;
			expect(prettyPrintTimeDifference(t1, t2)).toBe('vor 2 h 15 min');
		});

		it('should use "in" prefix when includeIn is true and t2 > t1', () => {
			const t1 = 0;
			const t2 = 30 * MILLISECONDS_PER_MINUTE;
			expect(prettyPrintTimeDifference(t1, t2, true)).toBe('in 30 min');
		});
	});

	describe('convertISO8601ToMSSinceEpoch', () => {
		it('should convert an ISO 8601 date string to ms since epoch', () => {
			const iso = '2023-01-15T00:00:00.000Z';
			const result = convertISO8601ToMSSinceEpoch(iso);
			expect(result).toBe(new Date(iso).getTime());
		});
	});

	describe('dateToLocalISO', () => {
		it('should format a Date to a local ISO-like string', () => {
			const date = new Date(2023, 0, 15, 14, 30);
			const result = dateToLocalISO(date);
			expect(result).toBe('2023-01-15 14:30');
		});

		it('should pad single-digit months and days', () => {
			const date = new Date(2023, 2, 5, 9, 7);
			const result = dateToLocalISO(date);
			expect(result).toBe('2023-03-05 09:07');
		});
	});

	describe('addMissingZero', () => {
		it('should add leading zero for single digit values', () => {
			expect(addMissingZero(5)).toBe('05');
			expect(addMissingZero(0)).toBe('00');
			expect(addMissingZero(9)).toBe('09');
		});

		it('should not add leading zero for two digit values', () => {
			expect(addMissingZero(10)).toBe(10);
			expect(addMissingZero(99)).toBe(99);
			expect(addMissingZero(15)).toBe(15);
		});
	});

	describe('getDurationTimeBySeconds', () => {
		it('should format seconds only', () => {
			expect(getDurationTimeBySeconds(45)).toBe('45s');
		});

		it('should format minutes and seconds', () => {
			expect(getDurationTimeBySeconds(125)).toBe('2m 5s');
		});

		it('should format hours, minutes and seconds', () => {
			expect(getDurationTimeBySeconds(3665)).toBe('1h 1m 5s');
		});

		it('should handle exact minutes', () => {
			expect(getDurationTimeBySeconds(120)).toBe('2m ');
		});

		it('should return empty string for zero', () => {
			expect(getDurationTimeBySeconds(0)).toBe('');
		});
	});

	describe('getPrettyDateFromMessageDate', () => {
		it('should return today translation key for today', () => {
			const nowInSeconds = Math.floor(Date.now() / 1000);
			const result = getPrettyDateFromMessageDate(nowInSeconds);
			expect(result.str).toBe('message.today');
			expect(result.date).toBeNull();
		});

		it('should return yesterday translation key for yesterday', () => {
			const yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			yesterday.setHours(12, 0, 0, 0);
			const yesterdayInSeconds = Math.floor(yesterday.getTime() / 1000);
			const result = getPrettyDateFromMessageDate(yesterdayInSeconds);
			expect(result.str).toBe('message.yesterday');
			expect(result.date).toBeNull();
		});

		it('should return a date string for older dates', () => {
			// A date far in the past
			const oldDate = new Date(2020, 5, 15, 12, 0, 0);
			const oldDateInSeconds = Math.floor(oldDate.getTime() / 1000);
			const result = getPrettyDateFromMessageDate(oldDateInSeconds);
			expect(result.str).toBeNull();
			expect(result.date).toBeTruthy();
		});
	});
});
