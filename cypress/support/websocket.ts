import { v4 as uuid } from 'uuid';
import { WebSocket, Server } from 'mock-socket';

declare global {
	interface Window {
		mockStompServer: Server;
		mockStompSocket: WebSocket;
		mockRocketChatServer: Server;
		mockRocketChatSocket: WebSocket;
	}
}

const mocks: { [key: string]: { server: Server; websocket: WebSocket } } = {};

const cleanupMock = (url: string) => {
	if (mocks[url]) {
		mocks[url].websocket.close();
		mocks[url].server.stop();
		delete mocks[url];
	}
};

const createMock = (url: string) => {
	cleanupMock(url);
	const server = new Server(url);
	const websocket = new WebSocket(url);
	mocks[url] = { server, websocket };

	return mocks[url];
};

export const mockWebSocket = () => {
	cy.on('window:before:load', (win) => {
		const winWebSocket = win.WebSocket;
		cy.stub(win, 'WebSocket').callsFake((url) => {
			// TODO: "/service/live" & "/websocket" should be synced with config, but the
			// config hardcodes the http protocol in development
			if (new URL(url).pathname.startsWith('/service/live')) {
				// stomp mock
				const { server, websocket } = createMock(url);

				win.mockStompServer = server;
				win.mockStompServer.on('connection', (socket) => {
					win.mockStompSocket = socket;

					socket.on('message', (message) => {
						const parsedMessage = JSON.parse(
							message.toString()
						)[0].split('\n');

						if (parsedMessage[0] === 'CONNECT') {
							socket.send(
								'a["CONNECTED\\nversion:1.2\\nheart-beat:1200000,1200000\\n\\n\\u0000"]'
							);
						}
					});

					socket.send('o');
				});

				return websocket;
			} else if (new URL(url).pathname.startsWith('/websocket')) {
				// rocketchat mock
				const { server, websocket } = createMock(url);

				win.mockRocketChatServer = server;
				win.mockRocketChatServer.on('connection', (socket) => {
					win.mockRocketChatSocket = socket;
				});

				return websocket;
			} else {
				return new winWebSocket(url);
			}
		});
	});

	cy.on('window:before:unload', () => {
		for (const url in mocks) {
			cleanupMock(url);
		}
	});
};

export const emitStompDirectMessage = ({
	messageId
}: { messageId?: string } = {}) => {
	cy.window().then((win) => {
		win.mockStompSocket.send(
			`a["MESSAGE\\ndestination:/user/events\\ncontent-type:application/json\\nsubscription:sub-0\\nmessage-id:${
				messageId || uuid()
			}\\ncontent-length:29\\n\\n{\\"eventType\\":\\"directMessage\\"}\\u0000"]`
		);
	});

	// TODO: wait for the app to process the messages. this should not
	// arbitrarily wait for the message to get processed but use some reliable
	// indication from the app instead
	return cy.wait(500); // eslint-disable-line cypress/no-unnecessary-waiting
};

export const emitStompVideoCallRequest = () => {
	cy.window().then((win) => {
		win.mockStompSocket.send(
			`a["MESSAGE\\ndestination:/user/events\\ncontent-type:application/json\\nsubscription:sub-0\\nmessage-id::${uuid()}\\ncontent-length:260\\n\\n{\\"eventType\\":\\"videoCallRequest\\",\\"eventContent\\":{\\"videoCallUrl\\":\\"https://localhost:8443/5db43632-8283-445b-9f20-4d69954727bf\\",\\"initiatorUsername\\":\\"enc.ouzdk3lbnfxa....\\",\\"initiatorRcUserId\\":\\"WXR5RAwbotmd4NPer\\",\\"rcGroupId\\":\\"${uuid()}\\"}}\\u0000"]`
		);
	});

	// TODO: wait for the app to process the messages. this should not
	// arbitrarily wait for the message to get processed but use some reliable
	// indication from the app instead
	return cy.wait(500); // eslint-disable-line cypress/no-unnecessary-waiting
};
