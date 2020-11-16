import * as React from 'react';
import { useState, useEffect, useContext, useRef } from 'react';
import { SendMessageButton } from './SendMessageButton';
import {
	typeIsEnquiry,
	isGroupChatForSessionItem,
	getChatItemForSession
} from '../../session/ts/sessionHelpers';
import { Checkbox, CheckboxItem } from '../../checkbox/ts/Checkbox';
import { translate } from '../../../resources/ts/i18n/translate';
import { UserDataContext } from '../../../globalState/provider/UserDataProvider';
import {
	getActiveSession,
	getContact,
	hasUserAuthority,
	AUTHORITIES
} from '../../../globalState/helpers/stateHelpers';
import {
	ActiveSessionGroupIdContext,
	SessionsDataContext
} from '../../../globalState';
import {
	ajaxSendEnquiry,
	ajaxSendMessage,
	ajaxCallUploadAttachment,
	ajaxCallPostDraftMessage,
	ajaxCallGetDraftMessage
} from '../../apiWrapper/ts';
import {
	MessageSubmitInfo,
	MessageSubmitInfoInterface
} from './MessageSubmitInfo';
import {
	isJPEGAttachment,
	isPNGAttachment,
	isPDFAttachment,
	isDOCXAttachment,
	getAttachmentSizeMBForKB,
	isXLSXAttachment,
	ATTACHMENT_MAX_SIZE_IN_MB
} from './attachmentHelpers';
import { TypingIndicator } from '../../typingIndicator/ts/typingIndicator';
import PluginsEditor from 'draft-js-plugins-editor';
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import {
	ItalicButton,
	BoldButton,
	UnorderedListButton
} from 'draft-js-buttons';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import {
	emojiPickerCustomClasses,
	toolbarCustomClasses,
	handleEditorBeforeInput,
	handleEditorPastedText
} from './richtextHelpers';
import { SVG } from '../../svgSet/ts/SVG';
import { ICON_KEYS } from '../../svgSet/ts/SVGHelpers';
import useDebounce from '../../../resources/ts/helpers/useDebounce';
import { FETCH_ERRORS } from '../../apiWrapper/ts/fetchData';

