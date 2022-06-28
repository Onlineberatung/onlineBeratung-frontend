import * as React from 'react';
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import { Link, useParams } from 'react-router-dom';
import clsx from 'clsx';
import CryptoJS from 'crypto-js';
import {
	getTypeOfLocation,
	getViewPathForType,
	typeIsEnquiry,
	scrollToEnd,
	isMyMessage,
	SESSION_LIST_TYPES,
	SESSION_LIST_TAB
} from './sessionHelpers';
import {
	MessageItem,
	MessageItemComponent
} from '../message/MessageItemComponent';
import { MessageSubmitInterfaceComponent } from '../messageSubmitInterface/messageSubmitInterfaceComponent';
import { translate } from '../../utils/translate';
import { SessionHeaderComponent } from '../sessionHeader/SessionHeaderComponent';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import {
	apiEnquiryAcceptance,
	apiGetConsultingType,
	FETCH_ERRORS
} from '../../api';
import {
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem,
	OverlayWrapper
} from '../overlay/Overlay';
import { SessionAssign } from '../sessionAssign/SessionAssign';
import {
	AUTHORITIES,
	ConsultingTypeInterface,
	getContact,
	hasUserAuthority,
	LegalLinkInterface,
	UserDataContext,
	SessionTypeContext,
	E2EEContext
} from '../../globalState';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { ReactComponent as XIcon } from '../../resources/img/illustrations/x.svg';
import './session.styles';
import './session.yellowTheme.styles';
import { useDebouncedCallback } from 'use-debounce';
import { ReactComponent as ArrowDoubleDownIcon } from '../../resources/img/icons/arrow-double-down.svg';
import smoothScroll from './smoothScrollHelper';
import { Headline } from '../headline/Headline';
import { history } from '../app/app';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { useE2EE } from '../../hooks/useE2EE';
import {
	createGroupKey,
	encryptForParticipant,
	getTmpMasterKey
} from '../../utils/encryptionHelpers';
import { apiRocketChatGroupMembers } from '../../api/apiRocketChatGroupMembers';
import { apiRocketChatGetUsersOfRoomWithoutKey } from '../../api/apiRocketChatGetUsersOfRoomWithoutKey';
import { apiRocketChatUpdateGroupKey } from '../../api/apiRocketChatUpdateGroupKey';
import { apiRocketChatSetRoomKeyID } from '../../api/apiRocketChatSetRoomKeyID';
import {
	ALIAS_MESSAGE_TYPES,
	apiSendAliasMessage
} from '../../api/apiSendAliasMessage';
import { DragAndDropArea } from '../dragAndDropArea/DragAndDropArea';
import useMeasure from 'react-use-measure';
import { useSearchParam } from '../../hooks/useSearchParams';

interface SessionItemProps {
	isTyping?: Function;
	messages?: MessageItem[];
	typingUsers: string[];
	hasUserInitiatedStopOrLeaveRequest: React.MutableRefObject<boolean>;
	legalLinks: Array<LegalLinkInterface>;
	bannedUsers: string[];
}

let initMessageCount: number;

