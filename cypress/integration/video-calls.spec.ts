import {
	closeWebSocketServer,
	mockWebSocket,
	startWebSocketServer
} from '../support/websocket';
import {
	generateMultipleAskerSessions,
	generateMultipleConsultantSessions
} from '../support/sessions';
import { USER_CONSULTANT } from '../support/commands/login';
import { config } from '../../src/resources/scripts/config';

describe('Video calls', () => {
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

	describe.skip('Asker', () => {
		it('should not show buttons to start a new video call in session header', () => {
			generateMultipleAskerSessions(2);
			cy.fastLogin();
			cy.wait('@consultingTypeServiceBaseBasic');

			cy.get('a[href="/sessions/user/view"]').click();
			cy.get('[data-cy=sessions-list-items-wrapper]').click();

			cy.get('[data-cy=session-header-video-call-buttons]').should(
				'not.exist'
			);
		});

		describe('Incoming video call notifications', () => {
			it('should show no notifications when no notifications exist', () => {
				cy.fastLogin();
				cy.wait('@consultingTypeServiceBaseBasic');

				cy.get('[data-cy=notifications]').should('be.empty');
			});

			it('should show an incoming video call', () => {
				generateMultipleConsultantSessions(2);
				cy.fastLogin();
				cy.wait('@consultingTypeServiceBaseBasic');

				cy.get('.cy-socket-connected-stomp');
				cy.waitForSubscriptions(['/user/events']);
				cy.emitVideoCallRequest();

				cy.get('[data-cy=notifications]').should('exist');
				cy.get('[data-cy=incoming-video-call]').should('exist');
				cy.get('[data-cy=incoming-video-call]').should(
					'have.length',
					1
				);
			});

			it('should show all incoming video calls', () => {
				const amountOfIncomingCalls = 3;
				generateMultipleConsultantSessions(2);
				cy.fastLogin();
				cy.wait('@consultingTypeServiceBaseBasic');

				cy.get('.cy-socket-connected-stomp');
				cy.waitForSubscriptions(['/user/events']);
				cy.emitVideoCallRequest();

				cy.get('[data-cy=notifications]').should('exist');
				cy.get('[data-cy=incoming-video-call]').should('exist');
				cy.get('[data-cy=incoming-video-call]').should(
					'have.length',
					1
				);
				for (let i = 0; i < amountOfIncomingCalls - 1; i++) {
					cy.emitVideoCallRequest();
				}
				cy.get('[data-cy=incoming-video-call]').should(
					'have.length',
					amountOfIncomingCalls
				);
			});

			it('should remove incoming call when call is answered', () => {
				generateMultipleConsultantSessions(2);
				cy.fastLogin();
				cy.wait('@consultingTypeServiceBaseBasic');

				cy.get('.cy-socket-connected-stomp');
				cy.waitForSubscriptions(['/user/events']);
				cy.emitVideoCallRequest();
				cy.emitVideoCallRequest();

				cy.get('[data-cy=incoming-video-call]').should(
					'have.length',
					2
				);

				cy.window().then((window) => {
					cy.stub(window, 'open').as('windowOpen');
				});

				cy.get('[data-cy=answer-incoming-video-call]').first().click();
				cy.get('[data-cy=incoming-video-call]').should(
					'have.length',
					1
				);

				cy.get('@windowOpen').should('be.called');
			});

			it('should remove incoming call when call is rejected', () => {
				generateMultipleConsultantSessions(2);
				cy.fastLogin();
				cy.wait('@consultingTypeServiceBaseBasic');

				cy.get('.cy-socket-connected-stomp');
				cy.waitForSubscriptions(['/user/events']);
				cy.emitVideoCallRequest();

				cy.get('[data-cy=incoming-video-call]').should(
					'have.length',
					1
				);
				cy.get('[data-cy=reject-incoming-video-call]').click();
				cy.get('[data-cy=incoming-video-call]').should(
					'have.length',
					0
				);
			});

			describe('Playing of ringtone', () => {
				it('should play on any incoming video call', () => {
					generateMultipleConsultantSessions(2);
					cy.fastLogin();
					cy.wait('@consultingTypeServiceBaseBasic');

					cy.get('.cy-socket-connected-stomp');
					cy.waitForSubscriptions(['/user/events']);
					cy.emitVideoCallRequest();

					cy.get('[data-cy=incoming-video-call]').should(
						'have.length',
						1
					);
					cy.get('[data-cy=incoming-video-call-audio]').should(
						'exist'
					);
				});

				it('should stop playing if last incoming call gets rejected', () => {
					generateMultipleConsultantSessions(2);
					cy.fastLogin();
					cy.wait('@consultingTypeServiceBaseBasic');

					cy.get('.cy-socket-connected-stomp');
					cy.waitForSubscriptions(['/user/events']);
					cy.emitVideoCallRequest();

					cy.get('[data-cy=incoming-video-call-audio]').should(
						'exist'
					);
					cy.get('[data-cy=reject-incoming-video-call]').click();
					cy.get('[data-cy=incoming-video-call-audio]').should(
						'not.exist'
					);
				});

				it('should stop playing if last incoming call gets answered', () => {
					generateMultipleConsultantSessions(2);
					cy.fastLogin();
					cy.wait('@consultingTypeServiceBaseBasic');

					cy.get('.cy-socket-connected-stomp');
					cy.waitForSubscriptions(['/user/events']);
					cy.emitVideoCallRequest();

					cy.get('[data-cy=incoming-video-call-audio]').should(
						'exist'
					);
					cy.window().then((window) => {
						cy.stub(window, 'open').as('windowOpen');
					});

					cy.get('[data-cy=answer-incoming-video-call]').click();
					cy.get('[data-cy=incoming-video-call-audio]').should(
						'not.exist'
					);

					cy.get('@windowOpen').should('be.called');
				});

				it('should keep playing if at least one incoming call remains after rejecting a call', () => {
					generateMultipleConsultantSessions(2);
					cy.fastLogin();
					cy.wait('@consultingTypeServiceBaseBasic');

					cy.get('.cy-socket-connected-stomp');
					cy.waitForSubscriptions(['/user/events']);
					cy.emitVideoCallRequest();
					cy.emitVideoCallRequest();

					cy.get('[data-cy=incoming-video-call-audio]').should(
						'exist'
					);
					cy.get('[data-cy=reject-incoming-video-call]')
						.first()
						.click();
					cy.get('[data-cy=incoming-video-call]').should(
						'have.length',
						1
					);
					cy.get('[data-cy=incoming-video-call-audio]').should(
						'exist'
					);
				});

				it('should keep playing if at least one incoming call remains after answering a call', () => {
					generateMultipleConsultantSessions(2);
					cy.fastLogin();
					cy.wait('@consultingTypeServiceBaseBasic');

					cy.get('.cy-socket-connected-stomp');
					cy.waitForSubscriptions(['/user/events']);
					cy.emitVideoCallRequest();
					cy.emitVideoCallRequest();

					cy.get('[data-cy=incoming-video-call-audio]').should(
						'exist'
					);

					cy.window().then((window) => {
						cy.stub(window, 'open').as('windowOpen');
					});

					cy.get('[data-cy=answer-incoming-video-call]')
						.first()
						.click();
					cy.get('[data-cy=incoming-video-call]').should(
						'have.length',
						1
					);
					cy.get('[data-cy=incoming-video-call-audio]').should(
						'exist'
					);

					cy.get('@windowOpen').should('be.called');
				});
			});
		});
	});

	describe.skip('Consultant', () => {
		describe('Start a new video call', () => {
			it('should show video call buttons in session header', () => {
				generateMultipleConsultantSessions(2);
				cy.willReturn('userData', {
					isVideoCallAllowed: true
				});

				cy.fastLogin({
					username: USER_CONSULTANT
				});

				cy.get('a[href="/sessions/consultant/sessionView"]').click();
				cy.get('[data-cy=sessions-list-items-wrapper]').click();

				cy.get('[data-cy=session-header-video-call-buttons]').should(
					'exist'
				);
			});
		});
	});
});
