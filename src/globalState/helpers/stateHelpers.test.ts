import { describe, it, expect } from 'vitest';
import {
	hasUserAuthority,
	AUTHORITIES,
	isAnonymousSession,
	getContact,
	getSessionsDataKeyForSessionType
} from './stateHelpers';
import {
	REGISTRATION_TYPE_ANONYMOUS,
	SESSION_DATA_KEY_ENQUIRIES,
	SESSION_DATA_KEY_MY_SESSIONS,
	SESSION_DATA_KEY_TEAM_SESSIONS
} from '../interfaces/SessionsDataInterface';
import { SESSION_LIST_TYPES } from '../../components/session/sessionHelpers';

describe('stateHelpers', () => {
	describe('hasUserAuthority', () => {
		it('should return true when user has the authority', () => {
			const userData = {
				grantedAuthorities: [
					AUTHORITIES.CONSULTANT_DEFAULT,
					AUTHORITIES.CREATE_NEW_CHAT
				]
			} as any;
			expect(
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
			).toBe(true);
		});

		it('should return false when user does not have the authority', () => {
			const userData = {
				grantedAuthorities: [AUTHORITIES.ASKER_DEFAULT]
			} as any;
			expect(
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
			).toBe(false);
		});

		it('should return false when grantedAuthorities is undefined', () => {
			const userData = {} as any;
			expect(
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
			).toBeFalsy();
		});

		it('should return false when userData is null', () => {
			expect(
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, null)
			).toBeFalsy();
		});
	});

	describe('AUTHORITIES', () => {
		it('should define expected authority constants', () => {
			expect(AUTHORITIES.ANONYMOUS_DEFAULT).toBe(
				'AUTHORIZATION_ANONYMOUS_DEFAULT'
			);
			expect(AUTHORITIES.CONSULTANT_DEFAULT).toBe(
				'AUTHORIZATION_CONSULTANT_DEFAULT'
			);
			expect(AUTHORITIES.ASKER_DEFAULT).toBe(
				'AUTHORIZATION_USER_DEFAULT'
			);
			expect(AUTHORITIES.CREATE_NEW_CHAT).toBe(
				'AUTHORIZATION_CREATE_NEW_CHAT'
			);
		});
	});

	describe('isAnonymousSession', () => {
		it('should return true for anonymous registration type', () => {
			const session = {
				registrationType: REGISTRATION_TYPE_ANONYMOUS
			} as any;
			expect(isAnonymousSession(session)).toBe(true);
		});

		it('should return false for non-anonymous session', () => {
			const session = { registrationType: 'REGISTERED' } as any;
			expect(isAnonymousSession(session)).toBe(false);
		});

		it('should return false for undefined session', () => {
			expect(isAnonymousSession(undefined)).toBe(false);
		});
	});

	describe('getContact', () => {
		it('should return user if present', () => {
			const user = { id: '1', username: 'user1' };
			const session = { user } as any;
			expect(getContact(session)).toBe(user);
		});

		it('should return consultant if no user', () => {
			const consultant = { id: '2', username: 'consultant1' };
			const session = { consultant } as any;
			expect(getContact(session)).toBe(consultant);
		});

		it('should prefer user over consultant', () => {
			const user = { id: '1', username: 'user1' };
			const consultant = { id: '2', username: 'consultant1' };
			const session = { user, consultant } as any;
			expect(getContact(session)).toBe(user);
		});

		it('should return null if neither user nor consultant exists', () => {
			expect(getContact({} as any)).toBeNull();
		});

		it('should return null for undefined session', () => {
			expect(getContact(undefined)).toBeNull();
		});
	});

	describe('getSessionsDataKeyForSessionType', () => {
		it('should return enquiries key for ENQUIRY type', () => {
			expect(
				getSessionsDataKeyForSessionType(SESSION_LIST_TYPES.ENQUIRY)
			).toBe(SESSION_DATA_KEY_ENQUIRIES);
		});

		it('should return my sessions key for MY_SESSION type', () => {
			expect(
				getSessionsDataKeyForSessionType(SESSION_LIST_TYPES.MY_SESSION)
			).toBe(SESSION_DATA_KEY_MY_SESSIONS);
		});

		it('should return team sessions key for TEAMSESSION type', () => {
			expect(
				getSessionsDataKeyForSessionType(SESSION_LIST_TYPES.TEAMSESSION)
			).toBe(SESSION_DATA_KEY_TEAM_SESSIONS);
		});

		it('should default to my sessions key for unknown type', () => {
			expect(getSessionsDataKeyForSessionType('UNKNOWN')).toBe(
				SESSION_DATA_KEY_MY_SESSIONS
			);
		});
	});
});
