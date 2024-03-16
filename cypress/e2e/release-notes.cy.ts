import { USER_CONSULTANT } from '../support/commands/mockApi';
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
		mockWebSocket();
	});

	afterEach(() => {
		cy.clearLocalStorage();
	});

	it('should show the release note overlay immediately but not after reload', () => {
		cy.fixture('releases.json').then((content) => {
			cy.willReturn('releases', {
				body: content,
				statusCode: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		});

		cy.fixture('releaseNote.md').then((content) => {
			cy.willReturn('releases_markup', {
				body: content,
				statusCode: 200,
				headers: {
					'Content-Type': 'text/markdown'
				}
			});
		});

		cy.fastLogin({
			userId: USER_CONSULTANT
		});
		cy.wait('@releases');
		cy.wait('@releases_markup');

		cy.get('.releaseNote').should('exist');

		cy.get('.releaseNote .checkbox__label').click();
		cy.get('.releaseNote button').click();

		cy.get('.releaseNote').should('not.exist');

		cy.fastLogin({
			userId: USER_CONSULTANT
		});

		cy.get('.releaseNote').should('not.exist');
	});

	it('should show the release note overlay immediately and after reload', () => {
		cy.fixture('releases.json').then((content) => {
			cy.willReturn('releases', {
				body: content,
				statusCode: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		});

		cy.fixture('releaseNote.md').then((content) => {
			cy.willReturn('releases_markup', {
				body: content,
				statusCode: 200,
				headers: {
					'Content-Type': 'text/markdown'
				}
			});
		});

		cy.fastLogin({
			userId: USER_CONSULTANT
		});
		cy.wait('@releases');
		cy.wait('@releases_markup');

		cy.get('.releaseNote').should('exist');

		cy.get('.releaseNote button').click();

		cy.get('.releaseNote').should('not.exist');

		cy.fastLogin({
			userId: USER_CONSULTANT
		});

		cy.get('.releaseNote').should('exist');
	});

	it('should not show the release note overlay if there is no file', () => {
		cy.fastLogin({
			userId: USER_CONSULTANT
		});

		cy.get('.releaseNote').should('not.exist');
	});
});
