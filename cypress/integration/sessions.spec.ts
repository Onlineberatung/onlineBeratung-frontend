import {
	generateMultipleAskerSessions,
	generateMultipleConsultantSessions
} from '../support/sessions';

describe('Sessions', () => {
	describe('Consultant', () => {
		it('should list my sessions', () => {
			const amountOfSessions = 3;
			const sessions = generateMultipleConsultantSessions(
				amountOfSessions
			);
			cy.caritasMockedLogin({
				type: 'consultant',
				sessions
			});

			cy.get('a[href="/sessions/consultant/sessionView"]').click();
			cy.get('.sessionsListItem').should('have.length', amountOfSessions);
		});
	});

	describe('Asker', () => {
		it('should list my sessions', () => {
			const amountOfSessions = 3;
			const sessions = generateMultipleAskerSessions(amountOfSessions);
			cy.caritasMockedLogin({
				type: 'asker',
				sessions
			});

			cy.get('.sessionsListItem').should('have.length', amountOfSessions);
		});
	});
});
