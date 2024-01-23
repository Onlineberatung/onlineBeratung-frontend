import { v4 as uuid } from 'uuid';
import { Server } from 'mock-socket';
import { ExtendedClient } from '../websocket';

const waitForSubscriptions = (getSubscriptions, events: string[]) => {
	let subscribed = true;
	events.forEach((event) => {
		if (!getSubscriptions().hasOwnProperty(event)) {
			subscribed = false;
		}
	});

	if (!subscribed) {
		setTimeout(() => {
			waitForSubscriptions(getSubscriptions, events);
		}, 250);
	}
};

Cypress.Commands.add('waitForSubscriptions', (events: string[]) => {
	cy.get<any>('@mockSocketServerSubscriptions').then(
		({ get: getSubscriptions }) => {
			waitForSubscriptions(getSubscriptions, events);
		}
	);
});

Cypress.Commands.add('emitDirectMessage', (index?: number) => {
	new Cypress.Promise((resolve) => {
		cy.askerSession({ session: { messagesRead: false } }, index || 0);
		cy.addMessage({}, index || 0);

		cy.get<() => Server>('@mockSocketServer').then((mockSocketServer) => {
			cy.get('@mockSocketServerSubscriptions').then(
				({ get: getSubscriptions }) => {
					const subscriptions = getSubscriptions();
					mockSocketServer()
						.clients()
						.forEach((client: ExtendedClient) => {
							if (client.type === 'Stomp') {
								client.send(
									`a["MESSAGE\\ndestination:/user/events\\ncontent-type:application/json\\nsubscription:sub-0\\nmessage-id:${uuid()}\\ncontent-length:29\\n\\n{\\"eventType\\":\\"directMessage\\"}\\u0000"]`
								);
							} else if (client.type === 'RC') {
								client.send(
									JSON.stringify({
										msg: 'changed',
										collection: 'stream-room-messages',
										fields: {
											args: [{}],
											eventName:
												subscriptions[
													'stream-room-messages'
												][0]
										}
									})
								);
							}
						});

					resolve();
				}
			);
		});
	});
});

Cypress.Commands.add('emitVideoCallRequest', () => {
	new Cypress.Promise((resolve) => {
		cy.get<() => Server>('@mockSocketServer').then((mockSocketServer) => {
			mockSocketServer()
				.clients()
				.forEach((client: ExtendedClient) => {
					if (client.type === 'Stomp') {
						client.send(
							`a["MESSAGE\\ndestination:/user/events\\ncontent-type:application/json\\nsubscription:sub-0\\nmessage-id::${uuid()}\\ncontent-length:260\\n\\n{\\"eventType\\":\\"videoCallRequest\\",\\"eventContent\\":{\\"videoCallUrl\\":\\"https://localhost:8443/5db43632-8283-445b-9f20-4d69954727bf\\",\\"initiatorUsername\\":\\"enc.ouzdk3lbnfxa....\\",\\"initiatorRcUserId\\":\\"WXR5RAwbotmd4NPer\\",\\"rcGroupId\\":\\"${uuid()}\\"}}\\u0000"]`
						);
					}
				});

			resolve();
		});
	});
});
