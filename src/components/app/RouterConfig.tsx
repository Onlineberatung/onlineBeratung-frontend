import { SessionsListWrapper } from '../sessionsList/SessionsListWrapper';
import { SESSION_LIST_TYPES } from '../session/sessionHelpers';
import { SessionView } from '../session/SessionView';
import { WriteEnquiry } from '../enquiry/WriteEnquiry';
import { AskerInfo } from '../askerInfo/AskerInfo';
import { Monitoring } from '../monitoring/Monitoring';
import { Profile } from '../profile/Profile';
import { SessionViewEmpty } from '../session/SessionViewEmpty';
import { CreateGroupChatView } from '../groupChat/CreateChatView';
import { GroupChatInfo } from '../groupChat/GroupChatInfo';

export const RouterConfigUser = (): any => {
	return {
		navigation: [
			{
				to: '/sessions/user/view',
				icon: 'speech-bubbles',
				titleKeys: {
					large: 'navigation.asker.sessions',
					small: 'navigation.asker.sessions.small'
				}
			},
			{
				to: '/profile',
				icon: 'person',
				titleKeys: {
					large: 'navigation.profile'
				}
			}
		],
		listRoutes: [
			{
				path: '/sessions/user/view/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				exact: false
			}
		],
		detailRoutes: [
			{
				path: '/sessions/user/view/write/:sessionId?',
				component: WriteEnquiry
			},
			{
				path: '/sessions/user/view/:rcGroupId/:sessionId',
				component: SessionView
			},
			{
				path: '/sessions/user/view/',
				component: SessionViewEmpty
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

export const RouterConfigConsultant = (): any => {
	return {
		navigation: [
			{
				to: '/sessions/consultant/sessionPreview',
				icon: 'inbox',
				titleKeys: {
					large: 'navigation.consultant.enquiries'
				}
			},
			{
				to: '/sessions/consultant/sessionView',
				icon: 'speech-bubbles',
				titleKeys: {
					large: 'navigation.consultant.sessions',
					small: 'navigation.consultant.sessions.small'
				}
			},
			{
				to: '/profile',
				icon: 'person',
				titleKeys: {
					large: 'navigation.profile'
				}
			}
		],
		listRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				type: SESSION_LIST_TYPES.ENQUIRY,
				exact: false
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
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
				component: SessionViewEmpty
			},
			{
				path: '/sessions/consultant/sessionView/',
				component: SessionViewEmpty
			},
			{
				path: '/sessions/consultant/sessionView/createGroupChat/',
				component: CreateGroupChatView
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/editGroupChat',
				component: CreateGroupChatView
			}
		],
		userProfileRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/userProfile/monitoring',
				component: Monitoring
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/groupChatInfo',
				component: GroupChatInfo
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

export const RouterConfigTeamConsultant = (): any => {
	return {
		navigation: [
			{
				to: '/sessions/consultant/sessionPreview',
				icon: 'inbox',
				titleKeys: {
					large: 'navigation.consultant.enquiries'
				}
			},
			{
				to: '/sessions/consultant/sessionView',
				icon: 'speech-bubbles',
				titleKeys: {
					large: 'navigation.consultant.sessions',
					small: 'navigation.consultant.sessions.small'
				}
			},
			{
				to: '/sessions/consultant/teamSessionView',
				icon: 'speech-bubbles-team',
				titleKeys: {
					large: 'navigation.consultant.teamsessions',
					small: 'navigation.consultant.teamsessions.small'
				}
			},
			{
				to: '/profile',
				icon: 'person',
				titleKeys: {
					large: 'navigation.profile'
				}
			}
		],
		listRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				type: SESSION_LIST_TYPES.ENQUIRY,
				exact: false
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				type: SESSION_LIST_TYPES.MY_SESSION,
				exact: false
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				type: SESSION_LIST_TYPES.TEAMSESSION,
				exact: false
			}
		],
		detailRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/',
				component: SessionViewEmpty
			},
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId/:sessionId',
				component: SessionView,
				type: SESSION_LIST_TYPES.ENQUIRY
			},
			{
				path: '/sessions/consultant/sessionView/',
				component: SessionViewEmpty
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/',
				component: SessionView,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/editGroupChat',
				component: CreateGroupChatView
			},
			{
				path: '/sessions/consultant/teamSessionView/',
				component: SessionViewEmpty
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/',
				component: SessionView,
				type: SESSION_LIST_TYPES.TEAMSESSION
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/editGroupChat',
				component: CreateGroupChatView
			}
		],
		userProfileRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/userProfile/monitoring',
				component: Monitoring
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/groupChatInfo',
				component: GroupChatInfo
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/userProfile/monitoring',
				component: Monitoring
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/groupChatInfo',
				component: GroupChatInfo
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

export const RouterConfigPeerConsultant = (): any => {
	let config = RouterConfigConsultant();
	return config;
};

export const RouterConfigMainConsultant = (): any => {
	let config = RouterConfigTeamConsultant();
	config.navigation[2].titleKeys = {
		large: 'navigation.consultant.peersessions',
		small: 'navigation.consultant.peersessions.small'
	};
	return config;
};

export const RouterConfigAnonymousAsker = (): any => {
	return {
		navigation: [
			{
				to: '/sessions/user/view',
				icon: 'speech-bubbles',
				titleKeys: {
					large: 'navigation.asker.sessions',
					small: 'navigation.asker.sessions.small'
				}
			}
		],
		listRoutes: [
			{
				path: '/sessions/user/view/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				exact: false
			}
		],
		detailRoutes: [
			{
				path: '/sessions/user/view/:rcGroupId/:sessionId',
				component: SessionView
			},
			{
				path: '/sessions/user/view/',
				component: SessionViewEmpty
			}
		]
	};
};