//Linkify Plugin
const omitKey = (key, { [key]: _, ...obj }) => obj;
const linkifyPlugin = createLinkifyPlugin({
	component: (props) => {
		return (
			<a
				{...omitKey('blockKey', props)}
				href={props.href}
				onClick={() => window.open(props.href, '_blank')}
			/>
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
	selectButtonContent: <SVG name={ICON_KEYS.EMOJI} />
});
const { EmojiSelect } = emojiPlugin;

const checkboxItem: CheckboxItem = {
	inputId: 'requestFeedback',
	name: 'requestFeedback',
	labelId: 'requestFeedbackLabel',
	label: translate('message.write.peer.checkbox.label'),
	checked: false
};

const INFO_TYPES = {
	ABSENT: 'ABSENT',
	ATTACHMENT_SIZE_ERROR: 'ATTACHMENT_SIZE_ERROR',
	ATTACHMENT_FORMAT_ERROR: 'ATTACHMENT_FORMAT_ERROR',
	ATTACHMENT_OTHER_ERROR: 'ATTACHMENT_OTHER_ERROR'
};

export const getIconForAttachmentType = (attachmentType: string) => {
	if (isJPEGAttachment(attachmentType) || isPNGAttachment(attachmentType)) {
		return <SVG name={ICON_KEYS.FILE_IMAGE} />;
	} else if (isPDFAttachment(attachmentType)) {
		return <SVG name={ICON_KEYS.FILE_PDF} />;
	} else if (isDOCXAttachment(attachmentType)) {
		return <SVG name={ICON_KEYS.FILE_DOC} />;
	} else if (isXLSXAttachment(attachmentType)) {
		return <SVG name={ICON_KEYS.FILE_XLS} />;
	}
};

const SAVE_DRAFT_TIMEOUT = 10000;

export interface MessageSubmitInterfaceComponentProps {
	handleSendButton: Function;
	isTyping?: Function;
	placeholder: string;
	showMonitoringButton?: Function;
	type: string;
	typingUsers?: [];
}

export const MessageSubmitInterfaceComponent = (
	props: MessageSubmitInterfaceComponentProps
) => {
	let textareaRef: React.RefObject<HTMLDivElement> = React.useRef();
	let featureWrapperRef: React.RefObject<HTMLSpanElement> = React.useRef();
	let attachmentInputRef: React.RefObject<HTMLInputElement> = React.useRef();
	const { userData } = useContext(UserDataContext);
	const [placeholder, setPlaceholder] = useState(props.placeholder);
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const isGroupChat = isGroupChatForSessionItem(activeSession);
	const [activeInfo, setActiveInfo] = useState(null);
	const [attachmentSelected, setAttachmentSelected] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(null);
	const [uploadOnLoadHandling, setUploadOnLoadHandling] = useState(null);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [attachmentUpload, setAttachmentUpload] = useState(null);
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [isRichtextActive, setIsRichtextActive] = useState(false);
	const chatItem = getChatItemForSession(activeSession);
	const currentDraftMessageRef = useRef<string>();
	const debouncedDraftMessage = useDebounce(
		currentDraftMessageRef.current,
		SAVE_DRAFT_TIMEOUT
	);

	const requestFeedbackCheckbox = document.getElementById(
		'requestFeedback'
	) as HTMLInputElement;

	const isConsultantAbsent =
		hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) &&
		activeSession &&
		activeSession.consultant &&
		activeSession.consultant.absent;

	useEffect(() => {
		isConsultantAbsent ? setActiveInfo(INFO_TYPES.ABSENT) : null;

		ajaxCallGetDraftMessage(activeSessionGroupId)
			.then((response) => {
				setEditorWithMarkdownString(response.message);
			})
			.catch((error) => {
				if (error.message != FETCH_ERRORS.EMPTY) {
					console.error('Loading Draft Message: ', error);
				}
			});

		return () => {
			if (currentDraftMessageRef.current) {
				const requestFeedbackCheckboxCallback = document.getElementById(
					'requestFeedback'
				) as HTMLInputElement;
				const groupId =
					requestFeedbackCheckboxCallback &&
					requestFeedbackCheckboxCallback.checked
						? activeSession.session.feedbackGroupId
						: activeSessionGroupId;
				ajaxCallPostDraftMessage(
					groupId,
					currentDraftMessageRef.current
				);
			}
		};
	}, []);

	useEffect(() => {
		if (debouncedDraftMessage && currentDraftMessageRef.current) {
			const groupId =
				requestFeedbackCheckbox && requestFeedbackCheckbox.checked
					? activeSession.session.feedbackGroupId
					: activeSessionGroupId;
			ajaxCallPostDraftMessage(groupId, debouncedDraftMessage);
		}
	}, [debouncedDraftMessage]);

	useEffect(() => {
		!activeInfo && isConsultantAbsent
			? setActiveInfo(INFO_TYPES.ABSENT)
			: null;
	}, [activeInfo]);

	useEffect(() => {
		resizeTextarea();
		const toolbar: HTMLDivElement = document.querySelector(
			'.textarea__toolbar'
		);
		const richtextToggle: HTMLSpanElement = document.querySelector(
			'.textarea__richtextToggle'
		);
		if (isRichtextActive) {
			toolbar.classList.add('textarea__toolbar--active');
			richtextToggle.classList.add('textarea__richtextToggle--active');
		} else {
			toolbar.classList.remove('textarea__toolbar--active');
			richtextToggle.classList.remove('textarea__richtextToggle--active');
		}
	}, [isRichtextActive]);

	useEffect(() => {
		resizeTextarea();
		if (!attachmentSelected && uploadProgress) {
			removeSelectedAttachment();
		}
	}, [attachmentSelected]);

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
			removeSelectedAttachment();
			if (uploadOnLoadHandling.status === 201) {
				handleMessageSendSuccess();
				cleanupAttachment();
			} else if (uploadOnLoadHandling.status === 413) {
				handleAttachmentUploadError(INFO_TYPES.ATTACHMENT_SIZE_ERROR);
			} else if (uploadOnLoadHandling.status === 415) {
				handleAttachmentUploadError(INFO_TYPES.ATTACHMENT_FORMAT_ERROR);
			} else {
				handleAttachmentUploadError(INFO_TYPES.ATTACHMENT_OTHER_ERROR);
			}
		}
	}, [uploadOnLoadHandling]);

	const handleAttachmentUploadError = (infoType: string) => {
		setActiveInfo(infoType);
		cleanupAttachment();
		setTimeout(() => setIsRequestInProgress(false), 1200);
	};

	const handleEditorChange = (currentEditorState) => {
		if (
			isGroupChat &&
			currentEditorState.getCurrentContent() !==
				editorState.getCurrentContent()
		) {
			props.isTyping();
		}
		setEditorState(currentEditorState);
		currentDraftMessageRef.current = getTypedMarkdownMessage();
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
		const textarea: any = textareaRef.current;
		const featureWrapper: any = featureWrapperRef.current;
		const richtextEditor: HTMLDivElement = document.querySelector(
			'.DraftEditor-root'
		);

		resetTextareaSize(textarea);

		let maxHeight;
		if (window.innerWidth <= 900) {
			maxHeight = 118;
		} else {
			maxHeight = 218;
		}

		const fileHeight = 44;
		const richtextHeight = 37;

		let textHeight = textarea.scrollHeight;
		textHeight = attachmentSelected ? textHeight + fileHeight : textHeight;
		textHeight = isRichtextActive
			? textHeight + richtextHeight
			: textHeight;

		if (textHeight <= maxHeight) {
			textarea.setAttribute(
				'style',
				'min-height: ' + textHeight + 'px;' + ' overflow-y: hidden;'
			);
			attachmentSelected
				? textarea.setAttribute(
						'style',
						'min-height: ' +
							textHeight +
							'px; padding-bottom: ' +
							fileHeight +
							'px; overflow-y: hidden;'
				  )
				: textarea.setAttribute(
						'style',
						'min-height: ' +
							textHeight +
							'px;' +
							' overflow-y: hidden;'
				  );
			featureWrapper.setAttribute(
				'style',
				'min-height: ' + textHeight + 'px;'
			);
		} else {
			textarea.setAttribute(
				'style',
				'min-height: ' + maxHeight + 'px;' + ' overflow-y: scroll;'
			);
			attachmentSelected
				? textarea.setAttribute(
						'style',
						'min-height: ' +
							maxHeight +
							'px; padding-bottom: ' +
							fileHeight +
							'px; overflow-y: scroll;'
				  )
				: textarea.setAttribute(
						'style',
						'min-height: ' +
							maxHeight +
							'px;' +
							' overflow-y: scroll;'
				  );
			featureWrapper.setAttribute(
				'style',
				'min-height: ' + maxHeight + 'px;'
			);
		}
	};

	const resetTextareaSize = (textarea) => {
		const featureWrapper: any = featureWrapperRef.current;

		if (window.innerWidth <= 900) {
			textarea.setAttribute('style', 'min-height: 87px;');
			featureWrapper.setAttribute('style', 'min-height: 87px;');
		} else {
			textarea.setAttribute('style', 'min-height: 106px;');
			featureWrapper.setAttribute('style', 'min-height: 106px;');
		}
	};

	const toggleAbsentMessage = () => {
		//TODO: not react way: use state and based on that set a class
		const infoWrapper = document.querySelector('.messageSubmitInfoWrapper');
		if (infoWrapper) {
			infoWrapper.classList.toggle('messageSubmitInfoWrapper--hidden');
		}
	};

	const handleTextareaClick = () => {
		this.editor.focus();
	};

	const getTypedMarkdownMessage = () => {
		const contentState = editorState.getCurrentContent();
		const rawObject = convertToRaw(contentState);
		const markdownString = draftToMarkdown(rawObject);
		return markdownString.trim();
	};

	const setEditorWithMarkdownString = (markdownString: string) => {
		const rawObject = markdownToDraft(markdownString);
		const draftContent = convertFromRaw(rawObject);
		setEditorState(EditorState.createWithContent(draftContent));
	};

	const handleButtonClick = (event) => {
		if (uploadProgress || isRequestInProgress) {
			return null;
		}

		const attachmentInput: any = attachmentInputRef.current;
		const attachment = attachmentInput && attachmentInput.files[0];
		if (getTypedMarkdownMessage() || attachment) {
			setIsRequestInProgress(true);
		} else {
			return null;
		}

		if (
			typeIsEnquiry(props.type) &&
			hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData)
		) {
			const enquirySessionId = activeSessionGroupId
				? activeSessionGroupId
				: sessionsData.mySessions[0].session.id;
			ajaxSendEnquiry(enquirySessionId, getTypedMarkdownMessage())
				.then((response) => {
					setEditorState(EditorState.createEmpty());
					props.handleSendButton();
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			const sendToFeedbackEndpoint =
				activeSession.isFeedbackSession ||
				(requestFeedbackCheckbox && requestFeedbackCheckbox.checked);
			const sendToRoomWithId = sendToFeedbackEndpoint
				? activeSession.session.feedbackGroupId
				: activeSessionGroupId;
			const getSendMailNotificationStatus = () => !isGroupChat;

			if (attachment) {
				setAttachmentUpload(
					ajaxCallUploadAttachment(
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
					ajaxSendMessage(
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
		props.showMonitoringButton();
		if (requestFeedbackCheckbox && requestFeedbackCheckbox.checked) {
			const feedbackButton = document.querySelector(
				'.sessionInfo__feedbackButton'
			);
			feedbackButton.classList.add('sessionInfo__feedbackButton--active');
			setTimeout(() => {
				feedbackButton.classList.remove(
					'sessionInfo__feedbackButton--active'
				);
			}, 700);
		}
		setEditorState(EditorState.createEmpty());
		currentDraftMessageRef.current = '';
		setActiveInfo(null);
		resizeTextarea();
		setTimeout(() => setIsRequestInProgress(false), 1200);
	};

	const handleCheckboxClick = () => {
		const textarea = document.querySelector('.textarea');
		textarea.classList.toggle('textarea--yellowTheme');
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
		setActiveInfo(null);
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
		setActiveInfo(null);
		cleanupAttachment();
	};

	const cleanupAttachment = () => {
		setUploadProgress(null);
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
		} else if (activeInfo === INFO_TYPES.ATTACHMENT_OTHER_ERROR) {
			infoData = {
				isInfo: false,
				infoHeadline: translate('attachments.error.other.headline'),
				infoMessage: translate('attachments.error.other.message')
			};
		}
		return infoData;
	};

	const hasUploadFunctionality =
		!typeIsEnquiry(props.type) ||
		(typeIsEnquiry(props.type) &&
			!hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData));
	const hasRequestFeedbackCheckbox =
		hasUserAuthority(AUTHORITIES.USE_FEEDBACK, userData) &&
		!hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData) &&
		activeSession.session.feedbackGroupId &&
		!activeSession.isFeedbackSession;
	return (
		<div
			className={
				isGroupChat
					? 'messageSubmit__wrapper messageSubmit__wrapper--withTyping'
					: 'messageSubmit__wrapper'
			}
		>
			{isGroupChat ? (
				<TypingIndicator
					disabled={
						!(props.typingUsers && props.typingUsers.length > 0)
					}
					typingUsers={props.typingUsers}
				/>
			) : null}
			{activeInfo ? (
				<MessageSubmitInfo {...getMessageSubmitInfo()} />
			) : null}
			<form
				className={
					hasRequestFeedbackCheckbox
						? 'textarea textarea--large'
						: 'textarea'
				}
			>
				<span className="textarea__outerWrapper">
					{hasRequestFeedbackCheckbox ? (
						<Checkbox
							className="textarea__checkbox"
							item={checkboxItem}
							checkboxHandle={handleCheckboxClick}
						/>
					) : null}
					<div className="textarea__wrapper">
						<span
							ref={featureWrapperRef}
							className="textarea__featureWrapper"
						>
							<span className="textarea__richtextToggle">
								<SVG
									name={ICON_KEYS.RICHTEXT_TOGGLE}
									width="20"
									height="20"
									onClick={() =>
										setIsRichtextActive(!isRichtextActive)
									}
								/>
							</span>
							<EmojiSelect />
						</span>
						<span className="textarea__inputWrapper">
							<div
								className={`textarea__input ${
									isRichtextActive
										? 'textarea__input--activeRichtext'
										: ''
								}`}
								ref={textareaRef}
								onKeyUp={resizeTextarea}
								onFocus={toggleAbsentMessage}
								onBlur={toggleAbsentMessage}
								onClick={handleTextareaClick}
							>
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
									handlePastedText={(pastedText) =>
										handleEditorPastedText(
											editorState,
											pastedText
										)
									}
									ref={(element) => {
										this.editor = element;
									}}
									plugins={[
										linkifyPlugin,
										staticToolbarPlugin,
										emojiPlugin
									]}
								/>
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
							</div>
							{hasUploadFunctionality ? (
								!attachmentSelected ? (
									<span className="textarea__attachmentSelect">
										<SVG
											name={ICON_KEYS.CLIP}
											onClick={handleAttachmentSelect}
										/>
									</span>
								) : (
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
												<svg
													onClick={
														handleAttachmentRemoval
													}
													xmlns="http://www.w3.org/2000/svg"
													xmlnsXlink="http://www.w3.org/1999/xlink"
													width="72"
													height="72"
													viewBox="0 0 72 72"
												>
													<defs>
														<path
															id="x-a"
															d="M45.6482323,36.5771645 L65.5685425,56.4974747 C66.3495911,57.2785233 66.3495911,58.5448532 65.5685425,59.3259018 L59.3259018,65.5685425 C58.5448532,66.3495911 57.2785233,66.3495911 56.4974747,65.5685425 L36.5771645,45.6482323 L16.6568542,65.5685425 C15.8758057,66.3495911 14.6094757,66.3495911 13.8284271,65.5685425 L7.58578644,59.3259018 C6.80473785,58.5448532 6.80473785,57.2785233 7.58578644,56.4974747 L27.5060967,36.5771645 L7.58578644,16.6568542 C6.80473785,15.8758057 6.80473785,14.6094757 7.58578644,13.8284271 L13.8284271,7.58578644 C14.6094757,6.80473785 15.8758057,6.80473785 16.6568542,7.58578644 L36.5771645,27.5060967 L56.4974747,7.58578644 C57.2785233,6.80473785 58.5448532,6.80473785 59.3259018,7.58578644 L65.5685425,13.8284271 C66.3495911,14.6094757 66.3495911,15.8758057 65.5685425,16.6568542 L45.6482323,36.5771645 Z"
														/>
													</defs>
													<use xlinkHref="#x-a" />
												</svg>
											</span>
										</span>
									</span>
								)
							) : null}
						</span>
						<SendMessageButton
							handleSendButton={(event) =>
								handleButtonClick(event)
							}
							clicked={isRequestInProgress}
							deactivated={uploadProgress}
						/>
					</div>
				</span>
				{hasUploadFunctionality ? (
					<span>
						<input
							ref={attachmentInputRef}
							onChange={handleAttachmentChange}
							className="textarea__attachmentInput"
							type="file"
							id="dataUpload"
							name="dataUpload"
							accept="image/jpeg, image/png, .pdf, .docx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
						/>
					</span>
				) : null}
			</form>
		</div>
	);
};
