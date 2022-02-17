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
	UnreadSessionsStatusContext,
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

	const { sessionsData } = useContext(SessionsDataContext);
	const { setAcceptedGroupId } = useContext(AcceptedGroupIdContext);
	const { userData } = useContext(UserDataContext);
	const { unreadSessionsStatus, setUnreadSessionsStatus } = useContext(
		UnreadSessionsStatusContext
	);
	const { setUpdateSessionList } = useContext(UpdateSessionListContext);

	const [activeSession, setActiveSession] = useState(null);
	const [chatItem, setChatItem] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [readonly, setReadonly] = useState(true);
	const [messagesItem, setMessagesItem] = useState(null);
	const [isOverlayActive, setIsOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState(null);
	const [redirectToSessionsList, setRedirectToSessionsList] = useState(false);
	const [loadedMessages, setLoadedMessages] = useState(null);
	const [isAnonymousEnquiry, setIsAnonymousEnquiry] = useState(false);

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

	/**
	 * ToDo: roomMessageBounce is just a temporary fix because currently
	 * every message gets marked but on every changed message we are loading all
	 * messages. Maybe in future we will only update single message as it changes
	 */
	const roomMessageBounce = useRef(null);
	const handleRoomMessage = useCallback(() => {
		if (roomMessageBounce.current) {
			clearTimeout(roomMessageBounce.current);
		}
		roomMessageBounce.current = setTimeout(() => {
			roomMessageBounce.current = null;
			fetchSessionMessages().finally(() => {
				setUpdateSessionList(SESSION_LIST_TYPES.MY_SESSION);
			});
		}, 500);
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

	useEffect(
		() => {
			if (readonly || !activeSession) {
				return;
			}

			const chatItem = getChatItemForSession(activeSession);
			const isLiveChatFinished =
				isSessionChat(chatItem) && chatItem?.status === STATUS_FINISHED;

			if (
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) ||
				!isLiveChatFinished
			) {
				const isCurrentSessionRead =
					activeSession.isFeedbackSession && isSessionChat(chatItem)
						? chatItem.feedbackRead
						: chatItem.messagesRead;

				const groupId =
					activeSession.isFeedbackSession && isSessionChat(chatItem)
						? chatItem.feedbackGroupId
						: chatItem.groupId;

				if (!isCurrentSessionRead) {
					apiSetSessionRead(groupId).then();

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
		[activeSession] // eslint-disable-line react-hooks/exhaustive-deps
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
			subscribeTyping,
			handleRoomMessage
		]
	);

	useEffect(() => {
		setIsLoading(true);

		const activeSession = getActiveSession(groupIdFromParam, sessionsData);
		const chatItem = getChatItemForSession(activeSession);

		const isConsultantEnquiry =
			typeIsEnquiry(getTypeOfLocation()) &&
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData);
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
			setReadonly(false);
			window['socket'] = new rocketChatSocket();
			fetchSessionMessages()
				.then(() => {
					connectSocket(
						isGroupChat(chatItem) || isLiveChat(chatItem)
					);
				})
				.finally(() => {
					setIsLoading(false);
				});
			return () => {
				window['socket'].close();
			};
		}
	}, [groupIdFromParam]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		mobileDetailView();
		setAcceptedGroupId(null);

		const activeSession = getActiveSession(groupIdFromParam, sessionsData);
		const chatItem = getChatItemForSession(activeSession);

		setActiveSession(activeSession);
		setChatItem(chatItem);
	}, [groupIdFromParam, sessionsData, setAcceptedGroupId]);

	useEffect(() => {
		if (loadedMessages) {
			setMessagesItem(loadedMessages);
			setLoadedMessages(null);
		}
	}, [loadedMessages]);

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			setUpdateSessionList(true);
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
