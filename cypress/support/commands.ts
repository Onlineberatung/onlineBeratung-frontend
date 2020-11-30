import { config } from '../../src/resources/scripts/config';

declare global {
	namespace Cypress {
		interface Chainable {
			caritasMockedLogin(): Chainable<Element>;
		}
	}
}

Cypress.Commands.add('caritasMockedLogin', () => {
	cy.intercept('POST', config.endpoints.keycloakAccessToken, {
		fixture: 'auth.token.json'
	});
	cy.intercept('GET', config.endpoints.userData, {
		fixture: 'service.users.data.json'
	});
	cy.intercept('GET', config.endpoints.userSessions, {
		fixture: 'service.users.sessions.askers.json'
	});
	cy.intercept('GET', config.endpoints.liveservice, {
		fixture: 'service.live.info.json'
	});
	cy.intercept('POST', config.endpoints.rocketchatAccessToken, {
		fixture: 'api.v1.login.json'
	});

	cy.visit('/login.html');

	cy.get('#username').type('username', { force: true });
	cy.get('#passwordInput').type('password', {
		force: true
	});
	cy.get('.button__primary').click();
});
