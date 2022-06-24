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
import { useParams } from 'react-router-dom';
import { Loading } from '../app/Loading';
import { SessionItemComponent } from './SessionItemComponent';
import {
	AUTHORITIES,
	hasUserAuthority,
	LegalLinkInterface,
	RocketChatContext,
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
import { apiGetGroupChatInfo, apiGetSessionData } from '../../api';
import {
	getSessionListPathForLocation,
	prepareMessages,
	SESSION_LIST_TAB,
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
import { useSearchParam } from '../../hooks/useSearchParams';
import { useSession } from '../../hooks/useSession';

interface RouterProps {
	rcGroupId: string;
	legalLinks: Array<LegalLinkInterface>;
}

export const SessionView = (props: RouterProps) => {
	const { rcGroupId: groupIdFromParam, sessionId: sessionIdFromParam } =
		useParams();

	const { type } = useContext(SessionTypeContext);
	const { userData } = useContext(UserDataContext);
	const { ready: rcReady } = useContext(RocketChatContext);
	const { subscribe, unsubscribe } = useContext(RocketChatContext);

	const subscribed = useRef(false);
	const [readonly, setReadonly] = useState(true);
	const [messagesItem, setMessagesItem] = useState(null);
	const [isOverlayActive, setIsOverlayActive] = useState(false);
	const [overlayItem, setOverlayItem] = useState(null);
	const [forceBannedOverlay, setForceBannedOverlay] = useState(false);
	const [bannedUsers, setBannedUsers] = useState<string[]>([]);

	const {
		session: activeSession,
		ready: activeSessionReady,
		reload: reloadActiveSession,
		read: readActiveSession
	} = useSession(groupIdFromParam);
	const { addNewUsersToEncryptedRoom } = useE2EE(groupIdFromParam);
	const { isE2eeEnabled } = useContext(E2EEContext);

	const abortController = useRef<AbortController>(null);
	const hasUserInitiatedStopOrLeaveRequest = useRef<boolean>(false);

	const displayName = userData.displayName || userData.userName;

	const { subscribeTyping, unsubscribeTyping, handleTyping, typingUsers } =
		useTyping(groupIdFromParam, userData.userName, displayName);

	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

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

	const fetchSessionMessages = useCallback(() => {
		if (abortController.current) {
			abortController.current.abort();
		}

		abortController.current = new AbortController();

		return apiGetSessionData(
			activeSession.rid,
			abortController.current.signal
		).then((messagesData) => {
			setMessagesItem(messagesData);
		});
	}, [activeSession]);

	const setSessionRead = useCallback(() => {
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

		readActiveSession();
	}, [activeSession, readActiveSession, readonly, userData]);

	const checkMutedUserForThisSession = useCallback(() => {
		setForceBannedOverlay(false);
		if (activeSession?.isGroup) {
			apiGetGroupChatInfo(activeSession.item.id)
				.then((response) => {
					if (response.bannedUsers) {
						const decodedBannedUsers =
							response.bannedUsers.map(decodeUsername);
						setBannedUsers(decodedBannedUsers);
						if (decodedBannedUsers.includes(userData.userName)) {
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

		return () => {
			setBannedUsers([]);
		};
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
				.forEach((message) => {
					if (message.t === 'user-muted') {
						checkMutedUserForThisSession();
						return;
					}

					if (message.t === 'au' && isE2eeEnabled) {
						addNewUsersToEncryptedRoom();
						return;
					}

					if (message.u?.username !== 'rocket-chat-technical-user') {
						fetchSessionMessages().then(() => {
							setSessionRead();
						});
					}
				});
		},

		[
			isE2eeEnabled,
			fetchSessionMessages,
			checkMutedUserForThisSession,
			addNewUsersToEncryptedRoom,
			setSessionRead
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
			([event]) => {
				if (event === 'removed') {
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

	useEffect(() => {
		setSessionRead();
	}, [setSessionRead]);

	useEffect(() => {
		const unmount = () => {
			if (abortController.current) {
				abortController.current.abort();
				abortController.current = null;
			}

			setReadonly(true);
			setMessagesItem(null);

			if (subscribed.current && activeSession) {
				subscribed.current = false;

				unsubscribe(
					{
						name: SUB_STREAM_ROOM_MESSAGES,
						roomId: activeSession.rid
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
			}
		};

		if (!rcReady) {
			return;
		}

		if (activeSessionReady && !activeSession) {
			history.push(
				getSessionListPathForLocation() +
					(sessionListTab ? `?sessionListTab=${sessionListTab}` : '')
			);
		} else if (activeSessionReady) {
			if (
				activeSession.item.groupId !== groupIdFromParam &&
				activeSession.item.id.toString() === sessionIdFromParam
			) {
				history.push(
					`${getSessionListPathForLocation()}/${
						activeSession.item.groupId
					}/${activeSession.item.id}${
						sessionListTab
							? `?sessionListTab=${sessionListTab}`
							: ''
					}`
				);
				return unmount;
			}

			const isConsultantEnquiry =
				type === SESSION_LIST_TYPES.ENQUIRY &&
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData);

			if (
				(activeSession.isGroup && !activeSession.item.subscribed) ||
				(activeSession.isEnquiry &&
					!activeSession.isEmptyEnquiry &&
					activeSession.isLive) ||
				bannedUsers.includes(userData.userName) ||
				subscribed.current
			) {
				return unmount;
			}

			subscribed.current = true;

			if (!isConsultantEnquiry) {
				setReadonly(false);
			}

			// check if any user needs to be added when opening session view
			addNewUsersToEncryptedRoom();

			fetchSessionMessages().then(() => {
				subscribe(
					{
						name: SUB_STREAM_ROOM_MESSAGES,
						roomId: activeSession.rid
					},
					onDebounceMessage
				);

				if (
					!isConsultantEnquiry &&
					(activeSession.isGroup || activeSession.isLive)
				) {
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
			});
		} else {
			setReadonly(true);
			setMessagesItem(null);
		}

		return unmount;
	}, [
		activeSessionReady,
		activeSession,
		unsubscribe,
		onDebounceMessage,
		unsubscribeTyping,
		handleGroupChatStopped,
		sessionListTab,
		type,
		userData,
		addNewUsersToEncryptedRoom,
		fetchSessionMessages,
		subscribe,
		subscribeTyping,
		bannedUsers,
		groupIdFromParam,
		rcReady,
		sessionIdFromParam
	]);

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

	if (!activeSession) {
		return <Loading />;
	}

	const currentUserIsBanned = bannedUsers.includes(userData.userName);

	if (
		activeSession.isGroup &&
		(!activeSession.item.subscribed || currentUserIsBanned)
	) {
		return (
			<ActiveSessionContext.Provider
				value={{ activeSession, reloadActiveSession }}
			>
				<JoinGroupChatView
					forceBannedOverlay={forceBannedOverlay}
					bannedUsers={bannedUsers}
					legalLinks={props.legalLinks}
				/>
			</ActiveSessionContext.Provider>
		);
	}

	return (
		<ActiveSessionContext.Provider
			value={{ activeSession, reloadActiveSession }}
		>
			<div className="session__wrapper">
				<SessionItemComponent
					hasUserInitiatedStopOrLeaveRequest={
						hasUserInitiatedStopOrLeaveRequest
					}
					isTyping={handleTyping}
					typingUsers={typingUsers}
					messages={
						messagesItem
							? prepareMessages(messagesItem.messages)
							: null
					}
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
