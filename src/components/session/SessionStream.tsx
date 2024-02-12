import * as React from 'react';
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Loading } from '../app/Loading';
import { SessionItemComponent } from './SessionItemComponent';
import {
	AnonymousConversationFinishedContext,
	AUTHORITIES,
	ConsultantListContext,
	E2EEContext,
	hasUserAuthority,
	RocketChatContext,
	RocketChatGlobalSettingsContext,
	SessionTypeContext,
	UserDataContext,
	ActiveSessionContext
} from '../../globalState';
import { STATUS_FINISHED } from '../../globalState/interfaces';
import {
	apiGetAgencyConsultantList,
	apiGetSessionData,
	FETCH_ERRORS
} from '../../api';
import {
	prepareMessages,
	SESSION_LIST_TAB,
	SESSION_LIST_TYPES
} from './sessionHelpers';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { logout } from '../logout/logout';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import useTyping from '../../utils/useTyping';
import './session.styles';
import { useE2EE } from '../../hooks/useE2EE';
import {
	EVENT_ROOMS_CHANGED,
	EVENT_SUBSCRIPTIONS_CHANGED,
	SUB_STREAM_NOTIFY_USER,
	SUB_STREAM_ROOM_MESSAGES
} from '../app/RocketChat';
import useUpdatingRef from '../../hooks/useUpdatingRef';
import useDebounceCallback from '../../hooks/useDebounceCallback';
import { useSearchParam } from '../../hooks/useSearchParams';
import { useTranslation } from 'react-i18next';
import { prepareConsultantDataForSelect } from '../sessionAssign/sessionAssignHelper';
import {
	IArraySetting,
	SETTING_HIDE_SYSTEM_MESSAGES
} from '../../api/apiRocketChatSettingsPublic';

interface SessionStreamProps {
	readonly: boolean;
	checkMutedUserForThisSession: () => void;
	bannedUsers: string[];
}

export const SessionStream = ({
	readonly,
	checkMutedUserForThisSession,
	bannedUsers
}: SessionStreamProps) => {
	const { t: translate } = useTranslation();
	const history = useHistory();

	const { type, path: listPath } = useContext(SessionTypeContext);
	const { userData } = useContext(UserDataContext);
	const { subscribe, unsubscribe } = useContext(RocketChatContext);
	const { getSetting } = useContext(RocketChatGlobalSettingsContext);
	const { anonymousConversationFinished } = useContext(
		AnonymousConversationFinishedContext
	);
	const { rcGroupId } = useParams<{ rcGroupId: string }>();

	const subscribed = useRef(false);
	const [messagesItem, setMessagesItem] = useState(null);
	const [isOverlayActive, setIsOverlayActive] = useState(false);
	const [loading, setLoading] = useState(true);
	const [overlayItem, setOverlayItem] = useState(null);

	const { activeSession, readActiveSession, reloadActiveSession } =
		useContext(ActiveSessionContext);

	const { addNewUsersToEncryptedRoom } = useE2EE(activeSession?.rid);
	const { isE2eeEnabled } = useContext(E2EEContext);
	const { setConsultantList } = useContext(ConsultantListContext);

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
			const hiddenSystemMessages = getSetting<IArraySetting>(
				SETTING_HIDE_SYSTEM_MESSAGES
			);
			setMessagesItem(
				messagesData
					? prepareMessages(
							messagesData.messages.filter(
								(message) =>
									!hiddenSystemMessages ||
									!hiddenSystemMessages.value.includes(
										message.t
									)
							)
						)
					: null
			);
		});
	}, [activeSession.rid, getSetting]);

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
			if (args.length === 0 || anonymousConversationFinished) return;

			args
				// Map collected from debounce callback
				.map(([[message]]) => message)
				.forEach((message) => {
					if (message.t === 'user-muted') {
						checkMutedUserForThisSession();
						return;
					}

					if (message.t === 'au') {
						// Handle this event only for groups because on session assigning its already handled
						if (isE2eeEnabled && activeSession.isGroup) {
							addNewUsersToEncryptedRoom().then();
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
			anonymousConversationFinished,
			checkMutedUserForThisSession,
			isE2eeEnabled,
			activeSession.isGroup,
			addNewUsersToEncryptedRoom,
			fetchSessionMessages,
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
		[translate]
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
			},
			[groupChatStoppedOverlay]
		)
	);

	const handleLiveChatStopped = useUpdatingRef(
		useCallback(
			([, room]) => {
				if (!room.ro) {
					return;
				}
				reloadActiveSession();
			},
			[reloadActiveSession]
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
			[activeSession, rcGroupId, listPath, type, history]
		)
	);

	useEffect(() => {
		if (subscribed.current) {
			setLoading(false);
		} else {
			subscribed.current = true;

			if (anonymousConversationFinished) {
				setLoading(false);
				return;
			}

			// check if any user needs to be added when opening session view
			addNewUsersToEncryptedRoom().then();

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

					subscribe(
						{
							name: SUB_STREAM_NOTIFY_USER,
							event: EVENT_SUBSCRIPTIONS_CHANGED,
							userId: getValueFromCookie('rc_uid')
						},
						activeSession.isGroup || activeSession.isLive
							? handleChatStopped
							: handleSubscriptionChanged
					);

					if (activeSession.isGroup || activeSession.isLive) {
						subscribeTyping();
					}

					if (activeSession.isLive) {
						subscribe(
							{
								name: SUB_STREAM_NOTIFY_USER,
								event: EVENT_ROOMS_CHANGED,
								userId: getValueFromCookie('rc_uid')
							},
							handleLiveChatStopped
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

				unsubscribe(
					{
						name: SUB_STREAM_NOTIFY_USER,
						event: EVENT_SUBSCRIPTIONS_CHANGED,
						userId: getValueFromCookie('rc_uid')
					},
					activeSession.isGroup || activeSession.isLive
						? handleChatStopped
						: handleSubscriptionChanged
				);

				if (activeSession.isGroup || activeSession.isLive) {
					unsubscribeTyping();
				}

				if (activeSession.isLive) {
					unsubscribe(
						{
							name: SUB_STREAM_NOTIFY_USER,
							event: EVENT_ROOMS_CHANGED,
							userId: getValueFromCookie('rc_uid')
						},
						handleLiveChatStopped
					);
				}
			}
		};
	}, [
		activeSession,
		addNewUsersToEncryptedRoom,
		anonymousConversationFinished,
		fetchSessionMessages,
		handleChatStopped,
		handleLiveChatStopped,
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

	useEffect(() => {
		if (
			activeSession.isLive ||
			activeSession.isGroup ||
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)
		) {
			return;
		}
		const agencyId = activeSession.item.agencyId.toString();
		apiGetAgencyConsultantList(agencyId)
			.then((response) => {
				const consultants = prepareConsultantDataForSelect(response);
				setConsultantList(consultants);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [
		activeSession.isGroup,
		activeSession.isLive,
		activeSession.item.agencyId,
		setConsultantList,
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
				bannedUsers={bannedUsers}
			/>
			{isOverlayActive && (
				<Overlay
					item={overlayItem}
					handleOverlay={handleOverlayAction}
				/>
			)}
		</div>
	);
};
