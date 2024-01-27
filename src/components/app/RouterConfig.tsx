import { lazy } from 'react';
import { isDesktop } from 'react-device-detect';
import { SessionsListWrapper } from '../sessionsList/SessionsListWrapper';
import {
	SESSION_LIST_TYPES,
	SESSION_TYPE_ARCHIVED,
	SESSION_TYPE_ENQUIRY,
	SESSION_TYPE_FEEDBACK,
	SESSION_TYPE_GROUP,
	SESSION_TYPE_LIVECHAT,
	SESSION_TYPE_SESSION,
	SESSION_TYPE_TEAMSESSION
} from '../session/sessionHelpers';

import { AskerInfo } from '../askerInfo/AskerInfo';
import { Profile } from '../profile/Profile';
import { SessionViewEmpty } from '../session/SessionViewEmpty';
import { CreateGroupChatView } from '../groupChat/CreateChatView';
import { GroupChatInfo } from '../groupChat/GroupChatInfo';
import { Appointments } from '../appointment/Appointments';
import VideoConference from '../videoConference/VideoConference';
import { AUTHORITIES, hasUserAuthority } from '../../globalState';
import { AppConfigInterface } from '../../globalState/interfaces';

import { ReactComponent as OverviewIconOutline } from '../../resources/img/icons/overview_outline.svg';
import { ReactComponent as OverviewIconFilled } from '../../resources/img/icons/overview_filled.svg';
import { ReactComponent as InboxIconOutline } from '../../resources/img/icons/inbox_outline.svg';
import { ReactComponent as InboxIconFilled } from '../../resources/img/icons/inbox_filled.svg';
import { ReactComponent as MessagesIconOutline } from '../../resources/img/icons/messages_outline.svg';
import { ReactComponent as MessagesIconFilled } from '../../resources/img/icons/messages_filled.svg';
import { ReactComponent as TeamsIconOutline } from '../../resources/img/icons/teams_outline.svg';
import { ReactComponent as TeamsIconFilled } from '../../resources/img/icons/teams_filled.svg';
import { ReactComponent as ProfilIconOutline } from '../../resources/img/icons/profil_outline.svg';
import { ReactComponent as ProfilIconFilled } from '../../resources/img/icons/profil_filled.svg';
import { ReactComponent as ToolsIconOutline } from '../../resources/img/icons/tools_outline.svg';
import { ReactComponent as ToolsIconFilled } from '../../resources/img/icons/tools_filled.svg';
import { ReactComponent as CalendarIconOutline } from '../../resources/img/icons/calendar_outline.svg';
import { ReactComponent as CalendarIconFilled } from '../../resources/img/icons/calendar_filled.svg';
import { ToolsList } from '../tools/ToolsList';
import { OverviewPage } from '../../containers/overview/overview';
import { Booking } from '../../containers/bookings/components/Booking/booking';
import { BookingCancellation } from '../../containers/bookings/components/BookingCancellation/bookingCancellation';
import { BookingEvents } from '../../containers/bookings/components/BookingEvents/bookingEvents';
import { BookingReschedule } from '../../containers/bookings/components/BookingReschedule/bookingReschedule';
import { hasVideoCallFeature } from '../../utils/videoCallHelpers';

const SessionView = lazy(() =>
	import('../session/SessionView').then((m) => ({ default: m.SessionView }))
);
const WriteEnquiry = lazy(() =>
	import('../enquiry/WriteEnquiry').then((m) => ({ default: m.WriteEnquiry }))
);

const showAppointmentsMenuItem = (userData, hasAssignedConsultant) => {
	return (
		userData.appointmentFeatureEnabled &&
		(hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) ||
			(hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
				hasAssignedConsultant))
	);
};

const showToolsMenuItem = (userData, consultingTypes, sessionsData, hasTools) =>
	hasTools;

const isVideoAppointmentsEnabled = (
	userData,
	consultingTypes,
	disableVideoAppointments
) =>
	!disableVideoAppointments && hasVideoCallFeature(userData, consultingTypes);

const appointmentRoutes = [
	{
		path: '/booking',
		component: Booking
	},
	{
		path: '/booking/cancellation',
		component: BookingCancellation
	},
	{
		path: '/booking/reschedule',
		component: BookingReschedule
	},
	{
		path: '/booking/events',
		exact: false,
		component: BookingEvents
	}
];

