import {
	closeWebSocketServer,
	startWebSocketServer,
	mockWebSocket
} from '../support/websocket';
import {
	generateMultipleAskerSessions,
	generateMultipleConsultantSessions
} from '../support/sessions';
import { USER_CONSULTANT } from '../support/commands/login';

import {
	MAX_ITEMS_TO_SHOW_WELCOME_ILLUSTRATION,
	SCROLL_PAGINATE_THRESHOLD
} from '../../src/components/sessionsList/sessionsListConfig';

describe('Sessions', () => {
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

	describe('Consultant', () => {
		it.skip('should show confirmation forwarding the session', () => {
			generateMultipleConsultantSessions(5);

			cy.fastLogin({
				username: USER_CONSULTANT
			});
			cy.wait('@consultingTypeServiceBaseBasic');

			cy.get('a[href="/sessions/consultant/sessionView"]').click();
			cy.get('.sessionsListItem').should('exist');
			cy.wait('@consultantSessions');

			cy.get('[data-cy=session-list-item]').first().click();
			cy.wait('@consultingTypeServiceBaseFull');
			cy.wait('@messages');

			cy.get('#iconH').click();
			cy.get('#flyout').should('be.visible');
			cy.get('#flyout a').first().click();
			cy.wait('@agencyConsultants');

			cy.get('#assignSelect').click();
			cy.get('#react-select-2-option-0').click();
			cy.get('.overlay').should('exist');
		});

		it('should list my sessions', () => {
			generateMultipleConsultantSessions(3);

			cy.fastLogin({
				username: USER_CONSULTANT
			});
			cy.wait('@consultingTypeServiceBaseBasic');

			cy.get('a[href="/sessions/consultant/sessionView"]').click();
			cy.get('.sessionsListItem').should('have.length', 6);
		});

		it('should fetch next batch of sessions if scroll threshold is reached', () => {
			generateMultipleConsultantSessions(100);

			cy.fastLogin({
				username: USER_CONSULTANT
			});
			cy.wait('@consultingTypeServiceBaseBasic');

			cy.get('a[href="/sessions/consultant/sessionView"]').click();
			cy.get('.sessionsListItem').should('exist');
			cy.wait('@consultantSessions');

			cy.get('.sessionsListItem').should('have.length', 15);

			cy.get('.sessionsList__scrollContainer').then(
				([scrollContainer]) => {
					const scrollPosition =
						Math.ceil(scrollContainer.scrollTop) +
						scrollContainer.offsetHeight;

					const scrollable =
						scrollContainer.scrollHeight - scrollPosition;

					cy.get('.sessionsList__scrollContainer').scrollTo(
						0,
						scrollable - SCROLL_PAGINATE_THRESHOLD
					);
				}
			);

			cy.wait('@consultantSessions');
		});

		it('should not fetch next batch of sessions if scroll threshold is not reached', () => {
			generateMultipleConsultantSessions(100);

			cy.fastLogin({
				username: USER_CONSULTANT
			});
			cy.wait('@consultingTypeServiceBaseBasic');

			cy.get('a[href="/sessions/consultant/sessionView"]').click();
			cy.get('.sessionsListItem').should('exist');
			cy.wait('@consultantSessions');

			cy.get('.sessionsListItem').should('have.length', 15);

			cy.get('.sessionsList__scrollContainer').then(
				([scrollContainer]) => {
					const scrollPosition =
						Math.ceil(scrollContainer.scrollTop) +
						scrollContainer.offsetHeight;

					const scrollable =
						scrollContainer.scrollHeight - scrollPosition;

					cy.get('.sessionsList__scrollContainer').scrollTo(
						0,
						scrollable - SCROLL_PAGINATE_THRESHOLD - 1
					);
				}
			);

			cy.get('.skeleton__item').should('not.exist');
		});

		describe('Access Token expires while logged in', () => {
			it('should logout if trying to paginate sessions', () => {
				generateMultipleConsultantSessions(15);

				cy.fastLogin({
					username: USER_CONSULTANT
				});
				cy.wait('@rcSettingsPublic');
				cy.wait('@consultingTypeServiceBaseBasic');

				cy.get('a[href="/sessions/consultant/sessionView"]').click();
				cy.wait('@consultantSessions');
				cy.get('.sessionsListItem').should('exist');

				cy.willReturn('consultantSessions', 401);

				cy.get('.sessionsList__scrollContainer').scrollTo('bottom');
				cy.wait('@consultantSessions');
				cy.get('.loginForm').should('exist');
			});
		});
	});

	describe('Asker', () => {
		it('should list my sessions', () => {
			generateMultipleAskerSessions(3);
			cy.fastLogin();
			cy.wait('@consultingTypeServiceBaseBasic');

			cy.get('.sessionsListItem').should('have.length', 4);
		});

		it('should show a header with headline', () => {
			cy.fastLogin();
			cy.wait('@consultingTypeServiceBaseBasic');
			cy.get('[data-cy=session-list-header]').should('exist');
			cy.get('[data-cy=session-list-headline]').contains(
				'Meine Beratungen'
			);
		});

		describe('welcome illustration', () => {
			it('should show until given session item limit is reached', () => {
				// MAX_ITEMS_TO_SHOW_WELCOME_ILLUSTRATION minus 1 because on session is already added
				generateMultipleAskerSessions(
					MAX_ITEMS_TO_SHOW_WELCOME_ILLUSTRATION - 1
				);
				cy.fastLogin();
				cy.wait('@consultingTypeServiceBaseBasic');

				cy.get('[data-cy=session-list-welcome-illustration]').should(
					'exist'
				);
			});

			it('should not show when given session item limit is reached', () => {
				generateMultipleAskerSessions(
					MAX_ITEMS_TO_SHOW_WELCOME_ILLUSTRATION
				);
				cy.fastLogin();
				cy.wait('@consultingTypeServiceBaseBasic');

				cy.get('[data-cy=session-list-welcome-illustration]').should(
					'not.exist'
				);
			});
		});
	});
});
