import { VideoCallMessageDTO } from '../../components/message/MessageItemComponent';
import { AgencyDataInterface } from './UserDataInterface';

export interface SessionsDataInterface {
	enquiries?: ListItemInterface[];
	mySessions?: ListItemInterface[];
	teamSessions?: ListItemInterface[];
}

export interface ListItemInterface {
	agency?: AgencyDataInterface;
	consultant?: SessionConsultantInterface;
	session?: SessionItemInterface;
	chat?: GroupChatItemInterface;
	user?: SessionUserInterface;
	language?: string;
}

export interface SessionConsultantInterface {
	absent: boolean;
	absenceMessage: boolean;
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

export interface SessionItemInterface {
	agencyId: number;
	askerRcId: string;
	attachment: UserService.Schemas.SessionAttachmentDTO;
	consultingType: number;
	feedbackGroupId?: string;
	feedbackRead?: boolean;
	groupId: string;
	id: number;
	lastMessage?: string;
	messageDate: number;
	messagesRead: boolean;
	messageTime?: number;
	monitoring: boolean;
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
}

export interface GroupChatItemInterface {
	active: boolean;
	attachment: UserService.Schemas.SessionAttachmentDTO;
	consultingType: number;
	duration: number;
	groupId: string;
	id: number;
	lastMessage: string;
	messageDate: number;
	messagesRead: boolean;
	moderators: string[];
	repetitive: boolean;
	startDate: string;
	startTime: string;
	subscribed: boolean;
	topic: string;
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
