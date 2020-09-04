import * as React from 'react';
import { useContext } from 'react';
import { getSessionsListItemDate } from '../../sessionsListItem/ts/sessionsListItemHelpers';
import {
	UserDataContext,
	ActiveSessionGroupIdContext,
	SessionsDataContext,
	getActiveSession,
	hasUserAuthority,
	AUTHORITIES
} from '../../../globalState';
import {
	SESSION_TYPES,
	getChatItemForSession
} from '../../session/ts/sessionHelpers';
import { ForwardIcon } from './actions/ForwardIcon';
import { MessageMetaData } from './MessageMetaData';
import { CopyIcon } from './actions/CopyIcon';
import { MessageUsername } from './MessageUsername';
import { getIconForAttachmentType } from '../../messageSubmitInterface/ts/messageSubmitInterfaceComponent';
import { translate } from '../../../resources/ts/i18n/translate';
import {
	ATTACHMENT_TRANSLATE_FOR_TYPE,
	getAttachmentSizeMBForKB
} from '../../messageSubmitInterface/ts/attachmentHelpers';
import { tld } from '../../../resources/ts/config';
import { markdownToDraft } from 'markdown-draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw, ContentState } from 'draft-js';
import { urlifyLinksInText } from '../../messageSubmitInterface/ts/richtextHelpers';
import { SVG } from '../../svgSet/ts/SVG';
import { ICON_KEYS } from '../../svgSet/ts/SVGHelpers';

export interface MessageItem {
	id?: number;
	message: string;
	messageDate: string | number;
	messageTime: string;
	username?: string;
	askerRcId?: string;
	userId?: string;
	consultant?: {
		username: string;
	};
	groupId?: string;
	isNotRead?: boolean;
	alias?: any;
	attachments?: any;
	file?: any;
}

interface MessageItemComponentProps extends MessageItem {
	isOnlyEnquiry?: boolean;
	isMyMessage: boolean;
	type: string;
	clientName: string;
}

export const MessageItemComponent = (props: MessageItemComponentProps) => {
	const { userData } = useContext(UserDataContext);
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const rawMessageObject = markdownToDraft(props.message);
	const contentStateMessage: ContentState = convertFromRaw(rawMessageObject);
	const renderedMessage = contentStateMessage.hasText()
		? urlifyLinksInText(stateToHTML(contentStateMessage))
		: '';
	const hasRenderedMessage = renderedMessage && renderedMessage.length > 0;
	const chatItem = getChatItemForSession(activeSession);

	const getMessageDate = () => {
		if (props.messageDate) {
			return (
				<div className="messageItem__date">
					{typeof props.messageDate === 'number'
						? getSessionsListItemDate(props.messageDate)
						: props.messageDate}
				</div>
			);
		}
		return null;
	};

	const getUsernameType = () => {
		if (props.isMyMessage) {
			return 'self';
		}
		if (props.alias) {
			return 'forwarded';
		}
		if (props.username === 'system') {
			return 'system';
		}
		if (isUserMessage()) {
			return 'user';
		}
		return 'consultant';
	};

	const isUserMessage = () =>
		props.userId === props.askerRcId ||
		(chatItem.moderators && !chatItem.moderators.includes(props.userId));
	const showForwardIcon = () =>
		hasRenderedMessage &&
		activeSession.type !== SESSION_TYPES.ENQUIRY &&
		chatItem.feedbackGroupId &&
		hasUserAuthority(AUTHORITIES.USE_FEEDBACK, userData) &&
		!activeSession.isFeedbackSession;
	return (
		<div
			className={
				props.isMyMessage
					? `messageItem messageItem--right`
					: `messageItem`
			}
		>
			{getMessageDate()}
			<div
				className={
					props.isMyMessage
						? `messageItem__messageWrap messageItem__messageWrap--right`
						: `messageItem__messageWrap`
				}
			>
				<MessageUsername
					alias={props.alias}
					isMyMessage={props.isMyMessage}
					isUser={isUserMessage()}
					type={getUsernameType()}
					userId={props.userId}
					username={props.username}
				></MessageUsername>

				<div
					className={
						props.isMyMessage && !props.alias
							? `messageItem__message messageItem__message--myMessage`
							: props.alias
							? `messageItem__message messageItem__message--forwarded`
							: `messageItem__message`
					}
				>
					<span
						dangerouslySetInnerHTML={{ __html: renderedMessage }}
					></span>
					{props.attachments
						? props.attachments.map((attachment, key) => (
								<div
									key={key}
									className={
										hasRenderedMessage
											? 'messageItem__message--withAttachment'
											: ''
									}
								>
									<div className="messageItem__message__attachment">
										<span className="messageItem__message__attachment__icon">
											{getIconForAttachmentType(
												props.file.type
											)}
										</span>
										<span className="messageItem__message__attachment__title">
											<p>{attachment.title}</p>
											<p className="messageItem__message__attachment__meta">
												{
													ATTACHMENT_TRANSLATE_FOR_TYPE[
														props.file.type
													]
												}{' '}
												{attachment.image_size
													? `| ${
															(
																getAttachmentSizeMBForKB(
																	attachment.image_size *
																		1000
																) / 1000
															).toFixed(2) +
															translate(
																'attachments.type.label.mb'
															)
													  }`
													: null}
											</p>
										</span>
									</div>
									<a
										href={tld + attachment.title_link}
										rel="noopener noreferer"
										className="messageItem__message__attachment__download"
									>
										<SVG name={ICON_KEYS.DOWNLOAD} />
										<p>
											{translate(
												'attachments.download.label'
											)}
										</p>
									</a>
								</div>
						  ))
						: null}
					{activeSession.isFeedbackSession ? (
						<CopyIcon
							right={props.isMyMessage}
							message={renderedMessage}
						></CopyIcon>
					) : null}
					{showForwardIcon() ? (
						<ForwardIcon
							right={props.isMyMessage}
							message={props.message}
							messageTime={props.messageTime}
							askerRcId={props.askerRcId}
							groupId={chatItem.feedbackGroupId}
							username={props.username}
						></ForwardIcon>
					) : null}
				</div>

				<MessageMetaData
					isMyMessage={props.isMyMessage}
					isNotRead={props.isNotRead}
					messageTime={props.messageTime}
					type={getUsernameType()}
				></MessageMetaData>
			</div>
		</div>
	);
};
