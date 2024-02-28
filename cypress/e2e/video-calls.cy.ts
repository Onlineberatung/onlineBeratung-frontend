import {
	closeWebSocketServer,
	mockWebSocket,
	startWebSocketServer
} from '../support/websocket';
import {
	generateMultipleAskerSessions,
	generateMultipleConsultantSessions
} from '../support/sessions';
import { USER_VIDEO } from '../support/commands/mockApi';

xdescribe('Video calls', () => {
	before(() => {
		startWebSocketServer();
	});

	after(() => {
		closeWebSocketServer();
	});

	beforeEach(() => {
		mockWebSocket();
	});

	describe('Asker', () => {
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

		describe('E2EE', () => {
			describe('E2EE Check enabled', () => {
				beforeEach(() => {
					cy.willReturn('userData', {
						e2eEncryptionEnabled: true
					});

					cy.fastLogin();
					cy.wait('@consultingTypeServiceBaseBasic');

					cy.get('.cy-socket-connected-stomp');
					cy.waitForSubscriptions(['/user/events']);
				});

				describe('Incoming VideoCall', () => {
					it('E2EE supported', () => {
						cy.window().then((window) => {
							cy.stub(window, 'open').as('windowOpen');
						});

						cy.emitVideoCallRequest();
						cy.get('[data-cy=incoming-video-call-audio]').should(
							'exist'
						);
						cy.get('[data-cy=incoming-video-call]')
							.should('exist')
							.children('.incomingVideoCall__hint')
							.should('not.exist');

						cy.get('[data-cy=answer-incoming-video-call]').click();
						cy.get('@windowOpen').should('be.called');
					});

					it('E2EE not supported', () => {
						cy.window().then((window) => {
							cy.stub(window, 'open').as('windowOpen');
							cy.stub(window, 'RTCRtpSender').returns(undefined);
						});
						cy.emitVideoCallRequest();

						cy.get('[data-cy=incoming-video-call-audio]').should(
							'exist'
						);
						cy.get('[data-cy=incoming-video-call]')
							.should('exist')
							.children('.incomingVideoCall__hint')
							.should('exist');

						cy.get('[data-cy=answer-incoming-video-call]').click();
						cy.get('@windowOpen').should('be.called');
					});
				});
			});

			describe('E2EE Check disabled', () => {
				beforeEach(() => {
					cy.willReturn('userData', {
						e2eEncryptionEnabled: false
					});

					cy.fastLogin();
					cy.wait('@consultingTypeServiceBaseBasic');

					cy.get('.cy-socket-connected-stomp');
					cy.waitForSubscriptions(['/user/events']);
				});

				describe('Incoming VideoCall', () => {
					it('E2EE supported', () => {
						cy.window().then((window) => {
							cy.stub(window, 'open').as('windowOpen');
						});

						cy.emitVideoCallRequest();
						cy.get('[data-cy=incoming-video-call-audio]').should(
							'exist'
						);
						cy.get('[data-cy=incoming-video-call]')
							.should('exist')
							.children('.incomingVideoCall__hint')
							.should('not.exist');

						cy.get('[data-cy=answer-incoming-video-call]').click();
						cy.get('@windowOpen').should('be.called');
					});

					it('E2EE not supported', () => {
						cy.window().then((window) => {
							cy.stub(window, 'open').as('windowOpen');
							cy.stub(window, 'RTCRtpSender').returns(undefined);
						});
						cy.emitVideoCallRequest();

						cy.get('[data-cy=incoming-video-call-audio]').should(
							'exist'
						);
						cy.get('[data-cy=incoming-video-call]')
							.should('exist')
							.children('.incomingVideoCall__hint')
							.should('exist');

						cy.get('[data-cy=answer-incoming-video-call]').click();
						cy.get('@windowOpen').should('be.called');
					});
				});
			});
		});
	});

	describe('Consultant', () => {
		beforeEach(() => {
			generateMultipleConsultantSessions(2);
			cy.consultantSession(
				{
					session: {
						consultingType: 2
					}
				},
				0
			);
		});

		describe('E2EE', () => {
			describe('E2EE Check enabled', () => {
				beforeEach(() => {
					cy.willReturn('userData', {
						e2eEncryptionEnabled: true
					});

					cy.fastLogin({
						userId: USER_VIDEO
					});
					cy.wait('@consultingTypeServiceBaseBasic');

					cy.get(
						'a[href="/sessions/consultant/sessionView"]'
					).click();
					cy.wait('@consultantSessions');
				});

				it('VideoCall disabled for chatItem', () => {
					cy.willReturn('sessionRooms', {
						agencyId: 0,
						consultingType: 0
					});

					cy.get('[data-cy=sessions-list-items-wrapper] > div')
						.eq(1)
						.click();
					cy.wait('@messages');
					cy.wait('@consultingTypeServiceBaseFull');

					cy.get(
						'[data-cy=session-header-video-call-buttons]'
					).should('not.exist');
				});

				describe('VideoCall enabled for chatItem', () => {
					it('E2EE supported', () => {
						cy.willReturn('sessionRooms', {
							agencyId: 2,
							consultingType: 2
						});
						cy.get('[data-cy=sessions-list-items-wrapper] > div')
							.eq(0)
							.click();
						cy.wait('@messages');
						cy.wait('@consultingTypeServiceBaseFull');

						cy.get(
							'[data-cy=session-header-video-call-buttons]'
						).should('exist');

						cy.window().then((window) => {
							cy.stub(window, 'open').as('windowOpen');
						});

						// Try video call
						cy.get(
							'[data-cy=session-header-video-call-buttons] .button__wrapper'
						)
							.eq(0)
							.click();
						cy.get('@windowOpen').should('be.called');
						cy.wait('@startVideoCall');

						// Try audio call
						cy.get(
							'[data-cy=session-header-video-call-buttons] .button__wrapper'
						)
							.eq(1)
							.click();
						cy.get('@windowOpen').should('be.called');
						cy.wait('@startVideoCall');
					});

					it('E2EE not supported', () => {
						cy.get('[data-cy=sessions-list-items-wrapper] > div')
							.eq(0)
							.click();
						cy.wait('@messages');
						cy.wait('@consultingTypeServiceBaseFull');

						cy.get(
							'[data-cy=session-header-video-call-buttons]'
						).should('exist');

						cy.window().then((window) => {
							cy.stub(window, 'open').as('windowOpen');
							cy.stub(window, 'RTCRtpSender').returns(undefined);
						});

						// Try video call
						cy.get(
							'[data-cy=session-header-video-call-buttons] .button__wrapper'
						)
							.eq(0)
							.click();
						cy.get('@windowOpen').should('not.be.called');
						cy.get('.overlay__content .headline').contains(
							'Der Video-Call kann nicht gestartet werden'
						);
						cy.get(
							'.overlay__content .overlay__buttons .button__wrapper'
						)
							.eq(0)
							.children('button')
							.click();

						// Try audio call
						cy.get(
							'[data-cy=session-header-video-call-buttons] .button__wrapper'
						)
							.eq(1)
							.click();
						cy.get('@windowOpen').should('not.be.called');
						cy.get('.overlay__content .headline').contains(
							'Der Video-Call kann nicht gestartet werden'
						);
						cy.get(
							'.overlay__content .overlay__buttons .button__wrapper'
						)
							.eq(0)
							.children('button')
							.click();
					});
				});
			});

			describe('E2EE Check disabled', () => {
				beforeEach(() => {
					cy.willReturn('userData', {
						e2eEncryptionEnabled: false
					});

					cy.fastLogin({
						userId: USER_VIDEO
					});
					cy.wait('@consultingTypeServiceBaseBasic');

					cy.get(
						'a[href="/sessions/consultant/sessionView"]'
					).click();
					cy.wait('@consultantSessions');
				});

				it('VideoCall disabled for chatItem', () => {
					cy.willReturn('sessionRooms', {
						agencyId: 0,
						consultingType: 0
					});

					cy.get('[data-cy=sessions-list-items-wrapper] > div')
						.eq(1)
						.click();
					cy.wait('@messages');
					cy.wait('@consultingTypeServiceBaseFull');

					cy.get(
						'[data-cy=session-header-video-call-buttons]'
					).should('not.exist');
				});

				describe('VideoCall enabled for chatItem', () => {
					it('E2EE supported', () => {
						cy.willReturn('sessionRooms', {
							agencyId: 2,
							consultingType: 2
						});
						cy.get('[data-cy=sessions-list-items-wrapper] > div')
							.eq(0)
							.click();
						cy.wait('@messages');
						cy.wait('@consultingTypeServiceBaseFull');

						cy.get(
							'[data-cy=session-header-video-call-buttons]'
						).should('exist');

						cy.window().then((window) => {
							cy.stub(window, 'open').as('windowOpen');
						});

						// Try video call
						cy.get(
							'[data-cy=session-header-video-call-buttons] .button__wrapper'
						)
							.eq(0)
							.click();
						cy.get('@windowOpen').should('be.called');
						cy.wait('@startVideoCall');

						// Try audio call
						cy.get(
							'[data-cy=session-header-video-call-buttons] .button__wrapper'
						)
							.eq(1)
							.click();
						cy.get('@windowOpen').should('be.called');
						cy.wait('@startVideoCall');
					});

					it('E2EE not supported', () => {
						cy.get('[data-cy=sessions-list-items-wrapper] > div')
							.eq(0)
							.click();
						cy.wait('@messages');
						cy.wait('@consultingTypeServiceBaseFull');

						cy.get(
							'[data-cy=session-header-video-call-buttons]'
						).should('exist');

						cy.window().then((window) => {
							cy.stub(window, 'open').as('windowOpen');
							cy.stub(window, 'RTCRtpSender').returns(undefined);
						});

						// Try video call
						cy.get(
							'[data-cy=session-header-video-call-buttons] .button__wrapper'
						)
							.eq(0)
							.click();
						cy.get('@windowOpen').should('be.called');
						cy.wait('@startVideoCall');

						// Try audio call
						cy.get(
							'[data-cy=session-header-video-call-buttons] .button__wrapper'
						)
							.eq(1)
							.click();
						cy.get('@windowOpen').should('be.called');
						cy.wait('@startVideoCall');
					});
				});
			});
		});
	});
});
