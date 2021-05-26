import * as React from 'react';
import { useState, useContext, useEffect, useMemo } from 'react';
import {
	typeIsSession,
	typeIsTeamSession,
	typeIsEnquiry,
	getViewPathForType,
	getChatItemForSession,
	getTypeOfLocation,
	isGroupChatForSessionItem,
	scrollToEnd,
	isMyMessage
} from './sessionHelpers';
import { MessageItem } from '../message/MessageItemComponent';
import { MessageSubmitInterfaceComponent } from '../messageSubmitInterface/messageSubmitInterfaceComponent';
import { translate } from '../../utils/translate';
import { MessageItemComponent } from '../message/MessageItemComponent';
import { SessionHeaderComponent } from '../sessionHeader/SessionHeaderComponent';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import { apiEnquiryAcceptance, apiGetConsultingType } from '../../api';
import {
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem,
	OverlayWrapper
} from '../overlay/Overlay';
import { SessionAssign } from '../sessionAssign/SessionAssign';
import {
	SessionsDataContext,
	getActiveSession,
	UserDataContext,
	getContact,
	AcceptedGroupIdContext,
	hasUserAuthority,
	isAnonymousSession,
	AUTHORITIES,
	ConsultingTypeInterface
} from '../../globalState';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { Link } from 'react-router-dom';
import './session.styles';
import './session.yellowTheme.styles';
import { useDebouncedCallback } from 'use-debounce';
import { ReactComponent as ArrowDoubleDownIcon } from '../../resources/img/icons/arrow-double-down.svg';
import smoothScroll from './smoothScrollHelper';
import { Headline } from '../headline/Headline';
import { history } from '../app/app';

interface SessionItemProps {
	currentGroupId: string;
	isAnonymousEnquiry?: boolean;
	isTyping: Function;
	messages?: MessageItem[];
	typingUsers: string[];
}

let initMessageCount: number;