const toolsRoutes = [
	{
		path: '/tools',
		component: ToolsList
	}
];

const overviewRoute = (settings: AppConfigInterface) => ({
	condition: () => settings.useOverviewPage && isDesktop,
	to: '/overview',
	icon: OverviewIconOutline,
	iconFilled: OverviewIconFilled,
	titleKeys: {
		large: 'navigation.overview'
	}
});

export const RouterConfigUser = (
	_settings: AppConfigInterface,
	hasAssignedConsultant: boolean
): any => {
	return {
		navigation: [
			{
				to: '/sessions/user/view',
				icon: MessagesIconOutline,
				iconFilled: MessagesIconFilled,
				titleKeys: {
					large: 'navigation.asker.sessions.large',
					small: 'navigation.asker.sessions.small'
				}
			},
			{
				to: '/profile',
				icon: ProfilIconOutline,
				iconFilled: ProfilIconFilled,
				titleKeys: {
					large: 'navigation.profile'
				}
			},
			{
				condition: (userData) =>
					showAppointmentsMenuItem(userData, hasAssignedConsultant),
				to: '/booking/events',
				icon: CalendarIconOutline,
				iconFilled: CalendarIconFilled,
				titleKeys: {
					large: 'navigation.booking.events'
				}
			},
			{
				condition: showToolsMenuItem,
				to: '/tools',
				icon: ToolsIconOutline,
				iconFilled: ToolsIconFilled,
				titleKeys: {
					large: 'navigation.tools'
				}
			}
		],
		listRoutes: [
			{
				path: '/sessions/user/view/write/:sessionId?',
				component: SessionsListWrapper,
				exact: false,
				sessionTypes: [
					SESSION_TYPE_SESSION,
					SESSION_TYPE_ARCHIVED,
					SESSION_TYPE_GROUP,
					SESSION_TYPE_LIVECHAT,
					SESSION_TYPE_ENQUIRY,
					SESSION_TYPE_TEAMSESSION
				]
			},
			{
				path: '/sessions/user/view/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				exact: false,
				sessionTypes: [
					SESSION_TYPE_SESSION,
					SESSION_TYPE_ARCHIVED,
					SESSION_TYPE_GROUP,
					SESSION_TYPE_LIVECHAT,
					SESSION_TYPE_ENQUIRY,
					SESSION_TYPE_TEAMSESSION
				]
			}
		],
		detailRoutes: [
			{
				path: '/sessions/user/view/write/:sessionId?',
				component: WriteEnquiry,
				type: SESSION_LIST_TYPES.ENQUIRY
			},
			{
				path: '/sessions/user/view/:rcGroupId/:sessionId',
				component: SessionView,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/user/view/',
				component: SessionViewEmpty,
				type: SESSION_LIST_TYPES.MY_SESSION
			}
		],
		profileRoutes: [
			{
				path: '/profile',
				exact: false,
				component: Profile
			}
		],
		appointmentRoutes,
		toolsRoutes
	};
};

