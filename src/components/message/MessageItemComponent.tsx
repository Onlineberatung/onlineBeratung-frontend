import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import { getPrettyDateFromMessageDate } from '../../utils/dateHelpers';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES,
	ConsultingTypeInterface,
	STATUS_ARCHIVED,
	E2EEContext,
	SessionTypeContext
} from '../../globalState';
import { SESSION_LIST_TYPES } from '../session/sessionHelpers';
import { ForwardMessage } from './ForwardMessage';
import { MessageMetaData } from './MessageMetaData';
import { CopyMessage } from './CopyMessage';
import { MessageDisplayName } from './MessageDisplayName';
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
import { decryptText } from '../../utils/encryptionHelpers';
import { useE2EE } from '../../hooks/useE2EE';
import { E2EEActivatedMessage } from './E2EEActivatedMessage';
import {
	ReassignRequestAcceptedMessage,
	ReassignRequestDeclinedMessage,
	ReassignRequestMessage,
	ReassignRequestSentMessage
} from './ReassignMessage';
import { ConsultantReassignment } from '../../api/apiSendAliasMessage';

enum MessageType {
	FURTHER_STEPS = 'FURTHER_STEPS',
	USER_MUTED = 'USER_MUTED',
	FORWARD = 'FORWARD',
	UPDATE_SESSION_DATA = 'UPDATE_SESSION_DATA',
	VIDEOCALL = 'VIDEOCALL',
	FINISHED_CONVERSATION = 'FINISHED_CONVERSATION',
	E2EE_ACTIVATED = 'E2EE_ACTIVATED',
	REASSIGN_CONSULTANT = 'REASSIGN_CONSULTANT'
}

export interface ForwardMessageDTO {
	message: string;
	rcUserId: string;
	timestamp: any;
	username: string; // TODO change to displayName if message service is adjusted
}

export interface VideoCallMessageDTO {
	eventType: 'IGNORED_CALL';
	initiatorRcUserId: string;
	initiatorUserName: string;
}

export interface MessageItem {
	id?: number;
	message: string;
	org: string;
	messageDate: string | number;
	messageTime: string;
	displayName: string;
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
	t: null | 'e2e';
	rid: string;
}

interface MessageItemComponentProps extends MessageItem {
	isOnlyEnquiry?: boolean;
	isMyMessage: boolean;
	type: SESSION_LIST_TYPES;
	clientName: string;
	resortData: ConsultingTypeInterface;
	bannedUsers: string[];
}

