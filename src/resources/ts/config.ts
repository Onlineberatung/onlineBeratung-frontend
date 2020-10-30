const nodeEnv: string = process.env.NODE_ENV as string;
export const tld = nodeEnv === 'development' ? 'http://caritas.local' : '';
const endpointPort = nodeEnv === 'development' ? ':9000' : '';

export const config = {
	endpoints: {
		enquiries: tld + '/service/users/sessions/consultants?status=1',
		enquiryBase: tld + '/service/users/sessions/',
		enquiryAcceptance: tld + '/service/users/sessions/new',
		enquiryAcceptanceRedirect: tld + '/02components.06sessionsList.html',
		enquirySendConfirmationRedirect:
			tld + '/02components.06userSession.html',
		attachmentUpload: tld + '/service/uploads/new/',
		attachmentUploadFeedbackRoom: tld + '/service/uploads/feedback/new/',
		keycloakAccessToken:
			tld +
			'/auth/realms/caritas-online-beratung/protocol/openid-connect/token',
		keycloakLogout:
			tld +
			'/auth/realms/caritas-online-beratung/protocol/openid-connect/logout',
		loginRedirectToRegistrationOverview:
			'https://www.caritas.de/onlineberatung',
		loginResetPasswordLink:
			'/auth/realms/caritas-online-beratung/login-actions/reset-credentials?client_id=account',
		logoutRedirect: tld + endpointPort + '/login.html',
		messages: tld + '/service/messages',
		sendMessage: tld + '/service/messages/new',
		sendMessageToFeedback: tld + '/service/messages/feedback/new',
		forwardMessage: tld + '/service/messages/forward',
		messageRead: tld + '/api/v1/subscriptions.read',
		redirectToApp: tld + endpointPort + `/beratung-hilfe.html?5.9.0`,
		rocketchatAccessToken: tld + '/api/v1/login',
		rocketchatLogout: tld + '/api/v1/logout',
		sessions: tld + '/service/users/sessions/consultants?status=2',
		registerAsker: tld + '/service/users/askers/new',
		registerAskerNewConsultingType:
			tld + '/service/users/askers/consultingType/new',
		userSessions: tld + '/service/users/sessions/askers',
		userWriteEnquiry: tld + '/02components.06writeEnquiry.html',
		setAbsence: tld + '/service/users/consultants/absences',
		agencyServiceBase: tld + '/service/agencies',
		userData: tld + '/service/users/data',
		headerData: tld + '/service/users/sessions/askers',
		teamSessions: tld + '/service/users/sessions/teams',
		caritasImprint: 'https://www.caritas.de/impressum',
		caritasDataprotection:
			'https://www.caritas.de/hilfeundberatung/onlineberatung/datenschutz',
		updateMonitoring: tld + '/service/users/sessions/monitoring',
		userSessionsListView: '/sessions/user/view',
		error500: tld + endpointPort + '/02components.07errorPage500.html',
		error401: tld + endpointPort + '/02components.07errorPage401.html',
		error404: tld + endpointPort + '/02components.07errorPage404.html',
		registrationHelpmailRedirect: 'https://www.u25.de/helpmail/',
		agencyConsultants: tld + '/service/users/consultants',
		sessionAssign: tld + '/service/users/sessions',
		passwordReset: tld + '/service/users/password/change',
		getMonitoring: tld + '/service/users/sessions',
		registrationOffenderRedirect:
			'/registration.straffaelligkeit.html?aid=',
		registrationRehabilitationRedirect:
			'/registration.kinder-reha.html?aid=',
		registrationKreuzbundRedirect:
			'/registration.kb-sucht-selbsthilfe.html?aid=',
		registrationDisabilityPostcodeFallback:
			'https://www.caritas.de/hilfeundberatung/onlineberatung/behinderung-und-psychische-erkrankung/adressen',
		groupChatBase: tld + '/service/users/chat/',
		registrationMigrationPostcodeFallback:
			'https://www.caritas.de/hilfeundberatung/onlineberatung/migration/adressen',
		registrationHospicePostcodeFallback:
			'https://www.caritas.de/hilfeundberatung/onlineberatung/hospiz-palliativ/adressen'
	}
};
