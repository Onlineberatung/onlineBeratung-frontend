import * as React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { SendMessageButton } from './SendMessageButton';
import { SESSION_LIST_TYPES } from '../session/sessionHelpers';
import { Checkbox, CheckboxItem } from '../checkbox/Checkbox';
import { UserDataContext } from '../../globalState/provider/UserDataProvider';
import {
	AUTHORITIES,
	getContact,
	hasUserAuthority
} from '../../globalState/helpers/stateHelpers';
import {
	E2EEContext,
	SessionsDataContext,
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
import {
	MessageSubmitInfo,
	MessageSubmitInfoInterface
} from './MessageSubmitInfo';
import {
	ATTACHMENT_MAX_SIZE_IN_MB,
	getAttachmentSizeMBForKB,
	isDOCXAttachment,
	isJPEGAttachment,
	isPDFAttachment,
	isPNGAttachment,
	isXLSXAttachment
} from './attachmentHelpers';
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
import { ReactComponent as FileDocIcon } from '../../resources/img/icons/file-doc.svg';
import { ReactComponent as FileImageIcon } from '../../resources/img/icons/file-image.svg';
import { ReactComponent as FilePdfIcon } from '../../resources/img/icons/file-pdf.svg';
import { ReactComponent as FileXlsIcon } from '../../resources/img/icons/file-xls.svg';
import { ReactComponent as ClipIcon } from '../../resources/img/icons/clip.svg';
import { ReactComponent as RichtextToggleIcon } from '../../resources/img/icons/richtext-toggle.svg';
import { ReactComponent as RemoveIcon } from '../../resources/img/icons/x.svg';
import { ReactComponent as CalendarMonthIcon } from '../../resources/img/icons/calendar-month-navigation.svg';
import './emojiPicker.styles';
import './messageSubmitInterface.styles';
import './messageSubmitInterface.yellowTheme.styles';
import clsx from 'clsx';
import { mobileListView } from '../app/navigationHandler';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Headline } from '../headline/Headline';
import { encryptText } from '../../utils/encryptionHelpers';
import { useE2EE } from '../../hooks/useE2EE';
import { encryptRoom } from '../../utils/e2eeHelper';
import { useTranslation } from 'react-i18next';
import { apiPostError, ERROR_LEVEL_WARN } from '../../api/apiPostError';
import { useE2EEViewElements } from '../../hooks/useE2EEViewElements';
import { Overlay, OverlayWrapper } from '../overlay/Overlay';
import { useTimeoutOverlay } from '../../hooks/useTimeoutOverlay';
import { SubscriptionKeyLost } from '../session/SubscriptionKeyLost';
import { RoomNotFound } from '../session/RoomNotFound';
import { useDraftMessage } from './useDraftMessage';

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

//Emoji Picker Plugin
const emojiPlugin = createEmojiPlugin({
	theme: emojiPickerCustomClasses,
	useNativeArt: true,
	selectButtonContent: <EmojiIcon />
});
const { EmojiSelect } = emojiPlugin;

const INFO_TYPES = {
	ABSENT: 'ABSENT',
	ARCHIVED: 'ARCHIVED',
	ATTACHMENT_SIZE_ERROR: 'ATTACHMENT_SIZE_ERROR',
	ATTACHMENT_FORMAT_ERROR: 'ATTACHMENT_FORMAT_ERROR',
	ATTACHMENT_QUOTA_REACHED_ERROR: 'ATTACHMENT_QUOTA_REACHED_ERROR',
	ATTACHMENT_OTHER_ERROR: 'ATTACHMENT_OTHER_ERROR',
	FINISHED_CONVERSATION: 'FINISHED_CONVERSATION'
};

export const getIconForAttachmentType = (attachmentType: string) => {
	if (isJPEGAttachment(attachmentType) || isPNGAttachment(attachmentType)) {
		return <FileImageIcon />;
	} else if (isPDFAttachment(attachmentType)) {
		return <FilePdfIcon />;
	} else if (isDOCXAttachment(attachmentType)) {
		return <FileDocIcon />;
	} else if (isXLSXAttachment(attachmentType)) {
		return <FileXlsIcon />;
	}
};

