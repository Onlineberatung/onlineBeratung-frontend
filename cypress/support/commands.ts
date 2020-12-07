import {
	generateSession,
	generateMessage,
	generateMessagesReply
} from './sessions';
import { CyHttpMessages } from 'cypress/types/net-stubbing';
import { UserDataInterface } from '../../src/globalState';
import { config } from '../../src/resources/scripts/config';
import { mockWebSocket } from './websocket';

interface CaritasMockedLoginArgs {
	auth?: {
		expires_in?: number;
		refresh_expires_in?: number;
	};
	userData?: Partial<UserDataInterface>;
	attachmentUpload?: Partial<CyHttpMessages.IncomingResponse>;
	sessions?: any;
	messages?: any;
	userSessionsTimeout?: number;
}

declare global {
	namespace Cypress {
		interface Chainable {
			caritasMockedLogin(
				args?: CaritasMockedLoginArgs
			): Chainable<Element>;
		}
	}
}

Cypress.Commands.add(
	'caritasMockedLogin',
	(args: CaritasMockedLoginArgs = {}) => {
		mockWebSocket();

		cy.fixture('auth.token').then((auth) =>
			cy
				.intercept('POST', config.endpoints.keycloakAccessToken, {
					...auth,
					...args.auth
				})
				.as('authToken')
		);

		cy.intercept('POST', config.endpoints.keycloakLogout, {}).as(
			'authLogout'
		);

		cy.fixture('service.users.data').then((userData) => {
			cy.intercept('GET', config.endpoints.userData, {
				...userData,
				...args.userData
			});
		});

		const sessions = args.sessions || [generateSession()];
		cy.intercept('GET', config.endpoints.userSessions, (req) => {
			return new Promise((resolve) =>
				setTimeout(() => {
					req.reply({ sessions });
					resolve();
				}, args.userSessionsTimeout || 0)
			);
		});

		const messages = args.messages || [
			generateMessage(sessions[0].session.groupId)
		];
		cy.intercept('GET', config.endpoints.messages, (req) => {
			const url = new URL(req.url);

			req.reply(
				generateMessagesReply(
					messages.filter(
						(message) =>
							message.rid === url.searchParams.get('rcGroupId')
					)
				)
			);
		});

		cy.intercept('POST', config.endpoints.messageRead, (req) => {
			sessions.forEach((session) => {
				if (session.session.groupId === req.body.rid) {
					session.session.messagesRead = true;
				}
			});
			req.reply('{}');
		});

		cy.intercept('POST', config.endpoints.rocketchatAccessToken, {
			fixture: 'api.v1.login.json'
		});

		cy.intercept('POST', config.endpoints.rocketchatLogout, {}).as(
			'apiLogout'
		);

		cy.intercept(config.endpoints.liveservice, {});

		cy.intercept('GET', config.endpoints.draftMessages, {});

		cy.intercept('POST', config.endpoints.attachmentUpload, {
			statusCode: 201,
			...args.attachmentUpload
		}).as('attachmentUpload');

		cy.visit('login.html');

		cy.get('#loginRoot');
		cy.get('#username').type('username', { force: true });
		cy.get('#passwordInput').type('password', {
			force: true
		});
		cy.get('.button__primary').click();
		cy.wait('@authToken');
		cy.get('#appRoot').should('be.visible');

		// TODO: give initial app code a chance to run, this should not
		// arbitrarly wait but instead the DOM should have some indication
		// somewhere that the app finished doing all initial work
		return cy.wait(500); // eslint-disable-line cypress/no-unnecessary-waiting
	}
);
