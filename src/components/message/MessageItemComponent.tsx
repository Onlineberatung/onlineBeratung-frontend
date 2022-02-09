import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import { getPrettyDateFromMessageDate } from '../../utils/dateHelpers';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES,
	ConsultingTypeInterface,
	STATUS_ARCHIVED
} from '../../globalState';
import {
	SESSION_LIST_TYPES,
	getChatItemForSession,
	isSessionChat,
	isGroupChat
} from '../session/sessionHelpers';
import { ForwardMessage } from './ForwardMessage';
import { MessageMetaData } from './MessageMetaData';
import { CopyMessage } from './CopyMessage';
import { MessageUsername } from './MessageUsername';
import { markdownToDraft } from 'markdown-draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw, ContentState } from 'draft-js';
import {
	markdownToDraftDefaultOptions,
	sanitizeHtmlDefaultOptions,
	urlifyLinksInText
} from '../messageSubmitInterface/richtextHelpers';
import { VideoCallMessage } from './VideoCallMessage';
import { FurtherSteps } from './FurtherSteps';
import { MessageAttachment } from './MessageAttachment';
import { isVoluntaryInfoSet } from './messageHelpers';
import { Text } from '../text/Text';
import { translate } from '../../utils/translate';
import './message.styles';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';

enum MessageType {
	FURTHER_STEPS = 'FURTHER_STEPS',
	FORWARD = 'FORWARD',
	UPDATE_SESSION_DATA = 'UPDATE_SESSION_DATA',
	VIDEOCALL = 'VIDEOCALL',
	FINISHED_CONVERSATION = 'FINISHED_CONVERSATION'
}

export interface ForwardMessageDTO {
	message: string;
	rcUserId: string;
	timestamp: any;
	username: string;
}

export interface VideoCallMessageDTO {
	eventType: 'IGNORED_CALL';
	initiatorRcUserId: string;
	initiatorUserName: string;
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
		messageType: MessageType;
	};
	attachments?: MessageService.Schemas.AttachmentDTO[];
	file?: MessageService.Schemas.FileDTO;
}

interface MessageItemComponentProps extends MessageItem {
	isOnlyEnquiry?: boolean;
	isMyMessage: boolean;
	type: SESSION_LIST_TYPES;
	clientName: string;
	resortData: ConsultingTypeInterface;
}

