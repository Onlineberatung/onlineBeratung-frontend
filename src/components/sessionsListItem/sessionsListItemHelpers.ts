import OpenEnvelopeIcon from '../../resources/img/icons/envelope-open.svg?react';
import GroupChatIcon from '../../resources/img/icons/speech-bubble.svg?react';
import NewEnquiryIcon from '../../resources/img/icons/plus.svg?react';
import ClosedEnvelopeIcon from '../../resources/img/icons/envelope.svg?react';
import LiveChatIcon from '../../resources/img/icons/person-circle-solid.svg?react';

export const LIST_ICONS = {
	IS_READ: 'IS_READ',
	IS_UNREAD: 'IS_UNREAD',
	IS_GROUP_CHAT: 'IS_GROUP_CHAT',
	IS_NEW_ENQUIRY: 'IS_NEW_ENQUIRY',
	IS_LIVE_CHAT: 'IS_LIVE_CHAT'
};

export const getSessionsListItemIcon = (variant: string) => {
	switch (variant) {
		case LIST_ICONS.IS_READ:
			return OpenEnvelopeIcon;
		case LIST_ICONS.IS_GROUP_CHAT:
			return GroupChatIcon;
		case LIST_ICONS.IS_NEW_ENQUIRY:
			return NewEnquiryIcon;
		case LIST_ICONS.IS_LIVE_CHAT:
			return LiveChatIcon;
		default:
			return ClosedEnvelopeIcon;
	}
};