export const RouterConfigConsultant = (settings: AppConfigInterface): any => {
	return {
		plainRoutes: [
			{
				condition: hasVideoCallFeature,
				path: settings.urls.consultantVideoConference,
				exact: true,
				component: VideoConference
			}
		],
		navigation: [
			overviewRoute(settings),
			{
				to: '/sessions/consultant/sessionPreview',
				icon: InboxIconOutline,
				iconFilled: InboxIconFilled,
				titleKeys: {
					large: 'navigation.consultant.enquiries'
				}
			},
			{
				to: '/sessions/consultant/sessionView',
				icon: MessagesIconOutline,
				iconFilled: MessagesIconFilled,
				titleKeys: {
					large: 'navigation.consultant.sessions.large',
					small: 'navigation.consultant.sessions.small'
				}
			},
			{
				condition: (userData, consultingTypes) =>
					isVideoAppointmentsEnabled(
						userData,
						consultingTypes,
						settings.disableVideoAppointments
					),
				to: '/termine',
				icon: CalendarIconOutline,
				iconFilled: CalendarIconFilled,
				titleKeys: {
					large: 'navigation.appointments'
				}
			},
			{
				to: '/profile',
				icon: ProfilIconOutline,
				iconFilled: ProfilIconFilled,
				titleKeys: {
					large: 'navigation.profile'
				}
			},
			{
				condition: showAppointmentsMenuItem,
				to: '/booking/events',
				icon: CalendarIconOutline,
				iconFilled: CalendarIconFilled,
				titleKeys: {
					large: 'navigation.booking.events'
				}
			}
		],
		listRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				sessionTypes: [SESSION_TYPE_ENQUIRY, SESSION_TYPE_LIVECHAT],
				type: SESSION_LIST_TYPES.ENQUIRY,
				exact: false
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				sessionTypes: [
					SESSION_TYPE_SESSION,
					SESSION_TYPE_ARCHIVED,
					SESSION_TYPE_GROUP,
					SESSION_TYPE_FEEDBACK,
					SESSION_TYPE_TEAMSESSION
				],
				type: SESSION_LIST_TYPES.MY_SESSION,
				exact: false
			}
		],
		detailRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId/:sessionId',
				component: SessionView,
				type: SESSION_LIST_TYPES.ENQUIRY
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/',
				component: SessionView,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/consultant/sessionPreview/',
				component: SessionViewEmpty,
				type: SESSION_LIST_TYPES.ENQUIRY
			},
			{
				path: '/sessions/consultant/sessionView/',
				component: SessionViewEmpty,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/consultant/sessionView/createGroupChat/',
				component: CreateGroupChatView,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/editGroupChat',
				component: CreateGroupChatView,
				type: SESSION_LIST_TYPES.MY_SESSION
			}
		],
		userProfileRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo,
				type: SESSION_LIST_TYPES.ENQUIRY
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/groupChatInfo',
				component: GroupChatInfo,
				type: SESSION_LIST_TYPES.MY_SESSION
			}
		],
		profileRoutes: [
			{
				path: '/overview',
				component: OverviewPage
			},
			{
				path: '/profile',
				exact: false,
				component: Profile
			},
			{
				condition: (userData, consultingTypes) =>
					isVideoAppointmentsEnabled(
						userData,
						consultingTypes,
						settings.disableVideoAppointments
					),
				path: '/termine',
				exact: false,
				component: Appointments
			}
		],
		appointmentRoutes,
		toolsRoutes
	};
};

