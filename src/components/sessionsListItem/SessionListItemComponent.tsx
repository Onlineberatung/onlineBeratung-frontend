import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getSessionsListItemIcon, LIST_ICONS } from './sessionsListItemHelpers';
import {
	MILLISECONDS_PER_SECOND,
	convertISO8601ToMSSinceEpoch,
	getPrettyDateFromMessageDate,
	prettyPrintTimeDifference
} from '../../utils/dateHelpers';
import {
	typeIsTeamSession,
	getTypeOfLocation,
	getSessionListPathForLocation,
	typeIsEnquiry,
	getChatItemForSession,
	SESSION_LIST_TYPES,
	isSessionChat,
	isGroupChat,
	isLiveChat
} from '../session/sessionHelpers';
import { translate } from '../../utils/translate';
import {
	SessionsDataContext,
	UserDataContext,
	getSessionsDataKeyForSessionType,
	hasUserAuthority,
	AUTHORITIES,
	useConsultingType,
	getActiveSession,
	STATUS_FINISHED,
	STATUS_EMPTY,
	STATUS_ENQUIRY
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

interface SessionListItemProps {
	type: SESSION_LIST_TYPES;
	id: number;
	defaultLanguage: string;
}

export const SessionListItemComponent = ({
	id,
	defaultLanguage
}: SessionListItemProps) => {
	const { sessionId, rcGroupId: groupIdFromParam } = useParams();
	const sessionIdFromParam = sessionId ? parseInt(sessionId) : null;

	const sessionListTab = new URLSearchParams(useLocation().search).get(
		'sessionListTab'
	);
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;
	const { sessionsData } = useContext(SessionsDataContext);
	const [activeSession, setActiveSession] = useState(null);
	const { userData } = useContext(UserDataContext);
	const type = getTypeOfLocation();

	const currentSessionData = sessionsData[
		getSessionsDataKeyForSessionType(type)
	].find((session) => id === getChatItemForSession(session).id);
	const listItem = getChatItemForSession(currentSessionData);

	const isFeedbackChat =
		'feedbackGroupId' in listItem &&
		listItem.feedbackGroupId === groupIdFromParam;

	const language =
		(isSessionChat(listItem) && listItem?.language) || defaultLanguage;

	const isLiveChatFinished = isSessionChat(listItem)
		? listItem.status === STATUS_FINISHED
		: false;
	let plainTextLastMessage = '';
	const consultingType = useConsultingType(listItem.consultingType);
	const sessionConsultingType = useConsultingType(
		currentSessionData.session?.consultingType
	);

	useEffect(() => {
		setActiveSession(getActiveSession(groupIdFromParam, sessionsData));
	}, [groupIdFromParam]); // eslint-disable-line react-hooks/exhaustive-deps

	if (listItem.lastMessage) {
		const rawMessageObject = markdownToDraft(listItem.lastMessage);
		const contentStateMessage = convertFromRaw(rawMessageObject);
		plainTextLastMessage = contentStateMessage.getPlainText();
	}

	const isCurrentSessionNewEnquiry =
		currentSessionData.session &&
		currentSessionData.session.status === STATUS_EMPTY;

	const isCurrentSessionFirstContactMessage =
		currentSessionData.session &&
		currentSessionData.session.status === STATUS_ENQUIRY;

	if (!sessionsData) {
		return null;
	}

	if (!currentSessionData) {
		return null;
	}

	const handleOnClick = () => {
		if (listItem.groupId && listItem.id) {
			history.push(
				`${getSessionListPathForLocation()}/${listItem.groupId}/${
					listItem.id
				}${getSessionListTab()}`
			);
		} else if (
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
			isCurrentSessionNewEnquiry
		) {
			history.push(`/sessions/user/view/write/${listItem.id}`);
		}
	};

	const iconVariant = () => {
		if (isGroupChat(listItem)) {
			return LIST_ICONS.IS_GROUP_CHAT;
		} else if (isLiveChat(listItem)) {
			return LIST_ICONS.IS_LIVE_CHAT;
		} else if (isCurrentSessionNewEnquiry) {
			return LIST_ICONS.IS_NEW_ENQUIRY;
		} else if (listItem.messagesRead) {
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

	if (sessionConsultingType?.groupChat.isGroupChat) {
		return null;
	}

	if (isGroupChat(listItem)) {
		const isMyChat = () =>
			currentSessionData.consultant &&
			userData.userId === currentSessionData.consultant.id;
		const defaultSubjectText = isMyChat()
			? translate('groupChat.listItem.subjectEmpty.self')
			: translate('groupChat.listItem.subjectEmpty.other');
		return (
			<div
				onClick={handleOnClick}
				className={clsx(
					'sessionsListItem',
					activeSession &&
						activeSession.chat?.id === listItem.id &&
						'sessionsListItem--active'
				)}
				data-group-id={listItem.groupId ? listItem.groupId : ''}
				data-cy="session-list-item"
			>
				<div
					className={clsx(
						'sessionsListItem__content',
						activeSession &&
							activeSession.chat?.id === listItem.id &&
							'sessionsListItem__content--active'
					)}
				>
					<div className="sessionsListItem__row">
						<div className="sessionsListItem__consultingType">
							{consultingType.titles.default}
						</div>
						<div className="sessionsListItem__date">
							{getGroupChatDate(listItem)}
						</div>
					</div>
					<div className="sessionsListItem__row">
						<div className="sessionsListItem__icon">
							<Icon />
						</div>
						<div
							className={clsx(
								'sessionsListItem__username',
								listItem.messagesRead &&
									'sessionsListItem__username--readLabel'
							)}
						>
							{listItem.topic}
						</div>
					</div>
					<div className="sessionsListItem__row">
						<div className="sessionsListItem__subject">
							{listItem.lastMessage
								? plainTextLastMessage
								: defaultSubjectText}
						</div>
						{listItem.attachment && (
							<SessionListItemAttachment
								attachment={listItem.attachment}
							/>
						)}
						{listItem.active && (
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
		listItem.feedbackGroupId
	}/${listItem.id}${getSessionListTab()}`;
	return (
		<div
			onClick={handleOnClick}
			className={clsx(
				`sessionsListItem`,
				((activeSession &&
					activeSession.session?.id === listItem?.id) ||
					sessionIdFromParam === listItem.id) &&
					`sessionsListItem--active`,
				isFeedbackChat && 'sessionsListItem--yellowTheme'
			)}
			data-group-id={listItem.groupId}
			data-cy="session-list-item"
		>
			<div className="sessionsListItem__content">
				<div className="sessionsListItem__row">
					{typeIsTeamSession(type) &&
					hasUserAuthority(
						AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
						userData
					) &&
					currentSessionData.consultant ? (
						<div className="sessionsListItem__consultingType">
							{translate('sessionList.user.peer')}:{' '}
							{currentSessionData.consultant.firstName}{' '}
							{currentSessionData.consultant.lastName}
						</div>
					) : (
						<div className="sessionsListItem__consultingType">
							{consultingType.titles.default}{' '}
							{listItem.consultingType !== 1 &&
							!hasUserAuthority(
								AUTHORITIES.ASKER_DEFAULT,
								userData
							) &&
							!isLiveChat(listItem)
								? '/ ' + listItem.postcode
								: null}
						</div>
					)}
					<div className="sessionsListItem__date">
						{prettyPrintDate(
							listItem.messageDate,
							listItem.createDate,
							isLiveChat(listItem)
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
							listItem.messagesRead &&
								'sessionsListItem__username--readLabel'
						)}
					>
						{hasUserAuthority(
							AUTHORITIES.ASKER_DEFAULT,
							userData
						) ||
						hasUserAuthority(
							AUTHORITIES.ANONYMOUS_DEFAULT,
							userData
						)
							? currentSessionData.consultant
								? currentSessionData.consultant.username
								: isCurrentSessionNewEnquiry
								? translate('sessionList.user.writeEnquiry')
								: translate(
										'sessionList.user.consultantUnknown'
								  )
							: currentSessionData.user.username}
					</div>
				</div>
				<div className="sessionsListItem__row">
					{listItem.lastMessage ? (
						<div className="sessionsListItem__subject">
							{isCurrentSessionFirstContactMessage && language ? (
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
						(isCurrentSessionNewEnquiry ||
							isLiveChat(listItem)) && <span />
					)}
					{listItem.attachment && (
						<SessionListItemAttachment
							attachment={listItem.attachment}
						/>
					)}
					{listItem.videoCallMessageDTO && (
						<SessionListItemVideoCall
							videoCallMessage={listItem.videoCallMessageDTO}
							listItemUsername={
								currentSessionData.user?.username ||
								currentSessionData.consultant?.username
							}
							listItemAskerRcId={listItem.askerRcId}
						/>
					)}
					{!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
						!typeIsEnquiry(type) &&
						!listItem.feedbackRead &&
						!isLiveChat(listItem) &&
						!(
							activeSession &&
							activeSession.isFeedbackSession &&
							activeSession.session.feedbackGroupId ===
								listItem.feedbackGroupId
						) && (
							<Tag
								color="yellow"
								text={translate('chatFlyout.feedback')}
								link={feedbackPath}
							/>
						)}
					{isLiveChat(listItem) &&
						!typeIsEnquiry(type) &&
						!isLiveChatFinished && (
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
