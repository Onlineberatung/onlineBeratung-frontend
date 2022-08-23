import { config } from '../../src/resources/scripts/config';
import {
	closeWebSocketServer,
	mockWebSocket,
	startWebSocketServer
} from '../support/websocket';

describe('registration', () => {
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

	describe('addiction', () => {
		beforeEach(() => {
			cy.intercept(config.endpoints.topicsData, [
				{
					id: 1,
					name: 'Alkohol'
				}
			]);
		});

		it('should have all generic registration page elements', () => {
			cy.visit('/suchtberatung/registration');
			cy.wait('@consultingTypeServiceBySlugFull');
			cy.get('[data-cy="close-welcome-screen"]').click();

			cy.get('.registrationFormDigi__Input').should('exist');
			cy.get('input[name="gender"]').should('exist');
			cy.get('input[name="counsellingRelation"]').should('exist');
			cy.get(
				'.registrationFormDigi__InputTopicIdsContainer input'
			).should('exist');
			cy.get('#username').should('exist');
			cy.get('#passwordInput').should('exist');
			cy.get('#passwordConfirmation').should('exist');
			cy.get('.button__primary').should('exist');
			cy.get('.stageLayout__toLogin').should('exist');
		});
	});
});
