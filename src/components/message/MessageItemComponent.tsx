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
import { Appointment } from './Appointment';
import { decryptText } from '../../utils/encryptionHelpers';
import { useE2EE } from '../../hooks/useE2EE';
import { E2EEActivatedMessage } from './E2EEActivatedMessage';
import {
	ReassignRequestAcceptedMessage,
	ReassignRequestDeclinedMessage,
	ReassignRequestMessage,
	ReassignRequestSentMessage
} from './ReassignMessage';
import {
	apiSendAliasMessage,
	ConsultantReassignment,
	ReassignStatus
} from '../../api/apiSendAliasMessage';
import { apiPatchMessage } from '../../api/apiPatchMessage';
import { apiSessionAssign } from '../../api';

import { MasterKeyLostMessage } from './MasterKeyLostMessage';
import { ALIAS_MESSAGE_TYPES } from '../../api/apiSendAliasMessage';

export enum MessageType {
	FURTHER_STEPS = 'FURTHER_STEPS',
	USER_MUTED = 'USER_MUTED',
	FORWARD = 'FORWARD',
	UPDATE_SESSION_DATA = 'UPDATE_SESSION_DATA',
	VIDEOCALL = 'VIDEOCALL',
	FINISHED_CONVERSATION = 'FINISHED_CONVERSATION',
	APPOINTMENT_SET = 'APPOINTMENT_SET',
	APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',
	APPOINTMENT_RESCHEDULED = 'APPOINTMENT_RESCHEDULED'
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
	_id: string;
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
		content?: string;
		messageType: ALIAS_MESSAGE_TYPES;
	};
	attachments?: MessageService.Schemas.AttachmentDTO[];
	file?: MessageService.Schemas.FileDTO;
	t: null | 'e2e';
	rid: string;
}

interface MessageItemComponentProps extends MessageItem {
	isOnlyEnquiry?: boolean;
	isMyMessage: boolean;
	clientName: string;
	resortData: ConsultingTypeInterface;
	isUserBanned: boolean;
}

