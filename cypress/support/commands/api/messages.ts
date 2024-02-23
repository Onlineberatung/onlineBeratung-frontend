/*
/service/users/consultants/adsf-asdf-asdf
 */
import { endpoints } from '../../../../src/resources/scripts/endpoints';
import { generateMessagesReply } from '../../sessions';
import { getMessages } from '../helper/messages';

const messagesApi = (cy, getWillReturn, setWillReturn) => {
	cy.intercept('GET', endpoints.draftMessages, {}).as('draftMessages');

	cy.intercept('GET', `${endpoints.messages.get}*`, (req) => {
		const messages = getWillReturn['messages'];
		if (messages) {
			return req.reply(messages);
		}

		const url = new URL(req.url);

		req.reply(
			generateMessagesReply(
				getMessages().filter(
					(message) =>
						message.rid === url.searchParams.get('rcGroupId')
				)
			)
		);
	}).as('messages');
};

export default messagesApi;
