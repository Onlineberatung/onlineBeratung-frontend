import {
	generateMultipleAskerSessions,
	generateMultipleConsultantSessions
} from '../support/sessions';
import { emitStompVideoCallRequest } from '../support/websocket';

describe('Video calls', () => {
	describe('Consultant', () => {
		describe('Start a new video call', () => {
			//TODO: reimplement on videocall release
			it.skip('should show video call buttons in session header', () => {
				const sessions = generateMultipleConsultantSessions(2);
				cy.caritasMockedLogin({
					type: 'consultant',
					sessions
				});

				cy.get('a[href="/sessions/consultant/sessionView"]').click();
				cy.get('[data-cy=sessions-list-items-wrapper]').click();

				cy.get('[data-cy=session-header-video-call-buttons]').should(
					'exist'
				);
			});
		});
	});

	describe('Asker', () => {
		it('should not show buttons to start a new video call in session header', () => {
			const sessions = generateMultipleAskerSessions(2);
			cy.caritasMockedLogin({
				type: 'asker',
				sessions
			});

			cy.get('a[href="/sessions/user/view"]').click();
			cy.get('[data-cy=sessions-list-items-wrapper]').click();

			cy.get('[data-cy=session-header-video-call-buttons]').should(
				'not.exist'
			);
		});

		describe('Incoming video call notifications', () => {
			it('should show no notifications when no notifications exist', () => {
				cy.caritasMockedLogin();

				cy.get('[data-cy=notifications]').should('be.empty');
			});

			it('should show an incoming video call', () => {
				const sessions = generateMultipleConsultantSessions(2);
				cy.caritasMockedLogin({
					type: 'asker',
					sessions
				}).then(() => {
					emitStompVideoCallRequest();
				});

				cy.get('[data-cy=notifications]').should('exist');
				cy.get('[data-cy=incoming-video-call]').should('exist');
				cy.get('[data-cy=incoming-video-call]').should(
					'have.length',
					1
				);
			});

			it('should show all incoming video calls', () => {
				const amountOfIncomingCalls = 3;
				const sessions = generateMultipleConsultantSessions(2);
				cy.caritasMockedLogin({
					type: 'asker',
					sessions
				}).then(() => {
					emitStompVideoCallRequest();
				});

				cy.get('[data-cy=notifications]').should('exist');
				cy.get('[data-cy=incoming-video-call]').should('exist');
				cy.get('[data-cy=incoming-video-call]').should(
					'have.length',
					1
				);
				for (let i = 0; i < amountOfIncomingCalls - 1; i++) {
					emitStompVideoCallRequest();
				}
				cy.get('[data-cy=incoming-video-call]').should(
					'have.length',
					amountOfIncomingCalls
				);
			});

			it('should remove incoming call when call is answered', () => {
				const sessions = generateMultipleConsultantSessions(2);
				cy.caritasMockedLogin({
					type: 'asker',
					sessions
				}).then(() => {
					emitStompVideoCallRequest();
					emitStompVideoCallRequest();
				});

				cy.get('[data-cy=incoming-video-call]').should(
					'have.length',
					2
				);
				cy.get('[data-cy=answer-incoming-video-call]').first().click();
				cy.get('[data-cy=incoming-video-call]').should(
					'have.length',
					1
				);
			});

			it('should remove incoming call when call is rejected', () => {
				const sessions = generateMultipleConsultantSessions(2);
				cy.caritasMockedLogin({
					type: 'asker',
					sessions
				}).then(() => {
					emitStompVideoCallRequest();
				});

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
					const sessions = generateMultipleConsultantSessions(2);
					cy.caritasMockedLogin({
						type: 'asker',
						sessions
					}).then(() => {
						emitStompVideoCallRequest();
					});

					cy.get('[data-cy=incoming-video-call]').should(
						'have.length',
						1
					);
					cy.get('[data-cy=incoming-video-call-audio]').should(
						'exist'
					);
				});

				it('should stop playing if last incoming call gets rejected', () => {
					const sessions = generateMultipleConsultantSessions(2);
					cy.caritasMockedLogin({
						type: 'asker',
						sessions
					}).then(() => {
						emitStompVideoCallRequest();
					});

					cy.get('[data-cy=incoming-video-call-audio]').should(
						'exist'
					);
					cy.get('[data-cy=reject-incoming-video-call]').click();
					cy.get('[data-cy=incoming-video-call-audio]').should(
						'not.exist'
					);
				});

				it('should stop playing if last incoming call gets answered', () => {
					const sessions = generateMultipleConsultantSessions(2);
					cy.caritasMockedLogin({
						type: 'asker',
						sessions
					}).then(() => {
						emitStompVideoCallRequest();
					});

					cy.get('[data-cy=incoming-video-call-audio]').should(
						'exist'
					);
					cy.get('[data-cy=answer-incoming-video-call]').click();
					cy.get('[data-cy=incoming-video-call-audio]').should(
						'not.exist'
					);
				});

				it('should keep playing if at least one incoming call remains after rejecting a call', () => {
					const sessions = generateMultipleConsultantSessions(2);
					cy.caritasMockedLogin({
						type: 'asker',
						sessions
					}).then(() => {
						emitStompVideoCallRequest();
						emitStompVideoCallRequest();
					});

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
					const sessions = generateMultipleConsultantSessions(2);
					cy.caritasMockedLogin({
						type: 'asker',
						sessions
					}).then(() => {
						emitStompVideoCallRequest();
						emitStompVideoCallRequest();
					});

					cy.get('[data-cy=incoming-video-call-audio]').should(
						'exist'
					);
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
				});
			});
		});
	});
});
