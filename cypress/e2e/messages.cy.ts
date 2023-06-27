import { SUB_STREAM_ROOM_MESSAGES } from '../../src/components/app/RocketChat';
import {
	closeWebSocketServer,
	mockWebSocket,
	startWebSocketServer
} from '../support/websocket';

describe('Messages', () => {
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

	describe('Attachments', () => {
		it('should allow to send a message with attachment', () => {
			cy.fastLogin();

			cy.get('[data-cy=session-list-item]').click();
			cy.wait('@sessionRooms');
			cy.wait('@messages');

			cy.get('.textarea__attachmentInput').attachFile('empty.pdf');
			cy.get('.textarea__iconWrapper').click();

			cy.wait('@attachmentUpload');
		});

		describe('formal', () => {
			it('should show inline error when quota is reached', () => {
				cy.willReturn('attachmentUpload', {
					statusCode: 403,
					headers: {
						'X-Reason': 'QUOTA_REACHED'
					}
				});

				cy.fastLogin();

				cy.get('[data-cy=session-list-item]').click();
				cy.wait('@messages');

				cy.get('.textarea__attachmentInput').attachFile('empty.pdf');
				cy.get('.textarea__iconWrapper').click();

				cy.wait('@attachmentUpload');

				cy.contains('Sie haben das Limit zum Hochladen erreicht.');
			});
		});

		describe('informal', () => {
			it('should show inline error when quota is reached', () => {
				cy.willReturn('userData', {
					formalLanguage: false
				});

				cy.willReturn('attachmentUpload', {
					statusCode: 403,
					headers: {
						'X-Reason': 'QUOTA_REACHED'
					}
				});

				cy.fastLogin();

				cy.get('[data-cy=session-list-item]').click();
				cy.wait('@messages');

				cy.get('.textarea__attachmentInput').attachFile('empty.pdf');
				cy.get('.textarea__iconWrapper').click();

				cy.wait('@attachmentUpload');

				cy.contains('Du hast das Limit zum Hochladen erreicht.');
			});
		});
	});

	describe('Unread Animations', () => {
		describe('No unread messages exist', () => {
			describe('Initially loading the app', () => {
				it('should not animate the envelope and no dot visible', () => {
					cy.fastLogin();

					cy.get('.navigation__item__count--active').should(
						'not.exist'
					);
					cy.get('.navigation__item__count--initial').should(
						'not.exist'
					);
				});
			});

			describe('On "My Sessions" but no session open', () => {
				describe('New message from Live Service', () => {
					it.skip('should animate the envelope and initial dot', () => {
						cy.fastLogin();

						cy.get('.cy-socket-connected-stomp');
						cy.waitForSubscriptions(['/user/events']);
						cy.emitDirectMessage();

						cy.wait('@askerSessions');

						cy.get('.navigation__item__count--active').should(
							'exist'
						);

						cy.get('.navigation__item__count--initial').should(
							'exist'
						);
					});
				});
			});

			describe('Not on My Sessions', () => {
				describe('New message from Live Service', () => {
					it.skip('should animate the envelope and initial dot', () => {
						cy.fastLogin();
						cy.get('.cy-socket-connected-stomp');
						cy.waitForSubscriptions(['/user/events']);

						cy.get('a[href="/profile"]').click();

						cy.emitDirectMessage();

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--initial').should(
							'exist'
						);
					});
				});
			});

			describe('Session open', () => {
				describe('New message from Live Service in currently active Session', () => {
					// ToDo: Test currenlty skipped because its not working like the test tries
					it.skip('should animate envelope and initial dot and remove dot after message was read', () => {
						cy.fastLogin();
						cy.get('.cy-socket-connected-stomp');

						cy.get('.sessionsListItem').first().click({
							force: true
						});
						cy.wait('@consultingTypeServiceBaseFull');
						cy.wait('@messages');

						cy.get('.cy-socket-connected-rc');
						cy.waitForSubscriptions([
							'/user/events',
							SUB_STREAM_ROOM_MESSAGES
						]);

						//stream-room-messages
						cy.emitDirectMessage();

						cy.wait('@messages');
						cy.wait('@askerSessions');

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--initial').should(
							'exist'
						);

						cy.wait('@sessionRead');
						cy.wait('@askerSessions');

						// wait for the animation to finish and the dot to disappear
						// TODO: use cy.clock instead. currenlty stomp socket will not connect with clock
						cy.wait(1500); // eslint-disable-line cypress/no-unnecessary-waiting

						cy.get('.navigation__item__count--active').should(
							'not.exist'
						);
						cy.get('.navigation__item__count').should('not.exist');
					});
				});
				describe('New message from Live Service in different Session', () => {
					it.skip('should animate the envelope and initial dot', () => {
						cy.askerSession();
						cy.fastLogin();
						cy.get('.cy-socket-connected-stomp');

						cy.get('.navigation__item__count--active').should(
							'not.exist'
						);

						cy.get('.navigation__item__count--initial').should(
							'not.exist'
						);

						cy.get('.sessionsListItem').first().click({
							force: true
						});
						cy.wait('@consultingTypeServiceBaseFull');
						cy.wait('@messages');

						cy.get('.messageItem__message').should('be.visible');

						cy.emitDirectMessage(1);

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--initial').should(
							'exist'
						);
					});
				});
			});
		});

		describe('Unread messages already exist', () => {
			describe('Initially loading the app', () => {
				it.skip('should animate the envelope and initial dot', () => {
					cy.askerSession({ session: { messagesRead: false } }, 0);

					cy.fastLogin();

					cy.get('.navigation__item__count--active').should('exist');
					cy.get('.navigation__item__count--initial').should('exist');
				});
			});

			describe('On "My Sessions" but no session open', () => {
				describe('New message from Live Service', () => {
					it.skip('should animate the envelope and reanimate the dot', () => {
						cy.askerSession(
							{ session: { messagesRead: false } },
							0
						);

						cy.fastLogin();
						cy.get('.cy-socket-connected-stomp');
						cy.waitForSubscriptions(['/user/events']);

						cy.wait(1500); // eslint-disable-line cypress/no-unnecessary-waiting

						cy.emitDirectMessage();

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--reanimate').should(
							'exist'
						);
					});
				});
			});

			describe('Not on My Sessions', () => {
				describe('New message from Live Service', () => {
					it.skip('should animate the envelope and reanimate dot', () => {
						cy.askerSession(
							{ session: { messagesRead: false } },
							0
						);

						cy.fastLogin();
						cy.get('.cy-socket-connected-stomp');
						cy.waitForSubscriptions(['/user/events']);

						cy.get('a[href="/profile"]').click();

						cy.emitDirectMessage();

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--reanimate').should(
							'exist'
						);
					});
				});
			});

			describe('Session open', () => {
				describe('New message from Live Service in currently active Session', () => {
					it.skip('should animate envelope and reanimate dot', () => {
						cy.askerSession({ session: { messagesRead: false } });

						cy.fastLogin();
						cy.get('.cy-socket-connected-stomp');
						cy.waitForSubscriptions(['/user/events']);

						cy.get('.navigation__item__count--active').should(
							'exist'
						);

						cy.get('.navigation__item__count--initial').should(
							'exist'
						);
						// wait for animation to fully finish
						cy.wait(1500); // eslint-disable-line cypress/no-unnecessary-waiting

						cy.get('.sessionsListItem').first().click({
							force: true
						});
						cy.wait('@consultingTypeServiceBaseFull');
						cy.wait('@messages');

						cy.get('.messageItem__message').should('be.visible');

						cy.emitDirectMessage();

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--reanimate').should(
							'exist'
						);
					});
				});

				describe('New message from Live Service in different Session', () => {
					it.skip('should animate the envelope and reanimate the dot', () => {
						cy.askerSession({ session: { messagesRead: false } });

						cy.fastLogin();
						cy.get('.cy-socket-connected-stomp');
						cy.waitForSubscriptions(['/user/events']);

						cy.get('.navigation__item__count--active').should(
							'exist'
						);

						cy.get('.navigation__item__count--initial').should(
							'exist'
						);
						// wait for animation to fully finish
						cy.wait(1500); // eslint-disable-line cypress/no-unnecessary-waiting

						cy.get('.sessionsListItem').first().click({
							force: true
						});
						cy.get('.messageItem__message').should('be.visible');

						cy.emitDirectMessage(1);

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--reanimate').should(
							'exist'
						);
					});
				});
			});
		});
	});
});
