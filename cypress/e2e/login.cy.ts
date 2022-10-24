import {
	closeWebSocketServer,
	mockWebSocket,
	startWebSocketServer
} from '../support/websocket';

describe('Login', () => {
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

	it('should be able to login', () => {
		cy.login();

		cy.get('#appRoot').should('exist');
	});

	it('displays the login at the root', () => {
		cy.visit('/');
		cy.contains('Login');
		cy.contains('Impressum')
			.closest('a')
			.should('have.attr', 'href', 'https://www.caritas.de/impressum');
		cy.contains('Datenschutzerklärung')
			.closest('a')
			.should(
				'have.attr',
				'href',
				'https://www.caritas.de/hilfeundberatung/onlineberatung/datenschutz'
			);
	});

	it('displays the login for resorts', () => {
		cy.visit('/suchtberatung');
		cy.contains('Login');
	});
});
