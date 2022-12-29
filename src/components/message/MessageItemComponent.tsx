import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES,
	ConsultingTypeInterface,
	STATUS_ARCHIVED,
	SessionTypeContext,
	RocketChatGlobalSettingsContext
} from '../../globalState';
import { isUserModerator, SESSION_LIST_TYPES } from '../session/sessionHelpers';
import { ForwardMessage } from './ForwardMessage';
import { MessageMetaData } from './MessageMetaData';
import { CopyMessage } from './CopyMessage';
import { MessageDisplayName } from './MessageDisplayName';
import { VideoCallMessage } from './VideoCallMessage';
import { FurtherSteps } from './FurtherSteps';
import { MessageAttachment } from './MessageAttachment';
import { isVoluntaryInfoSet } from './messageHelpers';
import './message.styles';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { Appointment } from './Appointment';
import { E2EEActivatedMessage } from './E2EEActivatedMessage';
import { ReassignMessage } from './ReassignMessage';
import { MasterKeyLostMessage } from './MasterKeyLostMessage';
import { ALIAS_MESSAGE_TYPES } from '../../api/apiSendAliasMessage';
import { useTranslation } from 'react-i18next';
import { ReactComponent as TrashIcon } from '../../resources/img/icons/trash.svg';
import { ReactComponent as DeletedIcon } from '../../resources/img/icons/deleted.svg';
import {
	IBooleanSetting,
	SETTING_MESSAGE_ALLOWDELETING
} from '../../api/apiRocketChatSettingsPublic';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { ReactComponent as XIllustration } from '../../resources/img/illustrations/x.svg';
import { BUTTON_TYPES } from '../button/Button';
import { apiDeleteMessage } from '../../api/apiDeleteMessage';
import { FlyoutMenu } from '../flyoutMenu/FlyoutMenu';
import { BanUser } from '../banUser/BanUser';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { MessageItem } from '../../types/MessageItem';
import clsx from 'clsx';
import { VideoCallMessageDTO } from '../../types/VideoCallMessageDTO';

interface MessageItemComponentProps extends MessageItem {
	isMyMessage: boolean;
	resortData: ConsultingTypeInterface;
	isUserBanned: boolean;
	subscriptionKeyLost: boolean;
}

export const MessageItemComponent = ({
	_id,
	alias,
	userId,
	message,
	parsedMessage,
	messageTime,
	resortData,
	isMyMessage,
	displayName,
	username,
	askerRcId,
	attachments,
	file,
	unread,
	isUserBanned,
	t,
	rid,
	subscriptionKeyLost
}: MessageItemComponentProps) => {
	const { t: translate } = useTranslation();
	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const { type } = useContext(SessionTypeContext);

	const [showAddVoluntaryInfo, setShowAddVoluntaryInfo] = useState<boolean>();

	const hasParsedMessage = parsedMessage && parsedMessage.length > 0;

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
	const isReassignmentMessage =
		alias?.messageType === ALIAS_MESSAGE_TYPES.REASSIGN_CONSULTANT;
	const isMasterKeyLostMessage =
		alias?.messageType === ALIAS_MESSAGE_TYPES.MASTER_KEY_LOST;
	const isAppointmentDefined =
		alias?.messageType === ALIAS_MESSAGE_TYPES.INITIAL_APPOINTMENT_DEFINED;

	// WORKAROUND for reassignment last message bug
	// don't show this message in the session view
	if (
		alias?.messageType ===
		ALIAS_MESSAGE_TYPES.REASSIGN_CONSULTANT_RESET_LAST_MESSAGE
	) {
		return null;
	}

	const isAppointmentSet =
		alias?.messageType === ALIAS_MESSAGE_TYPES.APPOINTMENT_SET ||
		alias?.messageType === ALIAS_MESSAGE_TYPES.APPOINTMENT_RESCHEDULED ||
		alias?.messageType === ALIAS_MESSAGE_TYPES.APPOINTMENT_CANCELLED;
	const isDeleteMessage = t === 'rm';
	const isRoomRemovedReadOnly = t === 'room-removed-read-only';
	const isRoomSetReadOnly = t === 'room-set-read-only';

	const messageContent = (): JSX.Element => {
		switch (true) {
			case isMasterKeyLostMessage:
				return (
					<MasterKeyLostMessage
						subscriptionKeyLost={subscriptionKeyLost}
					/>
				);
			case isE2EEActivatedMessage:
				return <E2EEActivatedMessage />;
			case isReassignmentMessage:
				if (message) {
					return <ReassignMessage id={_id} message={message} />;
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
			case isDeleteMessage:
				return (
					<div className="messageItem__message messageItem__message--deleted flex flex--ai-c">
						<div className="mr--1">
							<DeletedIcon
								width={14}
								height={14}
								aria-hidden="true"
								focusable="false"
							/>
						</div>
						<div>
							{translate(
								isMyMessage
									? 'message.delete.deleted.own'
									: 'message.delete.deleted.other'
							)}
						</div>
					</div>
				);
			default:
				return (
					<>
						<div className="flex flex--jc-sb">
							<MessageDisplayName
								alias={alias?.forwardMessageDTO}
								isMyMessage={isMyMessage}
								isUser={isUserMessage()}
								type={getUsernameType()}
								userId={userId}
								username={username}
								displayName={displayName}
							/>
							<MessageFlyoutMenu
								_id={_id}
								userId={userId}
								username={username}
								isUserBanned={isUserBanned}
								isMyMessage={isMyMessage}
								isArchived={
									activeSession.item.status ===
									STATUS_ARCHIVED
								}
							/>
						</div>

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
									__html: parsedMessage
								}}
							/>
							{attachments &&
								attachments.map((attachment, key) => (
									<MessageAttachment
										key={key}
										attachment={attachment}
										rid={rid}
										file={file}
										t={t}
										hasParsedMessage={hasParsedMessage}
									/>
								))}
							{activeSession.isFeedback && (
								<CopyMessage
									right={isMyMessage}
									message={parsedMessage}
								/>
							)}
							{hasParsedMessage &&
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
										message={message}
										messageTime={messageTime}
										askerRcId={askerRcId}
										displayName={displayName}
									/>
								)}
						</div>
					</>
				);
		}
	};

	if (
		isUserMutedMessage ||
		isAppointmentDefined ||
		isRoomRemovedReadOnly ||
		isRoomSetReadOnly
	)
		return null;

	if (isUpdateSessionDataMessage && !showAddVoluntaryInfo) {
		return null;
	}

	return (
		<div
			className={clsx(
				'messageItem',
				isMyMessage && 'messageItem--right',
				alias?.messageType &&
					`${alias.messageType.toLowerCase()} systemMessage`
			)}
			id={`message-${_id}`}
		>
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
					unread={unread}
					messageTime={messageTime}
					t={t}
					type={getUsernameType()}
					isReadStatusDisabled={
						isVideoCallMessage || isFinishedConversationMessage
					}
				/>
			</div>
		</div>
	);
};