export const MessageItemComponent = ({
	alias,
	userId,
	message,
	org,
	messageDate,
	messageTime,
	resortData,
	isMyMessage,
	displayName,
	username,
	askerRcId,
	attachments,
	file,
	isNotRead,
	bannedUsers,
	t,
	rid
}: MessageItemComponentProps) => {
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const { type } = useContext(SessionTypeContext);

	const [showAddVoluntaryInfo, setShowAddVoluntaryInfo] = useState<boolean>();
	const [renderedMessage, setRenderedMessage] = useState<string | null>(null);
	const [decryptedMessage, setDecryptedMessage] = useState<string | null>(
		null
	);

	const { key, keyID, encrypted } = useE2EE(rid);
	const { isE2eeEnabled } = useContext(E2EEContext);

	useEffect((): void => {
		if (isE2eeEnabled) {
			decryptText(message, keyID, key, encrypted, t === 'e2e')
				.then(setDecryptedMessage)
				.catch((_e) => {
					// setDecryptedMessage(org) // TODO? Fallback in case decryption fails
				});
		} else {
			setDecryptedMessage(org);
		}
	}, [key, keyID, encrypted, message, org, t, isE2eeEnabled]);

	useEffect((): void => {
		const rawMessageObject = markdownToDraft(
			decryptedMessage,
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
	}, [decryptedMessage]);

	const hasRenderedMessage = renderedMessage && renderedMessage.length > 0;

	useEffect(() => {
		if (hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)) {
			const sessionData =
				userData.consultingTypes[activeSession.item.consultingType]
					?.sessionData;
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
		if (displayName === 'system') {
			return 'system';
		}
		if (isUserMessage()) {
			return 'user';
		}
		return 'consultant';
	};

	const isUserMessage = () =>
		userId === askerRcId ||
		(activeSession.isGroup &&
			!activeSession.item.moderators?.includes(userId));

	const videoCallMessage: VideoCallMessageDTO = alias?.videoCallMessageDTO;
	const isFurtherStepsMessage =
		alias?.messageType === MessageType.FURTHER_STEPS;
	const isUpdateSessionDataMessage =
		alias?.messageType === MessageType.UPDATE_SESSION_DATA;
	const isVideoCallMessage = alias?.messageType === MessageType.VIDEOCALL;
	const isFinishedConversationMessage =
		alias?.messageType === MessageType.FINISHED_CONVERSATION;
	const isUserMutedMessage = alias?.messageType === MessageType.USER_MUTED;
	const isE2EEActivatedMessage =
		alias?.messageType === MessageType.E2EE_ACTIVATED;
	const isReassignmentMessage =
		alias?.messageType === MessageType.REASSIGN_CONSULTANT;

	const messageContent = (): JSX.Element => {
		switch (true) {
			case isE2EEActivatedMessage:
				return <E2EEActivatedMessage />;
			// TODO handle all cases woth params
			// https://github.com/Onlineberatung/onlineBeratung-messageService/blob/develop/api/messageservice.yaml
			case isReassignmentMessage:
				if (message) {
					const messageArgs: ConsultantReassignment = JSON.parse(
						message.replaceAll('&quot;', '"')
					);
					console.log('test2', messageArgs);

					console.log('isReassignmentMessage', isReassignmentMessage);
					switch (messageArgs.status) {
						case 'REQUESTED':
							console.log('userId', userId);
							console.log('askerRcId', askerRcId);
							if (askerRcId === userId) {
								return (
									<ReassignRequestMessage
										oldConsultantName={'foo'}
										newConsultantName={'bar'}
										onClick={() => {}}
									/>
								);
							} else {
								return (
									<ReassignRequestSentMessage
										oldConsultantName={'foo'}
										newConsultantName={'bar'}
										clientName={'test'}
									/>
								);
							}
						case 'CONFIRMED':
							return (
								<ReassignRequestAcceptedMessage
									clientName={'foo'}
									newConsultantName={'bar'}
								/>
							);
						case 'REJECTED':
							return (
								<ReassignRequestDeclinedMessage
									clientName={'foo'}
								/>
							);
					}
					// console.log('alias', alias);
					//
					console.log('message', message);

					// console.log('displayName', displayName);
					// console.log('userName', username);
					// console.log('userId', userId);
					// console.log('askerRcId', askerRcId);
					// console.log('org', org);
					// console.log('messageDate', messageDate);
					// console.log('messageTime', messageTime);
					// console.log('resortData', resortData);
					// console.log('isMyMessage', isMyMessage);
					// console.log('attachments', attachments);
					// console.log('file', file);
					// console.log('isNotRead', isNotRead);
					// console.log('bannedUsers', bannedUsers);
					// console.log('t', t);
					// console.log('rid', rid);
				}
				return;
			case isFurtherStepsMessage:
				return (
					<FurtherSteps
						consultingType={activeSession.item.consultingType}
						resortData={resortData}
					/>
				);
			case isUpdateSessionDataMessage:
				return (
					<FurtherSteps
						onlyShowVoluntaryInfo={true}
						handleVoluntaryInfoSet={() =>
							setShowAddVoluntaryInfo(false)
						}
						consultingType={activeSession.item.consultingType}
						resortData={resortData}
					/>
				);
			case isFinishedConversationMessage:
				return (
					<span className="messageItem__message--system">
						{translate(
							'anonymous.session.systemMessage.chatFinished'
						)}
					</span>
				);
			case isVideoCallMessage &&
				videoCallMessage.eventType === 'IGNORED_CALL':
				return (
					<VideoCallMessage
						videoCallMessage={videoCallMessage}
						activeSessionUsername={
							activeSession.user?.username ||
							activeSession.consultant?.displayName ||
							activeSession.consultant?.username
						}
						activeSessionAskerRcId={activeSession.item.askerRcId}
					/>
				);
			default:
				return (
					<>
						<MessageDisplayName
							alias={alias?.forwardMessageDTO}
							isMyMessage={isMyMessage}
							isUser={isUserMessage()}
							type={getUsernameType()}
							userId={userId}
							username={username}
							isUserBanned={bannedUsers.includes(username)}
							displayName={displayName}
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
							{activeSession.isFeedback && (
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
								type !== SESSION_LIST_TYPES.ENQUIRY &&
								activeSession.isSession &&
								activeSession.item.feedbackGroupId &&
								!activeSession.isFeedback &&
								activeSession.item.status !==
									STATUS_ARCHIVED && (
									<ForwardMessage
										right={isMyMessage}
										message={decryptedMessage}
										messageTime={messageTime}
										askerRcId={askerRcId}
										groupId={
											activeSession.item.feedbackGroupId
										}
										displayName={displayName}
									/>
								)}
						</div>
					</>
				);
		}
	};

	if (isUserMutedMessage) return null;

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
					${
						isE2EEActivatedMessage
							? 'messageItem__messageWrap--e2eeActivatedMessage'
							: ''
					}
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
