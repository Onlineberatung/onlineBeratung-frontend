import { endpoints } from '../../../../../src/resources/scripts/endpoints';
import { sessionsReply } from '../../../sessions';

const usersSessionsApi = (cy, getWillReturn, setWillReturn) => {
	cy.intercept('GET', `${endpoints.sessionRooms}*`, (req) => {
		const rcGroupId = new URL(req.url).searchParams.get('rcGroupIds');
		const askerSessions = getWillReturn('askerSessions');
		let foundSession = null;
		askerSessions.forEach((session, index) => {
			if (session.session.groupId === rcGroupId) {
				foundSession = session.session;
			}
		});

		const consultantSessions = getWillReturn('consultantSessions');
		consultantSessions.forEach((session, index) => {
			if (session.session.groupId === rcGroupId) {
				foundSession = session.session;
			}
		});

		const data = getWillReturn('sessionRooms');
		data.body.sessions[0].session = {
			...foundSession
		};

		req.reply(data);
	}).as('sessionRooms');

	cy.intercept('GET', endpoints.askerSessions, (req) => {
		const sessionsRes = getWillReturn('askerSessions');
		if (sessionsRes?.statusCode) {
			return req.reply(sessionsRes);
		}

		req.reply({
			sessions: sessionsRes
		});
	}).as('askerSessions');

	cy.intercept('GET', `${endpoints.consultantSessions}*`, (req) => {
		const sessionsRes = getWillReturn('consultantSessions');

		if (sessionsRes?.statusCode) {
			return req.reply(sessionsRes);
		}

		const url = new URL(req.url);
		const offset = parseInt(url.searchParams.get('offset')) || 0;
		const count = parseInt(url.searchParams.get('count')) || 15;

		req.reply(
			sessionsReply({
				sessions: sessionsRes,
				offset,
				count
			})
		);
	}).as('consultantSessions');
};

export default usersSessionsApi;
