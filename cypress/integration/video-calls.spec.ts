import {
	generateMultipleAskerSessions,
	generateMultipleConsultantSessions
} from '../support/sessions';
import { emitStompVideoCallRequest } from '../support/websocket';

describe('Video calls', () => {
	describe('Consultant', () => {
		describe('Start a new video call', () => {
			it('should show video call buttons in session header', () => {
				const sessions = generateMultipleConsultantSessions(2);
				cy.caritasMockedLogin({
					type: 'consultant',
					sessions
				});

				cy.get('a[href="/sessions/consultant/sessionView"]').click();
				cy.get('.sessionsList__itemsWrapper ').click();

				cy.get('.sessionMenu__videoCallButtons').should('exist');
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
			cy.get('.sessionsList__itemsWrapper ').click();

			cy.get('.sessionMenu__videoCallButtons').should('not.exist');
		});

		it('should show no notifications when no notifications exist', () => {
			cy.clock();
			cy.caritasMockedLogin();

			cy.get('.notifications').should('be.empty');
		});

		describe('Incoming video call notifications', () => {
			it('should show an incoming video call', () => {
				const sessions = generateMultipleConsultantSessions(2);
				cy.caritasMockedLogin({
					type: 'asker',
					sessions
				}).then(() => {
					emitStompVideoCallRequest();
				});

				cy.get('.notifications').should('exist');
				cy.get('.incomingVideoCall').should('exist');
				cy.get('.incomingVideoCall').should('have.length', 1);
			});

			it('should show all incoming video calls', () => {
				const sessions = generateMultipleConsultantSessions(2);
				cy.caritasMockedLogin({
					type: 'asker',
					sessions
				}).then(() => {
					emitStompVideoCallRequest();
				});

				cy.get('.notifications').should('exist');
				cy.get('.incomingVideoCall').should('exist');
				cy.get('.incomingVideoCall').should('have.length', 1);
				emitStompVideoCallRequest();
				emitStompVideoCallRequest();
				cy.get('.incomingVideoCall').should('have.length', 3);
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

				cy.get('.incomingVideoCall').should('have.length', 2);
				cy.get('.incomingVideoCall__buttons .button__smallIcon--green')
					.first()
					.click();
				cy.get('.incomingVideoCall').should('have.length', 1);
			});

			it('should remove incoming call when call is rejected', () => {
				const sessions = generateMultipleConsultantSessions(2);
				cy.caritasMockedLogin({
					type: 'asker',
					sessions
				}).then(() => {
					emitStompVideoCallRequest();
				});

				cy.get('.incomingVideoCall').should('have.length', 1);
				cy.get('.incomingVideoCall__buttons .button__smallIcon--red')
					.first()
					.click();
				cy.get('.incomingVideoCall').should('have.length', 0);
			});

			describe('Playing of ringtone', () => {
				it('should play ringtone on any incoming video call', () => {
					const sessions = generateMultipleConsultantSessions(2);
					cy.caritasMockedLogin({
						type: 'asker',
						sessions
					}).then(() => {
						emitStompVideoCallRequest();
					});

					cy.get('.notifications audio[loop][autoplay]').should(
						'exist'
					);
				});

				it('should stop playing ringtone if last incoming call gets answered/rejected', () => {
					const sessions = generateMultipleConsultantSessions(2);
					cy.caritasMockedLogin({
						type: 'asker',
						sessions
					}).then(() => {
						emitStompVideoCallRequest();
					});

					cy.get('.notifications audio[loop][autoplay]').should(
						'exist'
					);
					cy.get(
						'.incomingVideoCall__buttons .button__smallIcon--red'
					)
						.first()
						.click();
					cy.get('.notifications audio[loop][autoplay]').should(
						'not.exist'
					);
				});

				it('should keep playing ringtone if at least one incoming call remains after answering/rejecting a call', () => {
					const sessions = generateMultipleConsultantSessions(2);
					cy.caritasMockedLogin({
						type: 'asker',
						sessions
					}).then(() => {
						emitStompVideoCallRequest();
						emitStompVideoCallRequest();
					});

					cy.get('.notifications audio[loop][autoplay]').should(
						'exist'
					);
					cy.get(
						'.incomingVideoCall__buttons .button__smallIcon--red'
					)
						.first()
						.click();
					cy.get('.incomingVideoCall').should('have.length', 1);
					cy.get('.notifications audio[loop][autoplay]').should(
						'exist'
					);
				});
			});
		});
	});
});
