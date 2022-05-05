import * as React from 'react';
import {
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
	AUTHORITIES,
	ExtendedSessionInterface,
	getExtendedSession,
	hasUserAuthority,
	LegalLinkInterface,
	REGISTRATION_TYPE_ANONYMOUS,
	RocketChatContext,
	SessionsDataContext,
	SessionTypeContext,
	STATUS_FINISHED,
	UserDataContext,
	E2EEContext
} from '../../globalState';
import {
	desktopView,
	mobileDetailView,
	mobileListView
} from '../app/navigationHandler';
import {
	apiGetGroupChatInfo,
	apiGetSessionData,
	apiSetSessionRead
} from '../../api';
import {
	getSessionListPathForLocation,
	prepareMessages,
	SESSION_LIST_TYPES
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
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import useTyping from '../../utils/useTyping';
import { decodeUsername } from '../../utils/encryptionHelpers';
import { useResponsive } from '../../hooks/useResponsive';
import './session.styles';
import { useE2EE } from '../../hooks/useE2EE';
import {
	EVENT_SUBSCRIPTIONS_CHANGED,
	SUB_STREAM_NOTIFY_USER,
	SUB_STREAM_ROOM_MESSAGES
} from '../app/RocketChat';
import useUpdatingRef from '../../hooks/useUpdatingRef';
import useDebounceCallback from '../../hooks/useDebounceCallback';

interface RouterProps {
	rcGroupId: string;
	legalLinks: Array<LegalLinkInterface>;
}

export const SessionView = (props: RouterProps) => {
	const { rcGroupId: groupIdFromParam } = useParams();

	const { sessions, ready } = useContext(SessionsDataContext);
	const { type } = useContext(SessionTypeContext);
	const { userData } = useContext(UserDataContext);
	const { subscribe, unsubscribe } = useContext(RocketChatContext);

	const [activeSession, setActiveSession] =
		useState<ExtendedSessionInterface>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [readonly, setReadonly] = useState(true);
	const [messagesItem, setMessagesItem] = useState(null);
	const [isOverlayActive, setIsOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState(null);
	const [loadedMessages, setLoadedMessages] = useState(null);
	const [isAnonymousEnquiry, setIsAnonymousEnquiry] = useState(false);
	const [forceBannedOverlay, setForceBannedOverlay] = useState(false);
	const [bannedUsers, setBannedUsers] = useState<string[]>([]);

	const { addNewUsersToEncryptedRoom } = useE2EE(groupIdFromParam);
	const { isE2eeEnabled } = useContext(E2EEContext);

	const hasUserInitiatedStopOrLeaveRequest = useRef<boolean>(false);

	const displayName = userData.displayName || userData.userName;

	const { subscribeTyping, unsubscribeTyping, handleTyping, typingUsers } =
		useTyping(groupIdFromParam, userData.userName, displayName);

	const [sessionListTab] = useState(
		new URLSearchParams(useLocation().search).get('sessionListTab')
	);

	const fetchSessionMessages = useCallback(() => {
		return apiGetSessionData(groupIdFromParam).then((messagesData) => {
			setLoadedMessages(messagesData);
		});
	}, [groupIdFromParam]);

	const checkMutedUserForThisSession = useCallback(() => {
		if (!activeSession) {
			return;
		}

		if (activeSession.isGroup) {
			apiGetGroupChatInfo(activeSession.item.id)
				.then((response) => {
					if (response.bannedUsers) {
						const decryptedBannedUsers =
							response.bannedUsers.map(decodeUsername);
						setBannedUsers(decryptedBannedUsers);
						if (decryptedBannedUsers.includes(userData.userName)) {
							setForceBannedOverlay(true);
						}
					} else {
						setBannedUsers([]);
					}
				})
				.catch(() => {
					setBannedUsers([]);
				});
		}
	}, [activeSession, userData.userName]);

	useEffect(() => {
		checkMutedUserForThisSession();
	}, [checkMutedUserForThisSession]);

	/**
	 * ToDo: roomMessageBounce is just a temporary fix because currently
	 * every message gets marked but on every changed message we are loading all
	 * messages. Maybe in future we will only update single message as it changes
	 */
	const handleRoomMessage = useCallback(
		(args) => {
			if (args.length === 0) return;

			args
				// Map collected from debounce callback
				.map(([[message]]) => message)
				.filter(
					(message) =>
						message.u?.username !== 'rocket-chat-technical-user'
				)
				.forEach((message) => {
					if (message.t === 'user-muted') {
						checkMutedUserForThisSession();
						return;
					}
					if (message.t === 'user-added' && isE2eeEnabled) {
						addNewUsersToEncryptedRoom();
					}

					fetchSessionMessages().then();
				});
		},

		[
			fetchSessionMessages,
			checkMutedUserForThisSession,
			addNewUsersToEncryptedRoom,
			isE2eeEnabled
		]
	);

	const onDebounceMessage = useUpdatingRef(
		useDebounceCallback(handleRoomMessage, 500, true)
	);

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

	const handleGroupChatStopped = useUpdatingRef(
		useCallback(
			([event, subscription]) =>
				() => {
					console.log('Never exec');
					if (
						event === 'removed' &&
						subscription.u._id === getValueFromCookie('rc_uid')
					) {
						// If the user has initiated the stop or leave request, he/she is already
						// shown an appropriate overlay during the process via the SessionMenu component.
						// Thus, there is no need for an additional notification.
						if (hasUserInitiatedStopOrLeaveRequest.current) {
							hasUserInitiatedStopOrLeaveRequest.current = false;
						} else {
							setOverlayItem(groupChatStoppedOverlay);
							setIsOverlayActive(true);
						}
					}
				},
			[groupChatStoppedOverlay]
		)
	);

	useEffect(
		() => {
			if (readonly || !activeSession) {
				return;
			}

			const isLiveChatFinished =
				activeSession.isLive &&
				activeSession.item.status === STATUS_FINISHED;

			if (
				!hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
				isLiveChatFinished
			) {
				return;
			}

			const isCurrentSessionRead = activeSession.isFeedback
				? activeSession.item.feedbackRead
				: activeSession.item.messagesRead;

			if (!isCurrentSessionRead) {
				apiSetSessionRead(activeSession.rid).then();
			}
		},
		[activeSession, readonly] // eslint-disable-line react-hooks/exhaustive-deps
	);

	useEffect(() => {
		// make sure that the active session has an active chat, user is subscribed and the id matches the url param
		if (
			activeSession?.item?.active &&
			activeSession?.item?.subscribed &&
			groupIdFromParam === activeSession?.item?.groupId
		) {
			addNewUsersToEncryptedRoom();
		}
	}, [groupIdFromParam, activeSession, addNewUsersToEncryptedRoom]);

	useEffect(() => {
		setActiveSession(null);
		setIsLoading(true);
		setForceBannedOverlay(false);
	}, [groupIdFromParam]);

	const { fromL } = useResponsive();
	useEffect(() => {
		if (!fromL) {
			mobileDetailView();
			return () => {
				mobileListView();
			};
		}
		desktopView();
	}, [fromL]);

	useEffect(() => {
		// Wait for session list to be loaded
		if (!ready) {
			return;
		}

		// Check if current session view session could be found in session list
		const activeSession = getExtendedSession(groupIdFromParam, sessions);
		if (!activeSession) {
			// Return to session list
			history.push(
				getSessionListPathForLocation() +
					(sessionListTab ? `?sessionListTab=${sessionListTab}` : '')
			);
			return;
		}

		setActiveSession(activeSession);
	}, [groupIdFromParam, ready, sessionListTab, sessions]);

	useEffect(() => {
		if (!activeSession) {
			return;
		}

		const isConsultantEnquiry =
			type === SESSION_LIST_TYPES.ENQUIRY &&
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData);
		const isEnquiry =
			activeSession.isEnquiry && !activeSession.isEmptyEnquiry;
		const isCurrentAnonymousEnquiry =
			isEnquiry &&
			activeSession.item.registrationType === REGISTRATION_TYPE_ANONYMOUS;

		if (activeSession.isGroup && !activeSession.item.subscribed) {
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
			fetchSessionMessages()
				.then(() => {
					subscribe(
						{
							name: SUB_STREAM_ROOM_MESSAGES,
							roomId: groupIdFromParam
						},
						onDebounceMessage
					);

					if (activeSession.isGroup || activeSession.isLive) {
						subscribeTyping();
						subscribe(
							{
								name: SUB_STREAM_NOTIFY_USER,
								event: EVENT_SUBSCRIPTIONS_CHANGED,
								userId: getValueFromCookie('rc_uid')
							},
							handleGroupChatStopped
						);
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
			return () => {
				unsubscribe(
					{
						name: SUB_STREAM_ROOM_MESSAGES,
						roomId: groupIdFromParam
					},
					onDebounceMessage
				);

				if (activeSession.isGroup || activeSession.isLive) {
					unsubscribeTyping();
					unsubscribe(
						{
							name: SUB_STREAM_NOTIFY_USER,
							event: EVENT_SUBSCRIPTIONS_CHANGED,
							userId: getValueFromCookie('rc_uid')
						},
						handleGroupChatStopped
					);
				}
			};
		}
	}, [
		activeSession,
		fetchSessionMessages,
		groupIdFromParam,
		handleGroupChatStopped,
		onDebounceMessage,
		subscribe,
		subscribeTyping,
		type,
		unsubscribe,
		unsubscribeTyping,
		userData
	]);

	useEffect(() => {
		if (loadedMessages) {
			setMessagesItem(loadedMessages);
			setLoadedMessages(null);
		}
	}, [loadedMessages]);

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			history.push(
				getSessionListPathForLocation() +
					(sessionListTab ? `?sessionListTab=${sessionListTab}` : '')
			);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LOGOUT) {
			logout();
		}
	};

	if (isLoading) {
		return <Loading />;
	}

	const currentUserIsBanned = bannedUsers.includes(userData.userName);

	if (
		activeSession.isGroup &&
		(!activeSession.item.subscribed || currentUserIsBanned)
	) {
		return (
			<ActiveSessionContext.Provider value={activeSession}>
				<JoinGroupChatView
					forceBannedOverlay={forceBannedOverlay}
					bannedUsers={bannedUsers}
					legalLinks={props.legalLinks}
				/>
			</ActiveSessionContext.Provider>
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
					legalLinks={props.legalLinks}
					bannedUsers={bannedUsers}
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