export const MessageItemComponent = ({
	_id,
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
	isUserBanned,
	t,
	rid
}: MessageItemComponentProps) => {
	const { activeSession, reloadActiveSession } =
		useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const { type } = useContext(SessionTypeContext);

	const [showAddVoluntaryInfo, setShowAddVoluntaryInfo] = useState<boolean>();
	const [renderedMessage, setRenderedMessage] = useState<string | null>(null);
	const [decryptedMessage, setDecryptedMessage] = useState<string | null>(
		null
	);

	const { key, keyID, encrypted, subscriptionKeyLost } = useE2EE(rid);
	const { isE2eeEnabled } = useContext(E2EEContext);

	useEffect((): void => {
		if (isE2eeEnabled) {
			decryptText(message, keyID, key, encrypted, t === 'e2e')
				.then(setDecryptedMessage)
				.catch((_e) => {
					// setDecryptedMessage(org) // TODO? Fallback in case decryption fails
				});
		} else {
			setDecryptedMessage(org || message);
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

	const clickReassignRequestMessage = (accepted, toConsultantId) => {
		if (accepted) {
			apiSessionAssign(activeSession.item.id, toConsultantId)
				.then(() => {
					apiPatchMessage(
						toConsultantId,
						ReassignStatus.CONFIRMED,
						_id
					)
						.then(() => {
							// WORKAROUND for an issue with reassignment and old users breaking the lastMessage for this session
							apiSendAliasMessage({
								rcGroupId: activeSession.rid,
								type: ALIAS_MESSAGE_TYPES.REASSIGN_CONSULTANT_RESET_LAST_MESSAGE
							});
							reloadActiveSession();
						})
						.catch((error) => console.log(error));
				})
				.catch((error) => console.log(error));
		} else {
			apiPatchMessage(toConsultantId, ReassignStatus.REJECTED, _id).catch(
				(error) => console.log(error)
			);
		}
	};

	const isUserMessage = () =>
		userId === askerRcId ||
		(activeSession.isGroup &&
			!activeSession.item.moderators?.includes(userId));

	const videoCallMessage: VideoCallMessageDTO = alias?.videoCallMessageDTO;
	const isFurtherStepsMessage =
		alias?.messageType === ALIAS_MESSAGE_TYPES.FURTHER_STEPS;
	const isUpdateSessionDataMessage =
		alias?.messageType === ALIAS_MESSAGE_TYPES.UPDATE_SESSION_DATA;
	const isVideoCallMessage =
		alias?.messageType === ALIAS_MESSAGE_TYPES.VIDEOCALL;
	const isFinishedConversationMessage =
		alias?.messageType === ALIAS_MESSAGE_TYPES.FINISHED_CONVERSATION;
	const isUserMutedMessage =
		alias?.messageType === ALIAS_MESSAGE_TYPES.USER_MUTED;
	const isE2EEActivatedMessage =
		alias?.messageType === ALIAS_MESSAGE_TYPES.E2EE_ACTIVATED;
	const isReassignmentMessage =
		alias?.messageType === ALIAS_MESSAGE_TYPES.REASSIGN_CONSULTANT;
	const isMasterKeyLostMessage =
		alias?.messageType === ALIAS_MESSAGE_TYPES.MASTER_KEY_LOST;

	// WORKAROUND for reassignment last message bug
	// don't show this message in the session view
	if (
		alias?.messageType ===
		ALIAS_MESSAGE_TYPES.REASSIGN_CONSULTANT_RESET_LAST_MESSAGE
	) {
		return null;
	}

	const isTeamSession = activeSession?.item?.isTeamSession;
	const isMySession = activeSession?.consultant?.id === userData?.userId;
	const isAppointmentSet =
		alias?.messageType === ALIAS_MESSAGE_TYPES.APPOINTMENT_SET ||
		alias?.messageType === ALIAS_MESSAGE_TYPES.APPOINTMENT_RESCHEDULED ||
		alias?.messageType === ALIAS_MESSAGE_TYPES.APPOINTMENT_CANCELLED;

	const messageContent = (): JSX.Element => {
		switch (true) {
			case isMasterKeyLostMessage:
				return (
					<div className="messageItem__message">
						<MasterKeyLostMessage
							subscriptionKeyLost={subscriptionKeyLost}
						/>
					</div>
				);
			case isE2EEActivatedMessage:
				return <E2EEActivatedMessage />;
			case isReassignmentMessage:
				if (message) {
					const isAsker = hasUserAuthority(
						AUTHORITIES.ASKER_DEFAULT,
						userData
					);

					const reassignmentParams: ConsultantReassignment =
						JSON.parse(message);
					switch (reassignmentParams.status) {
						case ReassignStatus.REQUESTED:
							return isAsker ? (
								<ReassignRequestMessage
									{...reassignmentParams}
									isTeamSession={isTeamSession}
									onClick={(accepted) =>
										clickReassignRequestMessage(
											accepted,
											reassignmentParams.toConsultantId
										)
									}
								/>
							) : (
								<ReassignRequestSentMessage
									{...reassignmentParams}
									isTeamSession={isTeamSession}
									isMySession={isMySession}
								/>
							);
						case ReassignStatus.CONFIRMED:
							return (
								<ReassignRequestAcceptedMessage
									isAsker={isAsker}
									isMySession={isMySession}
									{...reassignmentParams}
								/>
							);
						case ReassignStatus.REJECTED:
							return (
								<ReassignRequestDeclinedMessage
									isAsker={isAsker}
									isMySession={isMySession}
									{...reassignmentParams}
								/>
							);
					}
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
			case isAppointmentSet:
				return (
					<Appointment
						data={alias.content}
						messageType={alias.messageType}
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
							isUserBanned={isUserBanned}
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