export const SessionItemComponent = (props: SessionItemProps) => {
	let { sessionsData, setSessionsData } = useContext(SessionsDataContext);
	const activeSession = useMemo(
		() => getActiveSession(props.currentGroupId, sessionsData),
		[props.currentGroupId] // eslint-disable-line react-hooks/exhaustive-deps
	);
	const { userData } = useContext(UserDataContext);
	const [monitoringButtonVisible, setMonitoringButtonVisible] = useState(
		false
	);
	const [overlayActive, setOverlayActive] = useState(false);
	const [currentGroupId, setCurrenGroupId] = useState(null);
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);
	const chatItem = getChatItemForSession(activeSession);
	const isGroupChat = isGroupChatForSessionItem(activeSession);
	const isLiveChat = isAnonymousSession(activeSession?.session);
	const messages = useMemo(() => props.messages, [props && props.messages]); // eslint-disable-line react-hooks/exhaustive-deps
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const scrollContainerRef = React.useRef<HTMLDivElement>(null);
	const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
	const [newMessages, setNewMessages] = useState(0);

	useEffect(() => {
		if (!props.isAnonymousEnquiry) {
			resetUnreadCount();
			scrollToEnd(0);
		}
	}, []); // eslint-disable-line

	useEffect(() => {
		if (!props.isAnonymousEnquiry && messages) {
			if (isMyMessage(messages[messages.length - 1]?.userId)) {
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

				if (isScrolledToBottom) {
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
		const { consultingType } = chatItem;
		apiGetConsultingType({ consultingTypeId: consultingType }).then(
			(response) => {
				if (isCanceled) return;
				setResortData(response);
			}
		);
		return () => {
			isCanceled = true;
		};
	}, [chatItem]);

	if (!activeSession) return null;

	const resetUnreadCount = () => {
		if (!props.isAnonymousEnquiry) {
			setNewMessages(0);
			initMessageCount = messages?.length;
			scrollContainerRef.current
				.querySelectorAll('.messageItem__divider--lastRead')
				.forEach((e) => e.remove());
		}
	};

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

		apiEnquiryAcceptance(sessionId, props.isAnonymousEnquiry)
			.then(() => {
				setOverlayActive(true);
				setCurrenGroupId(sessionGroupId);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		setOverlayActive(false);
		setIsRequestInProgress(false);
		setCurrenGroupId('');
		setAcceptedGroupId(currentGroupId);
		setSessionsData({ ...sessionsData, enquiries: [] });
		history.push(`/sessions/consultant/sessionView/`);
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
			const sessionHeader = scrollContainer.parentElement.getElementsByClassName(
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

	const isOnlyEnquiry = typeIsEnquiry(getTypeOfLocation());

	const buttonItem: ButtonItem = {
		label: props.isAnonymousEnquiry
			? translate('enquiry.acceptButton.anonymous')
			: translate('enquiry.acceptButton'),
		type: BUTTON_TYPES.PRIMARY
	};

	const getMonitoringLink = () => {
		if (
			typeIsSession(getTypeOfLocation()) &&
			!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)
		) {
			return {
				pathname: `/sessions/consultant/${getViewPathForType(
					getTypeOfLocation()
				)}/${chatItem.groupId}/${chatItem.id}/userProfile/monitoring`
			};
		}
		if (
			typeIsTeamSession(getTypeOfLocation()) &&
			!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)
		) {
			return {
				pathname: `/sessions/consultant/${getViewPathForType(
					getTypeOfLocation()
				)}/${chatItem.groupId}/${chatItem.id}/userProfile/monitoring`
			};
		}
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
						: false
				}
			/>

			{!props.isAnonymousEnquiry && (
				<div
					id="session-scroll-container"
					className="session__content"
					ref={scrollContainerRef}
					onScroll={(e) => handleScroll.callback(e)}
				>
					{messages &&
						resortData &&
						messages.map((message: MessageItem, index) => (
							<MessageItemComponent
								key={index}
								clientName={getContact(activeSession).username}
								askerRcId={chatItem.askerRcId}
								type={getTypeOfLocation()}
								isOnlyEnquiry={isOnlyEnquiry}
								isMyMessage={isMyMessage(message.userId)}
								resortData={resortData}
								{...message}
							/>
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

			{props.isAnonymousEnquiry && (
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
				!activeSession.isFeedbackSession &&
				!typeIsEnquiry(getTypeOfLocation()) &&
				monitoringButtonVisible &&
				!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
				!isLiveChat &&
				getMonitoringLink() && (
					<Link to={getMonitoringLink()}>
						<div className="monitoringButton">
							<Button item={monitoringButtonItem} isLink={true} />
						</div>
					</Link>
				)}

			{typeIsEnquiry(getTypeOfLocation()) ? (
				<div className="session__acceptance messageItem">
					{hasUserAuthority(
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

			{!props.isAnonymousEnquiry &&
				(!typeIsEnquiry(getTypeOfLocation()) ||
					(typeIsEnquiry(getTypeOfLocation()) &&
						hasUserAuthority(
							AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
							userData
						))) && (
					<MessageSubmitInterfaceComponent
						handleSendButton={() => {}}
						isTyping={() => props.isTyping()}
						placeholder={getPlaceholder()}
						showMonitoringButton={() => {
							setMonitoringButtonVisible(true);
						}}
						type={getTypeOfLocation()}
						typingUsers={props.typingUsers}
					/>
				)}

			{overlayActive && (
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

const overlayItem: OverlayItem = {
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

const monitoringButtonItem: ButtonItem = {
	label: translate('session.monitoring.buttonLabel'),
	type: 'PRIMARY',
	function: ''
};

const scrollBottomButtonItem: ButtonItem = {
	icon: <ArrowDoubleDownIcon />,
	type: BUTTON_TYPES.SMALL_ICON,
	smallIconBackgroundColor: 'grey'
};
