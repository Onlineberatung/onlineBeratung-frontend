const nodeEnv: string = process.env.NODE_ENV as string;
export const tld = nodeEnv === 'development' ? 'http://caritas.local' : '';
export const endpointPort = nodeEnv === 'development' ? ':9000' : '';

export const config = {
	endpoints: {
		deleteAskerAccount: tld + '/service/users/account',
		draftMessages: tld + '/service/messages/draft',
		email: tld + '/service/users/email',
		enquiries: tld + '/service/users/sessions/consultants?status=1',
		enquiryBase: tld + '/service/users/sessions/',
		enquiryAcceptance: tld + '/service/users/sessions/new',
		attachmentUpload: tld + '/service/uploads/new/',
		attachmentUploadFeedbackRoom: tld + '/service/uploads/feedback/new/',
		keycloakAccessToken:
			tld +
			'/auth/realms/caritas-online-beratung/protocol/openid-connect/token',
		keycloakLogout:
			tld +
			'/auth/realms/caritas-online-beratung/protocol/openid-connect/logout',
		liveservice: tld + '/service/live',
		loginResetPasswordLink:
			'/auth/realms/caritas-online-beratung/login-actions/reset-credentials?client_id=account',
		messages: tld + '/service/messages',
		sendMessage: tld + '/service/messages/new',
		sendMessageToFeedback: tld + '/service/messages/feedback/new',
		startVideoCall: tld + '/service/videocalls/new',
		forwardMessage: tld + '/service/messages/forward',
		messageRead: tld + '/api/v1/subscriptions.read',
		rocketchatAccessToken: tld + '/api/v1/login',
		rocketchatLogout: tld + '/api/v1/logout',
		sessions: tld + '/service/users/sessions/consultants?status=2',
		registerAsker: tld + '/service/users/askers/new',
		registerAskerNewConsultingType:
			tld + '/service/users/askers/consultingType/new',
		userSessions: tld + '/service/users/sessions/askers',
		setAbsence: tld + '/service/users/consultants/absences',
		agencyServiceBase: tld + '/service/agencies',
		userData: tld + '/service/users/data',
		headerData: tld + '/service/users/sessions/askers',
		teamSessions: tld + '/service/users/sessions/teams',
		updateMonitoring: tld + '/service/users/sessions/monitoring',
		userSessionsListView: '/sessions/user/view',
		agencyConsultants: tld + '/service/users/consultants',
		passwordReset: tld + '/service/users/password/change',
		groupChatBase: tld + '/service/users/chat/',
		rejectVideoCall: tld + '/service/videocalls/reject',
		sessionBase: tld + '/service/users/sessions',
		registerAnonymousAsker:
			tld + '/service/conversations/askers/anonymous/new'
	},
	urls: {
		loginRedirectToRegistrationOverview:
			'https://www.caritas.de/onlineberatung',
		toLogin: tld + endpointPort + '/login.html',
		redirectToApp: tld + endpointPort + `/beratung-hilfe.html`,
		home: 'https://www.caritas.de',
		imprint: 'https://www.caritas.de/impressum',
		privacy:
			'https://www.caritas.de/hilfeundberatung/onlineberatung/datenschutz',
		error500: tld + endpointPort + '/error.500.html',
		error401: tld + endpointPort + '/error.401.html',
		error404: tld + endpointPort + '/error.404.html',
		registrationDisabilityPostcodeFallback:
			'https://www.caritas.de/hilfeundberatung/onlineberatung/behinderung-und-psychische-erkrankung/adressen',
		registrationMigrationPostcodeFallback:
			'https://www.caritas.de/hilfeundberatung/onlineberatung/migration/adressen',
		registrationHospicePostcodeFallback:
			'https://www.caritas.de/hilfeundberatung/onlineberatung/hospiz-palliativ/adressen',
		registrationMenPostcodeFallback:
			'https://www.skmev.de/beratung-hilfe/jungen-und-maennerarbeit/'
	}
};
