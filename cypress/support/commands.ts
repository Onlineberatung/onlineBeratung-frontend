import { WebSocket, Server } from 'mock-socket';
import { config } from '../../src/resources/scripts/config';

interface CaritasMockedLoginArgs {
	auth?: {
		expires_in?: number;
		refresh_expires_in?: number;
	};
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
	// TODO: remove this temporary workarounds
	// See:
	// - https://github.com/cypress-io/cypress/issues/9170
	// - https://github.com/cypress-io/cypress/issues/9362
	// - https://github.com/cypress-io/cypress/issues/8926
	cy.clearCookies();
	cy.window().then((win) => (win.location.href = 'about:blank'));
});

Cypress.Commands.add(
	'caritasMockedLogin',
	(args: CaritasMockedLoginArgs = {}) => {
		// stomp mock
		let mockServer;
		cy.on('window:before:load', (win) => {
			const winWebSocket = win.WebSocket;
			cy.stub(win, 'WebSocket').callsFake((url) => {
				// TODO: "/service/live" should be synced with config, but the
				// config hardcodes the http protocol in development
				if (new URL(url).pathname.startsWith('/service/live')) {
					if (mockServer) {
						mockServer.stop();
					}

					let stompConnected = false;
					mockServer = new Server(url);
					mockServer.on('connection', (socket) => {
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
		cy.intercept('GET', config.endpoints.userData, {
			fixture: 'service.users.data.json'
		});
		cy.intercept('GET', config.endpoints.userSessions, {
			fixture: 'service.users.sessions.askers.json'
		});
		cy.intercept('GET', config.endpoints.liveservice, {
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

		cy.visit('login.html');

		cy.get('#loginRoot');
		cy.get('#username').type('username', { force: true });
		cy.get('#passwordInput').type('password', {
			force: true
		});
		cy.get('.button__primary').click();
		cy.wait('@authToken');
		cy.get('#appRoot');
	}
);
