const apiUrlEnv: string = (window as any).Cypress
	? (window as any).Cypress.env('REACT_APP_API_URL')
	: process.env.REACT_APP_API_URL;

export let apiUrl = '';
if (apiUrlEnv) {
	apiUrl = apiUrlEnv;
	if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
		apiUrl = 'https://' + apiUrl;
	}
}

export const endpoints = {
	agencyConsultants: apiUrl + '/service/users/consultants',
	agencyServiceBase: apiUrl + '/service/agencies',
	anonymousAskerBase: apiUrl + '/service/conversations/askers/anonymous/',
	anonymousBase: apiUrl + '/service/conversations/anonymous/',
	appointmentBase: apiUrl + '/service/appointments/sessions',
	appointmentBaseNew: (sessionId: number) =>
		apiUrl + `/service/appointments/sessions/${sessionId}/enquiry/new`,
	appointmentServiceBase: apiUrl + '/service/agency/',
	appointmentServiceCalDav: apiUrl + '/service/appointservice/caldav',
	appointmentServiceCalDavAccount:
		apiUrl + '/service/appointservice/caldav/hasAccount',
	appointmentServiceMeetingLink: (agencyId: number) =>
		apiUrl +
		`/service/appointservice/agencies/${agencyId}/initialMeetingSlug`,
	counselorAppointmentLink: (userId: string) =>
		apiUrl + `/service/appointservice/consultants/${userId}/meetingSlug`,
	counselorToken: apiUrl + `/service/appointservice/consultants/token`,
	appointmentsServiceBase: apiUrl + '/service/appointments',
	appointmentsServiceBookingEventsByUserId: (userId: string) =>
		apiUrl + `/service/appointservice/askers/${userId}/bookings`,
	appointmentsServiceConsultantBookings: (userId: string, status: string) =>
		apiUrl +
		`/service/appointservice/consultants/${userId}/bookings?status=${status}`,
	askerSessions: apiUrl + '/service/users/sessions/askers',
	attachmentUpload: apiUrl + '/service/uploads/new/',
	attachmentUploadFeedbackRoom: apiUrl + '/service/uploads/feedback/new/',
	banUser: (rcUserId, chatId) =>
		apiUrl + `/service/users/${rcUserId}/chat/${chatId}/ban`,
	budibaseTools: (userId: string) =>
		apiUrl + `/service/counselingtoolsservice/tools/${userId}`,
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
		apiUrl + '/auth/realms/online-beratung/protocol/openid-connect/token',
	keycloakLogout:
		apiUrl + '/auth/realms/online-beratung/protocol/openid-connect/logout',
	liveservice: apiUrl + '/service/live',
	loginResetPasswordLink:
		'/auth/realms/online-beratung/login-actions/reset-credentials?client_id=account',
	messageRead: apiUrl + '/api/v1/subscriptions.read',
	messages: {
		get: apiUrl + '/service/messages',
		delete: apiUrl + '/service/messages/:messageId'
	},
	myMessagesBase: apiUrl + '/service/conversations/consultants/mymessages/',
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
			getStatus: apiUrl + '/api/v1/users.getStatus',
			info: apiUrl + '/api/v1/users.info',
			resetE2EKey: apiUrl + '/api/v1/users.resetE2EKey'
		}
	},
	registerAnonymousAsker:
		apiUrl + '/service/conversations/askers/anonymous/new',
	registerAsker: apiUrl + '/service/users/askers/new',
	baseUserService: apiUrl + '/service/users',
	registerAskerNewConsultingType:
		apiUrl + '/service/users/askers/consultingType/new',
	rejectVideoCall: apiUrl + '/service/videocalls/reject',
	rocketchatAccessToken: apiUrl + '/api/v1/login',
	rocketchatLogout: apiUrl + '/api/v1/logout',
	sendAliasMessage: apiUrl + '/service/messages/aliasonly/new',
	sendMessage: apiUrl + '/service/messages/new',
	sendMessageToFeedback: apiUrl + '/service/messages/feedback/new',
	sessionBase: apiUrl + '/service/users/sessions',
	sessionRooms: apiUrl + '/service/users/sessions/room',
	setAbsence: apiUrl + '/service/users/consultants/absences',
	startVideoCall: apiUrl + '/service/videocalls/new',
	teamSessionsBase:
		apiUrl + '/service/conversations/consultants/teamsessions/',
	tenantServiceBase: apiUrl + '/service/tenant',
	topicGroups: apiUrl + '/service/topic-groups/',
	topicsData: apiUrl + '/service/topic/public/',
	twoFactorAuth: apiUrl + '/service/users/2fa',
	twoFactorAuthApp: apiUrl + '/service/users/2fa/app',
	twoFactorAuthEmail: apiUrl + '/service/users/2fa/email',
	updateMessage: apiUrl + '/service/messages/',
	userData: apiUrl + '/service/users/data',
	userDataBySessionId: (sessionId: number) =>
		apiUrl + `/service/users/consultants/sessions/${sessionId}`,
	userSessionsListView: '/sessions/user/view',
	serviceSettings: apiUrl + '/service/settings',
	frontend: {
		settings: '/p/api/settings'
	},
	setAppointmentSuccessMessage:
		apiUrl + '/service/messages/aliasWithContent/new',
	userUpdateE2EKey: apiUrl + '/service/users/chat/e2e',
	videocallServiceBase: apiUrl + '/service/videocalls'
};
