import { config, apiUrl } from '../../src/resources/scripts/config';
import { generateMultipleConsultantSessions } from '../support/sessions';

describe('Default consultant sessions', () => {
	const loginGenerateSessions = (amountOfSessions: number) => {
		const sessions = generateMultipleConsultantSessions(amountOfSessions);
		cy.caritasMockedLogin({
			type: 'consultant',
			sessions
		});
	};
	it('should check Ratsuchende and Archiv tabs', () => {
		loginGenerateSessions(3);
		cy.get('a[href="/sessions/consultant/sessionView"]').click();
		cy.intercept(config.endpoints.sendMessage, {});
		cy.get('.sessionsListItem__content').first().click();
		cy.get('span[class="textarea__inputWrapper"]')
			.click()
			.type('Hallo, wie kann ich helfe?');
		cy.get('span[title="Nachricht senden"]').click();
		cy.intercept(`${apiUrl}/service/users/sessions/1/archive`, {});
		cy.get('span[id="iconH"]').click();
		cy.intercept(config.endpoints.myMessagesBase, {});
		cy.get('div[class="sessionMenu__item"]')
			.contains('Archivieren')
			.click();
		cy.get('.overlay__buttons').get('button').contains('Schließen').click();
	});

	it('should check RS profile access', () => {
		loginGenerateSessions(3);
		cy.intercept(`${apiUrl}/service/users/sessions/1/monitoring`, {});
		cy.intercept(config.endpoints.messages, {});
		cy.get('a[href="/sessions/consultant/sessionView"]').click();
		cy.get('.sessionsListItem__content').first().click();
		cy.get('span[id="iconH"]').click();
		cy.get('div[id="flyout"]').contains('a', 'Ratsuchendenprofil').click();
		cy.get('.profile__header__backButton').click();
		cy.get('.sessionInfo__username').click();
		cy.get('.profile__header__backButton').click();
	});

	it('should go to Team/Peer Beratungen', () => {
		cy.intercept(config.endpoints.consultantTeamSessions, {});
		cy.intercept(config.endpoints.teamSessionsBase, {});
		cy.get('.navigation__title').contains('Beratungen').click();
	});
});