export interface MessageSubmitInterfaceComponentProps {
	className?: string;
	onSendButton?: Function;
	isTyping?: Function;
	placeholder: string;
	showMonitoringButton?: Function;
	typingUsers?: string[];
	language?: string;
	preselectedFile?: File;
	handleMessageSendSuccess?: Function;
}

const encryptAttachment = (attachment, keyID, key) => {
	if (!keyID) {
		return attachment;
	}

	/* ToDo: Currently attachments should not be E2E encrypted.
	In my opinion its required because this could be private pictures or medical documents
	or anything else but it should be tbd because there are some points which
	have to be changed to get it working.
	- Encrypt will happen in frontend so backend could not do any spam protection anymore
	- Download logic need to download the document first and decrypt it
	- Some better spam protection in frontend?
	 */
	return attachment;
};

export const MessageSubmitInterfaceComponent = (
	props: MessageSubmitInterfaceComponentProps
) => {
	const { t: translate } = useTranslation();
	const tenant = useTenant();
	const history = useHistory();

	const textareaInputRef = useRef<HTMLDivElement>(null);
	const inputWrapperRef = useRef<HTMLSpanElement>(null);
	const attachmentInputRef = useRef<HTMLInputElement>(null);
	const { userData } = useContext(UserDataContext);
	const { activeSession } = useContext(ActiveSessionContext);
	const { type, path: listPath } = useContext(SessionTypeContext);
	const { sessions } = useContext(SessionsDataContext);
	const [activeInfo, setActiveInfo] = useState(null);
	const [attachmentSelected, setAttachmentSelected] = useState<File | null>(
		null
	);
	const [uploadProgress, setUploadProgress] = useState(null);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [attachmentUpload, setAttachmentUpload] =
		useState<XMLHttpRequest | null>(null);
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [isRichtextActive, setIsRichtextActive] = useState(false);

	const { isE2eeEnabled } = useContext(E2EEContext);
	const {
		keyID: feedbackChatKeyId,
		key: feedbackChatKey,
		encrypted: feedbackEncrypted,
		sessionKeyExportedString: feedbackChatSessionKeyExportedString
	} = useE2EE(activeSession.item.feedbackGroupId);

	const {
		keyID,
		key,
		encrypted,
		sessionKeyExportedString,
		subscriptionKeyLost,
		roomNotFound
	} = useE2EE(activeSession.rid || null);

	const {
		visible: e2eeOverlayVisible,
		setState: setE2EEState,
		overlay: e2eeOverlay
	} = useE2EEViewElements();

	const { visible: requestOverlayVisible, overlay: requestOverlay } =
		useTimeoutOverlay(
			// Disable the request overlay if upload is in progess because upload progress is shown in the ui already
			isRequestInProgress && [0, 100, null].includes(uploadProgress),
			null,
			null,
			null,
			5000
		);

	const groupIdOrSessionId =
		activeSession.item.groupId || activeSession.item.id;

	const [requestFeedbackCheckboxChecked, setRequestFeedbackCheckboxChecked] =
		useState(false);

	const checkboxItem: CheckboxItem = {
		inputId: 'requestFeedback',
		name: 'requestFeedback',
		labelId: 'requestFeedbackLabel',
		labelClass: 'requestFeedbackLabel',
		label: translate('message.write.peer.checkbox.label'),
		checked: requestFeedbackCheckboxChecked
	};

	const handleEncryptRoom = useCallback(
		async (rcGroupId, isFeedback: boolean = false) =>
			encryptRoom({
				rcGroupId,
				isE2eeEnabled,
				keyId: isFeedback ? feedbackChatKeyId : keyID,
				isRoomAlreadyEncrypted: isFeedback
					? feedbackEncrypted
					: encrypted,
				sessionKeyExportedString: isFeedback
					? feedbackChatSessionKeyExportedString
					: sessionKeyExportedString,
				onStateChange: setE2EEState
			}),
		[
			encrypted,
			feedbackChatKeyId,
			feedbackChatSessionKeyExportedString,
			feedbackEncrypted,
			isE2eeEnabled,
			keyID,
			sessionKeyExportedString,
			setE2EEState
		]
	);

	const [isConsultantAbsent, setIsConsultantAbsent] = useState(
		hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
			activeSession.consultant?.absent
	);
	const [isSessionArchived, setIsSessionArchived] = useState(
		activeSession.item.status === STATUS_ARCHIVED
	);
	const [isTypingActive, setIsTypingActive] = useState(
		activeSession.isGroup || activeSession.isLive
	);
	const [isLiveChatFinished, setIsLiveChatFinished] = useState(
		activeSession.isLive && activeSession.item.status === STATUS_FINISHED
	);

	useEffect(() => {
		setIsConsultantAbsent(
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
				activeSession.consultant?.absent
		);
		setIsSessionArchived(activeSession.item.status === STATUS_ARCHIVED);
		setIsTypingActive(activeSession.isGroup || activeSession.isLive);
		setIsLiveChatFinished(
			activeSession.isLive &&
				activeSession.item.status === STATUS_FINISHED
		);
	}, [activeSession, activeSession.item.status, userData]);

	const [showAppointmentButton, setShowAppointmentButton] = useState(false);

	const { onChange: onDraftMessageChange, loaded: draftLoaded } =
		useDraftMessage(
			!isLiveChatFinished && !isRequestInProgress,
			setEditorState
		);

	useEffect(() => {
		if (
			isSessionArchived &&
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
		) {
			setActiveInfo(INFO_TYPES.ARCHIVED);
		} else if (isConsultantAbsent) {
			setActiveInfo(INFO_TYPES.ABSENT);
		} else if (isLiveChatFinished) {
			setActiveInfo(INFO_TYPES.FINISHED_CONVERSATION);
		} else {
			setActiveInfo(null);
		}
	}, [isConsultantAbsent, isLiveChatFinished, isSessionArchived, userData]);

	useEffect(() => {
		if (isLiveChatFinished) {
			setActiveInfo(INFO_TYPES.FINISHED_CONVERSATION);
		}
	}, [isLiveChatFinished]);

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
		if (!activeInfo && isConsultantAbsent) {
			setActiveInfo(INFO_TYPES.ABSENT);
		}
	}, [activeInfo]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		resizeTextarea();
		const toolbar: HTMLDivElement | null =
			document.querySelector('.textarea__toolbar');
		const richtextToggle: HTMLSpanElement | null = document.querySelector(
			'.textarea__richtextToggle'
		);
		if (isRichtextActive) {
			toolbar?.classList.add('textarea__toolbar--active');
			richtextToggle?.classList.add('textarea__richtextToggle--active');
		} else {
			toolbar?.classList.remove('textarea__toolbar--active');
			richtextToggle?.classList.remove(
				'textarea__richtextToggle--active'
			);
		}
	}, [isRichtextActive]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		resizeTextarea();
	}, [attachmentSelected]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const uploadProgressBar = document.querySelector(
			'.textarea__attachmentSelected__progress'
		);
		if (uploadProgressBar && uploadProgress > 0 && uploadProgress <= 100) {
			uploadProgressBar.setAttribute(
				'style',
				`width: ${uploadProgress}%`
			);
		}
	}, [uploadProgress]);

	useEffect(() => {
		if (
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
			hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)
		) {
			const { appointmentFeatureEnabled } = userData;
			if (!sessions?.[0]?.consultant && !activeSession.item.groupId) {
				setShowAppointmentButton(appointmentFeatureEnabled);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeSession.item.groupId]);

	const handleAttachmentUploadError = (infoType: string) => {
		setActiveInfo(infoType);
		cleanupAttachment();
		setTimeout(() => setIsRequestInProgress(false), 1200);
	};

	const handleEditorChange = useCallback(
		(currentEditorState) => {
			if (
				draftLoaded &&
				currentEditorState.getCurrentContent() !==
					editorState.getCurrentContent() &&
				props.isTyping
			) {
				props.isTyping(
					!currentEditorState.getCurrentContent().hasText()
				);
			}
			setEditorState(currentEditorState);
			onDraftMessageChange(getTypedMarkdownMessage(currentEditorState));
		},
		[
			draftLoaded,
			editorState,
			getTypedMarkdownMessage,
			onDraftMessageChange,
			props
		]
	);

	const handleEditorKeyCommand = (command) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			handleEditorChange(newState);
			return 'handled';
		}
		return 'not-handled';
	};

	const resizeTextarea = () => {
		const textInput: any = textareaInputRef.current;
		// default values
		let textareaMaxHeight;
		if (window.innerWidth <= 900) {
			textareaMaxHeight = 118;
		} else {
			textareaMaxHeight = 218;
		}
		const richtextHeight = 38;
		const fileHeight = 48;

		// calculate inputHeight
		const textHeight = document.querySelector(
			'.public-DraftEditor-content > div'
		)?.scrollHeight;
		let textInputMaxHeight = isRichtextActive
			? textareaMaxHeight - richtextHeight
			: textareaMaxHeight;
		textInputMaxHeight = attachmentSelected
			? textInputMaxHeight - fileHeight
			: textInputMaxHeight;
		const currentInputHeight =
			textHeight > textInputMaxHeight ? textInputMaxHeight : textHeight;

		// add input styles
		const currentOverflow =
			textHeight <= textareaMaxHeight
				? 'overflow-y: hidden;'
				: 'overflow-y: scroll;';
		const textInputMarginTop = isRichtextActive
			? `margin-top: ${richtextHeight}px;`
			: '';
		const textInputMarginBottom = attachmentSelected
			? `margin-bottom: ${fileHeight}px;`
			: '';
		let textInputStyles = `min-height: ${currentInputHeight}px; ${currentOverflow} ${textInputMarginTop} ${textInputMarginBottom}`;
		textInputStyles = isRichtextActive
			? textInputStyles +
			  `border-top: none; border-top-right-radius: 0; box-shadow: none;`
			: textInputStyles;
		textInputStyles = attachmentSelected
			? textInputStyles +
			  `border-bottom: none; border-bottom-right-radius: 0;`
			: textInputStyles;
		textInput?.setAttribute('style', textInputStyles);

		const textareaContainer = textInput?.closest('.textarea');
		const textareaContainerHeight = textareaContainer?.offsetHeight;
		const scrollButton = textareaContainer
			?.closest('.session')
			?.getElementsByClassName('session__scrollToBottom')[0];
		if (scrollButton) {
			scrollButton.style.bottom = textareaContainerHeight + 24 + 'px';
		}
	};

	const toggleAbsentMessage = () => {
		//TODO: not react way: use state and based on that set a class
		const infoWrapper = document.querySelector('.messageSubmitInfoWrapper');
		if (infoWrapper) {
			infoWrapper.classList.toggle('messageSubmitInfoWrapper--hidden');
		}
	};

	const handleButtonClick = () => {
		if (uploadProgress || isRequestInProgress) {
			return null;
		}

		if (isSessionArchived) {
			apiPutDearchive(activeSession.item.id)
				.then(prepareAndSendMessage)
				.then(() => {
					if (
						!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)
					) {
						if (window.innerWidth >= 900) {
							history.push(
								`${listPath}/${activeSession.item.groupId}/${activeSession.item.id}}`
							);
						} else {
							mobileListView();
							history.push(listPath);
						}
					}
				})
				.catch((error) => {
					console.error(error);
				});
		} else {
			prepareAndSendMessage().then();
		}
	};

	const sendEnquiry = (encryptedMessage, unencryptedMessage, isEncrypted) => {
		return apiSendEnquiry(
			activeSession.item.id,
			encryptedMessage,
			unencryptedMessage,
			isEncrypted,
			props.language
		)
			.then((response) =>
				handleEncryptRoom(response.rcGroupId).then(() => {
					props?.onSendButton && props.onSendButton(response);
				})
			)
			.then(() => setEditorState(EditorState.createEmpty()))
			.catch((error) => {
				console.log(error);
			});
	};

	const sendMessage = async (
		sendToFeedbackEndpoint,
		encryptedMessage,
		unencryptedMessage,
		attachment,
		isEncrypted
	) => {
		const sendToRoomWithId = sendToFeedbackEndpoint
			? activeSession.item.feedbackGroupId
			: groupIdOrSessionId;
		const getSendMailNotificationStatus = () =>
			!activeSession.isGroup && !activeSession.isLive;

		if (attachment) {
			const res = await apiUploadAttachment(
				encryptAttachment(attachment, keyID, key),
				sendToRoomWithId,
				sendToFeedbackEndpoint,
				getSendMailNotificationStatus(),
				setUploadProgress,
				setAttachmentUpload
			).catch((res: XMLHttpRequest) => {
				if (res.status === 413) {
					handleAttachmentUploadError(
						INFO_TYPES.ATTACHMENT_SIZE_ERROR
					);
				} else if (res.status === 415) {
					handleAttachmentUploadError(
						INFO_TYPES.ATTACHMENT_FORMAT_ERROR
					);
				} else if (
					res.status === 403 &&
					res.getResponseHeader('X-Reason') === 'QUOTA_REACHED'
				) {
					handleAttachmentUploadError(
						INFO_TYPES.ATTACHMENT_QUOTA_REACHED_ERROR
					);
				} else {
					handleAttachmentUploadError(
						INFO_TYPES.ATTACHMENT_OTHER_ERROR
					);
				}

				return null;
			});

			if (!res) {
				return;
			}
		}

		if (getTypedMarkdownMessage()) {
			await apiSendMessage(
				encryptedMessage,
				unencryptedMessage,
				sendToRoomWithId,
				sendToFeedbackEndpoint,
				getSendMailNotificationStatus() && !attachment,
				isEncrypted
			)
				.then(() => handleEncryptRoom(activeSession.item.groupId))
				.then(() => {
					props?.onSendButton && props.onSendButton();
					handleMessageSendSuccess();
					cleanupAttachment();
				})
				.catch((error) => {
					setIsRequestInProgress(false);
					console.log(error);
				});
		}
	};

	const isFeedbackMessage = () => {
		return (
			(!activeSession.isGroup && activeSession.isFeedback) ||
			requestFeedbackCheckboxChecked
		);
	};

	const prepareAndSendMessage = async () => {
		const attachmentInput: any = attachmentInputRef.current;
		const selectedFile = attachmentInput && attachmentInput.files[0];
		const attachment = props.preselectedFile || selectedFile;

		if (isE2eeEnabled && encrypted && !keyID) {
			console.error("Can't send message without key");
			return;
		}

		if (getTypedMarkdownMessage() || attachment) {
			setIsRequestInProgress(true);
		} else {
			return null;
		}

		const sendToFeedbackEndpoint = isFeedbackMessage();
		const messageKeyId = sendToFeedbackEndpoint ? feedbackChatKeyId : keyID;
		const messageKey = sendToFeedbackEndpoint ? feedbackChatKey : key;
		const unencryptedMessage = getTypedMarkdownMessage().trim();

		let encryptedMessage = unencryptedMessage;
		let isEncrypted = isE2eeEnabled;
		if (encryptedMessage.length > 0 && isE2eeEnabled) {
			try {
				encryptedMessage = await encryptText(
					encryptedMessage,
					messageKeyId,
					messageKey
				);
			} catch (e: any) {
				apiPostError({
					name: e.name,
					message: e.message,
					stack: e.stack,
					level: ERROR_LEVEL_WARN
				}).then();

				isEncrypted = false;
			}
		}

		if (
			type === SESSION_LIST_TYPES.ENQUIRY &&
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)
		) {
			await sendEnquiry(
				encryptedMessage,
				unencryptedMessage,
				isEncrypted
			);
			return;
		}

		await sendMessage(
			sendToFeedbackEndpoint,
			encryptedMessage,
			unencryptedMessage,
			attachment,
			isEncrypted
		);

		if (requestFeedbackCheckboxChecked) {
			await handleEncryptRoom(activeSession.item.feedbackGroupId, true);
		}
	};

	const handleMessageSendSuccess = () => {
		props.handleMessageSendSuccess?.();
		if (props.showMonitoringButton) {
			props.showMonitoringButton();
		}
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
		setEditorState(EditorState.createEmpty());
		setActiveInfo('');
		resizeTextarea();
		setTimeout(() => setIsRequestInProgress(false), 1200);
	};

	const handleRequestFeedbackCheckbox = (e) => {
		setRequestFeedbackCheckboxChecked((requestFeedbackCheckboxChecked) => {
			const textarea = document.querySelector('.textarea');
			textarea?.classList.toggle(
				'textarea--yellowTheme',
				!requestFeedbackCheckboxChecked
			);
			return !requestFeedbackCheckboxChecked;
		});
	};

	const handleAttachmentSelect = () => {
		const attachmentInput: any = attachmentInputRef.current;
		attachmentInput.click();
	};

	const displayAttachmentToUpload = (attachment: File) => {
		setAttachmentSelected(attachment);
		setActiveInfo('');
	};

	const handleLargeAttachments = useCallback(() => {
		removeSelectedAttachment();
		setActiveInfo(INFO_TYPES.ATTACHMENT_SIZE_ERROR);
	}, []);

	const handleAttachmentChange = () => {
		const attachmentInput: any = attachmentInputRef.current;
		const attachment = attachmentInput.files[0];
		const attachmentSizeMB = getAttachmentSizeMBForKB(attachment.size);
		attachmentSizeMB > ATTACHMENT_MAX_SIZE_IN_MB
			? handleLargeAttachments()
			: displayAttachmentToUpload(attachment);
	};

	const handlePreselectedAttachmentChange = useCallback(() => {
		const attachment = props.preselectedFile;
		const attachmentSizeMB = getAttachmentSizeMBForKB(attachment.size);
		attachmentSizeMB > ATTACHMENT_MAX_SIZE_IN_MB
			? handleLargeAttachments()
			: displayAttachmentToUpload(attachment);
	}, [handleLargeAttachments, props.preselectedFile]);

	useEffect(() => {
		if (!props.preselectedFile) return;
		handlePreselectedAttachmentChange();
	}, [handlePreselectedAttachmentChange, props.preselectedFile]);

	const removeSelectedAttachment = () => {
		const attachmentInput: any = attachmentInputRef.current;
		if (attachmentInput) {
			attachmentInput.value = '';
		}
	};

	const handleAttachmentRemoval = () => {
		if (uploadProgress && attachmentUpload) {
			attachmentUpload.abort();
			setTimeout(() => setIsRequestInProgress(false), 1200);
		}
		setActiveInfo('');
		cleanupAttachment();
	};

	const cleanupAttachment = () => {
		setUploadProgress(0);
		setAttachmentSelected(null);
		setAttachmentUpload(null);
		removeSelectedAttachment();
	};

	const getMessageSubmitInfo = (): MessageSubmitInfoInterface => {
		let infoData;
		if (activeInfo === INFO_TYPES.ABSENT) {
			infoData = {
				isInfo: true,
				infoHeadline: `${
					getContact(
						activeSession,
						translate('sessionList.user.consultantUnknown')
					).displayName ||
					getContact(
						activeSession,
						translate('sessionList.user.consultantUnknown')
					).username
				} ${translate('consultant.absent.message')} `,
				infoMessage: activeSession.consultant.absenceMessage
			};
		} else if (activeInfo === INFO_TYPES.ATTACHMENT_SIZE_ERROR) {
			infoData = {
				isInfo: false,
				infoHeadline: translate('attachments.error.size.headline'),
				infoMessage: translate('attachments.error.size.message')
			};
		} else if (activeInfo === INFO_TYPES.ATTACHMENT_FORMAT_ERROR) {
			infoData = {
				isInfo: false,
				infoHeadline: translate('attachments.error.format.headline'),
				infoMessage: translate('attachments.error.format.message')
			};
		} else if (activeInfo === INFO_TYPES.ATTACHMENT_QUOTA_REACHED_ERROR) {
			infoData = {
				isInfo: false,
				infoHeadline: translate('attachments.error.quota.headline'),
				infoMessage: translate('attachments.error.quota.message')
			};
		} else if (activeInfo === INFO_TYPES.ATTACHMENT_OTHER_ERROR) {
			infoData = {
				isInfo: false,
				infoHeadline: translate('attachments.error.other.headline'),
				infoMessage: translate('attachments.error.other.message')
			};
		} else if (activeInfo === INFO_TYPES.FINISHED_CONVERSATION) {
			infoData = {
				isInfo: true,
				infoHeadline: translate(
					'anonymous.session.infoMessage.chatFinished'
				)
			};
		} else if (activeInfo === INFO_TYPES.ARCHIVED) {
			infoData = {
				isInfo: true,
				infoHeadline: translate('archive.submitInfo.headline'),
				infoMessage: translate('archive.submitInfo.message')
			};
		}

		return infoData;
	};

	const handleBookingButton = () => {
		history.push('/booking/');
	};

	const hasUploadFunctionality =
		(type !== SESSION_LIST_TYPES.ENQUIRY ||
			(type === SESSION_LIST_TYPES.ENQUIRY &&
				!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData))) &&
		!tenant?.settings?.featureAttachmentUploadDisabled;
	const hasRequestFeedbackCheckbox =
		hasUserAuthority(AUTHORITIES.USE_FEEDBACK, userData) &&
		!hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData) &&
		activeSession.item.feedbackGroupId &&
		(activeSession.isGroup || !activeSession.isFeedback);

	const bookingButton: ButtonItem = {
		label: translate('message.submit.booking.buttonLabel'),
		type: BUTTON_TYPES.PRIMARY
	};

	if (subscriptionKeyLost) {
		return <SubscriptionKeyLost />;
	}

	// Ignore the missing room if session has no roomId
	if (roomNotFound && activeSession.rid) {
		return <RoomNotFound />;
	}

	return (
		<div
			className={clsx(
				props.className,
				'messageSubmit__wrapper',
				isTypingActive && 'messageSubmit__wrapper--withTyping'
			)}
		>
			{isTypingActive && (
				<TypingIndicator
					disabled={
						!(props.typingUsers && props.typingUsers.length > 0)
					}
					typingUsers={props.typingUsers}
				/>
			)}
			{activeInfo && <MessageSubmitInfo {...getMessageSubmitInfo()} />}
			{!isLiveChatFinished && (
				<form
					className={
						hasRequestFeedbackCheckbox
							? 'textarea textarea--large'
							: 'textarea'
					}
				>
					{hasRequestFeedbackCheckbox && (
						<Checkbox
							className="textarea__checkbox"
							item={checkboxItem}
							checkboxHandle={handleRequestFeedbackCheckbox}
						/>
					)}
					<div className={'textarea__wrapper'}>
						<div className="textarea__wrapper-send-message">
							<span className="textarea__featureWrapper">
								<span className="textarea__richtextToggle">
									<RichtextToggleIcon
										width="20"
										height="20"
										onClick={() =>
											setIsRichtextActive(
												!isRichtextActive
											)
										}
									/>
								</span>
								<EmojiSelect />
							</span>
							<span
								className="textarea__inputWrapper"
								ref={inputWrapperRef}
							>
								<div
									className="textarea__input"
									ref={textareaInputRef}
									onKeyUp={() => resizeTextarea()}
									onFocus={toggleAbsentMessage}
									onBlur={toggleAbsentMessage}
								>
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
												: props.placeholder
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
									/>
								</div>
								{hasUploadFunctionality &&
									(!attachmentSelected ? (
										<span className="textarea__attachmentSelect">
											<ClipIcon
												onClick={handleAttachmentSelect}
											/>
										</span>
									) : (
										<div className="textarea__attachmentWrapper">
											<span className="textarea__attachmentSelected">
												<span className="textarea__attachmentSelected__progress"></span>
												<span className="textarea__attachmentSelected__labelWrapper">
													{getIconForAttachmentType(
														attachmentSelected.type
													)}
													<p className="textarea__attachmentSelected__label">
														{
															attachmentSelected.name
														}
													</p>
													<span className="textarea__attachmentSelected__remove">
														<RemoveIcon
															onClick={
																handleAttachmentRemoval
															}
														/>
													</span>
												</span>
											</span>
										</div>
									))}
							</span>
							<div className="textarea__buttons">
								<SendMessageButton
									handleSendButton={handleButtonClick}
									clicked={isRequestInProgress}
									deactivated={
										uploadProgress || isRequestInProgress
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
					{hasUploadFunctionality && (
						<input
							ref={attachmentInputRef}
							onChange={handleAttachmentChange}
							className="textarea__attachmentInput"
							type="file"
							id="dataUpload"
							name="dataUpload"
							accept="image/jpeg, image/png, .pdf, .docx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
						/>
					)}
				</form>
			)}

			{requestOverlayVisible && !e2eeOverlayVisible && (
				<OverlayWrapper>
					<Overlay item={requestOverlay} />
				</OverlayWrapper>
			)}

			{e2eeOverlayVisible && (
				<OverlayWrapper>
					<Overlay item={e2eeOverlay} />
				</OverlayWrapper>
			)}
		</div>
	);
};
