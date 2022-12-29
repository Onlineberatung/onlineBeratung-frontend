import * as React from 'react';
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import { useHistory } from 'react-router-dom';

import { SendMessageButton } from './SendMessageButton';
import { SESSION_LIST_TYPES } from '../session/sessionHelpers';
import { Checkbox, CheckboxItem } from '../checkbox/Checkbox';
import { UserDataContext } from '../../globalState/provider/UserDataProvider';
import {
	AUTHORITIES,
	hasUserAuthority
} from '../../globalState/helpers/stateHelpers';
import {
	AnonymousConversationFinishedContext,
	E2EEContext,
	RocketChatContext,
	SessionTypeContext,
	STATUS_ARCHIVED,
	STATUS_FINISHED,
	useTenant
} from '../../globalState';
import {
	apiPutDearchive,
	apiSendEnquiry,
	apiSendMessage,
	apiUploadAttachment
} from '../../api';
import { INFO_TYPES, MessageSubmitInfo } from './MessageSubmitInfo';
import { TypingIndicator } from '../typingIndicator/typingIndicator';
import PluginsEditor from '@draft-js-plugins/editor';
import {
	convertToRaw,
	DraftHandleValue,
	EditorState,
	RichUtils
} from 'draft-js';
import { draftToMarkdown } from 'markdown-draft-js';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import {
	BoldButton,
	ItalicButton,
	UnorderedListButton
} from '@draft-js-plugins/buttons';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import {
	emojiPickerCustomClasses,
	escapeMarkdownChars,
	handleEditorBeforeInput,
	handleEditorPastedText,
	toolbarCustomClasses
} from './richtextHelpers';
import { ReactComponent as EmojiIcon } from '../../resources/img/icons/smiley-positive.svg';
import { ReactComponent as RichtextToggleIcon } from '../../resources/img/icons/richtext-toggle.svg';
import { ReactComponent as CalendarMonthIcon } from '../../resources/img/icons/calendar-month-navigation.svg';
import './emojiPicker.styles';
import './messageSubmitInterface.styles';
import './messageSubmitInterface.yellowTheme.styles';
import clsx from 'clsx';
import { mobileListView } from '../app/navigationHandler';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Headline } from '../headline/Headline';
import { useTranslation } from 'react-i18next';
import {
	encryptAttachment,
	encryptText,
	getSignature
} from '../../utils/encryptionHelpers';
import { apiPostError, ERROR_LEVEL_WARN } from '../../api/apiPostError';
import { useE2EEViewElements } from '../../hooks/useE2EEViewElements';
import { Overlay } from '../overlay/Overlay';
import { useTimeoutOverlay } from '../../hooks/useTimeoutOverlay';
import { useDraftMessage } from './useDraftMessage';
import { useDevToolbar } from '../devToolbar/DevToolbar';
import {
	OVERLAY_E2EE,
	OVERLAY_REQUEST
} from '../../globalState/interfaces/AppConfig/OverlaysConfigInterface';
import { SessionE2EEContext } from '../../globalState/provider/SessionE2EEProvider';
import useTyping from '../../utils/useTyping';
import { DragAndDropAreaContext } from '../dragAndDropArea/DragAndDropArea';
import { AttachmentUpload } from './AttachmentUpload';
import { STORAGE_KEY_ATTACHMENT_ENCRYPTION } from '../devToolbar/constants';

//Linkify Plugin
const omitKey = (key, { [key]: _, ...obj }) => obj;
const linkifyPlugin = createLinkifyPlugin({
	component: (props) => {
		return (
			/* eslint-disable */
			<a
				{...omitKey('blockKey', props)}
				href={props.href}
				onClick={() => window.open(props.href, '_blank')}
			></a>
			/* eslint-enable */
		);
	}
});

//Static Toolbar Plugin
const staticToolbarPlugin = createToolbarPlugin({
	theme: toolbarCustomClasses
});
const { Toolbar } = staticToolbarPlugin;

export interface MessageSubmitInterfaceComponentProps {
	className?: string;
	onSendButton?: Function;
	placeholder: string;
	showMonitoringButton?: Function;
	language?: string;
}

