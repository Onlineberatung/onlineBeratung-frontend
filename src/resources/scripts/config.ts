const nodeEnv: string = process.env.NODE_ENV as string;
export const tld = nodeEnv === 'development' ? 'http://caritas.local' : '';
export const endpointPort = nodeEnv === 'development' ? ':9000' : '';

export const config = {
	endpoints: {
		agencyConsultants: tld + '/service/users/consultants',
		agencyServiceBase: tld + '/service/agencies',
		askerSessions: tld + '/service/users/sessions/askers',
		attachmentUpload: tld + '/service/uploads/new/',
		attachmentUploadFeedbackRoom: tld + '/service/uploads/feedback/new/',
		consultantEnquiriesBase:
			tld + '/service/conversations/consultants/enquiries/',
		consultantSessions:
			tld + '/service/users/sessions/consultants?status=2&',
		consultantTeamSessions: tld + '/service/users/sessions/teams?',
		deleteAskerAccount: tld + '/service/users/account',
		draftMessages: tld + '/service/messages/draft',
		email: tld + '/service/users/email',
		forwardMessage: tld + '/service/messages/forward',
		groupChatBase: tld + '/service/users/chat/',
		keycloakAccessToken:
			tld +
			'/auth/realms/caritas-online-beratung/protocol/openid-connect/token',
		keycloakLogout:
			tld +
			'/auth/realms/caritas-online-beratung/protocol/openid-connect/logout',
		liveservice: tld + '/service/live',
		loginResetPasswordLink:
			'/auth/realms/caritas-online-beratung/login-actions/reset-credentials?client_id=account',
		messageRead: tld + '/api/v1/subscriptions.read',
		messages: tld + '/service/messages',
		passwordReset: tld + '/service/users/password/change',
		rejectVideoCall: tld + '/service/videocalls/reject',
		registerAsker: tld + '/service/users/askers/new',
		registerAskerNewConsultingType:
			tld + '/service/users/askers/consultingType/new',
		rocketchatAccessToken: tld + '/api/v1/login',
		rocketchatLogout: tld + '/api/v1/logout',
		sendMessage: tld + '/service/messages/new',
		sendMessageToFeedback: tld + '/service/messages/feedback/new',
		sessionBase: tld + '/service/users/sessions',
		setAbsence: tld + '/service/users/consultants/absences',
		startVideoCall: tld + '/service/videocalls/new',
		consultingTypeServiceBase: tld + '/service/consultingtypes',
		userData: tld + '/service/users/data',
		updateMonitoring: tld + '/service/users/sessions/monitoring',
		userSessionsListView: '/sessions/user/view',
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
