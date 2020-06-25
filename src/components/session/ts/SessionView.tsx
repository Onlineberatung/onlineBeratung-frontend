import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Loading } from '../../app/ts/Loading';
import { SessionItemComponent } from './SessionItemComponent';
import {
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession,
	UnreadSessionsStatusContext,
	getUnreadMessagesStatus,
	getSessionsDataWithChangedValue,
	StoppedGroupChatContext,
	AcceptedGroupIdContext,
	UserDataContext
} from '../../../globalState';
import {
	mobileDetailView,
	mobileListView
} from '../../app/ts/navigationHandler';
import {
	getSessionData,
	setSessionRead,
	SOCKET_COLLECTION
} from '../../apiWrapper/ts';
import {
	getSessionListPathForLocation,
	getChatItemForSession,
	isGroupChatForSessionItem,
	prepareMessages,
	scrollToEnd
} from './sessionHelpers';
import { history } from '../../app/ts/app';
import { rocketChatSocket } from '../../apiWrapper/ts';
import { JoinGroupChatView } from '../../groupChat/ts/JoinGroupChatView';
import { getTokenFromCookie } from '../../sessionCookie/ts/accessSessionCookie';
import {
	OverlayWrapper,
	Overlay,
	OverlayItem,
	OVERLAY_FUNCTIONS
} from '../../overlay/ts/Overlay';
import { translate } from '../../../resources/ts/i18n/translate';
import { BUTTON_TYPES } from '../../button/ts/Button';
import { Redirect } from 'react-router';
import { logout } from '../../logout/ts/logout';
import {
	encodeUsername,
	decodeUsername
} from '../../../resources/ts/helpers/encryptionHelpers';

let typingTimeout;
const TYPING_TIMEOUT_MS = 4000;

export const SessionView = (props) => {
	const { sessionsData, setSessionsData } = useContext(SessionsDataContext);
	if (!sessionsData) return null;

	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);
	const { setActiveSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const groupIdFromParam: string = props.match.params.rcGroupId;
	setActiveSessionGroupId(groupIdFromParam);
	const activeSession = getActiveSession(groupIdFromParam, sessionsData);
	if (!activeSession) {
		history.push(getSessionListPathForLocation());
		return null;
	}
	const chatItem = getChatItemForSession(activeSession);
	const isGroupChat = isGroupChatForSessionItem(activeSession);
	const groupId = activeSession.isFeedbackSession
		? chatItem.feedbackGroupId
		: chatItem.groupId;

	const [isLoading, setIsLoading] = useState(true);
	const [messagesItem, setMessagesItem] = useState(null);
	const { setUnreadSessionsStatus } = useContext(UnreadSessionsStatusContext);
	const { setStoppedGroupChat } = useContext(StoppedGroupChatContext);
	const [isOverlayActive, setIsOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState(null);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);
	const [currentMessagesOffset, setCurrentMessagesOffset] = useState(null);
	const [loadNextMessages, setLoadNextMessages] = useState(null);
	const [loadedMessages, setLoadedMessages] = useState(null);
	const [preventMessageReload, setPreventMessageReload] = useState(null);
	const { userData } = useContext(UserDataContext);
	const [typingUsers, setTypingUsers] = useState([]);
	const [currentlyTypingUsers, setCurrentlyTypingUsers] = useState([]);
	//SET FALSE
	const [typingStatusSent, setTypingStatusSent] = useState(false);

	const setSessionToRead = () => {
		if (activeSession && !isGroupChat) {
			const isCurrentSessionRead = activeSession.isFeedbackSession
				? chatItem.feedbackRead
				: chatItem.messagesRead;
			if (!isCurrentSessionRead) {
				setSessionRead(groupId);
				activeSession.isFeedbackSession
					? (chatItem.feedbackRead = true)
					: (chatItem.messagesRead = true);

				setUnreadSessionsStatus({
					sessions: getUnreadMessagesStatus(sessionsData)
				});

				const changedSessionsData = getSessionsDataWithChangedValue(
					sessionsData,
					activeSession,
					'messagesRead',
					true
				);
				setSessionsData(changedSessionsData);
			}
		}
	};

	useEffect(() => {
		mobileDetailView();
		setAcceptedGroupId(null);
		typingTimeout = null;
		if (isGroupChat && !chatItem.subscribed) {
			setIsLoading(false);
		} else {
			window['socket'] = new rocketChatSocket();
			fetchData();
			return () => {
				window['socket'].close();
				setStoppedGroupChat(false);
			};
		}
	}, []);

	useEffect(() => {
		setTypingUsers(currentlyTypingUsers);
	}, [currentlyTypingUsers]);

	useEffect(() => {
		typingStatusSent ? setTypingTimeout() : null;
	}, [typingStatusSent]);

	useEffect(() => {
		if (!preventMessageReload && loadNextMessages) {
			fetchData(true, currentMessagesOffset);
			setLoadNextMessages(false);
		}
	}, [loadNextMessages]);

	useEffect(() => {
		if (loadedMessages) {
			setMessagesItem(loadedMessages);
			setLoadedMessages(null);
		}
	}, [loadedMessages]);

	const fetchData = (
		isSocketConnected: boolean = false,
		offset: number = 0
	) => {
		const rcGroupId = props.match.params.rcGroupId;
		getSessionData(rcGroupId, offset)
			.then((messagesData) => {
				setCurrentMessagesOffset(parseInt(messagesData.total));
				let newMessages: any = messagesItem;
				if (offset > 0) {
					newMessages.messages = [
						...messagesItem.messages,
						...messagesData.messages
					];
					newMessages.total = messagesData.total;
					newMessages.count = messagesData.total;
					setLoadedMessages(newMessages);
				} else {
					setLoadedMessages(messagesData);
					setIsLoading(false);
				}
				scrollToEnd(0, true);
				setSessionToRead();

				if (!isSocketConnected) {
					window['socket'].connect();
					window[
						'socket'
					].addSubscription(
						SOCKET_COLLECTION.ROOM_MESSAGES,
						[groupId, false],
						() => fetchData(true)
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
						window[
							'socket'
						].addSubscription(
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

	const handleGroupChatStopped = () => {
		setPreventMessageReload(true);
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
		return <Redirect to={getSessionListPathForLocation()} />;
	}

	return (
		<div className="session__wrapper">
			{messagesItem ? (
				isGroupChat ? (
					<SessionItemComponent
						messages={prepareMessages(messagesItem.messages)}
						isTyping={handleTyping}
						typingUsers={typingUsers}
					/>
				) : (
					<SessionItemComponent
						messages={prepareMessages(messagesItem.messages)}
					/>
				)
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

const groupChatStoppedOverlay: OverlayItem = {
	imgSrc: '/../resources/img/illustrations/check.svg',
	headline: translate('groupChat.stopped.overlay.headline'),
	buttonSet: [
		{
			label: translate('groupChat.stopped.overlay.button1Label'),
			function: OVERLAY_FUNCTIONS.LOGOUT,
			type: BUTTON_TYPES.PRIMARY
		},
		{
			label: translate('groupChat.stopped.overlay.button2Label'),
			function: OVERLAY_FUNCTIONS.REDIRECT,
			type: BUTTON_TYPES.GHOST
		}
	]
};