export const MessageSubmitInterfaceComponent = ({
	className,
	onSendButton,
	placeholder,
	showMonitoringButton,
	language
}: MessageSubmitInterfaceComponentProps) => {
	const { t: translate } = useTranslation();
	const tenant = useTenant();
	const history = useHistory();
	const { getDevToolbarOption } = useDevToolbar();

	const attachmentUploadController = useRef<XMLHttpRequest | null>(null);
	const progressRef = useRef<HTMLSpanElement>();

	const { userData } = useContext(UserDataContext);
	const { activeSession, reloadActiveSession } =
		useContext(ActiveSessionContext);
	const { type, path: listPath } = useContext(SessionTypeContext);
	const { anonymousConversationFinished } = useContext(
		AnonymousConversationFinishedContext
	);
	const { isE2eeEnabled } = useContext(E2EEContext);
	const { ready: rcSocketReady } = useContext(RocketChatContext);
	const { attachment, setAttachment, fileRejections } = useContext(
		DragAndDropAreaContext
	);

	const displayName = useMemo(
		() => userData.displayName || userData.userName,
		[userData.displayName, userData.userName]
	);
	const isConsultantAbsent = useMemo(
		() =>
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
			activeSession.consultant?.absent,
		[activeSession.consultant?.absent, userData]
	);
	const isSessionArchived = useMemo(
		() => activeSession.item.status === STATUS_ARCHIVED,
		[activeSession.item.status]
	);
	const isLiveChatFinished = useMemo(
		() =>
			activeSession.isLive &&
			activeSession.item.status === STATUS_FINISHED,
		[activeSession.isLive, activeSession.item.status]
	);
	const isTypingActive = useMemo(
		() => activeSession.isGroup || activeSession.isLive,
		[activeSession.isGroup, activeSession.isLive]
	);
	const showAppointmentButton = useMemo(
		() =>
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
			activeSession.isEmptyEnquiry &&
			userData.appointmentFeatureEnabled,
		[activeSession.isEmptyEnquiry, userData]
	);
	const hasUploadFunctionality = useMemo(
		() =>
			(type !== SESSION_LIST_TYPES.ENQUIRY ||
				(type === SESSION_LIST_TYPES.ENQUIRY &&
					!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData))) &&
			!tenant?.settings?.featureAttachmentUploadDisabled,
		[tenant?.settings?.featureAttachmentUploadDisabled, type, userData]
	);
	const hasRequestFeedbackCheckbox = useMemo(
		() =>
			hasUserAuthority(AUTHORITIES.USE_FEEDBACK, userData) &&
			!hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData) &&
			activeSession.item.feedbackGroupId &&
			(activeSession.isGroup || !activeSession.isFeedback),
		[
			activeSession.isFeedback,
			activeSession.isGroup,
			activeSession.item.feedbackGroupId,
			userData
		]
	);
	const instantInfo = useMemo<INFO_TYPES>(() => {
		if (
			isSessionArchived &&
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
		) {
			return INFO_TYPES.ARCHIVED;
		} else if (isConsultantAbsent) {
			return INFO_TYPES.ABSENT;
		} else if (isLiveChatFinished) {
			return INFO_TYPES.FINISHED_CONVERSATION;
		} else {
			return null;
		}
	}, [isConsultantAbsent, isLiveChatFinished, isSessionArchived, userData]);

	const { subscribeTyping, unsubscribeTyping, handleTyping, typingUsers } =
		useTyping(activeSession.rid, userData.userName, displayName);

	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [isRichtextActive, setIsRichtextActive] = useState(false);
	const [showAbsentMessage, setShowAbsentMessage] = useState(false);
	const [requestFeedbackCheckboxChecked, setRequestFeedbackCheckboxChecked] =
		useState(false);
	const [activeInfo, setActiveInfo] = useState<INFO_TYPES>(instantInfo);

	useEffect(() => {
		if (fileRejections.length > 0) {
			const {
				errors: [error]
			} = fileRejections[0];

			switch (error.code) {
				case 'file-too-large':
					setActiveInfo(INFO_TYPES.ATTACHMENT_SIZE_ERROR);
					return;
				case 'file-invalid-type':
					setActiveInfo(INFO_TYPES.ATTACHMENT_FORMAT_ERROR);
					return;
				case 'too-many-files':
					setActiveInfo(INFO_TYPES.ATTACHMENT_MULTIPLE_ERROR);
					return;
				default:
					setActiveInfo(INFO_TYPES.ATTACHMENT_OTHER_ERROR);
					return;
			}
		}
		setActiveInfo(instantInfo);
	}, [fileRejections, instantInfo]);

	//Emoji Picker Plugin
	const emojiPlugin = useMemo(
		() =>
			createEmojiPlugin({
				theme: emojiPickerCustomClasses,
				useNativeArt: true,
				disableInlineEmojis: true,
				selectButtonContent: (
					<EmojiIcon
						aria-label={translate('enquiry.write.input.emojies')}
						title={translate('enquiry.write.input.emojies')}
					/>
				)
			}),
		[translate]
	);
	const { EmojiSelect } = emojiPlugin;

	// This loads the keys for current activeSession.rid which is already set:
	// to groupChat.groupId on group chats
	// to session.groupId on session chats
	// to session.feebackGroupId on feedback chats
	const {
		keyID,
		key,
		encrypted,
		subscriptionKeyLost,
		roomNotFound,
		encryptRoom,
		// This loads keys for feedback chat to have the ability to encrypt
		// the feedback chat when checkbox "Request feedback" is checked
		feedback: {
			keyID: feedbackChatKeyId,
			key: feedbackChatKey,
			encryptRoom: feedbackEncryptRoom
		}
	} = useContext(SessionE2EEContext);

	const {
		visible: e2eeOverlayVisible,
		setState: setE2EEState,
		overlay: e2eeOverlay
	} = useE2EEViewElements();

	const { visible: requestOverlayVisible, overlay: requestOverlay } =
		useTimeoutOverlay(
			// Disable the request overlay if upload is in process because upload progress is shown in the ui already
			isRequestInProgress &&
				!(uploadProgress > 0 && uploadProgress < 100),
			null,
			null,
			null,
			5000
		);

	const checkboxItem: CheckboxItem = useMemo(
		() => ({
			inputId: 'requestFeedback',
			name: 'requestFeedback',
			labelId: 'requestFeedbackLabel',
			labelClass: 'requestFeedbackLabel',
			label: translate('message.write.peer.checkbox.label'),
			checked: requestFeedbackCheckboxChecked
		}),
		[requestFeedbackCheckboxChecked, translate]
	);

	/*
	 * Subscribe to typing events
	 */
	useEffect(() => {
		if (!rcSocketReady || !isTypingActive) {
			return;
		}
		subscribeTyping();

		return () => {
			unsubscribeTyping();
		};
	}, [isTypingActive, rcSocketReady, subscribeTyping, unsubscribeTyping]);

	const { onChange: onDraftMessageChange, loaded: draftLoaded } =
		useDraftMessage(
			!anonymousConversationFinished && !isRequestInProgress,
			setEditorState
		);

	const getTypedMarkdownMessage = useCallback(
		(currentEditorState?: EditorState) => {
			const contentState = currentEditorState
				? currentEditorState.getCurrentContent()
				: editorState.getCurrentContent();
			const rawObject = convertToRaw(escapeMarkdownChars(contentState));
			const markdownString = draftToMarkdown(rawObject, {
				escapeMarkdownCharacters: false
			});
			return markdownString.trim();
		},
		[editorState]
	);

	useEffect(() => {
		if (
			progressRef.current &&
			uploadProgress > 0 &&
			uploadProgress <= 100
		) {
			progressRef.current.setAttribute(
				'style',
				`width: ${uploadProgress}%`
			);
		}
	}, [uploadProgress]);

	const cleanupAttachment = useCallback(
		(infoType: INFO_TYPES = null) => {
			if (uploadProgress && attachmentUploadController.current) {
				attachmentUploadController.current.abort();
				attachmentUploadController.current = null;
			}
			setActiveInfo(infoType || instantInfo);
			setUploadProgress(0);
			setAttachment(null);
		},
		[instantInfo, setAttachment, uploadProgress]
	);

	const handleEditorChange = useCallback(
		(currentEditorState) => {
			if (
				draftLoaded &&
				currentEditorState.getCurrentContent() !==
					editorState.getCurrentContent() &&
				handleTyping
			) {
				handleTyping(!currentEditorState.getCurrentContent().hasText());
			}
			setEditorState(currentEditorState);
			onDraftMessageChange(getTypedMarkdownMessage(currentEditorState));
		},
		[
			draftLoaded,
			editorState,
			getTypedMarkdownMessage,
			handleTyping,
			onDraftMessageChange
		]
	);

	const handleEditorKeyCommand = useCallback(
		(command) => {
			const newState = RichUtils.handleKeyCommand(editorState, command);
			if (newState) {
				handleEditorChange(newState);
				return 'handled';
			}
			return 'not-handled';
		},
		[editorState, handleEditorChange]
	);

	const handleMessageSendSuccess = useCallback(
		(res = null) => {
			setEditorState(EditorState.createEmpty());
			cleanupAttachment();
			if (showMonitoringButton) showMonitoringButton();
			if (requestFeedbackCheckboxChecked) {
				const feedbackButton = document.querySelector(
					'.sessionInfo__feedbackButton'
				);
				feedbackButton?.classList.add(
					'sessionInfo__feedbackButton--active'
				);
				setTimeout(() => {
					feedbackButton?.classList.remove(
						'sessionInfo__feedbackButton--active'
					);
				}, 700);
			}
			onSendButton && onSendButton(res);
		},
		[
			cleanupAttachment,
			showMonitoringButton,
			requestFeedbackCheckboxChecked,
			onSendButton
		]
	);

	const encAttachment = useCallback(async () => {
		const isAttachmentEncryptionEnabledDevTools = parseInt(
			getDevToolbarOption(STORAGE_KEY_ATTACHMENT_ENCRYPTION)
		);

		// Encrypt attachment
		if (isE2eeEnabled && !!isAttachmentEncryptionEnabledDevTools) {
			try {
				const attachmentFile = await encryptAttachment(
					attachment,
					keyID,
					key
				);
				const signature = await getSignature(attachment);
				return [attachmentFile, signature];
			} catch (e: any) {
				apiPostError({
					name: e.name,
					message: e.message,
					stack: e.stack,
					level: ERROR_LEVEL_WARN
				}).then();
			}
		}

		return [attachment, null];
	}, [attachment, getDevToolbarOption, isE2eeEnabled, key, keyID]);

	const sendAttachment = useCallback(
		async (attachmentFile, signature) => {
			const sendToRoomWithId = requestFeedbackCheckboxChecked
				? activeSession.item.feedbackGroupId
				: activeSession.rid || activeSession.item.id;

			let infoType = null;

			try {
				await apiUploadAttachment(
					attachmentFile,
					sendToRoomWithId,
					requestFeedbackCheckboxChecked,
					!activeSession.isGroup && !activeSession.isLive,
					setUploadProgress,
					(xhr) => (attachmentUploadController.current = xhr),
					!!signature,
					signature
				);
				cleanupAttachment();
			} catch (res: any) {
				// Request aborted
				if (res.status !== 0) {
					infoType = INFO_TYPES.ATTACHMENT_OTHER_ERROR;
					if (res.status === 413) {
						infoType = INFO_TYPES.ATTACHMENT_SIZE_ERROR;
					} else if (res.status === 415) {
						infoType = INFO_TYPES.ATTACHMENT_FORMAT_ERROR;
					} else if (
						res.status === 403 &&
						res.getResponseHeader('X-Reason') === 'QUOTA_REACHED'
					) {
						infoType = INFO_TYPES.ATTACHMENT_QUOTA_REACHED_ERROR;
					}
				}
			}

			cleanupAttachment(infoType);
			return !infoType;
		},
		[
			activeSession.isGroup,
			activeSession.isLive,
			activeSession.item.feedbackGroupId,
			activeSession.item.id,
			activeSession.rid,
			cleanupAttachment,
			requestFeedbackCheckboxChecked
		]
	);

	// Encrypt message
	const encMessage = useCallback(
		async (message) => {
			let isEncrypted = isE2eeEnabled;
			if (isE2eeEnabled) {
				try {
					message = await encryptText(
						message,
						requestFeedbackCheckboxChecked
							? feedbackChatKeyId
							: keyID,
						requestFeedbackCheckboxChecked ? feedbackChatKey : key
					);
				} catch (e: any) {
					// On error, send message unencrypted
					apiPostError({
						name: e.name,
						message: e.message,
						stack: e.stack,
						level: ERROR_LEVEL_WARN
					}).then();

					isEncrypted = false;
				}
			}
			return [message, isEncrypted];
		},
		[
			feedbackChatKey,
			feedbackChatKeyId,
			isE2eeEnabled,
			key,
			keyID,
			requestFeedbackCheckboxChecked
		]
	);

	const sendEnquiry = useCallback(
		async (message, isEncrypted) => {
			try {
				const response = await apiSendEnquiry(
					activeSession.item.id,
					message,
					isEncrypted,
					language
				);
				await encryptRoom(setE2EEState, response.rcGroupId);
				return response;
			} catch (e: any) {
				console.error(e);
				return;
			}
		},
		[activeSession.item.id, encryptRoom, language, setE2EEState]
	);

	const sendMessage = useCallback(
		async (message, isEncrypted) => {
			const sendToRoomWithId = requestFeedbackCheckboxChecked
				? activeSession.item.feedbackGroupId
				: activeSession.rid || activeSession.item.id;

			try {
				const response = await apiSendMessage(
					message,
					sendToRoomWithId,
					requestFeedbackCheckboxChecked || activeSession.isFeedback,
					!activeSession.isGroup &&
						!activeSession.isLive &&
						!attachment,
					isEncrypted
				);
				if (requestFeedbackCheckboxChecked) {
					await feedbackEncryptRoom(setE2EEState);
				} else {
					await encryptRoom(setE2EEState);
				}
				return response;
			} catch (e: any) {
				console.error(e);
				return;
			}
		},
		[
			requestFeedbackCheckboxChecked,
			activeSession.item.feedbackGroupId,
			activeSession.item.id,
			activeSession.rid,
			activeSession.isFeedback,
			activeSession.isGroup,
			activeSession.isLive,
			attachment,
			feedbackEncryptRoom,
			setE2EEState,
			encryptRoom
		]
	);

	const prepareAndSendMessage = useCallback(async () => {
		if (isE2eeEnabled && encrypted && !keyID) {
			console.error("Can't send message without key");
			return;
		}

		let message = getTypedMarkdownMessage().trim();
		if (message.length <= 0 && !attachment) {
			return null;
		}

		setIsRequestInProgress(true);

		// Encrypt attachment and send it
		if (attachment) {
			const [attachmentFile, signature] = await encAttachment();
			if (!(await sendAttachment(attachmentFile, signature))) {
				setIsRequestInProgress(false);
				return;
			}
		}

		// Encrypt message and send it
		if (message.length > 0) {
			const [processedMessage, isEncrypted] = await encMessage(message);

			// Send message
			let send = sendMessage;
			if (
				type === SESSION_LIST_TYPES.ENQUIRY &&
				hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)
			) {
				send = sendEnquiry;
			}

			const response = await send(processedMessage, isEncrypted);
			if (response) {
				handleMessageSendSuccess(response);
			}
		}

		setIsRequestInProgress(false);
	}, [
		attachment,
		encAttachment,
		encMessage,
		encrypted,
		getTypedMarkdownMessage,
		isE2eeEnabled,
		keyID,
		sendAttachment,
		sendEnquiry,
		sendMessage,
		type,
		userData,
		handleMessageSendSuccess
	]);

	const handleButtonClick = useCallback(() => {
		if (uploadProgress || isRequestInProgress) {
			return null;
		}

		if (!isSessionArchived) {
			prepareAndSendMessage().then();
			return;
		}

		apiPutDearchive(activeSession.item.id)
			.then(prepareAndSendMessage)
			.then(() => {
				reloadActiveSession();
				if (!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)) {
					// Short timeout to wait for RC events finished
					setTimeout(() => {
						if (window.innerWidth >= 900) {
							history.push(
								`${listPath}/${activeSession.item.groupId}/${activeSession.item.id}}`
							);
						} else {
							mobileListView();
							history.push(listPath);
						}
					}, 1000);
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}, [
		activeSession.item.groupId,
		activeSession.item.id,
		history,
		isRequestInProgress,
		isSessionArchived,
		listPath,
		prepareAndSendMessage,
		reloadActiveSession,
		uploadProgress,
		userData
	]);

	const handleBookingButton = useCallback(() => {
		history.push('/booking/');
	}, [history]);

	const bookingButton: ButtonItem = useMemo(
		() => ({
			label: translate('message.submit.booking.buttonLabel'),
			type: BUTTON_TYPES.PRIMARY
		}),
		[translate]
	);

	if (subscriptionKeyLost) {
		return (
			<div>
				<MessageSubmitInfo
					activeInfo={INFO_TYPES.SUBSCRIPTION_KEY_LOST}
				/>
			</div>
		);
	}

	// Ignore the missing room if session has no roomId
	if (roomNotFound && activeSession.rid) {
		return (
			<div>
				<MessageSubmitInfo activeInfo={INFO_TYPES.ROOM_NOT_FOUND} />
			</div>
		);
	}

	return (
		<div
			className={clsx(
				className,
				'messageSubmit__wrapper',
				isTypingActive && 'messageSubmit__wrapper--withTyping'
			)}
		>
			{isTypingActive && (
				<TypingIndicator
					disabled={!(typingUsers && typingUsers.length > 0)}
					typingUsers={typingUsers}
				/>
			)}
			{activeInfo &&
				(activeInfo !== INFO_TYPES.ABSENT || showAbsentMessage) && (
					<MessageSubmitInfo activeInfo={activeInfo} />
				)}
			{!isLiveChatFinished && (
				<form
					className={clsx(
						'textarea',
						requestFeedbackCheckboxChecked &&
							'textarea--yellowTheme'
					)}
				>
					{hasRequestFeedbackCheckbox && (
						<Checkbox
							className="textarea__checkbox"
							item={checkboxItem}
							checkboxHandle={() =>
								setRequestFeedbackCheckboxChecked(
									!requestFeedbackCheckboxChecked
								)
							}
						/>
					)}
					<div className={'textarea__wrapper'}>
						<div className="textarea__wrapper-send-message">
							<div className="textarea__featureWrapper">
								<span
									className={clsx(
										'textarea__richtextToggle',
										isRichtextActive &&
											'textarea__richtextToggle--active'
									)}
								>
									<RichtextToggleIcon
										width="20"
										height="20"
										onClick={() =>
											setIsRichtextActive(
												!isRichtextActive
											)
										}
										title={translate(
											'enquiry.write.input.format'
										)}
										aria-label={translate(
											'enquiry.write.input.format'
										)}
									/>
								</span>
								<EmojiSelect />
							</div>
							<div className="textarea__inputWrapper">
								<div
									className="textarea__input flex flex--fd-column"
									onFocus={() => setShowAbsentMessage(false)}
									onBlur={() => setShowAbsentMessage(true)}
								>
									{isRichtextActive && (
										<Toolbar>
											{(externalProps) => (
												<div className="textarea__toolbar__buttonWrapper">
													<BoldButton
														{...externalProps}
													/>
													<ItalicButton
														{...externalProps}
													/>
													<UnorderedListButton
														{...externalProps}
													/>
												</div>
											)}
										</Toolbar>
									)}
									<PluginsEditor
										editorState={editorState}
										onChange={handleEditorChange}
										readOnly={!draftLoaded}
										handleKeyCommand={
											handleEditorKeyCommand
										}
										placeholder={
											hasRequestFeedbackCheckbox &&
											requestFeedbackCheckboxChecked
												? translate(
														'enquiry.write.input.placeholder.feedback.peer'
												  )
												: translate(placeholder)
										}
										stripPastedStyles={true}
										spellCheck={true}
										handleBeforeInput={() =>
											handleEditorBeforeInput(editorState)
										}
										handlePastedText={(
											text: string,
											html?: string
										): DraftHandleValue => {
											const newEditorState =
												handleEditorPastedText(
													editorState,
													text,
													html
												);
											if (newEditorState) {
												setEditorState(newEditorState);
											}
											return 'handled';
										}}
										plugins={[
											linkifyPlugin,
											staticToolbarPlugin,
											emojiPlugin
										]}
										tabIndex={0}
									/>
									{hasUploadFunctionality && (
										<AttachmentUpload
											onDelete={() => cleanupAttachment()}
											ref={progressRef}
										/>
									)}
								</div>
							</div>
							<div className="textarea__buttons">
								<SendMessageButton
									handleSendButton={handleButtonClick}
									clicked={isRequestInProgress}
									deactivated={
										!!uploadProgress || isRequestInProgress
									}
								/>
							</div>
						</div>
						{showAppointmentButton && (
							<div className="textarea__wrapper-booking">
								<Headline
									semanticLevel="5"
									text={translate(
										'message.submit.booking.headline'
									)}
									className="textarea__wrapper-booking-headline"
								/>
								<Button
									item={bookingButton}
									isLink={true}
									buttonHandle={handleBookingButton}
									customIcon={<CalendarMonthIcon />}
								/>
							</div>
						)}
					</div>
				</form>
			)}

			{requestOverlayVisible && (
				<Overlay item={requestOverlay} name={OVERLAY_REQUEST} />
			)}
			{e2eeOverlayVisible && (
				<Overlay item={e2eeOverlay} name={OVERLAY_E2EE} />
			)}
		</div>
	);
};