export const MessageItemComponent = ({
	alias,
	userId,
	message,
	messageDate,
	messageTime,
	resortData,
	isMyMessage,
	username,
	askerRcId,
	attachments,
	file,
	isNotRead
}: MessageItemComponentProps) => {
	const activeSession = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const [showAddVoluntaryInfo, setShowAddVoluntaryInfo] = useState<boolean>();
	const [renderedMessage, setRenderedMessage] = useState<string | null>(null);
	useEffect((): void => {
		const rawMessageObject = markdownToDraft(
			message,
			markdownToDraftDefaultOptions
		);
		const contentStateMessage: ContentState =
			convertFromRaw(rawMessageObject);

		setRenderedMessage(
			contentStateMessage.hasText()
				? sanitizeHtml(
						urlifyLinksInText(stateToHTML(contentStateMessage)),
						sanitizeHtmlDefaultOptions
				  )
				: ''
		);
	}, [message]);

	const hasRenderedMessage = renderedMessage && renderedMessage.length > 0;
	const chatItem = getChatItemForSession(activeSession);

	useEffect(() => {
		if (hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)) {
			const sessionData =
				userData.consultingTypes[chatItem.consultingType]?.sessionData;
			setShowAddVoluntaryInfo(
				!isVoluntaryInfoSet(sessionData, resortData)
			);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const getMessageDate = () => {
		if (messageDate) {
			return (
				<div className="messageItem__divider">
					<Text
						text={
							typeof messageDate === 'number'
								? getPrettyDateFromMessageDate(messageDate)
								: messageDate
						}
						type="divider"
					/>
				</div>
			);
		}
		return null;
	};

	const getUsernameType = () => {
		if (isMyMessage) {
			return 'self';
		}
		if (alias?.forwardMessageDTO) {
			return 'forwarded';
		}
		if (username === 'system') {
			return 'system';
		}
		if (isUserMessage()) {
			return 'user';
		}
		return 'consultant';
	};

	const isUserMessage = () =>
		userId === askerRcId ||
		(isGroupChat(chatItem) && !chatItem.moderators?.includes(userId));

	const videoCallMessage: VideoCallMessageDTO = alias?.videoCallMessageDTO;
	const isFurtherStepsMessage =
		alias?.messageType === MessageType.FURTHER_STEPS;
	const isUpdateSessionDataMessage =
		alias?.messageType === MessageType.UPDATE_SESSION_DATA;
	const isVideoCallMessage = alias?.messageType === MessageType.VIDEOCALL;
	const isFinishedConversationMessage =
		alias?.messageType === MessageType.FINISHED_CONVERSATION;

	const messageContent = (): JSX.Element => {
		if (isFurtherStepsMessage) {
			return (
				<FurtherSteps
					consultingType={chatItem.consultingType}
					resortData={resortData}
				/>
			);
		} else if (isUpdateSessionDataMessage) {
			return (
				<FurtherSteps
					onlyShowVoluntaryInfo={true}
					handleVoluntaryInfoSet={() =>
						setShowAddVoluntaryInfo(false)
					}
					consultingType={chatItem.consultingType}
					resortData={resortData}
				/>
			);
		} else if (isFinishedConversationMessage) {
			return (
				<span className="messageItem__message--system">
					{translate('anonymous.session.systemMessage.chatFinished')}
				</span>
			);
		} else if (
			isVideoCallMessage &&
			videoCallMessage.eventType === 'IGNORED_CALL'
		) {
			return (
				<VideoCallMessage
					videoCallMessage={videoCallMessage}
					activeSessionUsername={
						activeSession.user?.username ||
						activeSession.consultant?.username
					}
					activeSessionAskerRcId={activeSession.session.askerRcId}
				/>
			);
		} else {
			return (
				<>
					<MessageUsername
						alias={alias?.forwardMessageDTO}
						isMyMessage={isMyMessage}
						isUser={isUserMessage()}
						type={getUsernameType()}
						userId={userId}
						username={username}
					/>

					<div
						className={
							isMyMessage && !alias
								? `messageItem__message messageItem__message--myMessage`
								: alias
								? `messageItem__message messageItem__message--forwarded`
								: `messageItem__message`
						}
					>
						<span
							dangerouslySetInnerHTML={{
								__html: renderedMessage
							}}
						/>
						{attachments &&
							attachments.map((attachment, key) => (
								<MessageAttachment
									key={key}
									attachment={attachment}
									file={file}
									hasRenderedMessage={hasRenderedMessage}
								/>
							))}
						{activeSession?.isFeedbackSession && (
							<CopyMessage
								right={isMyMessage}
								message={renderedMessage}
							/>
						)}
						{hasRenderedMessage &&
							hasUserAuthority(
								AUTHORITIES.USE_FEEDBACK,
								userData
							) &&
							activeSession?.type !==
								SESSION_LIST_TYPES.ENQUIRY &&
							isSessionChat(chatItem) &&
							chatItem.feedbackGroupId &&
							!activeSession?.isFeedbackSession &&
							chatItem.status !== STATUS_ARCHIVED && (
								<ForwardMessage
									right={isMyMessage}
									message={message}
									messageTime={messageTime}
									askerRcId={askerRcId}
									groupId={chatItem.feedbackGroupId}
									username={username}
								/>
							)}
					</div>
				</>
			);
		}
	};

	if (isUpdateSessionDataMessage && !showAddVoluntaryInfo) {
		return null;
	}

	return (
		<div
			className={`messageItem ${
				isMyMessage ? 'messageItem--right' : ''
			} ${isVideoCallMessage ? 'videoCallMessage' : ''}`}
		>
			{getMessageDate()}
			<div
				className={`
					messageItem__messageWrap
					${isMyMessage ? 'messageItem__messageWrap--right' : ''}
					${isFurtherStepsMessage ? 'messageItem__messageWrap--furtherSteps' : ''}
				`}
			>
				{messageContent()}

				<MessageMetaData
					isMyMessage={isMyMessage}
					isNotRead={isNotRead}
					messageTime={messageTime}
					type={getUsernameType()}
					isReadStatusDisabled={
						isVideoCallMessage || isFinishedConversationMessage
					}
				/>
			</div>
		</div>
	);
};
