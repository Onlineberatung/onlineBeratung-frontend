import { PrettyDate } from '../utils/dateHelpers';
import { ALIAS_MESSAGE_TYPES } from '../api/apiSendAliasMessage';
import { ForwardMessageDTO } from './ForwardMessageDTO';
import { VideoCallMessageDTO } from './VideoCallMessageDTO';

export interface MessageItem {
	_id: string;
	message: string;
	parsedMessage?: string;
	messageDate: PrettyDate;
	messageTime: string;
	displayName: string;
	username: string;
	askerRcId?: string;
	userId: string;
	consultant?: {
		username: string;
	};
	groupId?: string;
	unread: boolean;
	alias?: {
		forwardMessageDTO?: ForwardMessageDTO;
		videoCallMessageDTO?: VideoCallMessageDTO;
		content?: string;
		messageType: ALIAS_MESSAGE_TYPES;
	};
	attachments?: MessageService.Schemas.AttachmentDTO[];
	file?: MessageService.Schemas.FileDTO;
	t: null | 'e2e' | 'rm' | 'room-removed-read-only' | 'room-set-read-only';
	rid: string;
	own: boolean;
}
