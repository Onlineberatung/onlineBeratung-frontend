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
import { decryptText, MissingKeyError } from '../../utils/encryptionHelpers';
import { e2eeParams } from '../../hooks/useE2EE';
import { E2EEActivatedMessage } from './E2EEActivatedMessage';
import { MasterKeyLostMessage } from './MasterKeyLostMessage';
import { ALIAS_MESSAGE_TYPES } from '../../api/apiSendAliasMessage';
import { ERROR_LEVEL_WARN, TError } from '../../api/apiPostError';

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
		messageType: ALIAS_MESSAGE_TYPES;
	};
	attachments?: MessageService.Schemas.AttachmentDTO[];
	file?: MessageService.Schemas.FileDTO;
	t: null | 'e2e';
}

interface MessageItemComponentProps extends MessageItem {
	isOnlyEnquiry?: boolean;
	isMyMessage: boolean;
	clientName: string;
	resortData: ConsultingTypeInterface;
	isUserBanned: boolean;
	handleDecryptionErrors: (
		id: string,
		messageTime: string,
		error: TError
	) => void;
	handleDecryptionSuccess: (id: string) => void;
	e2eeParams: e2eeParams & { subscriptionKeyLost: boolean };
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
	handleDecryptionErrors,
	handleDecryptionSuccess,
	e2eeParams
}: MessageItemComponentProps) => {
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const { type } = useContext(SessionTypeContext);

	const [showAddVoluntaryInfo, setShowAddVoluntaryInfo] = useState<boolean>();
	const [renderedMessage, setRenderedMessage] = useState<string | null>(null);
	const [decryptedMessage, setDecryptedMessage] = useState<
		string | null | undefined
	>(null);

	const { isE2eeEnabled } = useContext(E2EEContext);

	useEffect((): void => {
		if (isE2eeEnabled) {
			decryptText(
				message,
				e2eeParams.keyID,
				e2eeParams.key,
				e2eeParams.encrypted,
				t === 'e2e'
			)
				.catch((e) => {
					if (!(e instanceof MissingKeyError)) {
						handleDecryptionErrors(_id, messageTime, {
							name: e.name,
							message: e.message,
							stack: e.stack,
							level: ERROR_LEVEL_WARN
						});
					}

					return `${org || message} *`;
				})
				.then(setDecryptedMessage)
				.then(() => handleDecryptionSuccess(_id));
		} else {
			setDecryptedMessage(org || message);
		}
	}, [
		message,
		org,
		t,
		isE2eeEnabled,
		handleDecryptionErrors,
		e2eeParams.keyID,
		e2eeParams.key,
		e2eeParams.encrypted,
		messageTime,
		_id,
		handleDecryptionSuccess
	]);

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
	const isMasterKeyLostMessage =
		alias?.messageType === ALIAS_MESSAGE_TYPES.MASTER_KEY_LOST;

	const messageContent = (): JSX.Element => {
		switch (true) {
			case isMasterKeyLostMessage:
				return (
					<div className="messageItem__message">
						<MasterKeyLostMessage
							subscriptionKeyLost={e2eeParams.subscriptionKeyLost}
						/>
					</div>
				);
			case isE2EEActivatedMessage:
				return <E2EEActivatedMessage />;
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
