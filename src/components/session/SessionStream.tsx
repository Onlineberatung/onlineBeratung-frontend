import * as React from 'react';
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import { useParams } from 'react-router-dom';
import { history } from '../app/app';
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
import { apiGetSessionData, FETCH_ERRORS } from '../../api';
import {
	prepareMessages,
	SESSION_LIST_TAB,
	SESSION_LIST_TYPES
} from './sessionHelpers';
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

interface SessionStreamProps {
	readonly: boolean;
	legalLinks: Array<LegalLinkInterface>;
	checkMutedUserForThisSession: () => void;
	bannedUsers: string[];
}

export const SessionStream = ({
	readonly,
	legalLinks,
	checkMutedUserForThisSession,
	bannedUsers
}: SessionStreamProps) => {
	const { type, path: listPath } = useContext(SessionTypeContext);
	const { userData } = useContext(UserDataContext);
	const { subscribe, unsubscribe } = useContext(RocketChatContext);
	const { rcGroupId } = useParams();

	const subscribed = useRef(false);
	const [messagesItem, setMessagesItem] = useState(null);
	const [isOverlayActive, setIsOverlayActive] = useState(false);
	const [loading, setLoading] = useState(true);
	const [overlayItem, setOverlayItem] = useState(null);

	const { activeSession, readActiveSession, reloadActiveSession } =
		useContext(ActiveSessionContext);

	const { addNewUsersToEncryptedRoom } = useE2EE(activeSession?.rid);
	const { isE2eeEnabled } = useContext(E2EEContext);

	const abortController = useRef<AbortController>(null);
	const hasUserInitiatedStopOrLeaveRequest = useRef<boolean>(false);

	const displayName = userData.displayName || userData.userName;

	const { subscribeTyping, unsubscribeTyping, handleTyping, typingUsers } =
		useTyping(activeSession?.rid, userData.userName, displayName);

	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	const fetchSessionMessages = useCallback(() => {
		if (abortController.current) {
			abortController.current.abort();
		}

		abortController.current = new AbortController();

		return apiGetSessionData(
			activeSession.rid,
			abortController.current.signal
		).then((messagesData) => {
			setMessagesItem(
				messagesData ? prepareMessages(messagesData.messages) : null
			);
		});
	}, [activeSession]);

	const setSessionRead = useCallback(() => {
		if (readonly) {
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

					if (message.t === 'au') {
						if (isE2eeEnabled) {
							addNewUsersToEncryptedRoom();
						}
						return;
					}

					if (message.u?.username !== 'rocket-chat-technical-user') {
						fetchSessionMessages()
							.then(() => {
								setSessionRead();
							})
							.catch(() => {
								// prevent error from leaking to console
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

	const handleChatStopped = useUpdatingRef(
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
				if (event === 'updated') {
					reloadActiveSession();
				}
			},
			[groupChatStoppedOverlay, reloadActiveSession]
		)
	);

	const handleSubscriptionChanged = useUpdatingRef(
		useCallback(
			([event]) => {
				if (event === 'removed') {
					// user was removed from the session and is still in a session view
					// then redirect him to the listview
					if (type === SESSION_LIST_TYPES.MY_SESSION) {
						if (activeSession?.item?.groupId === rcGroupId) {
							history.push(listPath);
						}
					}
				}
			},
			[activeSession, rcGroupId, listPath, type]
		)
	);

	useEffect(() => {
		if (subscribed.current) {
			setLoading(false);
		} else {
			subscribed.current = true;

			// check if any user needs to be added when opening session view
			addNewUsersToEncryptedRoom();

			fetchSessionMessages()
				.then(() => {
					setSessionRead();

					subscribe(
						{
							name: SUB_STREAM_ROOM_MESSAGES,
							roomId: activeSession.rid
						},
						onDebounceMessage
					);

					if (activeSession.isGroup || activeSession.isLive) {
						subscribe(
							{
								name: SUB_STREAM_NOTIFY_USER,
								event: EVENT_SUBSCRIPTIONS_CHANGED,
								userId: getValueFromCookie('rc_uid')
							},
							handleChatStopped
						);

						subscribeTyping();
					} else {
						subscribe(
							{
								name: SUB_STREAM_NOTIFY_USER,
								event: EVENT_SUBSCRIPTIONS_CHANGED,
								userId: getValueFromCookie('rc_uid')
							},
							handleSubscriptionChanged
						);
					}

					setLoading(false);
				})
				.catch((e) => {
					if (e.message !== FETCH_ERRORS.ABORT) {
						console.error('error fetchSessionMessages', e);
					}
				});
		}

		return () => {
			if (abortController.current) {
				abortController.current.abort();
				abortController.current = null;
			}

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
					unsubscribe(
						{
							name: SUB_STREAM_NOTIFY_USER,
							event: EVENT_SUBSCRIPTIONS_CHANGED,
							userId: getValueFromCookie('rc_uid')
						},
						handleChatStopped
					);

					unsubscribeTyping();
				} else {
					unsubscribe(
						{
							name: SUB_STREAM_NOTIFY_USER,
							event: EVENT_SUBSCRIPTIONS_CHANGED,
							userId: getValueFromCookie('rc_uid')
						},
						handleSubscriptionChanged
					);
				}
			}
		};
	}, [
		activeSession,
		addNewUsersToEncryptedRoom,
		fetchSessionMessages,
		handleChatStopped,
		handleSubscriptionChanged,
		onDebounceMessage,
		setSessionRead,
		subscribe,
		subscribeTyping,
		type,
		unsubscribe,
		unsubscribeTyping,
		userData
	]);

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			history.push(
				listPath +
					(sessionListTab ? `?sessionListTab=${sessionListTab}` : '')
			);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.LOGOUT) {
			logout();
		}
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="session__wrapper">
			<SessionItemComponent
				hasUserInitiatedStopOrLeaveRequest={
					hasUserInitiatedStopOrLeaveRequest
				}
				isTyping={handleTyping}
				typingUsers={typingUsers}
				messages={messagesItem}
				legalLinks={legalLinks}
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
	);
};
