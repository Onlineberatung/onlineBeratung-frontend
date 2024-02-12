import { WebSocket, Server, Client } from 'mock-socket';
import { getSessions } from './commands';
import {
	SETTING_E2E_ENABLE,
	SETTING_FILEUPLOAD_MAXFILESIZE,
	SETTING_MESSAGE_MAXALLOWEDSIZE
} from '../../src/api/apiRocketChatSettingsPublic';

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
				if (parsedMessage.msg === 'connect') {
					socket.send(
						JSON.stringify({
							msg: 'connected',
							session: '123'
						})
					);
				} else if (parsedMessage.msg === 'method') {
					switch (parsedMessage.method) {
						case 'login':
							socket.send(
								JSON.stringify({
									id: parsedMessage.id,
									msg: 'result'
								})
							);
							break;
						case 'getUsersOfRoom':
							socket.send(
								JSON.stringify({
									id: parsedMessage.id,
									msg: 'result',
									result: {
										records: [
											{
												_id: 'userId123',
												username: 'enc.usera....',
												status: 'busy',
												_updatedAt: {
													$date: 1674640540785
												}
											},
											{
												_id: 'userId123456',
												username: 'enc.userb....',
												status: 'busy',
												_updatedAt: {
													$date: 1674640540785
												}
											}
										],
										total: 2
									}
								})
							);
							break;
						case 'subscriptions/get':
							socket.send(
								JSON.stringify({
									id: parsedMessage.id,
									msg: 'result',
									result: getSessions().map((session) => ({
										_id: 'bwB9ZKmsiqKSiFYfP',
										open: true,
										alert: false,
										unread: 0,
										userMentions: 0,
										groupMentions: 0,
										ts: {
											$date: 1567766283329
										},
										rid: session.rid,
										name: 'sub1',
										fname: 'sub1',
										customFields: {},
										t: 'p',
										u: {
											_id: 'consultant1',
											username: 'enc.usera....',
											name: 'consultant1'
										},
										_updatedAt: {
											$date: 1650376745838
										},
										ls: {
											$date: 1657781298497
										}
									}))
								})
							);
							break;
						case 'rooms/get':
							socket.send(
								JSON.stringify({
									id: parsedMessage.id,
									msg: 'result',
									result: getSessions().map((session) => ({
										_id: session.rid,
										ts: {
											$date: 1567766364033
										},
										name: 'room1',
										fname: 'room2',
										t: 'p',
										msgs: 34,
										usersCount: 8,
										u: {
											_id: 'consultant1',
											username: 'enc.usera....',
											name: 'consultant1'
										},
										_updatedAt: {
											$date: 1661238537021
										},
										lm: {
											$date: 1607589845901
										},
										lastMessage: {
											_id: 'fPHXFBQpEc2c8WKW3',
											rid: session.rid,
											msg: 'test',
											ts: {
												$date: 1647529088997
											},
											u: {
												_id: 'consultant1',
												username: 'enc.usera....'
											},
											unread: true,
											parseUrls: false,
											groupable: false,
											_updatedAt: {
												$date: 1647529089013
											}
										},
										customFields: {},
										ro: false
									}))
								})
							);
							break;
						case 'getUserRoles':
							socket.send(
								JSON.stringify({
									id: parsedMessage.id,
									msg: 'result',
									result: [
										{
											_id: 'asker1',
											username: 'asker1',
											status: 'busy',
											_updatedAt: {
												$date: 1677018431963
											},
											name: null
										},
										{
											_id: 'consultant1',
											username: 'consultant1',
											status: 'offline',
											name: 'consultant1',
											_updatedAt: {
												$date: 1677016800740
											}
										}
									]
								})
							);
							break;
						case 'public-settings/get':
							socket.send(
								JSON.stringify({
									id: parsedMessage.id,
									msg: 'result',
									result: [
										{
											_id: SETTING_E2E_ENABLE,
											value: true,
											enterprise: false
										},
										{
											_id: SETTING_MESSAGE_MAXALLOWEDSIZE,
											value: 99999999,
											enterprise: false
										},
										{
											_id: SETTING_FILEUPLOAD_MAXFILESIZE,
											value: 99999999,
											enterprise: false
										}
									]
								})
							);
							break;
					}
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
