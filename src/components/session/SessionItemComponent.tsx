import * as React from 'react';
import { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import CryptoJS from 'crypto-js';
import {
	typeIsEnquiry,
	getViewPathForType,
	getChatItemForSession,
	getTypeOfLocation,
	isGroupChatForSessionItem,
	scrollToEnd,
	isMyMessage,
	SESSION_LIST_TYPES
} from './sessionHelpers';
import { MessageItem } from '../message/MessageItemComponent';
import { MessageSubmitInterfaceComponent } from '../messageSubmitInterface/messageSubmitInterfaceComponent';
import { translate } from '../../utils/translate';
import { MessageItemComponent } from '../message/MessageItemComponent';
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
	SessionsDataContext,
	UserDataContext,
	getContact,
	AcceptedGroupIdContext,
	hasUserAuthority,
	isAnonymousSession,
	AUTHORITIES,
	ConsultingTypeInterface,
	UpdateSessionListContext,
	SessionItemInterface,
	LegalLinkInterface,
	E2EEContext
} from '../../globalState';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { ReactComponent as XIcon } from '../../resources/img/illustrations/x.svg';
import { Link, useLocation } from 'react-router-dom';
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

interface SessionItemProps {
	isAnonymousEnquiry?: boolean;
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

	const activeSession = useContext(ActiveSessionContext);
	let { sessionsData, setSessionsData } = useContext(SessionsDataContext);
	const { userData } = useContext(UserDataContext);
	const [monitoringButtonVisible, setMonitoringButtonVisible] =
		useState(false);
	const [overlayItem, setOverlayItem] = useState<OverlayItem>(null);
	const [currentGroupId, setCurrentGroupId] = useState(null);
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);
	const chatItem = getChatItemForSession(
		activeSession
	) as SessionItemInterface;
	const isGroupChat = isGroupChatForSessionItem(activeSession);
	const isLiveChat = isAnonymousSession(activeSession?.session);
	const messages = useMemo(() => props.messages, [props && props.messages]); // eslint-disable-line react-hooks/exhaustive-deps
	const [initialScrollCompleted, setInitialScrollCompleted] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const scrollContainerRef = React.useRef<HTMLDivElement>(null);
	const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
	const [newMessages, setNewMessages] = useState(0);
	const { setUpdateSessionList } = useContext(UpdateSessionListContext);
	const [sessionListTab] = useState(
		new URLSearchParams(useLocation().search).get('sessionListTab')
	);
	const getSessionListTab = () =>
		`${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	const { isAnonymousEnquiry } = props;

	/* E2EE */
	const { encrypted, key, keyID, sessionKeyExportedString } =
		useE2EE(groupIdFromParam);
	const { refresh } = useContext(E2EEContext);
	const [groupKey, setGroupKey] = useState(null);
	const [groupKeyID, setGroupKeyID] = useState(null);
	const [sessionGroupKeyExportedString, setSessionGroupKeyExportedString] =
		useState(null);

	const hasE2EEFeatureEnabled = () =>
		localStorage.getItem('e2eeFeatureEnabled') ?? false;

	// group Key generation if needed
	useEffect(() => {
		if (!activeSession) {
			console.log('no active session');
			return;
		}
		if (!hasE2EEFeatureEnabled() || encrypted) {
			setGroupKey(key);
			setGroupKeyID(keyID);
			setSessionGroupKeyExportedString(sessionKeyExportedString);
			console.log('room already encrypted');
			return;
		}

		createGroupKey().then(({ keyID, key, sessionKeyExportedString }) => {
			setGroupKey(key);
			setGroupKeyID(keyID);
			setSessionGroupKeyExportedString(sessionKeyExportedString);
		});
	}, [encrypted, activeSession, key, keyID, sessionKeyExportedString]);

	const handleSendButton = useCallback(async () => {
		if (hasE2EEFeatureEnabled() && !encrypted) {
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
			refresh();
		}
	}, [
		encrypted,
		groupIdFromParam,
		groupKeyID,
		refresh,
		sessionGroupKeyExportedString
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
			consultingTypeId: chatItem?.consultingType
		}).then((response) => {
			if (isCanceled) return;
			setResortData(response);
		});
		return () => {
			isCanceled = true;
		};
	}, [chatItem?.consultingType]);

	const getPlaceholder = () => {
		if (isGroupChat) {
			return translate('enquiry.write.input.placeholder.groupChat');
		} else if (hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)) {
			return translate('enquiry.write.input.placeholder');
		} else if (
			hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData) &&
			activeSession.isFeedbackSession
		) {
			return translate('enquiry.write.input.placeholder.feedback.main');
		} else if (
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
			activeSession.isFeedbackSession
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
			.then(() => {
				setOverlayItem(enquirySuccessfullyAcceptedOverlayItem);
				setCurrentGroupId(sessionGroupId);
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
				setAcceptedGroupId(currentGroupId);
				setSessionsData({ ...sessionsData, enquiries: [] });
				history.push(`/sessions/consultant/sessionView/`);
				break;
			case OVERLAY_FUNCTIONS.CLOSE:
				setOverlayItem(null);
				setUpdateSessionList(SESSION_LIST_TYPES.ENQUIRY);
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

	const isOnlyEnquiry = typeIsEnquiry(getTypeOfLocation());

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

	return (
		<div
			className={
				activeSession.isFeedbackSession
					? `session session--yellowTheme`
					: `session`
			}
		>
			<SessionHeaderComponent
				consultantAbsent={
					activeSession.consultant && activeSession.consultant.absent
						? activeSession.consultant
						: null
				}
				hasUserInitiatedStopOrLeaveRequest={
					props.hasUserInitiatedStopOrLeaveRequest
				}
				legalLinks={props.legalLinks}
				bannedUsers={props.bannedUsers}
			/>

			{!isAnonymousEnquiry && (
				<div
					id="session-scroll-container"
					className="session__content"
					ref={scrollContainerRef}
					onScroll={(e) => handleScroll(e)}
				>
					{messages &&
						resortData &&
						messages.map((message: MessageItem, index) => (
							<React.Fragment key={index}>
								<MessageItemComponent
									clientName={
										getContact(activeSession).username
									}
									askerRcId={chatItem.askerRcId}
									type={getTypeOfLocation()}
									isOnlyEnquiry={isOnlyEnquiry}
									isMyMessage={isMyMessage(message.userId)}
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
									? translate('session.unreadCount.maxValue')
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

			{chatItem.monitoring &&
				!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
				!activeSession.isFeedbackSession &&
				!typeIsEnquiry(getTypeOfLocation()) &&
				monitoringButtonVisible &&
				!isLiveChat && (
					<Link
						to={`/sessions/consultant/${getViewPathForType(
							getTypeOfLocation()
						)}/${chatItem.groupId}/${
							chatItem.id
						}/userProfile/monitoring${getSessionListTab()}`}
					>
						<div className="monitoringButton">
							<Button item={monitoringButtonItem} isLink={true} />
						</div>
					</Link>
				)}

			{typeIsEnquiry(getTypeOfLocation()) ? (
				<div className="session__acceptance messageItem">
					{!isLiveChat &&
					hasUserAuthority(
						AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
						userData
					) ? (
						<SessionAssign />
					) : (
						<Button
							item={buttonItem}
							buttonHandle={() =>
								handleButtonClick(chatItem.id, chatItem.groupId)
							}
						/>
					)}
				</div>
			) : null}

			{!isAnonymousEnquiry &&
				(!typeIsEnquiry(getTypeOfLocation()) ||
					(typeIsEnquiry(getTypeOfLocation()) &&
						hasUserAuthority(
							AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
							userData
						))) && (
					<MessageSubmitInterfaceComponent
						handleSendButton={handleSendButton}
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
						groupIdFromParam={groupIdFromParam}
						E2EEParams={{
							encrypted,
							key: groupKey,
							keyID: groupKeyID,
							sessionKeyExportedString:
								sessionGroupKeyExportedString
						}}
					/>
				)}
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
