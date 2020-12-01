import { ReactComponent as OpenEnvelopeIcon } from '../../resources/img/icons/envelope-open.svg';
import { ReactComponent as GroupChatIcon } from '../../resources/img/icons/speech-bubble.svg';
import { ReactComponent as NewEnquiryIcon } from '../../resources/img/icons/plus.svg';
import { ReactComponent as ClosedEnvelopeIcon } from '../../resources/img/icons/envelope.svg';

export const LIST_ICONS = {
	IS_READ: 'IS_READ',
	IS_UNREAD: 'IS_UNREAD',
	IS_GROUP_CHAT: 'IS_GROUP_CHAT',
	IS_NEW_ENQUIRY: 'IS_NEW_ENQUIRY'
};

export const getSessionsListItemIcon = (variant: string) => {
	switch (variant) {
		case LIST_ICONS.IS_READ:
			return OpenEnvelopeIcon;
		case LIST_ICONS.IS_GROUP_CHAT:
			return GroupChatIcon;
		case LIST_ICONS.IS_NEW_ENQUIRY:
			return NewEnquiryIcon;
		default:
			return ClosedEnvelopeIcon;
	}
};
