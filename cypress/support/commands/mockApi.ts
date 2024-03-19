import merge from 'lodash.merge';
import { generateAskerSession, generateConsultantSession } from '../sessions';
import { endpoints } from '../../../src/resources/scripts/endpoints';
import { setAskerSessions } from './helper/askerSessions';
import { setConsultantSessions } from './helper/consultantSessions';
import { setMessages } from './helper/messages';
import { config } from '../../../src/resources/scripts/config';
import usersChatApi from './api/users/chat';
import usersConsultantsApi from './api/users/consultants';
import usersDataApi from './api/users/data';
import usersSessionsApi from './api/users/sessions';
import apiAgencies from './api/agencies';
import apiAppointments from './api/appointments';
import apiConsultingTypes from './api/consultTypes';
import apiMessages from './api/messages';
import apiRc from './api/rc';
import apiUploads from './api/uploads';
import apiVideocalls from './api/videocalls';
import loginCommand from './helper/login';
import fastLoginCommand from './helper/fastLogin';
import askerSessionsCommand from './helper/askerSessions';
import consultantSessionsCommand from './helper/consultantSessions';
import messagesCommand from './helper/messages';
import apiTopics from './api/topic';

let overrides = {};

const defaultReturns = {
	'attachmentUpload': {
		statusCode: 201
	},
	'userData': {
		emailToggles: [
			{
				name: 'DAILY_ENQUIRY',
				state: true
			},
			{
				name: 'NEW_CHAT_MESSAGE_FROM_ADVICE_SEEKER',
				state: false
			},
			{
				name: 'NEW_FEEDBACK_MESSAGE_FROM_ADVICE_SEEKER',
				state: false
			}
		]
	},
	'agencies': [],
	'consultingTypes': [],
	'settings': {},
	'service.tenant.public': {},
	'releases': {
		statusCode: 404
	},
	'releases_markup': {
		statusCode: 404
	},
	'sessionRooms': {
		statusCode: 200,
		body: {
			sessions: []
		}
	},
	'frontend.settings': config,
	'agencyConsultants': [],
	'agencyConsultantsLanguages': ['de'],
	'messages': []
};

const setWillReturn = (name: string, data: any, mergeData: boolean = false) => {
	if (mergeData) {
		overrides[name] = merge(
			Array.isArray(overrides[name] || defaultReturns[name]) ? [] : {},
			overrides[name] || defaultReturns[name] || {},
			data || {}
		);
		return;
	}

	overrides[name] = data;
};

Cypress.Commands.add(
	'willReturn',
	(name: string, data?: any, mergeData: boolean = false) =>
		data === undefined
			? getWillReturn(name)
			: setWillReturn(name, data, mergeData)
);

const getWillReturn = (name: string) => {
	return overrides[name] || defaultReturns[name] || null;
};

loginCommand(getWillReturn, setWillReturn);
fastLoginCommand(getWillReturn, setWillReturn);
consultantSessionsCommand(getWillReturn, setWillReturn);
askerSessionsCommand(getWillReturn, setWillReturn);
messagesCommand(getWillReturn, setWillReturn);

Cypress.Commands.add('mockApi', () => {
	// Empty overrides
	overrides = {};
	defaultReturns['messages'] = [];

	// Generate 1 default sessions
	setAskerSessions([]);
	cy.askerSession(generateAskerSession());

	// Generate 3 default sessions
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
			overrides['consultingTypes'] = [
				...(overrides['consultingTypes'] || []),
				consultingType
			];
		}
	);
	cy.fixture('service.consultingtypes.addiction.json').then(
		(consultingType) => {
			overrides['consultingTypes'] = [
				...(overrides['consultingTypes'] || []),
				consultingType
			];
		}
	);
	cy.fixture('service.consultingtypes.pregnancy.json').then(
		(consultingType) => {
			overrides['consultingTypes'] = [
				...(overrides['consultingTypes'] || []),
				consultingType
			];
		}
	);
	cy.fixture('service.consultingtypes.u25.json').then((consultingType) => {
		overrides['consultingTypes'] = [
			...(overrides['consultingTypes'] || []),
			consultingType
		];
	});

	cy.fixture('service.users.sessions.room.json').then((session) => {
		const rooms = defaultReturns['sessionRooms'];
		rooms.body.sessions.push(session);
		overrides['sessionRooms'] = rooms;
	});

	cy.fixture('service.agency.consultants.json').then((agencyConsultants) => {
		overrides['agencyConsultants'] = agencyConsultants;
	});

	cy.fixture('auth.token').then((auth) => {
		overrides['auth'] = auth;
	});

	cy.intercept('GET', `${endpoints.consultantEnquiriesBase}*`, {}).as(
		'consultantEnquiriesBase'
	);

	cy.intercept('POST', endpoints.keycloakLogout, {}).as('authLogout');

	cy.intercept('GET', endpoints.frontend.settings, (req) =>
		req.reply(JSON.stringify(getWillReturn('frontend.settings')))
	);

	cy.intercept('POST', endpoints.keycloakLogout, {
		statusCode: 204
	}).as('authLogout');

	cy.intercept(
		`${endpoints.liveservice}/**/*`,
		JSON.stringify({
			entropy: '-1197552011',
			origins: ['*:*'],
			cookie_needed: false,
			websocket: true
		})
	).as('liveService');

	cy.intercept('POST', endpoints.keycloakAccessToken, (req) => {
		req.reply(getWillReturn('auth'));
	}).as('authToken');

	cy.intercept('GET', `${endpoints.serviceSettings}`, (req) => {
		req.reply(JSON.stringify(getWillReturn('settings')));
	}).as('settings');

	cy.intercept('GET', `${endpoints.tenantServiceBase}/public/`, (req) => {
		req.reply(JSON.stringify(getWillReturn('service.tenant.public')));
	}).as('service.tenant.public');

	cy.intercept('GET', '/releases/*.json**', (req) => {
		req.reply(getWillReturn('releases'));
	}).as('releases');

	cy.intercept('GET', '/releases/*.md**', (req) => {
		req.reply(getWillReturn('releases_markup'));
	}).as('releases_markup');

	usersChatApi(cy, getWillReturn, setWillReturn);
	usersConsultantsApi(cy, getWillReturn, setWillReturn);
	usersDataApi(cy, getWillReturn, setWillReturn);
	usersSessionsApi(cy, getWillReturn, setWillReturn);
	apiAgencies(cy, getWillReturn, setWillReturn);
	apiAppointments(cy);
	apiConsultingTypes(cy, getWillReturn, setWillReturn);
	apiMessages(cy, getWillReturn, setWillReturn);
	apiRc(cy, getWillReturn, setWillReturn);
	apiTopics(cy, getWillReturn, setWillReturn);
	apiUploads(cy, getWillReturn, setWillReturn);
	apiVideocalls(cy);
});

export const USER_ASKER = 'asker';
export const USER_CONSULTANT = 'consultant';
export const USER_VIDEO = 'video';

export interface LoginArgs {
	userId?: typeof USER_ASKER | typeof USER_CONSULTANT | typeof USER_VIDEO;
	auth?: { expires_in: number; refresh_expires_in: number };
}
