import { SessionsListWrapper } from '../sessionsList/SessionsListWrapper';
import {
	SESSION_LIST_TYPES,
	SESSION_TYPE_ARCHIVED,
	SESSION_TYPE_ENQUIRY,
	SESSION_TYPE_FEEDBACK,
	SESSION_TYPE_GROUP,
	SESSION_TYPE_LIVECHAT,
	SESSION_TYPE_SESSION
} from '../session/sessionHelpers';
import { SessionView } from '../session/SessionView';
import { WriteEnquiry } from '../enquiry/WriteEnquiry';
import { AskerInfo } from '../askerInfo/AskerInfo';
import { Monitoring } from '../monitoring/Monitoring';
import { Profile } from '../profile/Profile';
import { SessionViewEmpty } from '../session/SessionViewEmpty';
import { CreateGroupChatView } from '../groupChat/CreateChatView';
import { GroupChatInfo } from '../groupChat/GroupChatInfo';
import { Appointments } from '../appointment/Appointments';
import VideoConference from '../videoConference/VideoConference';
import { config } from '../../resources/scripts/config';
import { AUTHORITIES, hasUserAuthority } from '../../globalState';

import { ReactComponent as InboxIcon } from '../../resources/img/icons/inbox.svg';
import { ReactComponent as SpeechBubbleIcon } from '../../resources/img/icons/speech-bubble.svg';
import { ReactComponent as SpeechBubbleTeamIcon } from '../../resources/img/icons/speech-bubble-team.svg';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import { ReactComponent as CalendarIcon } from '../../resources/img/icons/calendar2.svg';
import * as React from 'react';

const hasVideoCallFeature = (userData, consultingTypes) =>
	userData &&
	hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
	userData.agencies.some(
		(agency) =>
			!!(consultingTypes || []).find(
				(consultingType) =>
					consultingType.id === agency.consultingType &&
					consultingType.isVideoCallAllowed
			)
	);

export const RouterConfigUser = (): any => {
	return {
		navigation: [
			{
				to: '/sessions/user/view',
				icon: <SpeechBubbleIcon className="navigation__icon" />,
				titleKeys: {
					large: 'navigation.asker.sessions',
					small: 'navigation.asker.sessions.small'
				}
			},
			{
				to: '/profile',
				icon: <PersonIcon className="navigation__icon" />,
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
					SESSION_TYPE_ENQUIRY
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
					SESSION_TYPE_ENQUIRY
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
		]
	};
};

export const RouterConfigConsultant = (): any => {
	return {
		plainRoutes: [
			{
				condition: hasVideoCallFeature,
				path: config.urls.consultantVideoConference,
				exact: true,
				component: VideoConference
			}
		],
		navigation: [
			{
				to: '/sessions/consultant/sessionPreview',
				icon: <InboxIcon className="navigation__icon" />,
				titleKeys: {
					large: 'navigation.consultant.enquiries'
				}
			},
			{
				to: '/sessions/consultant/sessionView',
				icon: <SpeechBubbleIcon className="navigation__icon" />,
				titleKeys: {
					large: 'navigation.consultant.sessions',
					small: 'navigation.consultant.sessions.small'
				}
			},
			{
				condition: hasVideoCallFeature,
				to: '/termine',
				icon: <CalendarIcon className="navigation__icon" />,
				titleKeys: {
					large: 'navigation.appointments'
				}
			},
			{
				to: '/profile',
				icon: <PersonIcon className="navigation__icon" />,
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
					SESSION_TYPE_FEEDBACK
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
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/userProfile/monitoring',
				component: Monitoring,
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
				path: '/profile',
				exact: false,
				component: Profile
			},
			{
				condition: hasVideoCallFeature,
				path: '/termine',
				exact: false,
				component: Appointments
			}
		]
	};
};

export const RouterConfigTeamConsultant = (): any => {
	return {
		plainRoutes: [
			{
				condition: hasVideoCallFeature,
				path: config.urls.consultantVideoConference,
				exact: true,
				component: VideoConference
			}
		],
		navigation: [
			{
				to: '/sessions/consultant/sessionPreview',
				icon: <InboxIcon className="navigation__icon" />,
				titleKeys: {
					large: 'navigation.consultant.enquiries'
				}
			},
			{
				to: '/sessions/consultant/sessionView',
				icon: <SpeechBubbleIcon className="navigation__icon" />,
				titleKeys: {
					large: 'navigation.consultant.sessions',
					small: 'navigation.consultant.sessions.small'
				}
			},
			{
				to: '/sessions/consultant/teamSessionView',
				icon: <SpeechBubbleTeamIcon className="navigation__icon" />,
				titleKeys: {
					large: 'navigation.consultant.teamsessions',
					small: 'navigation.consultant.teamsessions.small'
				}
			},
			{
				condition: hasVideoCallFeature,
				to: '/termine',
				icon: <CalendarIcon className="navigation__icon" />,
				titleKeys: {
					large: 'navigation.appointments'
				}
			},
			{
				to: '/profile',
				icon: <PersonIcon className="navigation__icon" />,
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
					SESSION_TYPE_FEEDBACK
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
					SESSION_TYPE_FEEDBACK
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
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/userProfile/monitoring',
				component: Monitoring,
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
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/userProfile/monitoring',
				component: Monitoring,
				type: SESSION_LIST_TYPES.TEAMSESSION
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/groupChatInfo',
				component: GroupChatInfo,
				type: SESSION_LIST_TYPES.TEAMSESSION
			}
		],
		profileRoutes: [
			{
				path: '/profile',
				exact: false,
				component: Profile
			},
			{
				condition: hasVideoCallFeature,
				path: '/termine',
				exact: false,
				component: Appointments
			}
		]
	};
};

export const RouterConfigPeerConsultant = (): any => {
	return RouterConfigConsultant();
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
				icon: <SpeechBubbleIcon className="navigation__icon" />,
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
				exact: false,
				sessionTypes: [
					SESSION_TYPE_SESSION,
					SESSION_TYPE_ARCHIVED,
					SESSION_TYPE_GROUP,
					SESSION_TYPE_LIVECHAT,
					SESSION_TYPE_ENQUIRY
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
