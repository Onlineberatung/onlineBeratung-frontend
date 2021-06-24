import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { history } from '../app/app';
import { Loading } from '../app/Loading';
import { SessionItemComponent } from './SessionItemComponent';
import {
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession,
	UnreadSessionsStatusContext,
	getSessionsDataWithChangedValue,
	StoppedGroupChatContext,
	AcceptedGroupIdContext,
	UserDataContext
} from '../../globalState';
import { mobileDetailView, mobileListView } from '../app/navigationHandler';
import {
	apiGetSessionData,
	apiSetSessionRead,
	SOCKET_COLLECTION,
	rocketChatSocket
} from '../../api';
import {
	getSessionListPathForLocation,
	getChatItemForSession,
	isGroupChatForSessionItem,
	prepareMessages
} from './sessionHelpers';
import { JoinGroupChatView } from '../groupChat/JoinGroupChatView';
import { getTokenFromCookie } from '../sessionCookie/accessSessionCookie';
import {
	OverlayWrapper,
	Overlay,
	OverlayItem,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import { translate } from '../../utils/translate';
import { BUTTON_TYPES } from '../button/Button';
import { logout } from '../logout/logout';
import { encodeUsername, decodeUsername } from '../../utils/encryptionHelpers';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import './session.styles';

let typingTimeout;
const TYPING_TIMEOUT_MS = 4000;

export const SessionView = (props) => {
	const { sessionsData, setSessionsData } = useContext(SessionsDataContext);
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);
	const { setActiveSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const groupIdFromParam: string = props.match.params.rcGroupId;
	setActiveSessionGroupId(groupIdFromParam);
	const activeSession = useMemo(
		() => getActiveSession(groupIdFromParam, sessionsData),
		[groupIdFromParam] // eslint-disable-line react-hooks/exhaustive-deps
	);
	const chatItem = getChatItemForSession(activeSession);
	const isGroupChat = isGroupChatForSessionItem(activeSession);
	const groupId = activeSession?.isFeedbackSession
		? chatItem?.feedbackGroupId
		: chatItem?.groupId;

	const [isLoading, setIsLoading] = useState(true);
	const [messagesItem, setMessagesItem] = useState(null);
	const { unreadSessionsStatus, setUnreadSessionsStatus } = useContext(
		UnreadSessionsStatusContext
	);
	const { setStoppedGroupChat } = useContext(StoppedGroupChatContext);
	const [isOverlayActive, setIsOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState(null);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);
	const [loadedMessages, setLoadedMessages] = useState(null);
	const { userData } = useContext(UserDataContext);
	const [typingUsers, setTypingUsers] = useState([]);
	const [currentlyTypingUsers, setCurrentlyTypingUsers] = useState([]);
	const [typingStatusSent, setTypingStatusSent] = useState(false);

	const setSessionToRead = (newMessageFromSocket: boolean = false) => {
		if (activeSession) {
			const isCurrentSessionRead = activeSession.isFeedbackSession
				? chatItem.feedbackRead
				: chatItem.messagesRead;
			if (!isCurrentSessionRead || newMessageFromSocket) {
				apiSetSessionRead(groupId);
				activeSession.isFeedbackSession
					? (chatItem.feedbackRead = true)
					: (chatItem.messagesRead = true);

				const changedSessionsData = getSessionsDataWithChangedValue(
					sessionsData,
					activeSession,
					'messagesRead',
					true
				);
				setSessionsData(changedSessionsData);

				const newMySessionsCount = unreadSessionsStatus.mySessions - 1;
				setUnreadSessionsStatus({
					...unreadSessionsStatus,
					mySessions: newMySessionsCount,
					resetedAnimations: newMySessionsCount === 0
				});
			}
		}
	};

	useEffect(() => {
		setIsLoading(true);
		mobileDetailView();
		setAcceptedGroupId(null);
		typingTimeout = null;
		if (isGroupChat && !chatItem.subscribed) {
			setIsLoading(false);
		} else {
			window['socket'] = new rocketChatSocket();
			fetchSessionMessages();
			return () => {
				window['socket'].close();
				setStoppedGroupChat(false);
			};
		}
	}, [activeSession]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (sessionsData) {
			const currentSession = getActiveSession(
				groupIdFromParam,
				sessionsData
			);
			const currentChatItem = getChatItemForSession(currentSession);
			const currentSessionRead = currentSession.isFeedbackSession
				? currentChatItem.feedbackRead
				: currentChatItem.messagesRead;
			if (!currentSessionRead) {
				setSessionToRead(true);
			}
		}
	}, [sessionsData]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		setTypingUsers(currentlyTypingUsers);
	}, [currentlyTypingUsers]);

	useEffect(() => {
		if (typingStatusSent) {
			setTypingTimeout();
		}
	}, [typingStatusSent]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (loadedMessages) {
			setMessagesItem(loadedMessages);
			setLoadedMessages(null);
		}
	}, [loadedMessages]);

	if (!sessionsData) return null;
	if (!activeSession) {
		history.push(getSessionListPathForLocation());
		return null;
	}

	const fetchSessionMessages = (isSocketConnected: boolean = false) => {
		const rcGroupId = props.match.params.rcGroupId;
		apiGetSessionData(rcGroupId)
			.then((messagesData) => {
				setLoadedMessages(messagesData);
				setIsLoading(false);

				if (!isSocketConnected) {
					setSessionToRead();
					window['socket'].connect();
					window['socket'].addSubscription(
						SOCKET_COLLECTION.ROOM_MESSAGES,
						[groupId, false],
						() => fetchSessionMessages(true)
					);
					if (isGroupChat) {
						window['socket'].addSubscription(
							SOCKET_COLLECTION.NOTIFY_USER,
							[
								getTokenFromCookie('rc_uid') +
									'/subscriptions-changed',
								false
							],
							handleGroupChatStopped
						);
						window['socket'].addSubscription(
							SOCKET_COLLECTION.NOTIFY_ROOM,
							[
								`${groupId}/typing`,
								{ useCollection: false, args: [] }
							],
							(data) => handleTypingResponse(data)
						);
					}
				}
			})
			.catch((error) => null);
	};

	const groupChatStoppedOverlay: OverlayItem = {
		svg: CheckIcon,
		headline: translate('groupChat.stopped.overlay.headline'),
		buttonSet: [
			{
				label: translate('groupChat.stopped.overlay.button1Label'),
				function: OVERLAY_FUNCTIONS.REDIRECT,
				type: BUTTON_TYPES.PRIMARY
			},
			{
				label: translate('groupChat.stopped.overlay.button2Label'),
				function: OVERLAY_FUNCTIONS.LOGOUT,
				type: BUTTON_TYPES.SECONDARY
			}
		]
	};

	const handleGroupChatStopped = () => {
		setOverlayItem(groupChatStoppedOverlay);
		setIsOverlayActive(true);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			setStoppedGroupChat(true);
			setRedirectToSessionsList(true);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LOGOUT) {
			logout();
		}
	};

	const setTypingTimeout = () => {
		return (typingTimeout = setTimeout(() => {
			window['socket'].sendTypingState(SOCKET_COLLECTION.NOTIFY_ROOM, [
				`${groupId}/typing`,
				encodeUsername(userData.userName).toLowerCase(),
				false
			]);
			setTypingStatusSent(false);
		}, TYPING_TIMEOUT_MS));
	};

	const handleTyping = () => {
		if (isGroupChat && window['socket']) {
			if (!typingStatusSent) {
				window['socket'].sendTypingState(
					SOCKET_COLLECTION.NOTIFY_ROOM,
					[
						`${groupId}/typing`,
						encodeUsername(userData.userName).toLowerCase(),
						true
					]
				);
				setTypingStatusSent(true);
			} else {
				window.clearTimeout(typingTimeout);
				setTypingTimeout();
			}
		}
	};

	const handleTypingResponse = (data) => {
		setCurrentlyTypingUsers([]);
		const username = decodeUsername(data[0]);
		const isTyping = data[1];
		let users = typingUsers;
		if (isTyping && !typingUsers.includes(username)) {
			users.push(username);
		} else {
			const index = typingUsers.indexOf(username);
			if (index !== -1) {
				users.splice(index, 1);
			} else {
				users = [];
			}
		}
		setCurrentlyTypingUsers(users);
	};

	if (isLoading) {
		return <Loading />;
	}

	if (isGroupChat && !chatItem.subscribed) {
		return <JoinGroupChatView />;
	}

	if (redirectToSessionsList) {
		mobileListView();
		setActiveSessionGroupId(null);
		history.push(getSessionListPathForLocation());
	}

	return (
		<div className="session__wrapper">
			{messagesItem ? (
				<SessionItemComponent
					messages={prepareMessages(messagesItem.messages)}
					isTyping={handleTyping}
					typingUsers={typingUsers}
					currentGroupId={groupIdFromParam}
				/>
			) : null}
			{isOverlayActive ? (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			) : null}
		</div>
	);
};
