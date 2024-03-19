import {
	closeWebSocketServer,
	mockWebSocket,
	startWebSocketServer
} from '../../../../cypress/support/websocket';
import { config } from '../../resources/scripts/config';

describe('Login', () => {
	before(() => {
		startWebSocketServer();
	});

	after(() => {
		closeWebSocketServer();
	});

	beforeEach(() => {
		cy.willReturn('frontend.settings', config);
		mockWebSocket();
	});

	it('should be able to login', () => {
		cy.login();

		cy.get('#appRoot').should('exist');
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
