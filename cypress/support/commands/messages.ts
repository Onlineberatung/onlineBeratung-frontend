import { generateMessage } from '../sessions';
import { getAskerSessions } from './askerSessions';
import { getConsultantSessions } from './consultantSessions';

export let messages = [];

export const getMessages = () => messages;
export const setMessages = (data) => (messages = data);

export const addMessage = (
	props: { [key: string]: any },
	index: number = 0
) => {
	const askerSessions = getAskerSessions();
	if (askerSessions?.[index]) {
		messages.push(
			generateMessage({
				...props,
				rcGroupId: askerSessions[index].session.groupId
			})
		);
	}

	const consultantSession = getConsultantSessions();
	if (consultantSession?.[index]) {
		messages.push(
			generateMessage({
				...props,
				rcGroupId: consultantSession[index].session.groupId
			})
		);
	}
};

Cypress.Commands.add(
	'addMessage',
	(props: { [key: string]: any } = {}, index?: number) =>
		new Cypress.Promise((resolve) => {
			addMessage(props, index);
			resolve(undefined);
		})
);
