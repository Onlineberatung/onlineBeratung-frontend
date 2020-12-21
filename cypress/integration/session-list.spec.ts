import { generateSession } from '../support/sessions';
import sessionListI18n from '../../src/resources/scripts/i18n/de/sessionList';

const generateMultipleSessions = (count: number): Array<any> => {
	const sessions = [];
	for (let i = 0; i < count; i++) {
		sessions.push(generateSession());
	}
	return sessions;
};

describe('session list', () => {
	describe('my messages', () => {
		it('should show a header with headline', () => {
			cy.caritasMockedLogin();
			cy.get('[data-cy=session-list-header]').should('exist');
			cy.get('[data-cy=session-list-headline]').contains(
				sessionListI18n['view.headline']
			);
		});

		it('should display all existing sessions (3 sessions)', () => {
			const sessionCount = 3;
			const sessions = generateMultipleSessions(sessionCount);
			cy.caritasMockedLogin({ sessions });
			cy.get('[data-cy=session-list-item]').should(
				'have.length',
				sessionCount
			);
		});

		it('should display all existing sessions (100 sessions)', () => {
			const sessionCount = 100;
			const sessions = generateMultipleSessions(sessionCount);
			cy.caritasMockedLogin({ sessions });
			cy.get('[data-cy=session-list-item]').should(
				'have.length',
				sessionCount
			);
		});

		describe('welcome illustration', () => {
			it('should show with 3 or less sessions', () => {
				const sessions = generateMultipleSessions(3);
				cy.caritasMockedLogin({ sessions });
				cy.get('[data-cy=session-list-welcome-illustration]').should(
					'exist'
				);
			});

			it('should not show with 4 or more sessions', () => {
				const sessions = generateMultipleSessions(4);
				cy.caritasMockedLogin({ sessions });
				cy.get('[data-cy=session-list-welcome-illustration]').should(
					'not.exist'
				);
			});
		});
	});
});
