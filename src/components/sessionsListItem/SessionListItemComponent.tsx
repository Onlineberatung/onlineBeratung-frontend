import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { getSessionsListItemIcon, LIST_ICONS } from './sessionsListItemHelpers';
import { getPrettyDateFromMessageDate } from '../../utils/dateHelpers';
import {
	typeIsTeamSession,
	getTypeOfLocation,
	getSessionListPathForLocation,
	getChatTypeForListItem,
	typeIsEnquiry,
	typeIsUser,
	getChatItemForSession,
	isGroupChatForSessionItem
} from '../session/sessionHelpers';
import { translate } from '../../utils/translate';
import {
	ActiveSessionGroupIdContext,
	SessionsDataContext,
	getActiveSession,
	UserDataContext,
	getSessionsDataKeyForSessionType,
	hasUserAuthority,
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
import { useConsultingType } from '../../globalState/provider/ConsultingTypesProvider';

interface SessionListItemProps {
	type: string;
	id: number;
}

export const SessionListItemComponent = (props: SessionListItemProps) => {
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
	let plainTextLastMessage = '';
	const consultingType = useConsultingType(listItem.id);

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
				}`
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
		} else if (isCurrentSessionNewEnquiry) {
			return LIST_ICONS.IS_NEW_ENQUIRY;
		} else if (isRead) {
			return LIST_ICONS.IS_READ;
		} else {
			return LIST_ICONS.IS_UNREAD;
		}
	};
	const Icon = getSessionsListItemIcon(iconVariant());

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
							{consultingType.titles.default}{' '}
							{listItem.consultingType !== 1 && !typeIsUser(type)
								? '/ ' + listItem.postcode
								: null}
						</div>
					)}
					<div className="sessionsListItem__date">
						{listItem.messageDate
							? getPrettyDateFromMessageDate(listItem.messageDate)
							: ''}
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
						{typeIsUser(type)
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
						isCurrentSessionNewEnquiry && <span></span>
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
					{!typeIsUser(type) &&
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
				</div>
			</div>
		</div>
	);
};
