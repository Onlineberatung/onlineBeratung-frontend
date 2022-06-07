export const CSRF_WHITELIST_HEADER: string =
	process.env.REACT_APP_CSRF_WHITELIST_HEADER_PROPERTY;

export const apiUrlEnv: string = process.env.REACT_APP_API_URL;

export let apiUrl = '';
if (apiUrlEnv) {
	apiUrl = apiUrlEnv;
	if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
		apiUrl = 'https://' + apiUrl;
	}
}

export const uiUrl = process.env.REACT_APP_UI_URL || window.location.origin;
export const APP_PATH = 'app';

export const config = {
	enableTenantTheming: false, // Feature flag to enable tenant theming based on subdomains
	endpoints: {
		agencyConsultants: apiUrl + '/service/users/consultants',
		agencyServiceBase: apiUrl + '/service/agencies',
		appointmentsServiceBase: apiUrl + '/service/appointments',
		videocallServiceBase: apiUrl + '/service/videocalls',
		anonymousAskerBase: apiUrl + '/service/conversations/askers/anonymous/',
		anonymousBase: apiUrl + '/service/conversations/anonymous/',
		askerSessions: apiUrl + '/service/users/sessions/askers',
		attachmentUpload: apiUrl + '/service/uploads/new/',
		attachmentUploadFeedbackRoom: apiUrl + '/service/uploads/feedback/new/',
		consultantEnquiriesBase:
			apiUrl + '/service/conversations/consultants/enquiries/',
		consultantSessions:
			apiUrl + '/service/users/sessions/consultants?status=2&',
		consultantStatistics: apiUrl + '/service/statistics/consultant',
		consultantTeamSessions: apiUrl + '/service/users/sessions/teams?',
		consultingTypeServiceBase: apiUrl + '/service/consultingtypes',
		deleteAskerAccount: apiUrl + '/service/users/account',
		draftMessages: apiUrl + '/service/messages/draft',
		email: apiUrl + '/service/users/email',
		error: apiUrl + '/service/logstash',
		forwardMessage: apiUrl + '/service/messages/forward',
		groupChatBase: apiUrl + '/service/users/chat/',
		keycloakAccessToken:
			apiUrl +
			'/auth/realms/caritas-online-beratung/protocol/openid-connect/token',
		keycloakLogout:
			apiUrl +
			'/auth/realms/caritas-online-beratung/protocol/openid-connect/logout',
		liveservice: apiUrl + '/service/live',
		loginResetPasswordLink:
			'/auth/realms/caritas-online-beratung/login-actions/reset-credentials?client_id=account',
		messages: apiUrl + '/service/messages',
		myMessagesBase:
			apiUrl + '/service/conversations/consultants/mymessages/',
		passwordReset: apiUrl + '/service/users/password/change',
		rejectVideoCall: apiUrl + '/service/videocalls/reject',
		registerAnonymousAsker:
			apiUrl + '/service/conversations/askers/anonymous/new',
		registerAsker: apiUrl + '/service/users/askers/new',
		registerAskerNewConsultingType:
			apiUrl + '/service/users/askers/consultingType/new',
		rc: {
			accessToken: apiUrl + '/api/v1/login',
			logout: apiUrl + '/api/v1/logout',
			subscriptions: {
				get: apiUrl + '/api/v1/subscriptions.get',
				read: apiUrl + '/api/v1/subscriptions.read',
				getOne: apiUrl + '/api/v1/subscriptions.getOne'
			},
			rooms: {
				get: apiUrl + '/api/v1/rooms.get',
				info: apiUrl + '/api/v1/rooms.info'
			},
			users: {
				info: apiUrl + '/api/v1/users.info'
			},
			groups: {
				members: apiUrl + '/api/v1/groups.members'
			},
			e2ee: {
				fetchMyKeys: apiUrl + '/api/v1/e2e.fetchMyKeys',
				getUsersOfRoomWithoutKey:
					apiUrl + '/api/v1/e2e.getUsersOfRoomWithoutKey',
				resetE2EKey: apiUrl + '/api/v1/users.resetE2EKey',
				setRoomKeyID: apiUrl + '/api/v1/e2e.setRoomKeyID',
				setUserPublicAndPrivateKeys:
					apiUrl + '/api/v1/e2e.setUserPublicAndPrivateKeys',
				updateGroupKey: apiUrl + '/api/v1/e2e.updateGroupKey'
			}
		},
		sendMessage: apiUrl + '/service/messages/new',
		sendMessageToFeedback: apiUrl + '/service/messages/feedback/new',
		sendAliasMessage: apiUrl + '/service/messages/aliasonly/new',
		sessionBase: apiUrl + '/service/users/sessions',
		setAbsence: apiUrl + '/service/users/consultants/absences',
		startVideoCall: apiUrl + '/service/videocalls/new',
		teamSessionsBase:
			apiUrl + '/service/conversations/consultants/teamsessions/',
		tenantServiceBase: apiUrl + '/service/tenant',
		twoFactorAuth: apiUrl + '/service/users/2fa',
		twoFactorAuthApp: apiUrl + '/service/users/2fa/app',
		twoFactorAuthEmail: apiUrl + '/service/users/2fa/email',
		userData: apiUrl + '/service/users/data',
		userUpdateE2EKey: apiUrl + '/service/users/chat/e2e',
		updateMonitoring: apiUrl + '/service/users/sessions/monitoring',
		userSessionsListView: '/sessions/user/view',
		consultantsLanguages: apiUrl + '/service/users/consultants/languages',
		banUser: (rcUserId, chatId) =>
			apiUrl + `/service/users/${rcUserId}/chat/${chatId}/ban`
	},
	urls: {
		toRegistration: 'https://www.caritas.de/onlineberatung',
		toLogin: uiUrl + '/login',
		registration: uiUrl + '/registration',
		toEntry: uiUrl + '/',
		redirectToApp: uiUrl + '/' + APP_PATH,
		home: 'https://www.caritas.de',
		videoConference: '/videoberatung/:type/:appointmentId',
		consultantVideoConference:
			'/consultant/videoberatung/:type/:appointmentId',
		finishedAnonymousChatRedirect:
			'https://www.caritas.de/hilfeundberatung/hilfeundberatung',
		imprint: 'https://www.caritas.de/impressum',
		privacy:
			'https://www.caritas.de/hilfeundberatung/onlineberatung/datenschutz',
		error500: uiUrl + '/error.500.html',
		error401: uiUrl + '/error.401.html',
		error404: uiUrl + '/error.404.html',
		releases: uiUrl + '/releases'
	},
	postcodeFallbackUrl: '{url}',
	jitsi: {
		/**
		 * Enable WebRTC Encoded Transform as an alternative to insertable streams.
		 * NOTE: Currently the only browser supporting this is Safari / WebKit, behind a flag.
		 * This must be enabled in jitsi too. (Config value is named equal)
		 * https://github.com/jitsi/lib-jitsi-meet/blob/afc006e99a42439c305c20faab50a1f786254676/modules/browser/BrowserCapabilities.js#L259
		 */
		enableEncodedTransformSupport: false
	}
};
