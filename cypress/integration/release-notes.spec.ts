import { USER_CONSULTANT } from '../support/commands/login';

describe('release-note', () => {
	beforeEach(() => {
		cy.mockApi();
	});

	afterEach(() => {
		cy.clearLocalStorage();
	});

	it('should show the release note overlay immediately but not after reload', () => {
		cy.intercept('GET', '/releases/*', { fixture: 'releaseNote.md' });

		cy.fastLogin({
			username: USER_CONSULTANT
		});
		cy.wait('@consultingTypeServiceBaseBasic');

		cy.get('.releaseNote').should('exist');

		cy.get('.releaseNote .checkbox__label').click();
		cy.get('.releaseNote button').click();

		cy.get('.releaseNote').should('not.exist');

		cy.fastLogin({
			username: USER_CONSULTANT
		});

		cy.get('.releaseNote').should('not.exist');
	});

	it('should show the release note overlay immediately and after reload', () => {
		cy.intercept('GET', '/releases/*', { fixture: 'releaseNote.md' });

		cy.fastLogin({
			username: USER_CONSULTANT
		});
		cy.wait('@consultingTypeServiceBaseBasic');

		cy.get('.releaseNote').should('exist');

		cy.get('.releaseNote button').click();

		cy.get('.releaseNote').should('not.exist');

		cy.fastLogin({
			username: USER_CONSULTANT
		});

		cy.get('.releaseNote').should('exist');
	});

	it('should not show the release note overlay if there is no file', () => {
		cy.intercept('GET', '/releases/*', { statusCode: 404 });

		cy.fastLogin({
			username: USER_CONSULTANT
		});
		cy.wait('@consultingTypeServiceBaseBasic');

		cy.get('.releaseNote').should('not.exist');
	});
});
