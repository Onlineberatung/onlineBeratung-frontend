import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { SendMessageButton } from './SendMessageButton';
import {
	getChatItemForSession,
	getSessionListPathForLocation,
	isGroupChat,
	isLiveChat,
	isSessionChat,
	SESSION_LIST_TYPES,
	typeIsEnquiry
} from '../session/sessionHelpers';
import { Checkbox, CheckboxItem } from '../checkbox/Checkbox';
import { translate } from '../../utils/translate';
import { UserDataContext } from '../../globalState/provider/UserDataProvider';
import {
	AUTHORITIES,
	getContact,
	hasUserAuthority
} from '../../globalState/helpers/stateHelpers';
import {
	AcceptedGroupIdContext,
	SessionsDataContext,
	STATUS_ARCHIVED,
	STATUS_FINISHED
} from '../../globalState';
import {
	apiGetDraftMessage,
	apiPostDraftMessage,
	apiPutDearchive,
	apiSendEnquiry,
	apiSendMessage,
	apiUploadAttachment,
	FETCH_ERRORS
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
import PluginsEditor from 'draft-js-plugins-editor';
import {
	convertFromRaw,
	convertToRaw,
	DraftHandleValue,
	EditorState,
	RichUtils
} from 'draft-js';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import {
	BoldButton,
	ItalicButton,
	UnorderedListButton
} from 'draft-js-buttons';
import createEmojiPlugin from 'draft-js-emoji-plugin';
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
import useDebouncedValue from '../../utils/useDebouncedValue';
import './emojiPicker.styles';
import './messageSubmitInterface.styles';
import './messageSubmitInterface.yellowTheme.styles';
import clsx from 'clsx';
import { history } from '../app/app';
import { mobileListView } from '../app/navigationHandler';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';

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

const SAVE_DRAFT_TIMEOUT = 10000;

export interface MessageSubmitInterfaceComponentProps {
	className?: string;
	handleSendButton: Function;
	isTyping?: Function;
	placeholder: string;
	showMonitoringButton?: Function;
	type: SESSION_LIST_TYPES;
	typingUsers?: string[];
	sessionIdFromParam?: number;
	groupIdFromParam?: string;
	language?: string;
}

export const MessageSubmitInterfaceComponent = (
	props: MessageSubmitInterfaceComponentProps
) => {
	const textareaInputRef = React.useRef<HTMLDivElement>(null);
	const inputWrapperRef = React.useRef<HTMLSpanElement>(null);
	const attachmentInputRef = React.useRef<HTMLInputElement>(null);
	const { userData } = useContext(UserDataContext);
	const [placeholder, setPlaceholder] = useState(props.placeholder);
	const { sessionsData } = useContext(SessionsDataContext);
	const activeSession = useContext(ActiveSessionContext);
	const chatItem = getChatItemForSession(activeSession);
	const isTypingActive = isGroupChat(chatItem) || isLiveChat(chatItem);
	const isLiveChatFinished =
		isSessionChat(chatItem) && chatItem.status === STATUS_FINISHED;
	const [activeInfo, setActiveInfo] = useState(null);
	const [draftLoaded, setDraftLoaded] = useState(false);
	const [attachmentSelected, setAttachmentSelected] = useState<File | null>(
		null
	);
	const [uploadProgress, setUploadProgress] = useState(null);
	const [uploadOnLoadHandling, setUploadOnLoadHandling] = useState(null);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [attachmentUpload, setAttachmentUpload] =
		useState<XMLHttpRequest | null>(null);
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [isRichtextActive, setIsRichtextActive] = useState(false);
	const currentDraftMessageRef = useRef<string>();
	const debouncedDraftMessage = useDebouncedValue(
		currentDraftMessageRef.current,
		SAVE_DRAFT_TIMEOUT
	);
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);

	const requestFeedbackCheckbox = document.getElementById(
		'requestFeedback'
	) as HTMLInputElement;

	const checkboxItem: CheckboxItem = {
		inputId: 'requestFeedback',
		name: 'requestFeedback',
		labelId: 'requestFeedbackLabel',
		label: translate('message.write.peer.checkbox.label'),
		checked: requestFeedbackCheckbox?.checked || false
	};

	const isConsultantAbsent =
		hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
		activeSession?.consultant?.absent;

	const isSessionArchived =
		activeSession?.session?.status === STATUS_ARCHIVED;

	useEffect(() => {
		if (
			isSessionArchived &&
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
		) {
			setActiveInfo(INFO_TYPES.ARCHIVED);
		} else if (isConsultantAbsent) {
			setActiveInfo(INFO_TYPES.ABSENT);
		}

		apiGetDraftMessage(props.sessionIdFromParam || props.groupIdFromParam)
			.then((response) => {
				setEditorWithMarkdownString(response.message);
			})
			.catch((error) => {
				if (error.message !== FETCH_ERRORS.EMPTY) {
					console.error('Loading Draft Message: ', error);
				}
			})
			.finally(() => {
				setDraftLoaded(true);
			});

		return () => {
			if (currentDraftMessageRef.current && !isLiveChatFinished) {
				const requestFeedbackCheckboxCallback = document.getElementById(
					'requestFeedback'
				) as HTMLInputElement;
				const groupId =
					requestFeedbackCheckboxCallback &&
					requestFeedbackCheckboxCallback.checked
						? activeSession.session.feedbackGroupId
						: props.sessionIdFromParam || props.groupIdFromParam;
				apiPostDraftMessage(
					groupId,
					currentDraftMessageRef.current
				).then();
			}
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (isLiveChatFinished) {
			setActiveInfo(INFO_TYPES.FINISHED_CONVERSATION);
		}
	}, [isLiveChatFinished]);

	useEffect(() => {
		if (
			debouncedDraftMessage &&
			currentDraftMessageRef.current &&
			!isLiveChatFinished
		) {
			const groupId =
				requestFeedbackCheckbox && requestFeedbackCheckbox.checked
					? activeSession.session.feedbackGroupId
					: props.sessionIdFromParam || props.groupIdFromParam;
			apiPostDraftMessage(groupId, debouncedDraftMessage);
		}
	}, [debouncedDraftMessage]); // eslint-disable-line react-hooks/exhaustive-deps

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
		if (uploadOnLoadHandling) {
			if (uploadOnLoadHandling.status === 201) {
				handleMessageSendSuccess();
				cleanupAttachment();
			} else if (uploadOnLoadHandling.status === 413) {
				handleAttachmentUploadError(INFO_TYPES.ATTACHMENT_SIZE_ERROR);
			} else if (uploadOnLoadHandling.status === 415) {
				handleAttachmentUploadError(INFO_TYPES.ATTACHMENT_FORMAT_ERROR);
			} else if (
				uploadOnLoadHandling.status === 403 &&
				uploadOnLoadHandling.getResponseHeader('X-Reason') ===
					'QUOTA_REACHED'
			) {
				handleAttachmentUploadError(
					INFO_TYPES.ATTACHMENT_QUOTA_REACHED_ERROR
				);
			} else {
				handleAttachmentUploadError(INFO_TYPES.ATTACHMENT_OTHER_ERROR);
			}
		}
	}, [uploadOnLoadHandling]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleAttachmentUploadError = (infoType: string) => {
		setActiveInfo(infoType);
		cleanupAttachment();
		setTimeout(() => setIsRequestInProgress(false), 1200);
	};

	const handleEditorChange = (currentEditorState) => {
		if (
			draftLoaded &&
			currentEditorState.getCurrentContent() !==
				editorState.getCurrentContent() &&
			props.isTyping
		) {
			props.isTyping(!currentEditorState.getCurrentContent().hasText());
		}
		setEditorState(currentEditorState);
		currentDraftMessageRef.current =
			getTypedMarkdownMessage(currentEditorState);
	};

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

	const getTypedMarkdownMessage = (currentEditorState?: EditorState) => {
		const contentState = currentEditorState
			? currentEditorState.getCurrentContent()
			: editorState.getCurrentContent();
		const rawObject = convertToRaw(escapeMarkdownChars(contentState));
		const markdownString = draftToMarkdown(rawObject, {
			escapeMarkdownCharacters: false
		});
		return markdownString.trim();
	};

	const setEditorWithMarkdownString = (markdownString: string) => {
		const rawObject = markdownToDraft(markdownString);
		const draftContent = convertFromRaw(rawObject);
		setEditorState(EditorState.createWithContent(draftContent));
	};

	const handleButtonClick = () => {
		if (uploadProgress || isRequestInProgress) {
			return null;
		}

		if (isSessionArchived) {
			apiPutDearchive(chatItem.id)
				.then(() => {
					sendMessage();
					if (
						!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)
					) {
						mobileListView();
						history.push(getSessionListPathForLocation());
						if (window.innerWidth >= 900) {
							setAcceptedGroupId(
								props.sessionIdFromParam ||
									props.groupIdFromParam
							);
						}
					}
				})
				.catch((error) => {
					console.error(error);
				});
		} else {
			sendMessage();
		}
	};

	const sendMessage = () => {
		const attachmentInput: any = attachmentInputRef.current;
		const attachment = attachmentInput && attachmentInput.files[0];
		if (getTypedMarkdownMessage() || attachment) {
			setIsRequestInProgress(true);
		} else {
			return null;
		}

		if (
			typeIsEnquiry(props.type) &&
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)
		) {
			const enquirySessionId = props.sessionIdFromParam
				? props.sessionIdFromParam
				: sessionsData.mySessions[0].session.id;
			apiSendEnquiry(
				enquirySessionId,
				getTypedMarkdownMessage(),
				props.language
			)
				.then((response) => {
					setEditorState(EditorState.createEmpty());
					props.handleSendButton(response);
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			const sendToFeedbackEndpoint =
				activeSession?.isFeedbackSession ||
				(requestFeedbackCheckbox && requestFeedbackCheckbox.checked);
			const sendToRoomWithId = sendToFeedbackEndpoint
				? activeSession?.session.feedbackGroupId
				: props.sessionIdFromParam || props.groupIdFromParam;
			const getSendMailNotificationStatus = () =>
				!isGroupChat(chatItem) && !isLiveChat(chatItem);

			if (attachment) {
				setAttachmentUpload(
					apiUploadAttachment(
						getTypedMarkdownMessage(),
						attachment,
						sendToRoomWithId,
						sendToFeedbackEndpoint,
						getSendMailNotificationStatus(),
						setUploadProgress,
						setUploadOnLoadHandling
					)
				);
			} else {
				if (getTypedMarkdownMessage()) {
					apiSendMessage(
						getTypedMarkdownMessage(),
						sendToRoomWithId,
						sendToFeedbackEndpoint,
						getSendMailNotificationStatus()
					)
						.then(() => {
							handleMessageSendSuccess();
						})
						.catch((error) => {
							console.log(error);
						});
				}
			}
		}
	};

	const handleMessageSendSuccess = () => {
		if (props.showMonitoringButton) {
			props.showMonitoringButton();
		}
		if (requestFeedbackCheckbox && requestFeedbackCheckbox.checked) {
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
		currentDraftMessageRef.current = '';
		setActiveInfo('');
		resizeTextarea();
		setTimeout(() => setIsRequestInProgress(false), 1200);
	};

	const handleCheckboxClick = () => {
		const textarea = document.querySelector('.textarea');
		textarea?.classList.toggle('textarea--yellowTheme');
		placeholder === translate('enquiry.write.input.placeholder.consultant')
			? setPlaceholder(
					translate('enquiry.write.input.placeholder.feedback.peer')
			  )
			: setPlaceholder(
					translate('enquiry.write.input.placeholder.consultant')
			  );
	};

	const handleAttachmentSelect = () => {
		const attachmentInput: any = attachmentInputRef.current;
		attachmentInput.click();
	};

	const handleAttachmentChange = () => {
		const attachmentInput: any = attachmentInputRef.current;
		const attachment = attachmentInput.files[0];
		const attachmentSizeMB = getAttachmentSizeMBForKB(attachment.size);
		attachmentSizeMB > ATTACHMENT_MAX_SIZE_IN_MB
			? handleLargeAttachments()
			: displayAttachmentToUpload(attachment);
	};

	const displayAttachmentToUpload = (attachment: File) => {
		setAttachmentSelected(attachment);
		setActiveInfo('');
	};

	const handleLargeAttachments = () => {
		removeSelectedAttachment();
		setActiveInfo(INFO_TYPES.ATTACHMENT_SIZE_ERROR);
	};

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
		setUploadOnLoadHandling(false);
		removeSelectedAttachment();
	};

	const getMessageSubmitInfo = (): MessageSubmitInfoInterface => {
		let infoData;
		if (activeInfo === INFO_TYPES.ABSENT) {
			infoData = {
				isInfo: true,
				infoHeadline:
					translate('consultant.absent.message') +
					getContact(activeSession).username,
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

	const hasUploadFunctionality =
		!typeIsEnquiry(props.type) ||
		(typeIsEnquiry(props.type) &&
			!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData));
	const hasRequestFeedbackCheckbox =
		hasUserAuthority(AUTHORITIES.USE_FEEDBACK, userData) &&
		!hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData) &&
		activeSession.session.feedbackGroupId &&
		!activeSession?.isFeedbackSession;
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
							checkboxHandle={handleCheckboxClick}
						/>
					)}
					<div className="textarea__wrapper">
						<span className="textarea__featureWrapper">
							<span className="textarea__richtextToggle">
								<RichtextToggleIcon
									width="20"
									height="20"
									onClick={() =>
										setIsRichtextActive(!isRichtextActive)
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
											<BoldButton {...externalProps} />
											<ItalicButton {...externalProps} />
											<UnorderedListButton
												{...externalProps}
											/>
										</div>
									)}
								</Toolbar>
								<PluginsEditor
									editorState={editorState}
									onChange={handleEditorChange}
									handleKeyCommand={handleEditorKeyCommand}
									placeholder={placeholder}
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
													{attachmentSelected.name}
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
						<SendMessageButton
							handleSendButton={handleButtonClick}
							clicked={isRequestInProgress}
							deactivated={uploadProgress}
						/>
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
		</div>
	);
};
