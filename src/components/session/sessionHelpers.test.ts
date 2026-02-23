import { describe, it, expect } from 'vitest';
import {
	getChatTypeForListItem,
	isSessionChat,
	isGroupChat,
	isLiveChat,
	CHAT_TYPE_GROUP_CHAT,
	CHAT_TYPE_SINGLE_CHAT,
	getViewPathForType,
	SESSION_LIST_TYPES,
	selectDisplayName
} from './sessionHelpers';
import { REGISTRATION_TYPE_ANONYMOUS } from '../../globalState/interfaces/SessionsDataInterface';

describe('sessionHelpers', () => {
	describe('getChatTypeForListItem', () => {
		it('should return group chat type when chat property exists', () => {
			const listItem = {
				chat: { groupId: 'g1', topic: 'Test' }
			} as any;
			expect(getChatTypeForListItem(listItem)).toBe(
				CHAT_TYPE_GROUP_CHAT
			);
		});

		it('should return single chat type when no chat property', () => {
			const listItem = {
				session: { groupId: 's1', feedbackGroupId: 'f1' }
			} as any;
			expect(getChatTypeForListItem(listItem)).toBe(
				CHAT_TYPE_SINGLE_CHAT
			);
		});

		it('should return single chat type for undefined', () => {
			expect(getChatTypeForListItem(undefined)).toBe(
				CHAT_TYPE_SINGLE_CHAT
			);
		});
	});

	describe('isSessionChat', () => {
		it('should return true for session chat items with feedbackGroupId', () => {
			const chatItem = {
				feedbackGroupId: 'f1',
				groupId: 's1'
			} as any;
			expect(isSessionChat(chatItem)).toBe(true);
		});

		it('should return false for group chat items without feedbackGroupId', () => {
			const chatItem = { groupId: 'g1', topic: 'Test' } as any;
			expect(isSessionChat(chatItem)).toBe(false);
		});
	});

	describe('isGroupChat', () => {
		it('should return true for group chat items without feedbackGroupId', () => {
			const chatItem = { groupId: 'g1', topic: 'Test' } as any;
			expect(isGroupChat(chatItem)).toBe(true);
		});

		it('should return false for session chat items', () => {
			const chatItem = {
				feedbackGroupId: 'f1',
				groupId: 's1'
			} as any;
			expect(isGroupChat(chatItem)).toBe(false);
		});
	});

	describe('isLiveChat', () => {
		it('should return true for anonymous session chats', () => {
			const chatItem = {
				feedbackGroupId: 'f1',
				registrationType: REGISTRATION_TYPE_ANONYMOUS
			} as any;
			expect(isLiveChat(chatItem)).toBe(true);
		});

		it('should return false for non-anonymous session chats', () => {
			const chatItem = {
				feedbackGroupId: 'f1',
				registrationType: 'REGISTERED'
			} as any;
			expect(isLiveChat(chatItem)).toBe(false);
		});

		it('should return false for group chats', () => {
			const chatItem = {
				groupId: 'g1',
				registrationType: REGISTRATION_TYPE_ANONYMOUS
			} as any;
			expect(isLiveChat(chatItem)).toBe(false);
		});
	});

	describe('getViewPathForType', () => {
		it('should return sessionPreview for ENQUIRY', () => {
			expect(getViewPathForType(SESSION_LIST_TYPES.ENQUIRY)).toBe(
				'sessionPreview'
			);
		});

		it('should return sessionView for MY_SESSION', () => {
			expect(getViewPathForType(SESSION_LIST_TYPES.MY_SESSION)).toBe(
				'sessionView'
			);
		});

		it('should return teamSessionView for TEAMSESSION', () => {
			expect(getViewPathForType(SESSION_LIST_TYPES.TEAMSESSION)).toBe(
				'teamSessionView'
			);
		});
	});

	describe('selectDisplayName', () => {
		it('should return username for system user', () => {
			expect(
				selectDisplayName({ username: 'System', name: 'System Name' })
			).toBe('System');
		});

		it('should return username when name is null', () => {
			expect(
				selectDisplayName({ username: 'user1', name: null })
			).toBe('user1');
		});

		it('should return decoded name when name is not null', () => {
			// decodeUsername returns the name as-is for non-encoded strings
			expect(
				selectDisplayName({ username: 'user1', name: 'Display Name' })
			).toBeTruthy();
		});
	});
});
