import * as React from 'react';
import { useContext } from 'react';
import { getPrettyDateFromMessageDate } from '../../resources/scripts/helpers/dateHelpers';
import {
	UserDataContext,
	ActiveSessionGroupIdContext,
	SessionsDataContext,
	getActiveSession,
	hasUserAuthority,
	AUTHORITIES
} from '../../globalState';
import {
	SESSION_TYPES,
	getChatItemForSession
} from '../session/sessionHelpers';
import { ForwardMessage } from './ForwardMessage';
import { MessageMetaData } from './MessageMetaData';
import { CopyMessage } from './CopyMessage';
import { MessageUsername } from './MessageUsername';
import { getIconForAttachmentType } from '../messageSubmitInterface/messageSubmitInterfaceComponent';
import { translate } from '../../resources/scripts/i18n/translate';
import {
	ATTACHMENT_TRANSLATE_FOR_TYPE,
	getAttachmentSizeMBForKB
} from '../messageSubmitInterface/attachmentHelpers';
import { tld } from '../../resources/scripts/config';
import { markdownToDraft } from 'markdown-draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw, ContentState } from 'draft-js';
import { urlifyLinksInText } from '../messageSubmitInterface/richtextHelpers';
import { ReactComponent as DownloadIcon } from '../../resources/img/icons/download.svg';
import { ReactComponent as CallOffIcon } from '../../resources/img/icons/call-off.svg';
import './message.styles';
import { getTokenFromCookie } from '../sessionCookie/accessSessionCookie';

export interface ForwardMessageDTO {
	message: string;
	rcUserId: string;
	timestamp: any;
	username: string;
}

interface VideoCallMessageDTO {
	eventType: 'IGNORED_CALL';
	initiatorUserName: string;
	rcUserId: string;
}
export interface MessageItem {
	id?: number;
	message: string;
	messageDate: string | number;
	messageTime: string;
	username: string;
	askerRcId?: string;
	userId: string;
	consultant?: {
		username: string;
	};
	groupId?: string;
	isNotRead: boolean;
	alias?: {
		forwardMessageDTO?: ForwardMessageDTO;
		videoCallMessageDTO?: VideoCallMessageDTO;
	};
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
				<div className="messageItem__divider">
					{typeof props.messageDate === 'number'
						? getPrettyDateFromMessageDate(props.messageDate)
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
		if (props.alias?.forwardMessageDTO) {
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
	const showForwardMessage = () =>
		hasRenderedMessage &&
		activeSession.type !== SESSION_TYPES.ENQUIRY &&
		chatItem.feedbackGroupId &&
		hasUserAuthority(AUTHORITIES.USE_FEEDBACK, userData) &&
		!activeSession.isFeedbackSession;

	const videoCallMessage: VideoCallMessageDTO =
		props.alias?.videoCallMessageDTO;
	const isVideoCallMessage = !!videoCallMessage;
	const currentUserWasVideoCallInitiator = () =>
		videoCallMessage?.rcUserId === getTokenFromCookie('rc_uid');

	return (
		<div
			className={`messageItem ${
				props.isMyMessage ? 'messageItem--right' : ''
			} ${isVideoCallMessage ? 'videoCallMessage' : ''}`}
		>
			{getMessageDate()}
			<div
				className={
					props.isMyMessage
						? `messageItem__messageWrap messageItem__messageWrap--right`
						: `messageItem__messageWrap`
				}
			>
				{isVideoCallMessage &&
				videoCallMessage.eventType === 'IGNORED_CALL' ? (
					<div className="videoCallMessage__subjectWrapper">
						<CallOffIcon className="videoCallMessage__icon" />
						<p className="videoCallMessage__subject">
							{currentUserWasVideoCallInitiator() ? (
								<>
									{translate(
										'videoCall.incomingCall.rejected.prefix'
									)}{' '}
									<span className="videoCallMessage__username">
										{activeSession.user.username}
									</span>{' '}
									{translate(
										'videoCall.incomingCall.rejected.suffix'
									)}
								</>
							) : (
								<>
									<span className="videoCallMessage__username">
										{videoCallMessage.initiatorUserName}
									</span>{' '}
									{translate(
										'videoCall.incomingCall.ignored'
									)}
								</>
							)}
						</p>
					</div>
				) : (
					<>
						<MessageUsername
							alias={props.alias?.forwardMessageDTO}
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
								dangerouslySetInnerHTML={{
									__html: renderedMessage
								}}
							></span>
							{props.attachments &&
								props.attachments.map((attachment, key) => (
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
											<DownloadIcon />
											<p>
												{translate(
													'attachments.download.label'
												)}
											</p>
										</a>
									</div>
								))}
							{activeSession.isFeedbackSession && (
								<CopyMessage
									right={props.isMyMessage}
									message={renderedMessage}
								></CopyMessage>
							)}
							{showForwardMessage() && (
								<ForwardMessage
									right={props.isMyMessage}
									message={props.message}
									messageTime={props.messageTime}
									askerRcId={props.askerRcId}
									groupId={chatItem.feedbackGroupId}
									username={props.username}
								></ForwardMessage>
							)}
						</div>
					</>
				)}

				<MessageMetaData
					isMyMessage={props.isMyMessage}
					isNotRead={props.isNotRead}
					messageTime={props.messageTime}
					type={getUsernameType()}
					isVideoCallMessage={isVideoCallMessage}
				></MessageMetaData>
			</div>
		</div>
	);
};
