import {
	generateAskerSession,
	generateMessage,
	generateMessagesReply,
	generateConsultantSession
} from './sessions';
import { CyHttpMessages } from 'cypress/types/net-stubbing';
import { config } from '../../src/resources/scripts/config';
import { mockWebSocket } from './websocket';
import { UserDataInterface } from '../../src/globalState';

interface CaritasMockedLoginArgs {
	type?: 'asker' | 'consultant';
	auth?: {
		expires_in?: number;
		refresh_expires_in?: number;
	};
	// TODO: why is this type not available in userservice's openapi spec?
	userData?: Partial<UserDataInterface>;
	attachmentUpload?: Partial<CyHttpMessages.IncomingResponse>;
	sessions?:
		| UserService.Schemas.UserSessionResponseDTO[]
		| UserService.Schemas.ConsultantSessionResponseDTO[];
	messages?: MessageService.Schemas.MessagesDTO[];
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

		let sessions: CaritasMockedLoginArgs['sessions'];

		if (!args.type || args.type === 'asker') {
			cy.fixture('service.users.data.askers').then((userData) => {
				cy.intercept('GET', config.endpoints.userData, {
					...userData,
					...args.userData
				});
			});

			sessions = args.sessions || [generateAskerSession()];
			cy.intercept('GET', config.endpoints.userSessions, (req) => {
				return new Promise((resolve) =>
					setTimeout(() => {
						req.reply({
							sessions
						});
						resolve();
					}, args.userSessionsTimeout || 0)
				);
			});
		}

		if (args.type === 'consultant') {
			cy.fixture('service.users.data.consultants').then((userData) => {
				cy.intercept('GET', config.endpoints.userData, {
					...userData,
					...args.userData
				});
			});

			sessions = args.sessions || [
				generateConsultantSession(),
				generateConsultantSession(),
				generateConsultantSession()
			];
			cy.intercept('GET', config.endpoints.userSessions, (req) => {
				return new Promise((resolve) =>
					setTimeout(() => {
						req.reply({
							sessions
						});
						resolve();
					}, args.userSessionsTimeout || 0)
				);
			});
		}

		cy.intercept('GET', `${config.endpoints.sessions}*`, (req) => {
			const url = new URL(req.url);

			const offset = parseInt(url.searchParams.get('offset')) || 0;
			const count = parseInt(url.searchParams.get('count')) || 15;
			const _sessions = sessions.slice(offset, offset + count);

			return new Promise((resolve) =>
				setTimeout(() => {
					req.reply({
						sessions: _sessions,
						offset,
						count,
						total: sessions.length
					});
					resolve();
				}, args.userSessionsTimeout || 0)
			);
		});

		const messages = args.messages || [
			generateMessage({ rcGroupId: sessions[0].session.groupId })
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