export const RouterConfigTeamConsultant = (
	settings: AppConfigInterface
): any => {
	return {
		plainRoutes: [
			{
				condition: hasVideoCallFeature,
				path: settings.urls.consultantVideoConference,
				exact: true,
				component: VideoConference
			}
		],
		navigation: [
			overviewRoute(settings),
			{
				to: '/sessions/consultant/sessionPreview',
				icon: InboxIconOutline,
				iconFilled: InboxIconFilled,
				titleKeys: {
					large: 'navigation.consultant.enquiries'
				}
			},
			{
				to: '/sessions/consultant/sessionView',
				icon: MessagesIconOutline,
				iconFilled: MessagesIconFilled,
				titleKeys: {
					large: 'navigation.consultant.sessions.large',
					small: 'navigation.consultant.sessions.small'
				}
			},
			{
				to: '/sessions/consultant/teamSessionView',
				icon: TeamsIconOutline,
				iconFilled: TeamsIconFilled,
				titleKeys: {
					large: 'navigation.consultant.teamsessions.large',
					small: 'navigation.consultant.teamsessions.small'
				}
			},
			{
				condition: (userData, consultingTypes) =>
					isVideoAppointmentsEnabled(
						userData,
						consultingTypes,
						settings.disableVideoAppointments
					),
				to: '/termine',
				icon: CalendarIconOutline,
				iconFilled: CalendarIconFilled,
				titleKeys: {
					large: 'navigation.appointments'
				}
			},
			{
				condition: showAppointmentsMenuItem,
				to: '/booking/events',
				icon: CalendarIconOutline,
				iconFilled: CalendarIconFilled,
				titleKeys: {
					large: 'navigation.booking.events'
				}
			},
			{
				to: '/profile',
				icon: ProfilIconOutline,
				iconFilled: ProfilIconFilled,
				titleKeys: {
					large: 'navigation.profile'
				}
			}
		],
		listRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				sessionTypes: [SESSION_TYPE_LIVECHAT, SESSION_TYPE_ENQUIRY],
				type: SESSION_LIST_TYPES.ENQUIRY,
				exact: false
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				sessionTypes: [
					SESSION_TYPE_SESSION,
					SESSION_TYPE_ARCHIVED,
					SESSION_TYPE_GROUP,
					SESSION_TYPE_FEEDBACK,
					SESSION_TYPE_TEAMSESSION
				],
				type: SESSION_LIST_TYPES.MY_SESSION,
				exact: false
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				sessionTypes: [
					SESSION_TYPE_SESSION,
					SESSION_TYPE_ARCHIVED,
					SESSION_TYPE_GROUP,
					SESSION_TYPE_FEEDBACK,
					SESSION_TYPE_TEAMSESSION
				],
				type: SESSION_LIST_TYPES.TEAMSESSION,
				exact: false
			}
		],
		detailRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/',
				component: SessionViewEmpty,
				type: SESSION_LIST_TYPES.ENQUIRY
			},
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId/:sessionId',
				component: SessionView,
				type: SESSION_LIST_TYPES.ENQUIRY
			},
			{
				path: '/sessions/consultant/sessionView/',
				component: SessionViewEmpty,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/',
				component: SessionView,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/editGroupChat',
				component: CreateGroupChatView,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/consultant/teamSessionView/',
				component: SessionViewEmpty,
				type: SESSION_LIST_TYPES.TEAMSESSION
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/',
				component: SessionView,
				type: SESSION_LIST_TYPES.TEAMSESSION
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/editGroupChat',
				component: CreateGroupChatView,
				type: SESSION_LIST_TYPES.TEAMSESSION
			}
		],
		userProfileRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo,
				type: SESSION_LIST_TYPES.ENQUIRY
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/groupChatInfo',
				component: GroupChatInfo,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo,
				type: SESSION_LIST_TYPES.TEAMSESSION
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/groupChatInfo',
				component: GroupChatInfo,
				type: SESSION_LIST_TYPES.TEAMSESSION
			},
			{
				path: '/sessions/consultant/sessionView/createGroupChat/',
				component: CreateGroupChatView,
				type: SESSION_LIST_TYPES.MY_SESSION
			}
		],
		profileRoutes: [
			{
				path: '/overview',
				component: OverviewPage
			},
			{
				path: '/profile',
				exact: false,
				component: Profile
			},
			{
				condition: (userData, consultingTypes) =>
					isVideoAppointmentsEnabled(
						userData,
						consultingTypes,
						settings.disableVideoAppointments
					),
				path: '/termine',
				exact: false,
				component: Appointments
			}
		],
		appointmentRoutes,
		toolsRoutes
	};
};

export const RouterConfigPeerConsultant = (
	settings: AppConfigInterface
): any => {
	return RouterConfigConsultant(settings);
};

export const RouterConfigMainConsultant = (
	settings: AppConfigInterface
): any => {
	const config = RouterConfigTeamConsultant(settings);

	config.navigation[3].titleKeys = {
		large: 'navigation.consultant.peersessions.large',
		small: 'navigation.consultant.peersessions.small'
	};
	return config;
};

export const RouterConfigAnonymousAsker = (): any => {
	return {
		navigation: [
			{
				to: '/sessions/user/view',
				icon: MessagesIconOutline,
				iconFilled: MessagesIconFilled,
				titleKeys: {
					large: 'navigation.asker.sessions.large',
					small: 'navigation.asker.sessions.small'
				}
			}
		],
		listRoutes: [
			{
				path: '/sessions/user/view/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				exact: false,
				sessionTypes: [
					SESSION_TYPE_SESSION,
					SESSION_TYPE_ARCHIVED,
					SESSION_TYPE_GROUP,
					SESSION_TYPE_LIVECHAT,
					SESSION_TYPE_ENQUIRY,
					SESSION_TYPE_TEAMSESSION
				]
			}
		],
		detailRoutes: [
			{
				path: '/sessions/user/view/:rcGroupId/:sessionId',
				component: SessionView,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/user/view/',
				component: SessionViewEmpty,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/booking/reschedule',
				component: BookingReschedule
			},
			{
				path: '/booking/events',
				exact: false,
				component: BookingEvents
			}
		]
	};
};
