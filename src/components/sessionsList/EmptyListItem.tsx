import React, { useContext } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ListInfo } from '../listInfo/ListInfo';
import { ReactComponent as ChatWaitingIllustration } from '../../resources/img/illustrations/chat-waiting.svg';
import { ReactComponent as NoMessagesIllustration } from '../../resources/img/illustrations/no-messages.svg';
import {
	SESSION_LIST_TAB_ARCHIVE,
	SESSION_LIST_TYPES,
	SESSION_LIST_TAB_ANONYMOUS
} from '../session/sessionHelpers';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../globalState';

interface EmptyListItemProps {
	type: SESSION_LIST_TYPES;
	sessionListTab: string;
}

export const EmptyListItem = ({ type, sessionListTab }: EmptyListItemProps) => {
	const { t } = useTranslation();
	const { userData } = useContext(UserDataContext);

	const emptyTitle = useMemo(() => {
		if (sessionListTab === SESSION_LIST_TAB_ARCHIVE) {
			return t('sessionList.empty.archived');
		}

		switch (type) {
			case SESSION_LIST_TYPES.TEAMSESSION:
				const emptyKey = hasUserAuthority(
					AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
					userData
				)
					? 'peerSessions'
					: 'teamSessions';
				return t(`sessionList.empty.${emptyKey}`);
			case SESSION_LIST_TYPES.ENQUIRY:
				return t('sessionList.empty.known');
			case SESSION_LIST_TYPES.MY_SESSION:
			default:
				return t('sessionList.empty.mySessions');
		}
	}, [sessionListTab, userData, type, t]);
	return (
		<ListInfo
			headline={emptyTitle}
			Illustration={
				sessionListTab !== SESSION_LIST_TAB_ANONYMOUS
					? NoMessagesIllustration
					: ChatWaitingIllustration
			}
		/>
	);
};
