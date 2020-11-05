import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSessionsListItemIcon, LIST_ICONS } from './sessionsListItemHelpers';
import { getPrettyDateFromMessageDate } from '../../resources/scripts/helpers/dateHelpers';
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
import {
	translate,
	getResortTranslation
} from '../../resources/scripts/i18n/translate';
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
import { getIconForAttachmentType } from '../messageSubmitInterface/messageSubmitInterfaceComponent';
import { getGroupChatDate } from '../session/sessionDateHelpers';
import { markdownToDraft } from 'markdown-draft-js';
import { convertFromRaw } from 'draft-js';

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

	if (!sessionsData) {
		return null;
	}
	const { userData } = useContext(UserDataContext);
	const type = getTypeOfLocation();

	const currentSessionData = sessionsData[
		getSessionsDataKeyForSessionType(type)
	].filter((session) => props.id === getChatItemForSession(session).id)[0];
	if (!currentSessionData) {
		return null;
	}
	const listItem =
		currentSessionData[getChatTypeForListItem(currentSessionData)];
	const isGroupChat = isGroupChatForSessionItem(currentSessionData);
	let plainTextLastMessage = '';

	if (listItem.lastMessage) {
		const rawMessageObject = markdownToDraft(listItem.lastMessage);
		const contentStateMessage = convertFromRaw(rawMessageObject);
		plainTextLastMessage = contentStateMessage.getPlainText();
	}

	const isCurrentSessionNewEnquiry =
		currentSessionData.session && currentSessionData.session.status === 0;

	useEffect(() => {
		if (!isGroupChat) {
			setIsRead(
				(activeSession && activeSession.session.id === listItem.id) ||
					listItem.messagesRead
			);
		}

		if (activeSessionGroupId && isRequestInProgress) {
			setIsRequestInProgress(false);
		}
	}, [activeSessionGroupId, sessionsData]);

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
			hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) &&
			isCurrentSessionNewEnquiry
		) {
			setActiveSessionGroupId(listItem.id);
			history.push(`/sessions/user/view/write`);
		}
	};

	const handleLabelClick = (e) => {
		e.stopPropagation();
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
					activeSession && activeSession.chat.id === listItem.id
						? `sessionsListItem sessionsListItem--active`
						: `sessionsListItem`
				}
				data-group-id={listItem.groupId ? listItem.groupId : ''}
			>
				<div
					className={
						activeSession && activeSession.chat.id === listItem.id
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
						<div
							className="sessionsListItem__icon"
							dangerouslySetInnerHTML={{
								__html: getSessionsListItemIcon(iconVariant())
							}}
						></div>
						<div className="sessionsListItem__username">
							{listItem.topic}
						</div>
						{listItem.active ? (
							<div className="sessionsListItem__activeLabel">
								{translate('groupChat.listItem.activeLabel')}
							</div>
						) : null}
					</div>
					<div className="sessionsListItem__row">
						<div className="sessionsListItem__subject">
							{listItem.lastMessage
								? plainTextLastMessage
								: defaultSubjectText}
						</div>
						{listItem.attachment ? (
							<div className="sessionsListItem__subject">
								<span className="sessionsListItem__subject__attachment">
									{getIconForAttachmentType(
										listItem.attachment.fileType
									)}
								</span>
								<span>
									{listItem.attachment.fileReceived
										? translate(
												'attachments.list.label.received'
										  )
										: translate(
												'attachments.list.label.sent'
										  )}
								</span>
							</div>
						) : null}
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
				(activeSession && activeSession.session.id === listItem.id) ||
				activeSessionGroupId === listItem.id
					? `sessionsListItem sessionsListItem--active`
					: `sessionsListItem`
			}
			data-group-id={listItem.groupId}
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
							{listItem.consultingType != 1 && !typeIsUser(type)
								? '/ ' + listItem.postcode
								: null}
						</div>
					)}

					{!typeIsUser(type) &&
					!typeIsEnquiry(type) &&
					!listItem.feedbackRead &&
					!(
						activeSession &&
						activeSession.isFeedbackSession &&
						activeSession.session.feedbackGroupId ===
							listItem.feedbackGroupId
					) ? (
						<Link
							onClick={(e) => handleLabelClick(e)}
							to={feedbackPath}
							className="sessionsListItem__feedbackLabel"
							role="button"
						>
							{translate('chatFlyout.feedback')}
						</Link>
					) : null}
				</div>
				<div className="sessionsListItem__row">
					<div
						className="sessionsListItem__icon"
						dangerouslySetInnerHTML={{
							__html: getSessionsListItemIcon(iconVariant())
						}}
					></div>
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
					) : isCurrentSessionNewEnquiry ? (
						<span></span>
					) : null}
					{listItem.attachment ? (
						<div className="sessionsListItem__subject">
							<span className="sessionsListItem__subject__attachment">
								{getIconForAttachmentType(
									listItem.attachment.fileType
								)}
							</span>
							<span>
								{listItem.attachment.fileReceived
									? translate(
											'attachments.list.label.received'
									  )
									: translate('attachments.list.label.sent')}
							</span>
						</div>
					) : null}
					<div className="sessionsListItem__date">
						{listItem.messageDate
							? getPrettyDateFromMessageDate(listItem.messageDate)
							: ''}
					</div>
				</div>
			</div>
		</div>
	);
};
