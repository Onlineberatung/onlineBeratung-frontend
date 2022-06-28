import { config } from '../../src/resources/scripts/config';
import {
	closeWebSocketServer,
	mockWebSocket,
	startWebSocketServer
} from '../support/websocket';

const checkForGenericRegistrationElements = () => {
	cy.get('#loginLogoWrapper').should('exist');
	cy.get('[data-consultingtype]').should('exist');
	cy.get('.registrationForm__overline').should('exist');
	cy.get('.registrationForm__headline').should('exist');
	cy.get('#username').should('exist');
	cy.get('#passwordInput').should('exist');
	cy.get('#passwordConfirmation').should('exist');
	cy.get('#dataProtectionCheckbox').should('exist');
	cy.get('.button__primary').should('exist');
	cy.get('.stageLayout__toLogin').should('exist');
};

let agencies = [];

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
		it('should have all generic registration page elements', () => {
			cy.visit('/suchtberatung/registration');
			cy.wait('@consultingTypeServiceBySlugFull');
			cy.title().should('be.equal', 'Registrierung Suchtberatung');
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have no password info text', () => {
			cy.visit('/suchtberatung/registration');
			cy.wait('@consultingTypeServiceBySlugFull');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=registration-password-note]').should('not.exist');
		});

		it('should have no agency selection info text', () => {
			cy.visit('/suchtberatung/registration');
			cy.wait('@consultingTypeServiceBySlugFull');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=registration-agency-selection-note]').should(
				'not.exist'
			);
		});
	});

	describe('u25', () => {
		beforeEach(() => {
			cy.fixture('service.agencies.json').then((data) => {
				agencies = data;
				cy.intercept(config.endpoints.agencyServiceBase, data).as(
					'agencies'
				);
			});
		});

		it('should redirect to helpmail when no aid is given', () => {
			// Currently (2021-06-23), 'https://www.u25.de/helpmail/' throws an
			// `Uncaught ReferenceError: setVisitorCookieTimeout is not defined`
			// and causes Cypress to fail the test.
			// As this is outside of our control, we ignore this specific error for now.
			cy.on('uncaught:exception', (error) => {
				if (
					error.message.includes(
						'setVisitorCookieTimeout is not defined'
					)
				) {
					return false;
				}
			});
			cy.visit('/u25/registration');
			cy.wait('@consultingTypeServiceBySlugFull');
			cy.url().should('be.equal', 'https://www.u25.de/helpmail/');
		});

		it('should have all generic registration page elements', () => {
			cy.visit('/u25/registration?aid=1');
			cy.wait('@consultingTypeServiceBySlugFull');
			cy.wait('@agencies');
			cy.title().should(
				'be.equal',
				'Registrierung Beratung für Suizidgefährdete junge Menschen [U25]'
			);
			cy.get('[data-cy=close-welcome-screen]').click();
			checkForGenericRegistrationElements();
		});

		it('should have a password info text', () => {
			cy.visit('/u25/registration?aid=1');
			cy.wait('@consultingTypeServiceBySlugFull');
			cy.wait('@agencies');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=registration-password-note]').should('exist');
		});

		it('should have no agency selection info text', () => {
			cy.visit('/u25/registration?aid=1');
			cy.wait('@consultingTypeServiceBySlugFull');
			cy.wait('@agencies');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=registration-agency-selection-note]').should(
				'not.exist'
			);
		});

		it('should have an agency info when aid is given', () => {
			cy.visit('/u25/registration?aid=1');
			cy.wait('@consultingTypeServiceBySlugFull');
			cy.wait('@agencies');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=show-preselected-agency]').should('exist');
			cy.get('[data-cy=show-preselected-agency]').contains(
				agencies[0].name
			);
		});

		it('should be able to register', () => {
			cy.visit('/u25/registration?aid=1');
			cy.wait('@consultingTypeServiceBySlugFull');
			cy.wait('@agencies');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=show-preselected-agency]').should('exist');
			cy.get('[data-cy=show-preselected-agency]').contains(
				agencies[0].name
			);
			cy.get('input[id="username"]').focus().type('u25-user');
			cy.contains('Weiter').click();
			cy.get('input[id="passwordInput"]').focus().type('Password123!');
			cy.get('input[id="passwordConfirmation"]')
				.focus()
				.type('Password123!');
			cy.get('button:contains("Weiter"):visible').click();
			cy.contains('Alter auswählen*').click();
			cy.get('[id^="react-select"]:contains("unter 12")').click();
			cy.get('button:contains("Weiter"):visible').click();
			cy.contains('Bundesland auswählen*').click();
			cy.get('[id^="react-select"]:contains("Bayern")').click();
			cy.get('#dataProtectionLabel').click();
			cy.contains('Registrieren').should('be.enabled');
		});
	});

	describe('emigration', () => {
		it('should have a agency selection info text', () => {
			cy.visit('/rw-auswanderung/registration');
			cy.wait('@consultingTypeServiceBySlugFull');
			cy.get('[data-cy=close-welcome-screen]').click();
			cy.get('[data-cy=registration-agency-selection-note]').should(
				'exist'
			);
		});
	});
});
