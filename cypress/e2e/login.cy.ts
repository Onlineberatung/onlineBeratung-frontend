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
		mockWebSocket();
	});

	it('should be able to login', () => {
		cy.login();

		cy.get('#appRoot').should('exist');
	});

	it.skip('displays the login at the root', () => {
		cy.visit('/');
		cy.contains('Login');
		cy.contains('Impressum');
		cy.contains('Datenschutzerklärung');
	});

	it('displays the consultingtype page at the root', () => {
		cy.visit('/');
		cy.contains('Willkommen bei der Online-Beratung');
	});

	it('displays the login for resorts', () => {
		cy.visit('/suchtberatung');
		cy.contains('Login');
	});
});
