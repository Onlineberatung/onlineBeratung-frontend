import { CyHttpMessages } from 'cypress/types/net-stubbing';
import { WebSocket, Server } from 'mock-socket';
import { UserDataInterface } from '../../src/globalState';
import { config } from '../../src/resources/scripts/config';

interface CaritasMockedLoginArgs {
	auth?: {
		expires_in?: number;
		refresh_expires_in?: number;
	};
	userData?: Partial<UserDataInterface>;
	attachmentUpload?: Partial<CyHttpMessages.IncomingResponse>;
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

afterEach(() => {
	// TODO: remove those temporary workarounds
	// See:
	// - https://github.com/cypress-io/cypress/issues/9170
	// - https://github.com/cypress-io/cypress/issues/9362
	// - https://github.com/cypress-io/cypress/issues/8926
	cy.window().then((win) => (win.location.href = 'about:blank'));
	cy.clearCookies();
});

Cypress.Commands.add(
	'caritasMockedLogin',
	(args: CaritasMockedLoginArgs = {}) => {
		let mockStompServer;
		let mockRCServer;
		cy.on('window:before:load', (win) => {
			const winWebSocket = win.WebSocket;
			cy.stub(win, 'WebSocket').callsFake((url) => {
				// TODO: "/service/live" & "/websocket" should be synced with config, but the
				// config hardcodes the http protocol in development
				if (new URL(url).pathname.startsWith('/service/live')) {
					// stomp mock
					if (mockStompServer) {
						mockStompServer.stop();
					}

					let stompConnected = false;
					mockStompServer = new Server(url);
					mockStompServer.on('connection', (socket) => {
						socket.on('message', () => {
							if (!stompConnected) {
								socket.send(
									'a["CONNECTED\nversion:1.2\nheart-beat:600000,600000\n\n\u0000"]'
								);
								stompConnected = true;
							}
						});

						socket.send('o');
					});
					return new WebSocket(url);
				} else if (new URL(url).pathname.startsWith('/websocket')) {
					// rocketchat mock
					if (mockRCServer) {
						mockRCServer.stop();
					}
					mockRCServer = new Server(url);

					return new WebSocket(url);
				} else {
					return new winWebSocket(url);
				}
			});
		});

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
		cy.intercept('GET', config.endpoints.userSessions, {
			fixture: 'service.users.sessions.askers.json'
		});
		cy.intercept('GET', `${config.endpoints.liveservice}/**/*`, {
			fixture: 'service.live.info.json'
		});
		cy.intercept('POST', config.endpoints.rocketchatAccessToken, {
			fixture: 'api.v1.login.json'
		});
		cy.intercept('POST', config.endpoints.rocketchatLogout, {}).as(
			'apiLogout'
		);
		cy.intercept('POST', config.endpoints.liveservice, {});
		cy.intercept('GET', config.endpoints.liveservice, {});
		cy.intercept('GET', config.endpoints.draftMessages, {});
		cy.intercept('GET', config.endpoints.messages, {
			fixture: 'service.messages.json'
		});
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
		cy.get('#appRoot').should('exist');
	}
);
