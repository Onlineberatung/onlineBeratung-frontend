import { VideoCallMessageDTO } from '../../components/message/MessageItemComponent';
import { AgencyDataInterface } from './UserDataInterface';

export const SESSION_DATA_KEY_ENQUIRIES = 'enquiries';
export const SESSION_DATA_KEY_MY_SESSIONS = 'mySessions';
export const SESSION_DATA_KEY_TEAM_SESSIONS = 'teamSessions';

export type SessionDataKeyEnquiries = typeof SESSION_DATA_KEY_ENQUIRIES;
export type SessionDataKeyMySessions = typeof SESSION_DATA_KEY_MY_SESSIONS;
export type SessionDataKeyTeamSessions = typeof SESSION_DATA_KEY_TEAM_SESSIONS;

export type SessionDataKeys =
	| SessionDataKeyEnquiries
	| SessionDataKeyMySessions
	| SessionDataKeyTeamSessions;

export type SessionsDataInterface = {
	[key in SessionDataKeys]?: ListItemInterface[];
};

export interface ListItemInterface {
	agency?: AgencyDataInterface;
	consultant?: SessionConsultantInterface;
	session?: SessionItemInterface;
	chat?: GroupChatItemInterface;
	user?: SessionUserInterface;
	language?: string;
	latestMessage?: string;
}

export interface SessionConsultantInterface {
	consultantId: string;
	absent: boolean;
	absenceMessage: string;
	displayName?: string;
	username: string;
	firstName?: string;
	lastName?: string;
	id?: string;
}

export const STATUS_EMPTY = 0;
type statusEmpty = typeof STATUS_EMPTY;

export const STATUS_ENQUIRY = 1;
type statusEnquiry = typeof STATUS_ENQUIRY;

export const STATUS_ACTIVE = 2;
type statusActive = typeof STATUS_ACTIVE;

export const STATUS_FINISHED = 3;
type statusFinished = typeof STATUS_FINISHED;

export const STATUS_ARCHIVED = 4;
type statusArchived = typeof STATUS_ARCHIVED;

export const REGISTRATION_TYPE_ANONYMOUS = 'ANONYMOUS';
type registrationTypeAnonymous = typeof REGISTRATION_TYPE_ANONYMOUS;

export const REGISTRATION_TYPE_REGISTERED = 'REGISTERED';
type registrationTypeRegistered = typeof REGISTRATION_TYPE_REGISTERED;

export interface TopicSessionInterface {
	id: number;
	name: string;
	description: string;
}

export interface SessionItemInterface {
	agencyId: number;
	askerRcId: string;
	attachment: UserService.Schemas.SessionAttachmentDTO;
	consultingType: number;
	feedbackGroupId?: string;
	feedbackRead?: boolean;
	groupId: string;
	id: number;
	e2eLastMessage: {
		t: string;
		msg: string;
	};
	lastMessage?: string;
	lastMessageType?: string;
	messageDate: number;
	createDate: string;
	messagesRead: boolean;
	messageTime?: number;
	postcode: number;
	registrationType: registrationTypeAnonymous | registrationTypeRegistered;
	status:
		| statusEmpty
		| statusEnquiry
		| statusActive
		| statusFinished
		| statusArchived;
	isPeerChat: boolean;
	isTeamSession: boolean;
	videoCallMessageDTO: VideoCallMessageDTO;
	language?: string;
	isFeedbackSession: boolean;
	topic: TopicSessionInterface;
}

export interface GroupChatItemInterface {
	active: boolean;
	assignedAgencies: AgencyService.Schemas.AgencyResponseDTO[];
	attachment: UserService.Schemas.SessionAttachmentDTO;
	consultingType: number;
	duration: number;
	groupId: string;
	hintMessage: string;
	id: number;
	lastMessage: string;
	lastMessageType?: string;
	e2eLastMessage: {
		t: string;
		msg: string;
	};
	messageDate: number;
	messagesRead: boolean;
	moderators: string[];
	repetitive: boolean;
	startDate: string;
	startTime: string;
	subscribed: boolean;
	topic: string;
	createdAt: string;
}

export interface SessionUserInterface {
	username: string;
	sessionData: SessionUserDataInterface;
}

export interface SessionUserDataInterface {
	addictiveDrugs?: string;
	age?: number;
	gender?: number;
	relation?: number;
	state?: number;
}

export interface ListItemsResponseInterface {
	count: number;
	offset: number;
	sessions: ListItemInterface[];
	total: number;
}
