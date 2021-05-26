import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
	getChatTypeForListItem,
	typeIsEnquiry,
	getChatItemForSession,
	isGroupChatForSessionItem
} from '../session/sessionHelpers';
import { translate, getResortTranslation } from '../../utils/translate';
import {
	ActiveSessionGroupIdContext,
	SessionsDataContext,
	getActiveSession,
	UserDataContext,
	getSessionsDataKeyForSessionType,
	hasUserAuthority,
	isAnonymousSession,
	AUTHORITIES
} from '../../globalState';
import { history } from '../app/app';
import { getGroupChatDate } from '../session/sessionDateHelpers';
import { markdownToDraft } from 'markdown-draft-js';
import { convertFromRaw } from 'draft-js';
import './sessionsListItem.styles';
import { Tag } from '../tag/Tag';
import { isGroupChatConsultingType } from '../../utils/resorts';
import { SessionListItemVideoCall } from './SessionListItemVideoCall';
import { SessionListItemAttachment } from './SessionListItemAttachment';

interface SessionListItemProps {
	type: string;
	id: number;
}

export const SessionListItemComponent = (props: SessionListItemProps) => {
	const sessionListTab = new URLSearchParams(useLocation().search).get(
		'sessionListTab'
	);
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId, setActiveSessionGroupId } = useContext<any>(
		ActiveSessionGroupIdContext
	);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const [isRead, setIsRead] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const { userData } = useContext(UserDataContext);
	const type = getTypeOfLocation();

	const currentSessionData = sessionsData[
		getSessionsDataKeyForSessionType(type)
	].filter((session) => props.id === getChatItemForSession(session).id)[0];
	const listItem =
		currentSessionData[getChatTypeForListItem(currentSessionData)];
	const isGroupChat = isGroupChatForSessionItem(currentSessionData);
	const isLiveChat = isAnonymousSession(currentSessionData?.session);
	let plainTextLastMessage = '';

	if (listItem.lastMessage) {
		const rawMessageObject = markdownToDraft(listItem.lastMessage);
		const contentStateMessage = convertFromRaw(rawMessageObject);
		plainTextLastMessage = contentStateMessage.getPlainText();
	}

	const isCurrentSessionNewEnquiry =
		currentSessionData.session && currentSessionData.session.status === 0;

	useEffect(() => {
		const chatItem = activeSession
			? getChatItemForSession(activeSession)
			: null;
		setIsRead(chatItem?.id === listItem.id || listItem.messagesRead);

		if (activeSessionGroupId && isRequestInProgress) {
			setIsRequestInProgress(false);
		}
	}, [activeSessionGroupId, sessionsData]); // eslint-disable-line react-hooks/exhaustive-deps

	if (!sessionsData) {
		return null;
	}
	if (!currentSessionData) {
		return null;
	}

	const handleOnClick = () => {
		if (
			!isCurrentSessionNewEnquiry &&
			(isRequestInProgress || listItem.groupId === activeSessionGroupId)
		) {
			return null;
		}
		setIsRequestInProgress(true);

		if (listItem.groupId) {
			history.push(
				`${getSessionListPathForLocation()}/${listItem.groupId}/${
					listItem.id
				}${sessionListTab ? `?sessionListTab=${sessionListTab}` : ``}`
			);
		} else if (
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
			isCurrentSessionNewEnquiry
		) {
			setActiveSessionGroupId(listItem.id);
			history.push(`/sessions/user/view/write`);
		}
	};

	const iconVariant = () => {
		if (isGroupChat) {
			return LIST_ICONS.IS_GROUP_CHAT;
		} else if (isLiveChat) {
			return LIST_ICONS.IS_LIVE_CHAT;
		} else if (isCurrentSessionNewEnquiry) {
			return LIST_ICONS.IS_NEW_ENQUIRY;
		} else if (isRead) {
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

	if (isGroupChatConsultingType(currentSessionData.session?.consultingType)) {
		return null;
	}

	if (isGroupChat) {
		const isMyChat = () =>
			currentSessionData.consultant &&
			userData.userId === currentSessionData.consultant.id;
		const defaultSubjectText = isMyChat()
			? translate('groupChat.listItem.subjectEmpty.self')
			: translate('groupChat.listItem.subjectEmpty.other');
		return (
			<div
				onClick={handleOnClick}
				className={
					activeSession && activeSession.chat?.id === listItem.id
						? `sessionsListItem sessionsListItem--active`
						: `sessionsListItem`
				}
				data-group-id={listItem.groupId ? listItem.groupId : ''}
				data-cy="session-list-item"
			>
				<div
					className={
						activeSession && activeSession.chat?.id === listItem.id
							? `sessionsListItem__content sessionsListItem__content--active`
							: `sessionsListItem__content`
					}
				>
					<div className="sessionsListItem__row">
						<div className="sessionsListItem__consultingType">
							{getResortTranslation(listItem.consultingType)}
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
							className={
								isRead
									? `sessionsListItem__username sessionsListItem__username--readLabel`
									: `sessionsListItem__username`
							}
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
	}/${listItem.id}`;
	return (
		<div
			onClick={handleOnClick}
			className={
				(activeSession && activeSession.session?.id === listItem?.id) ||
				activeSessionGroupId === listItem.id
					? `sessionsListItem sessionsListItem--active`
					: `sessionsListItem`
			}
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
							{getResortTranslation(listItem.consultingType)}{' '}
							{listItem.consultingType !== 1 &&
							!hasUserAuthority(
								AUTHORITIES.ASKER_DEFAULT,
								userData
							) &&
							!isLiveChat
								? '/ ' + listItem.postcode
								: null}
						</div>
					)}
					<div className="sessionsListItem__date">
						{prettyPrintDate(
							listItem.messageDate,
							listItem.createDate,
							isLiveChat
						)}
					</div>
				</div>
				<div className="sessionsListItem__row">
					<div className="sessionsListItem__icon">
						<Icon />
					</div>
					<div
						className={
							isRead
								? `sessionsListItem__username sessionsListItem__username--readLabel`
								: `sessionsListItem__username`
						}
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
							{plainTextLastMessage}
						</div>
					) : (
						(isCurrentSessionNewEnquiry || isLiveChat) && (
							<span></span>
						)
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
					{isLiveChat && (
						<Tag
							text={translate('anonymous.listItem.activeLabel')}
							color="green"
						/>
					)}
				</div>
			</div>
		</div>
	);
};
