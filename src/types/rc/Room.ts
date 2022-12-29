import { IUser } from './User';

export interface IRoom {
	_id: string;
	t: 'c' | 'd' | 'p' | 'l' | 'v';
	name?: string;
	fname?: string;
	msgs: number;
	default?: true;
	broadcast?: true;
	featured?: true;
	announcement?: string;
	joinCodeRequired?: boolean;
	announcementDetails?: {
		style?: string;
	};
	encrypted?: boolean;
	topic?: string;

	reactWhenReadOnly?: boolean;

	sysMes?: string[];

	u: Pick<IUser, '_id' | 'username' | 'name'>;
	uids?: Array<string>;

	//lastMessage?: IMessage;
	lm?: Date;
	usersCount: number;
	//callStatus?: CallStatus;
	webRtcCallStartTime?: Date;
	servedBy?: {
		_id: string;
	};

	streamingOptions?: {
		id?: string;
		type: string;
	};

	prid?: string;
	avatarETag?: string;

	teamMain?: boolean;
	teamId?: string;
	teamDefault?: boolean;
	open?: boolean;

	autoTranslateLanguage: string;
	autoTranslate?: boolean;
	unread?: number;
	alert?: boolean;
	hideUnreadStatus?: boolean;
	hideMentionStatus?: boolean;

	muted?: string[];
	unmuted?: string[];

	usernames?: string[];
	ts?: Date;

	cl?: boolean;
	ro?: boolean;
	favorite?: boolean;
	archived?: boolean;
	description?: string;
	createdOTR?: boolean;
	e2eKeyId?: string;

	/* @deprecated */
	federated?: boolean;

	channel?: { _id: string };
}

export interface ICreatedRoom extends IRoom {
	rid: string;
	inserted: boolean;
}
