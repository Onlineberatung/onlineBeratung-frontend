import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionsListItemIcon, LIST_ICONS } from './sessionsListItemHelpers';
import {
	convertISO8601ToMSSinceEpoch,
	getPrettyDateFromMessageDate,
	MILLISECONDS_PER_SECOND,
	prettyPrintTimeDifference
} from '../../utils/dateHelpers';
import {
	getSessionListPathForLocation,
	SESSION_LIST_TAB,
	SESSION_LIST_TYPES
} from '../session/sessionHelpers';
import { translate } from '../../utils/translate';
import {
	AUTHORITIES,
	ExtendedSessionInterface,
	hasUserAuthority,
	SessionTypeContext,
	STATUS_FINISHED,
	useConsultingType,
	UserDataContext
} from '../../globalState';
import { history } from '../app/app';
import { getGroupChatDate } from '../session/sessionDateHelpers';
import { markdownToDraft } from 'markdown-draft-js';
import { convertFromRaw } from 'draft-js';
import './sessionsListItem.styles';
import { Tag } from '../tag/Tag';
import { SessionListItemVideoCall } from './SessionListItemVideoCall';
import { SessionListItemAttachment } from './SessionListItemAttachment';
import clsx from 'clsx';
import { decryptText } from '../../utils/encryptionHelpers';
import { useE2EE } from '../../hooks/useE2EE';
import { useSearchParam } from '../../hooks/useSearchParams';

interface SessionListItemProps {
	session: ExtendedSessionInterface;
	defaultLanguage: string;
}

