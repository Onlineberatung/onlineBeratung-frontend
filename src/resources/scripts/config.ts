export const CSRF_WHITELIST_HEADER: string =
	process.env.REACT_APP_CSRF_WHITELIST_HEADER_PROPERTY;

export const apiUrlEnv: string = process.env.REACT_APP_API_URL;

export let apiUrl = '';
if (apiUrlEnv) {
	apiUrl = apiUrlEnv;
	if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
		apiUrl = 'http://' + apiUrl;
	}
}

export const uiUrl = process.env.REACT_APP_UI_URL || window.location.origin;
export const APP_PATH = 'app';

export const config = {
	budibaseSSO: false, // Feature flag to enable SSO on budibase
	enableTenantTheming: false, // Feature flag to enable tenant theming based on subdomains
	enableWalkthrough: false, // Feature flag to enable walkthrough (false by default here & true in the theme repo)
	disableVideoAppointments: false, // Feature flag to enable Video-Termine page
	useMultiTenancyWithSingleDomain: false, // Feature flag to enable the multi tenancy with a single domain ex: lands
	useTenantService: false,
	useApiClusterSettings: false, // Feature flag to enable the cluster use the cluster settings instead of the config file
	mainTenantSubdomainForSingleDomainMultitenancy: 'app',

	endpoints: {
		agencyConsultants: apiUrl + '/service/users/consultants',
		agencyServiceBase: apiUrl + '/service/agencies',
		anonymousAskerBase: apiUrl + '/service/conversations/askers/anonymous/',
		anonymousBase: apiUrl + '/service/conversations/anonymous/',
		appointmentBase: apiUrl + '/service/appointments/sessions',
		appointmentBaseNew: (sessionId: number) =>
			apiUrl + `/service/appointments/sessions/${sessionId}/enquiry/new`,
		appointmentServiceBase: apiUrl + '/service/agency/',
		appointmentServiceMeetingLink: (agencyId: number) =>
			apiUrl +
			`/service/appointservice/agencies/${agencyId}/initialMeetingSlug`,
		counselorAppointmentLink: (userId: string) =>
			apiUrl +
			`/service/appointservice/consultants/${userId}/meetingSlug`,
		counselorToken: apiUrl + `/service/appointservice/consultants/token`,
		appointmentsServiceBase: apiUrl + '/service/appointments',
		appointmentsServiceBookingEventsByUserId: (userId: string) =>
			apiUrl + `/service/appointservice/askers/${userId}/bookings`,
		appointmentsServiceConsultantBookings: (
			userId: string,
			status: string
		) =>
			apiUrl +
			`/service/appointservice/consultants/${userId}/bookings?status=${status}`,
		askerSessions: apiUrl + '/service/users/sessions/askers',
		attachmentUpload: apiUrl + '/service/uploads/new/',
		attachmentUploadFeedbackRoom: apiUrl + '/service/uploads/feedback/new/',
		banUser: (rcUserId, chatId) =>
			apiUrl + `/service/users/${rcUserId}/chat/${chatId}/ban`,
		chatRoom: apiUrl + '/service/users/chat/room',
		consultantEnquiriesBase:
			apiUrl + '/service/conversations/consultants/enquiries/',
		consultantSessions:
			apiUrl + '/service/users/sessions/consultants?status=2&',
		consultantStatistics: apiUrl + '/service/statistics/consultant',
		consultantTeamSessions: apiUrl + '/service/users/sessions/teams?',
		consultantsLanguages: apiUrl + '/service/users/consultants/languages',
		consultingTypeServiceBase: apiUrl + '/service/consultingtypes',
		deleteAskerAccount: apiUrl + '/service/users/account',
		draftMessages: apiUrl + '/service/messages/draft',
		email: apiUrl + '/service/users/email',
		error: apiUrl + '/service/logstash',
		forwardMessage: apiUrl + '/service/messages/forward',
		groupChatBase: apiUrl + '/service/users/chat/',
		keycloakAccessToken:
			apiUrl +
			'/auth/realms/online-beratung/protocol/openid-connect/token',
		keycloakLogout:
			apiUrl +
			'/auth/realms/online-beratung/protocol/openid-connect/logout',
		liveservice: apiUrl + '/service/live',
		loginResetPasswordLink:
			'/auth/realms/online-beratung/login-actions/reset-credentials?client_id=account',
		messageRead: apiUrl + '/api/v1/subscriptions.read',
		messages: apiUrl + '/service/messages',
		myMessagesBase:
			apiUrl + '/service/conversations/consultants/mymessages/',
		passwordReset: apiUrl + '/service/users/password/change',
		rc: {
			accessToken: apiUrl + '/api/v1/login',
			e2ee: {
				fetchMyKeys: apiUrl + '/api/v1/e2e.fetchMyKeys',
				getUsersOfRoomWithoutKey:
					apiUrl + '/api/v1/e2e.getUsersOfRoomWithoutKey',
				setRoomKeyID: apiUrl + '/api/v1/e2e.setRoomKeyID',
				setUserPublicAndPrivateKeys:
					apiUrl + '/api/v1/e2e.setUserPublicAndPrivateKeys',
				updateGroupKey: apiUrl + '/api/v1/e2e.updateGroupKey'
			},
			groups: {
				members: apiUrl + '/api/v1/groups.members'
			},
			logout: apiUrl + '/api/v1/logout',
			rooms: {
				get: apiUrl + '/api/v1/rooms.get',
				info: apiUrl + '/api/v1/rooms.info'
			},
			settings: {
				public: apiUrl + '/api/v1/settings.public'
			},
			subscriptions: {
				get: apiUrl + '/api/v1/subscriptions.get',
				read: apiUrl + '/api/v1/subscriptions.read',
				getOne: apiUrl + '/api/v1/subscriptions.getOne'
			},
			users: {
				info: apiUrl + '/api/v1/users.info',
				resetE2EKey: apiUrl + '/api/v1/users.resetE2EKey'
			}
		},
		registerAnonymousAsker:
			apiUrl + '/service/conversations/askers/anonymous/new',
		registerAsker: apiUrl + '/service/users/askers/new',
		registerAskerNewConsultingType:
			apiUrl + '/service/users/askers/consultingType/new',
		rejectVideoCall: apiUrl + '/service/videocalls/reject',
		rocketchatAccessToken: apiUrl + '/api/v1/login',
		rocketchatLogout: apiUrl + '/api/v1/logout',
		sendAliasMessage: apiUrl + '/service/messages/aliasonly/new',
		sendMessage: apiUrl + '/service/messages/new',
		sendMessageToFeedback: apiUrl + '/service/messages/feedback/new',
		updateMessage: apiUrl + '/service/messages/',
		sessionBase: apiUrl + '/service/users/sessions',
		sessionRooms: apiUrl + '/service/users/sessions/room',
		setAbsence: apiUrl + '/service/users/consultants/absences',
		startVideoCall: apiUrl + '/service/videocalls/new',
		teamSessionsBase:
			apiUrl + '/service/conversations/consultants/teamsessions/',
		tenantServiceBase: apiUrl + '/service/tenant',
		topicsData: apiUrl + '/service/topic/public/',
		twoFactorAuth: apiUrl + '/service/users/2fa',
		twoFactorAuthApp: apiUrl + '/service/users/2fa/app',
		twoFactorAuthEmail: apiUrl + '/service/users/2fa/email',
		updateMonitoring: apiUrl + '/service/users/sessions/monitoring',
		userData: apiUrl + '/service/users/data',
		userSessionsListView: '/sessions/user/view',
		serviceSettings: apiUrl + '/service/settings',
		setAppointmentSuccessMessage:
			apiUrl + '/service/messages/aliasWithContent/new',
		userUpdateE2EKey: apiUrl + '/service/users/chat/e2e',
		videocallServiceBase: apiUrl + '/service/videocalls'
	},
	urls: {
		consultantVideoConference:
			'/consultant/videoberatung/:type/:appointmentId',
		error401: uiUrl + '/error.401.html',
		error404: uiUrl + '/error.404.html',
		error500: uiUrl + '/error.500.html',
		finishedAnonymousChatRedirect:
			'https://www.caritas.de/hilfeundberatung/hilfeundberatung',
		home: 'https://www.caritas.de',
		imprint: 'https://www.caritas.de/impressum',
		privacy:
			'https://www.caritas.de/hilfeundberatung/onlineberatung/datenschutz',
		releases: uiUrl + '/releases',
		budibaseDevServer: '',
		appointmentServiceDevServer: '',
		redirectToApp: uiUrl + '/' + APP_PATH,
		registration: uiUrl + '/registration',
		toEntry: uiUrl + '/',
		toLogin: uiUrl + '/login',
		toRegistration: 'https://www.caritas.de/onlineberatung',
		videoConference: '/videoberatung/:type/:appointmentId'
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
	},
	emails: {
		notifications: [
			{
				label: 'profile.notifications.follow.up.email.label',
				types: [
					'NEW_CHAT_MESSAGE_FROM_ADVICE_SEEKER',
					'NEW_FEEDBACK_MESSAGE_FROM_ADVICE_SEEKER'
				]
			}
		]
	},
	twofactor: {
		startObligatoryHint: new Date('2022-07-31'),
		dateTwoFactorObligatory: new Date('2022-10-01'),
		messages: [
			{
				title: 'twoFactorAuth.nag.obligatory.moment.title',
				copy: 'twoFactorAuth.nag.obligatory.moment.copy',
				showClose: true
			},
			{
				title: 'twoFactorAuth.nag.obligatory.title',
				copy: 'twoFactorAuth.nag.obligatory.copy',
				showClose: false
			}
		]
	}
};

export const ALIAS_LAST_MESSAGES = {
	E2EE_ACTIVATED: 'aliases.lastMessage.e2ee_activated',
	FURTHER_STEPS: 'aliases.lastMessage.further_steps',
	REASSIGN_CONSULTANT: 'aliases.lastMessage.reassign_consultant',
	REASSIGN_CONSULTANT_RESET_LAST_MESSAGE:
		'aliases.lastMessage.reassign_consultant_reset_last_message'
};
