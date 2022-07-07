import { USER_CONSULTANT } from '../support/commands/login';
import {
	closeWebSocketServer,
	mockWebSocket,
	startWebSocketServer
} from '../support/websocket';

describe('release-note', () => {
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

	afterEach(() => {
		cy.clearLocalStorage();
	});

	it('should show the release note overlay immediately but not after reload', () => {
		cy.fixture('releaseNote.md').then((content) => {
			cy.willReturn('releases', {
				body: content,
				statusCode: 200,
				headers: {
					'Content-Type': 'text/markdown'
				}
			});
		});

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
		cy.fixture('releaseNote.md').then((content) => {
			cy.willReturn('releases', {
				body: content,
				statusCode: 200,
				headers: {
					'Content-Type': 'text/markdown'
				}
			});
		});

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
		cy.fastLogin({
			username: USER_CONSULTANT
		});
		cy.wait('@consultingTypeServiceBaseBasic');

		cy.get('.releaseNote').should('not.exist');
	});

	it("should not show the release note overlay if there isn't a markdown", () => {
		cy.fixture('releaseNote.md').then((content) => {
			cy.willReturn('releases', {
				body: '<html></html>',
				statusCode: 200,
				headers: {
					'Content-Type': 'text/text'
				}
			});
		});
		cy.fastLogin({
			username: USER_CONSULTANT
		});
		cy.wait('@consultingTypeServiceBaseBasic');

		cy.get('.releaseNote').should('not.exist');
	});
});
