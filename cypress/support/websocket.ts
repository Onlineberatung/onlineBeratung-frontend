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

const mocks: { [key: string]: Server } = {};

export const mockWebSocket = () => {
	cy.on('window:before:load', (win) => {
		const winWebSocket = win.WebSocket;
		cy.stub(win, 'WebSocket').callsFake((url) => {
			// TODO: "/service/live" & "/websocket" should be synced with config, but the
			// config hardcodes the http protocol in development
			if (new URL(url).pathname.startsWith('/service/live')) {
				// stomp mock
				if (mocks[url]) {
					mocks[url].stop();
					delete mocks[url];
				}

				win.mockStompServer = new Server(url);
				mocks[url] = win.mockStompServer;

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

				return new WebSocket(url);
			} else if (new URL(url).pathname.startsWith('/websocket')) {
				// rocketchat mock
				if (mocks[url]) {
					mocks[url].stop();
					delete mocks[url];
				}

				win.mockRocketChatServer = new Server(url);
				mocks[url] = win.mockRocketChatServer;
				win.mockRocketChatServer.on('connection', (socket) => {
					win.mockRocketChatSocket = socket;
				});

				return new WebSocket(url);
			} else {
				return new winWebSocket(url);
			}
		});
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