export const SessionListItemComponent = ({
	session,
	defaultLanguage
}: SessionListItemProps) => {
	const { sessionId, rcGroupId: groupIdFromParam } = useParams();
	const sessionIdFromParam = sessionId ? parseInt(sessionId) : null;

	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;
	const { userData } = useContext(UserDataContext);
	const { type } = useContext(SessionTypeContext);

	// Is List Item active
	const isChatActive =
		session.rid === groupIdFromParam ||
		session.item.id === sessionIdFromParam;

	const language = session.item.language || defaultLanguage;
	const consultingType = useConsultingType(session.item.consultingType);

	const { key, keyID, encrypted } = useE2EE(session.item.groupId);
	const [plainTextLastMessage, setPlainTextLastMessage] = useState(null);

	useEffect(() => {
		if (!session.item.e2eLastMessage) {
			return;
		}
		decryptText(
			session.item.e2eLastMessage.msg,
			keyID,
			key,
			encrypted,
			session.item.e2eLastMessage.t === 'e2e'
		).then((message) => {
			const rawMessageObject = markdownToDraft(message);
			const contentStateMessage = convertFromRaw(rawMessageObject);
			setPlainTextLastMessage(contentStateMessage.getPlainText());
		});
	}, [
		key,
		keyID,
		encrypted,
		session.item.groupId,
		session.item.e2eLastMessage
	]);

	const isAsker = hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData);
	const isAnonymous = hasUserAuthority(
		AUTHORITIES.ANONYMOUS_DEFAULT,
		userData
	);

	if (!session) {
		return null;
	}

	const handleOnClick = () => {
		if (session.item.groupId && session.item.id) {
			history.push(
				`${getSessionListPathForLocation()}/${session.item.groupId}/${
					session.item.id
				}${getSessionListTab()}`
			);
		} else if (
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
			session.isEmptyEnquiry
		) {
			history.push(`/sessions/user/view/write/${session.item.id}`);
		}
	};

	const iconVariant = () => {
		if (session.isGroup) {
			return LIST_ICONS.IS_GROUP_CHAT;
		} else if (session.isLive) {
			return LIST_ICONS.IS_LIVE_CHAT;
		} else if (session.isEmptyEnquiry) {
			return LIST_ICONS.IS_NEW_ENQUIRY;
		} else if (session.item.messagesRead) {
			return LIST_ICONS.IS_READ;
		} else {
			return LIST_ICONS.IS_UNREAD;
		}
	};
	const Icon = getSessionsListItemIcon(iconVariant());

	const prettyPrintDate = (
		messageDate: number, // seconds since epoch
		createDate: string, // ISO8601 string
		isLiveChat: boolean
	) => {
		const newestDate = Math.max(
			messageDate * MILLISECONDS_PER_SECOND,
			convertISO8601ToMSSinceEpoch(createDate)
		);

		return isLiveChat
			? prettyPrintTimeDifference(newestDate, Date.now())
			: getPrettyDateFromMessageDate(
					newestDate / MILLISECONDS_PER_SECOND
			  );
	};

	// Hide sessions if consultingType has been switched to group chat.
	// ToDo: What is with vice versa?
	if (session.isSession && consultingType?.groupChat.isGroupChat) {
		return null;
	}

	if (session.isGroup) {
		const isMyChat = () =>
			session.consultant && userData.userId === session.consultant.id;
		const defaultSubjectText = isMyChat()
			? translate('groupChat.listItem.subjectEmpty.self')
			: translate('groupChat.listItem.subjectEmpty.other');
		return (
			<div
				onClick={handleOnClick}
				className={clsx(
					'sessionsListItem',
					isChatActive && 'sessionsListItem--active'
				)}
				data-group-id={session.rid ? session.rid : ''}
				data-cy="session-list-item"
			>
				<div
					className={clsx(
						'sessionsListItem__content',
						isChatActive && 'sessionsListItem__content--active'
					)}
				>
					<div className="sessionsListItem__row">
						<div className="sessionsListItem__consultingType">
							{consultingType.titles.default}
						</div>
						<div className="sessionsListItem__date">
							{getGroupChatDate(session.item)}
						</div>
					</div>
					<div className="sessionsListItem__row">
						<div className="sessionsListItem__icon">
							<Icon />
						</div>
						<div
							className={clsx(
								'sessionsListItem__username',
								session.item.messagesRead &&
									'sessionsListItem__username--readLabel'
							)}
						>
							{session.item.topic}
						</div>
					</div>
					<div className="sessionsListItem__row">
						<div className="sessionsListItem__subject">
							{plainTextLastMessage
								? plainTextLastMessage
								: defaultSubjectText}
						</div>
						{session.item.attachment && (
							<SessionListItemAttachment
								attachment={session.item.attachment}
							/>
						)}
						{session.item.active && (
							<Tag
								text={translate(
									'groupChat.listItem.activeLabel'
								)}
								color="green"
							/>
						)}
					</div>
				</div>
			</div>
		);
	}

	const feedbackPath = `${getSessionListPathForLocation()}/${
		session.item.feedbackGroupId
	}/${session.item.id}${getSessionListTab()}`;

	const hasConsultantData = !!session.consultant;
	let sessionTopic = '';

	if (isAsker || isAnonymous) {
		if (hasConsultantData) {
			sessionTopic =
				session.consultant.displayName || session.consultant.username;
		} else if (session.isEmptyEnquiry) {
			sessionTopic = translate('sessionList.user.writeEnquiry');
		} else {
			sessionTopic = translate('sessionList.user.consultantUnknown');
		}
	} else {
		sessionTopic = session.user.username;
	}

	return (
		<div
			onClick={handleOnClick}
			className={clsx(
				`sessionsListItem`,
				isChatActive && `sessionsListItem--active`,
				session.isFeedback && 'sessionsListItem--yellowTheme'
			)}
			data-group-id={session.item.groupId}
			data-cy="session-list-item"
		>
			<div className="sessionsListItem__content">
				<div className="sessionsListItem__row">
					{type === SESSION_LIST_TYPES.TEAMSESSION &&
					hasUserAuthority(
						AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
						userData
					) &&
					session.consultant ? (
						<div className="sessionsListItem__consultingType">
							{translate('sessionList.user.peer')}:{' '}
							{session.consultant.firstName}{' '}
							{session.consultant.lastName}
						</div>
					) : (
						<div className="sessionsListItem__consultingType">
							{consultingType.titles.default}{' '}
							{session.item.consultingType !== 1 &&
							!isAsker &&
							!session.isLive
								? '/ ' + session.item.postcode
								: null}
						</div>
					)}
					<div className="sessionsListItem__date">
						{prettyPrintDate(
							session.item.messageDate,
							session.item.createDate,
							session.isLive
						)}
					</div>
				</div>
				<div className="sessionsListItem__row">
					<div className="sessionsListItem__icon">
						<Icon />
					</div>
					<div
						className={clsx(
							'sessionsListItem__username',
							session.item.messagesRead &&
								'sessionsListItem__username--readLabel'
						)}
					>
						{sessionTopic}
					</div>
				</div>
				<div className="sessionsListItem__row">
					{plainTextLastMessage ? (
						<div className="sessionsListItem__subject">
							{session.isEnquiry &&
							!session.isEmptyEnquiry &&
							language ? (
								<>
									<span>
										{/* we need a &nbsp; here, to ensure correct spacing for long messages */}
										{language.toUpperCase()} |&nbsp;
									</span>
									{plainTextLastMessage}
								</>
							) : (
								plainTextLastMessage
							)}
						</div>
					) : (
						(session.isEmptyEnquiry || session.isLive) && <span />
					)}
					{session.item.attachment && (
						<SessionListItemAttachment
							attachment={session.item.attachment}
						/>
					)}
					{session.item.videoCallMessageDTO && (
						<SessionListItemVideoCall
							videoCallMessage={session.item.videoCallMessageDTO}
							listItemUsername={
								session.user?.username ||
								session.consultant?.username
							}
							listItemAskerRcId={session.item.askerRcId}
						/>
					)}
					{!isAsker &&
						type !== SESSION_LIST_TYPES.ENQUIRY &&
						!session.isLive &&
						!session.item.feedbackRead &&
						!session.isFeedback && (
							<Tag
								color="yellow"
								text={translate('chatFlyout.feedback')}
								link={feedbackPath}
							/>
						)}
					{session.isLive &&
						session.item.status !== STATUS_FINISHED &&
						type !== SESSION_LIST_TYPES.ENQUIRY && (
							<Tag
								text={translate(
									'anonymous.listItem.activeLabel'
								)}
								color="green"
							/>
						)}
				</div>
			</div>
		</div>
	);
};
