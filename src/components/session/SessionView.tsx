import * as React from 'react';
import {
	ComponentType,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import { history } from '../app/app';
import { useLocation, useParams } from 'react-router-dom';
import { Loading } from '../app/Loading';
import { SessionItemComponent } from './SessionItemComponent';
import {
	AcceptedGroupIdContext,
	AUTHORITIES,
	getActiveSession,
	hasUserAuthority,
	REGISTRATION_TYPE_ANONYMOUS,
	SessionsDataContext,
	STATUS_ENQUIRY,
	STATUS_FINISHED,
	StoppedGroupChatContext,
	UnreadSessionsStatusContext,
	UPDATE_SESSION_CHAT_ITEM,
	UpdateSessionListContext,
	UserDataContext
} from '../../globalState';
import { mobileDetailView, mobileListView } from '../app/navigationHandler';
import {
	apiGetSessionData,
	apiSetSessionRead,
	rocketChatSocket,
	SOCKET_COLLECTION
} from '../../api';
import {
	getChatItemForSession,
	getSessionListPathForLocation,
	getTypeOfLocation,
	isGroupChat,
	isSessionChat,
	prepareMessages,
	SESSION_LIST_TYPES,
	typeIsEnquiry,
	isLiveChat
} from './sessionHelpers';
import { JoinGroupChatView } from '../groupChat/JoinGroupChatView';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import {
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem,
	OverlayWrapper
} from '../overlay/Overlay';
import { translate } from '../../utils/translate';
import { BUTTON_TYPES } from '../button/Button';
import { logout } from '../logout/logout';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import './session.styles';
import { LegalInformationLinksProps } from '../login/LegalInformationLinks';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import useTyping from '../../utils/useTyping';

interface RouterProps {
	legalComponent: ComponentType<LegalInformationLinksProps>;
}

export const SessionView = (props: RouterProps) => {
	const { rcGroupId: groupIdFromParam } = useParams();

	const { sessionsData, dispatchSessionsData } =
		useContext(SessionsDataContext);
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);
	const { userData } = useContext(UserDataContext);
	const { unreadSessionsStatus, setUnreadSessionsStatus } = useContext(
		UnreadSessionsStatusContext
	);
	const { setStoppedGroupChat } = useContext(StoppedGroupChatContext);
	const { setUpdateSessionList } = useContext(UpdateSessionListContext);

	const [activeSession, setActiveSession] = useState(null);
	const [chatItem, setChatItem] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [messagesItem, setMessagesItem] = useState(null);
	const [isOverlayActive, setIsOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState(null);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);
	const [loadedMessages, setLoadedMessages] = useState(null);
	const [isAnonymousEnquiry, setIsAnonymousEnquiry] = useState(false);
	const [isLiveChatFinished, setIsLiveChatFinished] = useState(false);

	const hasUserInitiatedStopOrLeaveRequest = useRef<boolean>(false);

	const { subscribeTyping, handleTyping, typingUsers } = useTyping(
		groupIdFromParam,
		userData.userName
	);

	const [sessionListTab] = useState(
		new URLSearchParams(useLocation().search).get('sessionListTab')
	);

	const fetchSessionMessages = useCallback(() => {
		return apiGetSessionData(groupIdFromParam)
			.then((messagesData) => {
				setLoadedMessages(messagesData);
			})
			.catch((error) => null);
	}, [groupIdFromParam]);

	const handleRoomMessage = useCallback(() => {
		fetchSessionMessages().finally(() => {
			setUpdateSessionList(SESSION_LIST_TYPES.MY_SESSION);
		});
	}, [fetchSessionMessages, setUpdateSessionList]);

	const groupChatStoppedOverlay: OverlayItem = useMemo(
		() => ({
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
		}),
		[]
	);

	const handleGroupChatStopped = useCallback(
		(hasUserInitiatedStopOrLeaveRequest) => () => {
			// If the user has initiated the stop or leave request, he/she is already
			// shown an appropriate overlay during the process via the SessionMenu component.
			// Thus, there is no need for an additional notification.
			if (hasUserInitiatedStopOrLeaveRequest.current) {
				hasUserInitiatedStopOrLeaveRequest.current = false;
			} else {
				setOverlayItem(groupChatStoppedOverlay);
				setIsOverlayActive(true);
			}
		},
		[groupChatStoppedOverlay]
	);

	useEffect(() => {
		if (!activeSession || !chatItem) {
			return;
		}

		dispatchSessionsData({
			type: UPDATE_SESSION_CHAT_ITEM,
			key: activeSession.key,
			groupId: chatItem.groupId,
			data: {
				[activeSession.isFeedbackSession
					? 'feedbackRead'
					: 'messagesRead']: true
			}
		});
	}, [activeSession, chatItem, dispatchSessionsData]);

	const setSessionToRead = useCallback(
		(newMessageFromSocket: boolean = false) => {
			if (
				activeSession &&
				(hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) ||
					!isLiveChatFinished)
			) {
				const isCurrentSessionRead =
					activeSession.isFeedbackSession && isSessionChat(chatItem)
						? chatItem.feedbackRead
						: chatItem.messagesRead;

				if (!isCurrentSessionRead || newMessageFromSocket) {
					apiSetSessionRead(groupIdFromParam).then();

					const newMySessionsCount = Math.max(
						unreadSessionsStatus.mySessions - 1,
						0
					);
					setUnreadSessionsStatus({
						...unreadSessionsStatus,
						mySessions: newMySessionsCount,
						resetedAnimations: newMySessionsCount === 0
					});
				}
			}
		},
		[
			activeSession,
			chatItem,
			groupIdFromParam,
			isLiveChatFinished,
			setUnreadSessionsStatus,
			unreadSessionsStatus,
			userData
		]
	);

	const connectSocket = useCallback(
		(isGroupOrLiveChat) => {
			window['socket'].connect();

			window['socket'].addSubscription(
				SOCKET_COLLECTION.ROOM_MESSAGES,
				[groupIdFromParam, false],
				handleRoomMessage
			);

			if (isGroupOrLiveChat) {
				subscribeTyping();

				window['socket'].addSubscription(
					SOCKET_COLLECTION.NOTIFY_USER,
					[
						getValueFromCookie('rc_uid') + '/subscriptions-changed',
						false
					],
					handleGroupChatStopped
				);
			}
		},
		[
			groupIdFromParam,
			handleGroupChatStopped,
			handleRoomMessage,
			subscribeTyping
		]
	);

	useEffect(() => {
		setIsLoading(true);
	}, [groupIdFromParam]);

	useEffect(() => {
		mobileDetailView();
		setAcceptedGroupId(null);

		const activeSession = getActiveSession(groupIdFromParam, sessionsData);
		const chatItem = getChatItemForSession(activeSession);
		const isConsultantEnquiry =
			typeIsEnquiry(getTypeOfLocation()) &&
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData);

		setActiveSession(activeSession);
		setChatItem(chatItem);
		setIsLiveChatFinished(
			isSessionChat(chatItem) && chatItem?.status === STATUS_FINISHED
		);

		const isEnquiry =
			isSessionChat(chatItem) && chatItem?.status === STATUS_ENQUIRY;
		const isCurrentAnonymousEnquiry =
			isEnquiry &&
			isSessionChat(chatItem) &&
			chatItem?.registrationType === REGISTRATION_TYPE_ANONYMOUS;

		if (isGroupChat(chatItem) && !chatItem.subscribed) {
			setIsLoading(false);
		} else if (isCurrentAnonymousEnquiry) {
			setIsLoading(false);
			setIsAnonymousEnquiry(isCurrentAnonymousEnquiry);
		} else if (isConsultantEnquiry) {
			fetchSessionMessages().finally(() => {
				setIsLoading(false);
			});
		} else {
			window['socket'] = new rocketChatSocket();
			fetchSessionMessages()
				.then(() => {
					setSessionToRead();
					connectSocket(
						isGroupChat(chatItem) || isLiveChat(chatItem)
					);
				})
				.finally(() => {
					setIsLoading(false);
				});
			return () => {
				window['socket'].close();
				setStoppedGroupChat(false);
			};
		}
	}, [groupIdFromParam, sessionsData, userData]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (loadedMessages) {
			setMessagesItem(loadedMessages);
			setLoadedMessages(null);
		}
	}, [loadedMessages]);

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			setStoppedGroupChat(true);
			setRedirectToSessionsList(true);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LOGOUT) {
			logout();
		}
	};

	if (isLoading) {
		return <Loading />;
	}

	if (!sessionsData) return null;

	if (!activeSession) {
		history.push(getSessionListPathForLocation());
		return null;
	}

	if (isGroupChat(chatItem) && !chatItem.subscribed) {
		return (
			<ActiveSessionContext.Provider value={activeSession}>
				<JoinGroupChatView
					legalComponent={props.legalComponent}
					chatItem={chatItem}
				/>
			</ActiveSessionContext.Provider>
		);
	}

	if (redirectToSessionsList) {
		mobileListView();
		history.push(
			getSessionListPathForLocation() +
				(sessionListTab ? `?sessionListTab=${sessionListTab}` : '')
		);
	}

	return (
		<ActiveSessionContext.Provider value={activeSession}>
			<div className="session__wrapper">
				<SessionItemComponent
					hasUserInitiatedStopOrLeaveRequest={
						hasUserInitiatedStopOrLeaveRequest
					}
					isAnonymousEnquiry={isAnonymousEnquiry}
					isTyping={handleTyping}
					messages={
						messagesItem
							? prepareMessages(messagesItem.messages)
							: null
					}
					typingUsers={typingUsers}
					legalComponent={props.legalComponent}
				/>
				{isOverlayActive ? (
					<OverlayWrapper>
						<Overlay
							item={overlayItem}
							handleOverlay={handleOverlayAction}
						/>
					</OverlayWrapper>
				) : null}
			</div>
		</ActiveSessionContext.Provider>
	);
};
