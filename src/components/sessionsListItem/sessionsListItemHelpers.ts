import OpenEnvelopeIcon from '@mui/icons-material/Drafts';
import GroupChatIcon from '@mui/icons-material/Chat';
import NewEnquiryIcon from '@mui/icons-material/Add';
import ClosedEnvelopeIcon from '@mui/icons-material/Mail';
import LiveChatIcon from '@mui/icons-material/AccountCircle';

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
