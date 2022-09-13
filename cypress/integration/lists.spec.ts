import { getConsultantEnquiries } from '../support/commands/consultantEnquiries';
import {
	getConsultantSessions,
	setConsultantSessions
} from '../support/commands/consultantSessions';
import { USER_CONSULTANT } from '../support/commands/login';
import {
	mockRooms,
	mockSubscriptions,
	roomsChangedMessageMock,
	subscriptionChangedMessageMock
} from '../support/commands/mockSocket';

import {
	closeWebSocketServer,
	mockWebSocket,
	startWebSocketServer
} from '../support/websocket';

describe('lists', () => {
	before(() => {
		startWebSocketServer();
	});

	after(() => {
		closeWebSocketServer();
	});

	beforeEach(() => {
		cy.mockApi();
		mockWebSocket();
	});

	describe('Consultant Simple', () => {
		beforeEach(() => {
			cy.fastLogin({
				username: USER_CONSULTANT
			});
		});

		it('should not see a dot on first enquiries, even if there are unread messages', () => {
			const consultantEnquiries = [...getConsultantEnquiries()];

			const mockedRooms = mockRooms({ rooms: consultantEnquiries });
			const mockedSubscriptions = mockSubscriptions({
				subscriptions: consultantEnquiries
			});

			cy.willReturn('consultantEnquiries', consultantEnquiries);
			cy.willReturn('sessionRooms', consultantEnquiries);

			cy.socketWillReturn('rooms/get', mockedRooms);
			cy.socketWillReturn('subscriptions/get', mockedSubscriptions);

			cy.wait('@consultantEnquiriesRegistered');

			cy.get(
				'.navigation__item:nth-child(1) .navigation__item__count'
			).should('not.exist');
		});

		it('should see a dot on own sessions, if there are unread messages', () => {
			const consultantSessions = [...getConsultantSessions()];
			const mockedRooms = mockRooms({ rooms: consultantSessions });
			const mockedSubscriptions = mockSubscriptions({
				subscriptions: consultantSessions
			});

			cy.willReturn('consultantSessions', consultantSessions);
			cy.willReturn('sessionRooms', consultantSessions);

			cy.socketWillReturn('rooms/get', mockedRooms);
			cy.socketWillReturn('subscriptions/get', mockedSubscriptions);
			cy.visit('sessions/consultant/sessionView');

			cy.get(
				'.navigation__item:nth-child(2) .navigation__item__count'
			).should('exist');
		});

		it('should not see a dot on own sessions, if there are no unread messages', () => {
			const consultantSessions = [...getConsultantSessions()];
			const mockedRooms = mockRooms({
				rooms: consultantSessions,
				hasUnreadMessages: false
			});
			const mockedSubscriptions = mockSubscriptions({
				subscriptions: consultantSessions,
				hasUnreadMessages: false
			});

			cy.willReturn('consultantSessions', consultantSessions);
			cy.willReturn('sessionRooms', consultantSessions);

			cy.socketWillReturn('rooms/get', mockedRooms);
			cy.socketWillReturn('subscriptions/get', mockedSubscriptions);
			cy.visit('sessions/consultant/sessionView');

			cy.get(
				'.navigation__item:nth-child(2) .navigation__item__count'
			).should('not.exist');
		});
	});

	describe('Consultant', () => {
		it('should update session and show dot, when a new message is coming in', () => {
			setConsultantSessions([]);
			// const consultantSessions = [generateConsultantSession()];
			cy.consultantSession({
				session: { messagesRead: true, groupId: 'AAA-BBB' }
			});
			cy.getConsultantSessions().then((consultantSessions) => {
				cy.willReturn('consultantSessions', consultantSessions);
				cy.willReturn('sessionRooms', consultantSessions);

				cy.socketData({
					subscriptions: mockSubscriptions({
						subscriptions: consultantSessions,
						hasUnreadMessages: false,
						fixedId: true
					}),
					rooms: mockRooms({
						rooms: consultantSessions,
						hasUnreadMessages: false,
						fixedId: true
					}),
					roomsChanged: roomsChangedMessageMock({
						rid: consultantSessions[0].session.groupId,
						unread: true,
						fixedId: true
					}),
					subscriptionChanged: subscriptionChangedMessageMock({
						rid: consultantSessions[0].session.groupId,
						unread: 2,
						fixedId: true
					})
				});

				cy.getSocketData().then((socketData) => {
					cy.socketWillReturn('rooms/get', socketData.rooms);
					cy.socketWillReturn(
						'subscriptions/get',
						socketData.subscriptions
					);

					cy.fastLogin({
						username: USER_CONSULTANT
					});
					cy.visit('sessions/consultant/sessionView');

					// check unread status
					// dot
					cy.get(
						'.navigation__item:nth-child(2) .navigation__item__count'
					).should('not.exist');
					// bold username
					cy.get(
						'.sessionsListItem__username.sessionsListItem__username--readLabel'
					).should('exist');
					// lastMessage
					cy.get('.sessionsListItem__subject').should(($element) => {
						expect($element).to.contain('lastMessage');
					});

					cy.consultantSession(
						{
							session: {
								messagesRead: false,
								lastMessage: 'new lastMessage'
							}
						},
						0
					)
						.getConsultantSessions()
						.then((consultantSessions) => {
							cy.socketData({
								subscriptions: mockSubscriptions({
									subscriptions: consultantSessions,
									hasUnreadMessages: true,
									fixedId: true
								}),
								rooms: mockRooms({
									rooms: consultantSessions,
									hasUnreadMessages: true,
									fixedId: true
								})
							});
							cy.getSocketData().then((socketData) => {
								cy.emitRCMessage(socketData.roomsChanged);
								cy.emitRCMessage(
									socketData.subscriptionChanged
								);

								// dot sollte jetzt sichtbar sein
								cy.get(
									'.navigation__item:nth-child(2) .navigation__item__count'
								).should('exist');
								// text solte bold sein
								cy.get(
									'.sessionsListItem__username.sessionsListItem__username--readLabel'
								).should('not.exist');
								// lastMessage sollte sich ändern...
								cy.get('.sessionsListItem__subject').should(
									($element) => {
										expect($element).to.contain(
											'new lastMessage'
										);
									}
								);
							});
						});
				});
			});
		});
	});
});

// TODO TESTS:
// auf session klicken -> alles auf gelesen setzen
// session assign -> remove from list
// enquiry assign -> move from enquiry list to session list
