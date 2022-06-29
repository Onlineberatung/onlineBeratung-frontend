import {
	generateAskerSession,
	generateConsultantSession,
	generateMessagesReply,
	sessionsReply
} from '../sessions';
import { config } from '../../../src/resources/scripts/config';
import {
	getAskerSessions,
	setAskerSessions,
	updateAskerSession
} from './askerSessions';
import {
	getConsultantSessions,
	setConsultantSessions,
	updateConsultantSession
} from './consultantSessions';
import { LoginArgs, USER_ASKER } from './login';
import { deepMerge } from '../helpers';
import { decodeUsername } from '../../../src/utils/encryptionHelpers';
import { getMessages, setMessages } from './messages';
import apiAppointments from './api/appointments';
import apiVideocalls from './api/videocalls';

let overrides = {};

const defaultReturns = {
	attachmentUpload: {
		statusCode: 201
	},
	userData: {},
	consultingTypes: [],
	releases: {
		statusCode: 404
	}
};

Cypress.Commands.add('willReturn', (name: string, data: any) => {
	overrides[name] = data;
});

let username = null;

Cypress.Commands.add('mockApi', () => {
	// Empty overrides
	overrides = {};

	setAskerSessions([]);
	cy.askerSession(generateAskerSession());

	setConsultantSessions([]);
	cy.consultantSession(generateConsultantSession());
	cy.consultantSession(generateConsultantSession());
	cy.consultantSession(generateConsultantSession());

	setMessages([]);
	cy.addMessage({}, 0);
	cy.addMessage({}, 1);
	cy.addMessage({}, 2);

	// ConsultingTypes
	cy.fixture('service.consultingtypes.emigration.json').then(
		(consultingType) => {
			defaultReturns['consultingTypes'].push(consultingType);
		}
	);
	cy.fixture('service.consultingtypes.addiction.json').then(
		(consultingType) => {
			defaultReturns['consultingTypes'].push(consultingType);
		}
	);
	cy.fixture('service.consultingtypes.pregnancy.json').then(
		(consultingType) => {
			defaultReturns['consultingTypes'].push(consultingType);
		}
	);
	cy.fixture('service.consultingtypes.u25.json').then((consultingType) => {
		defaultReturns['consultingTypes'].push(consultingType);
	});

	cy.fixture('api.v1.login').then((data) => {
		cy.intercept('POST', config.endpoints.rocketchatAccessToken, (req) => {
			username = decodeUsername(req.body.username);
			req.reply(
				deepMerge(data, {
					data: { userId: decodeUsername(req.body.username) }
				})
			);
		});
	});

	cy.fixture('auth.token').then((auth) => {
		defaultReturns['auth'] = auth;
	});

	cy.fixture('service.users.data.consultants').then((usersData) => {
		usersData.forEach((userData) => {
			defaultReturns['userData'][userData.userId] = userData;
		});
	});
	cy.fixture('service.users.data.askers').then((userData) => {
		defaultReturns['userData'][USER_ASKER] = userData;
	});

	cy.intercept('GET', `${config.endpoints.consultantSessions}*`, (req) => {
		if (overrides['consultantSessions']) {
			return req.reply(overrides['consultantSessions']);
		}

		const url = new URL(req.url);

		const offset = parseInt(url.searchParams.get('offset')) || 0;
		const count = parseInt(url.searchParams.get('count')) || 15;

		req.reply(
			sessionsReply({
				sessions: getConsultantSessions(),
				offset,
				count
			})
		);
	}).as('consultantSessions');

	cy.intercept('GET', config.endpoints.askerSessions, (req) => {
		if (overrides['askerSessions']) {
			return req.reply(overrides['askerSessions']);
		}

		req.reply({
			sessions: getAskerSessions()
		});
	}).as('askerSessions');

	cy.intercept('GET', config.endpoints.messages, (req) => {
		if (overrides['messages']) {
			return req.reply(overrides['messages']);
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

	cy.intercept('POST', config.endpoints.messageRead, (req) => {
		getAskerSessions().forEach((session, index) => {
			if (session.session.groupId === req.body.rid) {
				updateAskerSession({ session: { messagesRead: true } }, index);
			}
		});

		getConsultantSessions().forEach((session, index) => {
			if (session.session.groupId === req.body.rid) {
				updateConsultantSession(
					{ session: { messagesRead: true } },
					index
				);
			}
		});

		req.reply('{}');
	}).as('sessionRead');

	cy.intercept('GET', `${config.endpoints.consultantEnquiriesBase}*`, {}).as(
		'consultantEnquiriesBase'
	);

	cy.intercept('POST', config.endpoints.keycloakLogout, {}).as('authLogout');

	cy.intercept('POST', config.endpoints.rocketchatLogout, {}).as('apiLogout');

	cy.intercept(`${config.endpoints.liveservice}/**/*`, {
		entropy: -1197552011,
		origins: ['*:*'],
		cookie_needed: false,
		websocket: true
	});

	cy.intercept('GET', config.endpoints.draftMessages, {}).as('draftMessages');

	cy.intercept('POST', config.endpoints.startVideoCall, {
		fixture: 'service.videocalls.new'
	}).as('startVideoCall');

	cy.intercept('POST', config.endpoints.rejectVideoCall, {}).as(
		'rejectVideoCall'
	);

	cy.intercept('POST', config.endpoints.attachmentUpload, (req) =>
		req.reply({
			...defaultReturns['attachmentUpload'],
			...(overrides['attachmentUpload'] || {})
		})
	).as('attachmentUpload');

	cy.intercept('POST', config.endpoints.keycloakAccessToken, (req) => {
		req.reply({
			...defaultReturns['auth'],
			...(overrides['auth'] || {})
		});
	}).as('authToken');

	cy.intercept('GET', config.endpoints.userData, (req) => {
		req.reply({
			...defaultReturns['userData'][username],
			...(overrides['userData'] || {})
		});
	}).as('usersData');

	cy.intercept(
		`${config.endpoints.consultingTypeServiceBase}/byslug/*/full`,
		(req) => {
			const slug = new URL(req.url).pathname.split('/')[4];

			req.reply({
				...(defaultReturns['consultingTypes'].find(
					(consultingType) => consultingType.slug === slug
				) || {}),
				...(overrides['consultingType'] || {})
			});
		}
	).as('consultingTypeServiceBySlugFull');

	cy.intercept(
		`${config.endpoints.consultingTypeServiceBase}/*/full`,
		(req) => {
			const id = parseInt(new URL(req.url).pathname.split('/')[3]);

			req.reply({
				...(defaultReturns['consultingTypes'].find(
					(consultingType) => consultingType.id === id
				) || {}),
				...(overrides['consultingType'] || {})
			});
		}
	).as('consultingTypeServiceBaseFull');

	cy.intercept(
		`${config.endpoints.consultingTypeServiceBase}/basic`,
		(req) => {
			req.reply([
				...defaultReturns['consultingTypes'],
				...(overrides['consultingTypes'] || [])
			]);
		}
	).as('consultingTypeServiceBaseBasic');

	cy.intercept('GET', '/releases/*', (req) => {
		req.reply({
			...defaultReturns['releases'],
			...(overrides['releases'] || {})
		});
	}).as('releases');

	apiAppointments(cy);
	apiVideocalls(cy);
});

Cypress.Commands.add(
	'fastLogin',
	(
		args: LoginArgs = {
			username: USER_ASKER
		}
	) => {
		username = args.username || USER_ASKER;

		cy.fixture('api.v1.login').then((res) => {
			if (res.data.authToken) {
				cy.setCookie('rc_token', res.data.authToken);
			}
			if (res.data.userId) {
				cy.setCookie('rc_uid', res.data.userId);
			}
		});

		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		window.localStorage.setItem(
			'auth.access_token_valid_until',
			tomorrow.getTime().toString()
		);
		window.localStorage.setItem(
			'auth.refresh_token_valid_until',
			tomorrow.getTime().toString()
		);

		cy.visit('/app');
		cy.wait('@usersData');
		if (username === USER_ASKER) {
			cy.wait('@askerSessions');
		} else {
			cy.wait('@consultantEnquiriesBase');
		}
	}
);
