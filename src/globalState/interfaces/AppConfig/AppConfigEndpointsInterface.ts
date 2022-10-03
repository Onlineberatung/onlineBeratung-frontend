export interface AppConfigEndpointsInterface {
	agencyConsultants: string;
	agencyServiceBase: string;
	anonymousAskerBase: string;
	anonymousBase: string;
	appointmentBase: string;
	appointmentBaseNew: (sessionId: number) => string;
	appointmentServiceBase: string;
	appointmentServiceCalDavAccount: string;
	appointmentServiceMeetingLink: (agencyId: number) => string;
	counselorAppointmentLink: (userId: string) => string;
	counselorToken: string;
	appointmentsServiceBase: string;
	appointmentsServiceBookingEventsByUserId: (userId: string) => string;
	appointmentsServiceConsultantBookings: (
		userId: string,
		status: string
	) => string;
	askerSessions: string;
	attachmentUpload: string;
	attachmentUploadFeedbackRoom: string;
	banUser: (rcUserId, chatId) => string;
	budibaseTools: (userId: string) => string;
	chatRoom: string;
	consultantEnquiriesBase: string;
	consultantSessions: string;
	consultantStatistics: string;
	consultantTeamSessions: string;
	consultantsLanguages: string;
	consultingTypeServiceBase: string;
	deleteAskerAccount: string;
	draftMessages: string;
	email: string;
	error: string;
	forwardMessage: string;
	groupChatBase: string;
	keycloakAccessToken: string;
	keycloakLogout: string;
	liveservice: string;
	loginResetPasswordLink: string;
	messageRead: string;
	messages: string;
	myMessagesBase: string;
	passwordReset: string;
	rc: {
		accessToken: string;
		e2ee: {
			fetchMyKeys: string;
			getUsersOfRoomWithoutKey: string;
			setRoomKeyID: string;
			setUserPublicAndPrivateKeys: string;
			updateGroupKey: string;
		};
		groups: {
			members: string;
		};
		logout: string;
		rooms: {
			get: string;
			info: string;
		};
		settings: {
			public: string;
		};
		subscriptions: {
			get: string;
			read: string;
			getOne: string;
		};
		users: {
			info: string;
			resetE2EKey: string;
		};
	};
	registerAnonymousAsker: string;
	registerAsker: string;
	registerAskerNewConsultingType: string;
	rejectVideoCall: string;
	rocketchatAccessToken: string;
	rocketchatLogout: string;
	sendAliasMessage: string;
	sendMessage: string;
	sendMessageToFeedback: string;
	sessionBase: string;
	sessionRooms: string;
	setAbsence: string;
	startVideoCall: string;
	teamSessionsBase: string;
	tenantServiceBase: string;
	topicsData: string;
	twoFactorAuth: string;
	twoFactorAuthApp: string;
	twoFactorAuthEmail: string;
	updateMessage: string;
	updateMonitoring: string;
	userData: string;
	userDataBySessionId: (sessionId: number) => string;
	userSessionsListView: string;
	serviceSettings: string;
	setAppointmentSuccessMessage: string;
	userUpdateE2EKey: string;
	videocallServiceBase: string;
}