const MessageFlyoutMenu = ({
	_id,
	userId,
	isUserBanned,
	isMyMessage,
	isArchived,
	username
}: {
	_id: string;
	userId: string;
	username: string;
	isUserBanned: boolean;
	isMyMessage: boolean;
	isArchived: boolean;
}) => {
	const { activeSession } = useContext(ActiveSessionContext);
	const { getSetting } = useContext(RocketChatGlobalSettingsContext);

	const currentUserIsModerator = isUserModerator({
		chatItem: activeSession.item,
		rcUserId: getValueFromCookie('rc_uid')
	});

	const subscriberIsModerator = isUserModerator({
		chatItem: activeSession.item,
		rcUserId: userId
	});

	return (
		<FlyoutMenu position={isMyMessage ? 'left-top' : 'right-top'}>
			{currentUserIsModerator &&
				!subscriberIsModerator &&
				!isUserBanned && (
					<BanUser
						userName={username}
						rcUserId={userId}
						chatId={activeSession.item.id}
					/>
				)}

			{isMyMessage &&
				!isArchived &&
				getSetting<IBooleanSetting>(SETTING_MESSAGE_ALLOWDELETING) && (
					<DeleteMessage
						messageId={_id}
						className="flyoutMenu__item--delete"
					/>
				)}
		</FlyoutMenu>
	);
};

const DeleteMessage = ({
	messageId,
	className
}: {
	messageId: string;
	className?: string;
}) => {
	const { t: translate } = useTranslation();
	const [deleteOverlay, setDeleteOverlay] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const deleteMessage = useCallback(() => {
		setIsRequestInProgress(true);
		apiDeleteMessage(messageId)
			.then(() => setDeleteOverlay(false))
			.then(() => setIsRequestInProgress(false));
	}, [messageId]);

	const deleteOverlayItem: OverlayItem = useMemo(
		() => ({
			headline: translate('message.delete.overlay.headline'),
			copy: translate('message.delete.overlay.copy'),
			svg: XIllustration,
			illustrationBackground: 'neutral',
			buttonSet: [
				{
					label: translate('message.delete.overlay.cancel'),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.SECONDARY,
					disabled: isRequestInProgress
				},
				{
					label: translate('message.delete.overlay.confirm'),
					function: 'CONFIRM',
					type: BUTTON_TYPES.PRIMARY,
					disabled: isRequestInProgress
				}
			],
			handleOverlay: (functionName) => {
				if (functionName === 'CONFIRM') {
					deleteMessage();
					return;
				}
				setDeleteOverlay(false);
			}
		}),
		[deleteMessage, isRequestInProgress, translate]
	);

	return (
		<>
			<button
				onClick={() => setDeleteOverlay(true)}
				className={`flex ${className}`}
			>
				<div className="mr--1">
					<TrashIcon
						width={24}
						height={24}
						style={{ display: 'block', padding: '2px 0' }}
						aria-hidden="true"
						focusable="false"
					/>
				</div>
				<div>{translate('message.delete.delete')}</div>
			</button>
			{deleteOverlay && (
				<Overlay
					item={deleteOverlayItem}
					handleOverlayClose={() => {
						setDeleteOverlay(false);
					}}
				/>
			)}
		</>
	);
};
