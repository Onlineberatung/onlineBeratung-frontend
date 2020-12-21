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

		// describe(-> feature wie illustration oder nachladen von sessions) anstelle von Anzahl der Sessions
		// it -> should show with given limit of sessions -> im Test eine config Variable ziehen, die auch die Anzahl der Sessions im production code bestimmt (ähnlich wie bei den Translations)
		// it -> should not show with given constraints (siehe oben)

		describe('no sessions', () => {
			describe('the user is an consultant', () => {
				// info text shown
			});
		});

		describe('3 sessions', () => {
			it('should display all existing sessions', () => {
				const sessionCount = 3;
				const sessions = generateMultipleSessions(sessionCount);
				cy.caritasMockedLogin({ sessions });
				cy.get('[data-cy=session-list-item]').should(
					'have.length',
					sessionCount
				);
			});

			it('should show a welcome illustration', () => {
				const sessions = generateMultipleSessions(3);
				cy.caritasMockedLogin({ sessions });
				cy.get('[data-cy=session-list-welcome-illustration]').should(
					'exist'
				);
			});
		});

		describe('4 sessions', () => {
			it('should display all existing sessions', () => {
				const sessionCount = 4;
				const sessions = generateMultipleSessions(sessionCount);
				cy.caritasMockedLogin({ sessions });
				cy.get('[data-cy=session-list-item]').should(
					'have.length',
					sessionCount
				);
			});

			it('should not show a welcome illustration', () => {
				const sessions = generateMultipleSessions(4);
				cy.caritasMockedLogin({ sessions });
				cy.get('[data-cy=session-list-welcome-illustration]').should(
					'not.exist'
				);
			});
		});

		describe('20 sessions', () => {
			describe('the user is an asker', () => {
				it('should display all existing sessions', () => {
					const sessionCount = 20;
					const sessions = generateMultipleSessions(sessionCount);
					cy.caritasMockedLogin({ sessions });
					cy.get('[data-cy=session-list-item]').should(
						'have.length',
						sessionCount
					);
				});
			});

			describe('the user is an consultant', () => {
				// only 15 items are loaded
			});
		});
	});
});
