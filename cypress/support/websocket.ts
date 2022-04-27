import { WebSocket, Server, Client } from 'mock-socket';

declare global {
	interface Window {
		mockStompServer: Server;
		mockStompSocket: WebSocket;
		mockRocketChatServer: Server;
		mockRocketChatSocket: WebSocket;
		clipboardData: any;
		externalApi: any;
		JitsiMeetExternalAPI: any;
	}
}

let mockSocketServer = null;

export const closeWebSocketServer = () => {
	if (mockSocketServer) {
		mockSocketServer.close();
		mockSocketServer = null;
	}
};

export type ExtendedClient = Client & {
	type?: 'Stomp' | 'RC';
};

let subscriptions = {};

export const startWebSocketServer = () => {
	closeWebSocketServer();

	const mockStompURL = Cypress.env('CYPRESS_WS_URL')
		.replace('http://', 'ws://')
		.replace('https://', 'wss://');

	mockSocketServer = new Server(mockStompURL, {
		mock: true
	});

	mockSocketServer.on('connection', (socket: ExtendedClient) => {
		const pathname = new URL(socket.url).searchParams.get('pathname');

		if (pathname.startsWith('/service/live')) {
			socket.type = 'Stomp';
			socket.on('message', (message) => {
				const parsedMessage = JSON.parse(message.toString())[0].split(
					'\n'
				);

				if (parsedMessage[0] === 'CONNECT') {
					socket.send(
						'a["CONNECTED\\nversion:1.2\\nheart-beat:1200000,1200000\\n\\n\\u0000"]'
					);
				} else if (parsedMessage[0] === 'SUBSCRIBE') {
					subscriptions[parsedMessage[2].split(':')[1]] = null;
				}
			});

			socket.send('o');
		} else {
			socket.type = 'RC';
			socket.on('message', (message) => {
				if (typeof message !== 'string') {
					return;
				}

				const parsedMessage = JSON.parse(message);
				if (
					parsedMessage.msg === 'method' &&
					parsedMessage.method === 'login'
				) {
					socket.send(
						JSON.stringify({
							id: parsedMessage.id,
							msg: 'result'
						})
					);
				} else if (
					parsedMessage.msg === 'sub' &&
					parsedMessage.name === 'stream-room-messages'
				) {
					subscriptions[parsedMessage.name] = parsedMessage.params;
				}
			});
		}
	});
};

export const mockWebSocket = () => {
	cy.wrap({
		get: () => subscriptions,
		set: (subs) => (subscriptions = subs)
	}).as('mockSocketServerSubscriptions');

	cy.wrap(() => mockSocketServer).as('mockSocketServer');

	cy.on('window:before:load', (win) => {
		const originWebsocket = win.WebSocket;
		cy.stub(win, 'WebSocket').callsFake((url) => {
			const pathname = new URL(url).pathname;
			let name = null;
			if (pathname.startsWith('/service/live')) {
				name = 'stomp';
			} else if (pathname.startsWith('/websocket')) {
				name = 'rc';
			}

			if (name) {
				const socket = new WebSocket(
					Cypress.env('CYPRESS_WS_URL')
						.replace('http://', 'ws://')
						.replace('https://', 'wss://') +
						'?pathname=' +
						pathname
				);

				socket.addEventListener('open', () => {
					if (socket?.readyState === 1) {
						win.document
							.getElementsByTagName('body')[0]
							.classList.add(`cy-socket-connected-${name}`);
					}
				});

				socket.onclose = () => {
					win.document
						.getElementsByTagName('body')[0]
						.classList.remove(`cy-socket-connected-${name}`);
				};

				socket.onerror = () => {
					win.document
						.getElementsByTagName('body')[0]
						.classList.remove(`cy-socket-connected-${name}`);
				};

				return socket;
			}
			//WDS_SOCKET_PORT
			return new originWebsocket(url);
		});
	});
};
