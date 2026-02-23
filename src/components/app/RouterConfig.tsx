import { lazy } from 'react';
import { isDesktop } from 'react-device-detect';
import { SessionsListWrapper } from '../sessionsList/SessionsListWrapper';
import {
	SESSION_LIST_TYPES,
	SESSION_TYPE_ARCHIVED,
	SESSION_TYPE_ENQUIRY,
	SESSION_TYPE_GROUP,
	SESSION_TYPE_LIVECHAT,
	SESSION_TYPE_SESSION,
	SESSION_TYPE_TEAMSESSION
} from '../session/sessionHelpers';

import { AskerInfo } from '../askerInfo/AskerInfo';
import { DocumentLibrary } from '../documentLibrary/DocumentLibrary';
import { Profile } from '../profile/Profile';
import { SessionViewEmpty } from '../session/SessionViewEmpty';
import { CreateGroupChatView } from '../groupChat/CreateChatView';
import { GroupChatInfo } from '../groupChat/GroupChatInfo';
import { AUTHORITIES, hasUserAuthority } from '../../globalState';
import { AppConfigInterface } from '../../globalState/interfaces';

import OverviewIconOutline from '@mui/icons-material/DashboardOutlined';
import OverviewIconFilled from '@mui/icons-material/Dashboard';
import InboxIconOutline from '@mui/icons-material/InboxOutlined';
import InboxIconFilled from '@mui/icons-material/Inbox';
import MessagesIconOutline from '@mui/icons-material/ForumOutlined';
import MessagesIconFilled from '@mui/icons-material/Forum';
import TeamsIconOutline from '@mui/icons-material/GroupOutlined';
import TeamsIconFilled from '@mui/icons-material/Group';
import ProfilIconOutline from '@mui/icons-material/PersonOutlined';
import ProfilIconFilled from '@mui/icons-material/Person';
import { OverviewPage } from '../../containers/overview/overview';


const SessionView = lazy(() =>
	import('../session/SessionView').then((m) => ({ default: m.SessionView }))
);
const WriteEnquiry = lazy(() =>
	import('../enquiry/WriteEnquiry').then((m) => ({ default: m.WriteEnquiry }))
);

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
	_hasAssignedConsultant: boolean
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
		userProfileRoutes: [
			{
				path: '/sessions/user/view/:rcGroupId/:sessionId/documentLibrary',
				component: DocumentLibrary,
				type: SESSION_LIST_TYPES.MY_SESSION
			}
		],
		profileRoutes: [
			{
				path: '/profile',
				exact: false,
				component: Profile
			}
		]
	};
};

export const RouterConfigConsultant = (settings: AppConfigInterface): any => {
	return {
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
			},
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId/:sessionId/documentLibrary',
				component: DocumentLibrary,
				type: SESSION_LIST_TYPES.ENQUIRY
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/documentLibrary',
				component: DocumentLibrary,
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
			}
		]
	};
};

export const RouterConfigTeamConsultant = (
	settings: AppConfigInterface
): any => {
	return {
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
			},
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId/:sessionId/documentLibrary',
				component: DocumentLibrary,
				type: SESSION_LIST_TYPES.ENQUIRY
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/documentLibrary',
				component: DocumentLibrary,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/documentLibrary',
				component: DocumentLibrary,
				type: SESSION_LIST_TYPES.TEAMSESSION
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
			}
		]
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
			}
		]
	};
};
