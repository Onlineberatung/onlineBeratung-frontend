import { config } from '../../src/resources/scripts/config';

describe('registration', () => {
	describe('u25', () => {
		it('should have a password reset info text', () => {
			cy.visit('/registration.u25.html?aid=1');
			cy.get('.registration__passwordNote').should('exist');
		});

		it('should have an agency info when aid is given', () => {
			cy.fixture('service.agencies.json').then((agencies) => {
				cy.intercept(config.endpoints.agencyServiceBase, agencies);
				cy.visit('/registration.u25.html?aid=1');
				cy.get('.registration__agencyInfo').should('exist');
				cy.get('.formWrapper__infoText').contains(agencies[0].name);
			});
		});
	});

	describe('Suchtberatung', () => {
		it('should have no password reset info text', () => {
			cy.visit('/registration.suchtberatung.html');
			cy.get('.registration__passwordNote').should('not.exist');
		});
	});
});