export const SessionItemComponent = (props: SessionItemProps) => {
	const { rcGroupId: groupIdFromParam } = useParams();

	const { activeSession } = useContext(ActiveSessionContext);
	const { userData } = useContext(UserDataContext);
	const { type } = useContext(SessionTypeContext);

	const [monitoringButtonVisible, setMonitoringButtonVisible] =
		useState(false);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const messages = useMemo(() => props.messages, [props && props.messages]); // eslint-disable-line react-hooks/exhaustive-deps
	const [initialScrollCompleted, setInitialScrollCompleted] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const scrollContainerRef = React.useRef<HTMLDivElement>(null);
	const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
	const [draggedFile, setDraggedFile] = useState<File | null>(null);
	const [isDragOverDropArea, setDragOverDropArea] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const dragCancelRef = useRef<NodeJS.Timeout>();
	const [newMessages, setNewMessages] = useState(0);
	const [headerRef, headerBounds] = useMeasure();
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	const isAnonymousEnquiry =
		activeSession?.isEnquiry &&
		!activeSession?.isEmptyEnquiry &&
		activeSession.isLive;

	/* E2EE */
	const { encrypted, key, keyID, sessionKeyExportedString } =
		useE2EE(groupIdFromParam);
	const { isE2eeEnabled } = useContext(E2EEContext);
	const [groupKey, setGroupKey] = useState(null);
	const [groupKeyID, setGroupKeyID] = useState(null);
	const [sessionGroupKeyExportedString, setSessionGroupKeyExportedString] =
		useState(null);

	// group Key generation if needed
	useEffect(() => {
		if (!isE2eeEnabled) {
			return;
		}
		if (!activeSession) {
			console.log('no active session');
			return;
		}
		if (encrypted) {
			setGroupKey(key);
			setGroupKeyID(keyID);
			setSessionGroupKeyExportedString(sessionKeyExportedString);
			return;
		}

		createGroupKey().then(({ keyID, key, sessionKeyExportedString }) => {
			setGroupKey(key);
			setGroupKeyID(keyID);
			setSessionGroupKeyExportedString(sessionKeyExportedString);
		});
	}, [
		encrypted,
		activeSession,
		key,
		keyID,
		sessionKeyExportedString,
		isE2eeEnabled
	]);

	const handleEncryptRoom = useCallback(async () => {
		if (isE2eeEnabled && !encrypted) {
			const { members } = await apiRocketChatGroupMembers(
				groupIdFromParam
			);
			const { users } = await apiRocketChatGetUsersOfRoomWithoutKey(
				groupIdFromParam
			);

			await Promise.all(
				members
					// Filter system user and users with unencrypted username (Maybe more system users)
					.filter(
						(member) =>
							member.username !== 'System' &&
							member.username.indexOf('enc.') === 0
					)
					.map(async (member) => {
						const user = users.find(
							(user) => user._id === member._id
						);
						// If user has no public_key encrypt with tmpMasterKey
						const tmpMasterKey = await getTmpMasterKey(member._id);
						let userKey;
						if (user) {
							userKey = await encryptForParticipant(
								user.e2e.public_key,
								groupKeyID,
								sessionGroupKeyExportedString
							);
						} else {
							userKey =
								'tmp.' +
								groupKeyID +
								CryptoJS.AES.encrypt(
									sessionGroupKeyExportedString,
									tmpMasterKey
								);
						}

						return apiRocketChatUpdateGroupKey(
							member._id,
							groupIdFromParam,
							userKey
						);
					})
			);

			// Set Room Key ID at the very end because if something failed before it will still be repairable
			// After room key is set the room is encrypted and the room key could not be set again.
			console.log('Set Room Key ID', groupKeyID);
			try {
				await apiRocketChatSetRoomKeyID(groupIdFromParam, groupKeyID);
				await apiSendAliasMessage({
					rcGroupId: groupIdFromParam,
					type: ALIAS_MESSAGE_TYPES.E2EE_ACTIVATED
				});
			} catch (e) {
				console.error(e);
				return;
			}

			console.log('Start writing encrypted messages!');
		}
	}, [
		encrypted,
		groupIdFromParam,
		groupKeyID,
		sessionGroupKeyExportedString,
		isE2eeEnabled
	]);

	/** END E2EE */

	const resetUnreadCount = () => {
		if (!isAnonymousEnquiry) {
			setNewMessages(0);
			initMessageCount = messages?.length;
			scrollContainerRef.current
				.querySelectorAll('.messageItem__divider--lastRead')
				.forEach((e) => e.remove());
		}
	};

	useEffect(() => {
		const enableDraggingOnWindow = () => {
			window.ondragover = (ev: any) => {
				setIsDragging(true);
				cancelDraggingOnOutsideWindow();

				const isOutsideDropZone =
					!ev.target.classList.contains('dragAndDropArea');
				if (isOutsideDropZone) {
					ev.preventDefault();
					ev.dataTransfer.dropEffect = 'none';
					ev.dataTransfer.effectAllowed = 'none';
				}
			};
			window.ondragleave = () => onDragLeave();
			window.ondragend = window.ondrop = () => setIsDragging(false);
		};

		enableDraggingOnWindow();
		return () => disableDraggingOnWindow();
	}, []);

	useEffect(() => {
		if (scrollContainerRef.current) {
			resetUnreadCount();
		}
	}, [scrollContainerRef]); // eslint-disable-line

	useEffect(() => {
		if (!isAnonymousEnquiry && messages) {
			if (
				initialScrollCompleted &&
				isMyMessage(messages[messages.length - 1]?.userId)
			) {
				resetUnreadCount();
				scrollToEnd(0, true);
			} else {
				// if first unread message -> prepend element
				if (newMessages === 0 && !isScrolledToBottom) {
					const scrollContainer = scrollContainerRef.current;
					const firstUnreadItem = Array.from(
						scrollContainer.querySelectorAll('.messageItem')
					).pop();
					const lastReadDivider = document.createElement('div');
					lastReadDivider.innerHTML = translate(
						'session.divider.lastRead'
					);
					lastReadDivider.className =
						'messageItem__divider messageItem__divider--lastRead';
					firstUnreadItem.prepend(lastReadDivider);
				}

				if (isScrolledToBottom && initialScrollCompleted) {
					resetUnreadCount();
					scrollToEnd(0, true);
				}

				setNewMessages(messages.length - initMessageCount);
			}
		}
	}, [messages?.length]); // eslint-disable-line

	useEffect(() => {
		if (isScrolledToBottom) {
			resetUnreadCount();
		}
	}, [isScrolledToBottom]); // eslint-disable-line

	const [resortData, setResortData] = useState<ConsultingTypeInterface>();
	useEffect(() => {
		let isCanceled = false;
		apiGetConsultingType({
			consultingTypeId: activeSession.item.consultingType
		}).then((response) => {
			if (isCanceled) return;
			setResortData(response);
		});
		return () => {
			isCanceled = true;
		};
	}, [activeSession.item.consultingType]);

	const getPlaceholder = () => {
		if (activeSession.isGroup) {
			return translate('enquiry.write.input.placeholder.groupChat');
		} else if (hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)) {
			return translate('enquiry.write.input.placeholder');
		} else if (
			hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData) &&
			activeSession.isFeedback
		) {
			return translate('enquiry.write.input.placeholder.feedback.main');
		} else if (
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
			activeSession.isFeedback
		) {
			return translate('enquiry.write.input.placeholder.feedback.peer');
		} else if (hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)) {
			return translate('enquiry.write.input.placeholder.consultant');
		}
		return translate('enquiry.write.input.placeholder');
	};

	const handleButtonClick = (sessionId: any, sessionGroupId: string) => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);

		apiEnquiryAcceptance(sessionId, isAnonymousEnquiry)
			.then(async () => {
				await handleEncryptRoom();
				setOverlayItem(enquirySuccessfullyAcceptedOverlayItem);
			})
			.catch((error) => {
				if (error.message === FETCH_ERRORS.CONFLICT) {
					setOverlayItem(enquiryTakenByOtherConsultantOverlayItem);
				} else {
					console.log(error);
				}
			});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		switch (buttonFunction) {
			case OVERLAY_FUNCTIONS.REDIRECT:
				setOverlayItem(null);
				setIsRequestInProgress(false);
				//setAcceptedGroupId(currentGroupId);
				//setSessionsData({ ...sessionsData, enquiries: [] });
				history.push(`/sessions/consultant/sessionView/`);
				break;
			case OVERLAY_FUNCTIONS.CLOSE:
				setOverlayItem(null);
				//setUpdateSessionList(SESSION_LIST_TYPES.ENQUIRY);
				history.push(
					`/sessions/consultant/sessionPreview${getSessionListTab()}`
				);
				break;
			default:
			// Should never be executed as `handleOverlayAction` is only called
			// with a non-null `overlayItem`
		}
	};

	/* eslint-disable */
	const handleScroll = useDebouncedCallback((e) => {
		const scrollPosition = Math.round(
			e.target.scrollHeight - e.target.scrollTop
		);
		const containerHeight = e.target.clientHeight;
		const isBottom =
			scrollPosition >= containerHeight - 1 &&
			scrollPosition <= containerHeight + 1;

		setIsScrolledToBottom(isBottom);
	}, 100);
	/* eslint-enable */

	const handleScrollToBottomButtonClick = () => {
		if (newMessages > 0) {
			const scrollContainer = scrollContainerRef.current;
			const sessionHeader =
				scrollContainer.parentElement.getElementsByClassName(
					'sessionInfo'
				)[0] as HTMLElement;
			const messageItems = scrollContainer.querySelectorAll(
				'.messageItem:not(.messageItem--right)'
			);
			const firstUnreadItem = messageItems[
				messageItems.length - newMessages
			] as HTMLElement;
			const firstUnreadItemOffet =
				firstUnreadItem.offsetTop - sessionHeader.offsetHeight;

			if (scrollContainer.scrollTop < firstUnreadItemOffet) {
				smoothScroll({
					duration: 1000,
					element: scrollContainer,
					to: firstUnreadItemOffet
				});
			} else {
				scrollToEnd(0, true);
			}
		} else {
			scrollToEnd(0, true);
		}
	};

	const enableInitialScroll = () => {
		if (!initialScrollCompleted) {
			setInitialScrollCompleted(true);
			scrollToEnd(500, true);
		}
	};

	const isOnlyEnquiry = type === SESSION_LIST_TYPES.ENQUIRY;

	const buttonItem: ButtonItem = {
		label: isAnonymousEnquiry
			? translate('enquiry.acceptButton.anonymous')
			: translate('enquiry.acceptButton'),
		type: BUTTON_TYPES.PRIMARY
	};

	const enquirySuccessfullyAcceptedOverlayItem: OverlayItem = {
		svg: CheckIcon,
		headline: translate('session.acceptance.overlayHeadline'),
		buttonSet: [
			{
				label: translate('session.acceptance.buttonLabel'),
				function: OVERLAY_FUNCTIONS.REDIRECT,
				type: BUTTON_TYPES.PRIMARY
			}
		]
	};

	const enquiryTakenByOtherConsultantOverlayItem: OverlayItem = {
		svg: XIcon,
		headline: translate(
			'session.anonymous.takenByOtherConsultant.overlayHeadline'
		),
		illustrationBackground: 'error',
		buttonSet: [
			{
				label: translate(
					'session.anonymous.takenByOtherConsultant.buttonLabel'
				),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.PRIMARY
			}
		]
	};

	const monitoringButtonItem: ButtonItem = {
		label: translate('session.monitoring.buttonLabel'),
		type: 'PRIMARY',
		function: ''
	};

	const scrollBottomButtonItem: ButtonItem = {
		icon: <ArrowDoubleDownIcon />,
		type: BUTTON_TYPES.SMALL_ICON,
		smallIconBackgroundColor: 'alternate'
	};

	// cancels dragging automatically if user drags outside the
	// browser window (there is no build-in mechanic for that)
	const cancelDraggingOnOutsideWindow = () => {
		if (dragCancelRef.current) {
			clearTimeout(dragCancelRef.current);
		}

		dragCancelRef.current = setTimeout(() => {
			setIsDragging(false);
		}, 300);
	};

	const disableDraggingOnWindow = () => {
		setIsDragging(false);
		window.ondrag = undefined;
	};

	const onDragEnter = () => setDragOverDropArea(true);
	const onDragLeave = () => setDragOverDropArea(false);

	const onFileDragged = (file: File) => {
		setDraggedFile(file);
		onDragLeave();
	};

	const handleMessageSendSuccess = () => setDraggedFile(null);

	return (
		<div
			className={
				activeSession.isFeedback
					? `session session--yellowTheme`
					: `session`
			}
		>
			<div ref={headerRef}>
				<SessionHeaderComponent
					consultantAbsent={
						activeSession.consultant &&
						activeSession.consultant.absent
							? activeSession.consultant
							: null
					}
					hasUserInitiatedStopOrLeaveRequest={
						props.hasUserInitiatedStopOrLeaveRequest
					}
					legalLinks={props.legalLinks}
					bannedUsers={props.bannedUsers}
				/>
			</div>

			{!isAnonymousEnquiry && (
				<div
					id="session-scroll-container"
					className={clsx(
						'session__content',
						isDragging && 'drag-in-progress'
					)}
					ref={scrollContainerRef}
					onScroll={(e) => handleScroll(e)}
					onDragEnter={onDragEnter}
				>
					<div className={'message-holder'}>
						{messages &&
							resortData &&
							messages.map((message: MessageItem, index) => (
								<React.Fragment key={index}>
									<MessageItemComponent
										clientName={
											getContact(activeSession).username
										}
										askerRcId={activeSession.item.askerRcId}
										type={getTypeOfLocation()}
										isOnlyEnquiry={isOnlyEnquiry}
										isMyMessage={isMyMessage(
											message.userId
										)}
										resortData={resortData}
										bannedUsers={props.bannedUsers}
										{...message}
									/>
									{index === messages.length - 1 &&
										enableInitialScroll()}
								</React.Fragment>
							))}
						<div
							className={`session__scrollToBottom ${
								isScrolledToBottom
									? 'session__scrollToBottom--disabled'
									: ''
							}`}
						>
							{newMessages > 0 && (
								<span className="session__unreadCount">
									{newMessages > 99
										? translate(
												'session.unreadCount.maxValue'
										  )
										: newMessages}
								</span>
							)}
							<Button
								item={scrollBottomButtonItem}
								isLink={false}
								buttonHandle={handleScrollToBottomButtonClick}
							/>
						</div>
					</div>
				</div>
			)}

			{isAnonymousEnquiry && (
				<div className="session__content session__content--anonymousEnquiry">
					<Headline
						semanticLevel="3"
						text={`${translate(
							'enquiry.anonymous.infoLabel.start'
						)}${getContact(activeSession).username}${translate(
							'enquiry.anonymous.infoLabel.end'
						)}`}
					/>
				</div>
			)}

			{activeSession.item.monitoring &&
				!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
				(activeSession.isGroup || !activeSession.isFeedback) &&
				type !== SESSION_LIST_TYPES.ENQUIRY &&
				monitoringButtonVisible &&
				!activeSession.isLive && (
					<Link
						to={`/sessions/consultant/${getViewPathForType(
							getTypeOfLocation()
						)}/${activeSession.item.groupId}/${
							activeSession.item.id
						}/userProfile/monitoring${getSessionListTab()}`}
					>
						<div className="monitoringButton">
							<Button item={monitoringButtonItem} isLink={true} />
						</div>
					</Link>
				)}

			{typeIsEnquiry(getTypeOfLocation()) ? (
				<div className="session__acceptance messageItem">
					{!activeSession.isLive &&
					hasUserAuthority(
						AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
						userData
					) ? (
						<SessionAssign />
					) : (
						<Button
							item={buttonItem}
							buttonHandle={() =>
								handleButtonClick(
									activeSession.item.id,
									activeSession.item.groupId
								)
							}
						/>
					)}
				</div>
			) : null}

			{!isAnonymousEnquiry &&
				(type !== SESSION_LIST_TYPES.ENQUIRY ||
					hasUserAuthority(
						AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
						userData
					)) && (
					<MessageSubmitInterfaceComponent
						handleSendButton={handleEncryptRoom}
						isTyping={props.isTyping}
						className={clsx(
							'session__submit-interface',
							!isScrolledToBottom &&
								'session__submit-interface--scrolled-up'
						)}
						placeholder={getPlaceholder()}
						showMonitoringButton={() => {
							setMonitoringButtonVisible(true);
						}}
						type={getTypeOfLocation()}
						typingUsers={props.typingUsers}
						E2EEParams={{
							encrypted,
							key: groupKey,
							keyID: groupKeyID,
							sessionKeyExportedString:
								sessionGroupKeyExportedString
						}}
						preselectedFile={draggedFile}
						handleMessageSendSuccess={handleMessageSendSuccess}
					/>
				)}
			<DragAndDropArea
				onFileDragged={onFileDragged}
				isDragging={isDragging}
				canDrop={isDragOverDropArea}
				onDragLeave={onDragLeave}
				styleOverride={{ top: headerBounds.height + 'px' }}
			/>
			{overlayItem && (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</div>
	);
};
