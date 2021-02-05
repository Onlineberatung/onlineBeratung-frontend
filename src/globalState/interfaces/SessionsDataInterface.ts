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
}

export interface SessionConsultantInterface {
	absent: boolean;
	absenceMessage: boolean;
	username: string;
	firstName?: string;
	lastName?: string;
	id?: string;
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
	lastMessage?: string;
	messageDate: number;
	messagesRead: boolean;
	messageTime?: number;
	monitoring: boolean;
	postcode: number;
	status: number;
	teamSession: boolean;
	videoCallMessageDTO: VideoCallMessageDTO;
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
