import * as React from 'react';
import {
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	useState
} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Loading } from '../app/Loading';
import {
	AnonymousConversationFinishedContext,
	AUTHORITIES,
	ConsultantListContext,
	ConsultingTypeInterface,
	E2EEContext,
	hasUserAuthority,
	RocketChatContext,
	SessionTypeContext,
	UserDataContext
} from '../../globalState';
import {
	apiGetAgencyConsultantList,
	apiGetConsultingType,
	apiGetMessages
} from '../../api';
import {
	decryptMessage as decryptMessageHelper,
	parseMessage,
	prepareMessage,
	scrollToEnd,
	SESSION_LIST_TAB,
	SESSION_LIST_TYPES
} from './sessionHelpers';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import { logout } from '../logout/logout';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { ReactComponent as ArrowDoubleDownIcon } from '../../resources/img/icons/arrow-double-down.svg';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import {
	EVENT_ROOMS_CHANGED,
	EVENT_SUBSCRIPTIONS_CHANGED,
	SUB_STREAM_NOTIFY_USER,
	SUB_STREAM_ROOM_MESSAGES
} from '../app/RocketChat';
import useUpdatingRef from '../../hooks/useUpdatingRef';
import { useSearchParam } from '../../hooks/useSearchParams';
import { useTranslation } from 'react-i18next';
import { prepareConsultantDataForSelect } from '../sessionAssign/sessionAssignHelper';
import { apiGetMessage } from '../../api/apiGetMessage';
import clsx from 'clsx';
import { MessageItem } from '../../types/MessageItem';
import { MessageItemComponent } from '../message/MessageItemComponent';
import { useDebouncedCallback } from 'use-debounce';
import smoothScroll from './smoothScrollHelper';
import useDebounceCallback from '../../hooks/useDebounceCallback';
import { apiPostError, TError } from '../../api/apiPostError';
import { GlobalDragAndDropContext } from '../../globalState/provider/GlobalDragAndDropProvider';
import { Text } from '../text/Text';
import { RoomContext } from '../../globalState/provider/RoomProvider';

interface SessionStreamProps {
	checkMutedUserForThisSession: () => void;
	bannedUsers: string[];
	onScrolledToTop?: (top: boolean) => void;
	onScrolledToBottom?: (bottom: boolean) => void;
	className?: string;
}

const INITIAL_COUNT = 20;
const COUNT = 10;

const SET_MESSAGES = 'set_messages';
type TSetMessagesAction = {
	type: typeof SET_MESSAGES;
	messages: MessageItem[];
};
const ADD_MESSAGE = 'add_message';
type TAddMessageAction = {
	type: typeof ADD_MESSAGE;
	message: MessageItem;
};

const sortMessages = (a, b) => {
	if (a.messageTime === b.messageTime) {
		return 0;
	}

	return a.messageTime > b.messageTime ? 1 : -1;
};

function reducer(
	state: MessageItem[],
	action: TSetMessagesAction | TAddMessageAction
) {
	switch (action.type) {
		case SET_MESSAGES:
			return action.messages
				.reduce(
					(acc, message) => {
						const i = acc.findIndex(
							(msg) => msg._id === message._id
						);
						if (i >= 0) {
							acc.splice(i, 1, message);
						} else {
							acc.push(message);
						}
						return acc;
					},
					[...state]
				)
				.sort(sortMessages);
		case ADD_MESSAGE:
			if (!action.message) {
				return state;
			}

			const messages = [...state];
			const i = state.findIndex((msg) => msg._id === action.message._id);
			if (i >= 0) {
				messages.splice(i, 1, action.message);
			} else {
				messages.push(action.message);
			}
			return messages.sort(sortMessages);
		default:
			throw new Error();
	}
}

export const SessionStream = ({
	checkMutedUserForThisSession,
	bannedUsers,
	onScrolledToTop,
	onScrolledToBottom,
	className
}: SessionStreamProps) => {
	const { t: translate } = useTranslation();
	const history = useHistory();
	const { rcGroupId } = useParams<{ rcGroupId: string }>();
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	const { type, path: listPath } = useContext(SessionTypeContext);
	const { userData } = useContext(UserDataContext);
	const { subscribe, unsubscribe, ready } = useContext(RocketChatContext);
	const { isDragActive } = useContext(GlobalDragAndDropContext);
	const { anonymousConversationFinished } = useContext(
		AnonymousConversationFinishedContext
	);
	const { activeSession, reloadActiveSession } =
		useContext(ActiveSessionContext);
	const { isE2eeEnabled } = useContext(E2EEContext);
	const { lastUnreadMessageTime, subscription, room, hiddenSystemMessages } =
		useContext(RoomContext);
	const { setConsultantList } = useContext(ConsultantListContext);
	const {
		e2eeParams: {
			key,
			keyID,
			encrypted,
			subscriptionKeyLost,
			addNewUsersToEncryptedRoom
		}
	} = useContext(RoomContext);

	const abortController = useRef<AbortController>(null);
	const hasUserInitiatedStopOrLeaveRequest = useRef<boolean>(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const unreadDividerRef = useRef<HTMLDivElement>(null);
	const loadingMessages = useRef(false);
	const initialCount = useRef(
		Math.max(subscription?.unread ?? 0, INITIAL_COUNT)
	);

	const [messages, dispatch] = useReducer(reducer, []);

	const [isOverlayActive, setIsOverlayActive] = useState(false);
	const [loading, setLoading] = useState(true);
	const [overlayItem, setOverlayItem] = useState(null);
	const [initialScrollCompleted, setInitialScrollCompleted] = useState(false);
	const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
	const [offset, setOffset] = useState(
		Math.max(0, room.msgs - initialCount.current)
	);
	const [loadedOffset, setLoadedOffset] = useState(Infinity);
	const [initialized, setInitialized] = useState(false);
	const [resortData, setResortData] = useState<ConsultingTypeInterface>();

	const unreadMessageData = useMemo(() => {
		const lastUnreadMessageIndex = (messages ?? []).findIndex(
			(message) =>
				parseInt(message.messageTime) >=
				(lastUnreadMessageTime || Infinity)
		);

		if (
			lastUnreadMessageIndex === -1 ||
			messages[lastUnreadMessageIndex].own
		) {
			return null;
		}

		return {
			count: messages.slice(lastUnreadMessageIndex).length,
			_id: messages[lastUnreadMessageIndex]._id
		};
	}, [lastUnreadMessageTime, messages]);

	// Track the decryption success because we have a short timing issue when
	// message is send before the room encryption
	const decryptionSuccess = useRef([]);
	const handleDecryptionSuccess = useCallback((id: string) => {
		if (decryptionSuccess.current.includes(id)) {
			return;
		}

		decryptionSuccess.current.push(id);
	}, []);
	const lastDecryptionError = useRef(0);
	const handleDecryptionErrors = useDebounceCallback(
		useCallback((collectedErrors: [[string, number, TError]]) => {
			Promise.all(
				collectedErrors
					// Filter already tracked error messages
					.filter(([, ts]) => ts > lastDecryptionError.current)
					.filter(([id]) => !decryptionSuccess.current.includes(id))
					// Keep only last error of one type
					.reduce((acc, [, timestamp, collectedError], i) => {
						const trackedErrorIndex = acc.findIndex(
							([, accError]) =>
								accError.message === collectedError.message
						);
						if (
							trackedErrorIndex >= 0 &&
							acc[trackedErrorIndex][1].message ===
								collectedError.message
						) {
							if (timestamp > acc[trackedErrorIndex][0]) {
								acc.splice(
									trackedErrorIndex,
									1,
									collectedErrors[i]
								);
							}
						} else {
							acc.push(collectedErrors[i]);
						}
						return acc;
					}, [])
					.map(([, timestamp, collectedError]) => {
						lastDecryptionError.current =
							timestamp > lastDecryptionError.current
								? timestamp
								: lastDecryptionError.current;

						return apiPostError(collectedError);
					})
			).then((a) => {
				if (a.length > 0) {
					console.log(`${a.length} error(s) reported.`);
				}
			});
		}, []),
		1000,
		true
	);

	const decryptMessage = useCallback(
		(message: MessageItem) => {
			if (!isE2eeEnabled) {
				return message;
			}

			return decryptMessageHelper(
				message,
				keyID,
				key,
				encrypted,
				handleDecryptionErrors,
				handleDecryptionSuccess
			);
		},
		[
			encrypted,
			handleDecryptionErrors,
			handleDecryptionSuccess,
			isE2eeEnabled,
			key,
			keyID
		]
	);

	const fetchMessage = useCallback(
		(id) => {
			abortController.current = new AbortController();

			return apiGetMessage(id, abortController.current.signal)
				.then((message) => {
					if (!message || hiddenSystemMessages.includes(message.t)) {
						return null;
					}

					return message;
				})
				.then(prepareMessage)
				.then(decryptMessage)
				.then(parseMessage);
		},
		[decryptMessage, hiddenSystemMessages]
	);

	/*
	Load messages until count is reached or page 1 is reached
	 */
	const fetchMessages = useCallback(
		(offset, count, loadedMessages = []) => {
			abortController.current = new AbortController();

			return apiGetMessages(
				activeSession.rid,
				abortController.current.signal,
				offset,
				count
			)
				.then(({ messages = [] }) =>
					messages.filter(
						({ t }) => !hiddenSystemMessages.includes(t)
					)
				)
				.then((messages) => Promise.all(messages.map(prepareMessage)))
				.then((messages) => Promise.all(messages.map(decryptMessage)))
				.then((messages) => Promise.all(messages.map(parseMessage)))
				.then((messages) => {
					const msgs = [...messages, ...loadedMessages];

					// Load messages until count is reached or offset 0 is reached
					if (
						msgs.length <=
							(loadedOffset === Infinity
								? INITIAL_COUNT
								: COUNT) &&
						offset > 0
					) {
						return fetchMessages(
							Math.max(0, offset - COUNT),
							COUNT + Math.min(0, offset - COUNT),
							msgs
						);
					}

					return [offset, msgs];
				});
		},
		[activeSession.rid, decryptMessage, hiddenSystemMessages, loadedOffset]
	);

	/*
	Get room messages if page changes
	 */
	useEffect(() => {
		if (loadingMessages.current || loadedOffset <= offset) {
			return;
		}

		loadingMessages.current = true;

		let firstMessageId = null;
		let firstMessageOffset = null;

		fetchMessages(
			offset,
			loadedOffset === Infinity
				? initialCount.current
				: loadedOffset - offset
		)
			.then(([offset, messages]) => {
				const firstMessage = scrollContainerRef.current
					?.getElementsByClassName('messageItem')
					?.item(0);
				if (firstMessage) {
					// Keep the offset of first message too becuase there could be a divider which changes
					firstMessageOffset =
						firstMessage.getBoundingClientRect().top -
						scrollContainerRef.current.getBoundingClientRect().top;
					firstMessageId = firstMessage.id;
				}
				// Get element message item scroll position to scrollcontainer
				setOffset(offset);
				setLoadedOffset(offset);
				return messages;
			})
			.then((messages) => {
				dispatch({
					type: SET_MESSAGES,
					messages
				});
			})
			.finally(() => {
				loadingMessages.current = false;
				setInitialized(true);
				if (firstMessageId) {
					setTimeout(() => {
						scrollContainerRef.current.scrollTop =
							document.getElementById(firstMessageId).offsetTop +
							firstMessageOffset * -1;
					});
				}
			});
	}, [fetchMessages, loadedOffset, offset]);

	const handleRoomMessage = useUpdatingRef(
		useCallback(
			([message]) => {
				if (anonymousConversationFinished) return;

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
					fetchMessage(message._id)
						.then((message) => {
							dispatch({
								type: ADD_MESSAGE,
								message
							});
							return message;
						})
						.then((message) => {
							if (
								initialScrollCompleted &&
								(message?.own || isScrolledToBottom)
							) {
								setTimeout(() => {
									scrollToEnd(
										scrollContainerRef.current,
										0,
										true
									);
								});
							}
						});
				}
			},
			[
				anonymousConversationFinished,
				checkMutedUserForThisSession,
				isE2eeEnabled,
				activeSession.isGroup,
				addNewUsersToEncryptedRoom,
				fetchMessage,
				initialScrollCompleted,
				isScrolledToBottom
			]
		)
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

	const handleScrolledToTop = useCallback(
		(top: boolean) => {
			onScrolledToTop && onScrolledToTop(top);

			if (!top || loadingMessages.current) {
				return;
			}

			setOffset((offset) => {
				if (offset <= 0) {
					return offset;
				}

				return Math.max(0, offset - COUNT);
			});
		},
		[onScrolledToTop]
	);

	useEffect(() => {
		if (!initialized || !ready) {
			return;
		}

		if (anonymousConversationFinished) {
			setLoading(false);
			return;
		}

		// check if any user needs to be added when opening session view
		addNewUsersToEncryptedRoom().then();

		subscribe(
			{
				name: SUB_STREAM_ROOM_MESSAGES,
				roomId: activeSession.rid
			},
			handleRoomMessage
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

		return () => {
			unsubscribe(
				{
					name: SUB_STREAM_ROOM_MESSAGES,
					roomId: activeSession.rid
				},
				handleRoomMessage
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

			unsubscribe(
				{
					name: SUB_STREAM_NOTIFY_USER,
					event: EVENT_ROOMS_CHANGED,
					userId: getValueFromCookie('rc_uid')
				},
				handleLiveChatStopped
			);
		};
	}, [
		activeSession.isGroup,
		activeSession.isLive,
		activeSession.rid,
		addNewUsersToEncryptedRoom,
		anonymousConversationFinished,
		handleChatStopped,
		handleLiveChatStopped,
		handleSubscriptionChanged,
		initialized,
		handleRoomMessage,
		ready,
		subscribe,
		unsubscribe
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

	useEffect(() => {
		if (activeSession.item.consultingType) {
			let isCanceled = false;
			apiGetConsultingType({
				consultingTypeId: activeSession.item.consultingType
			}).then((response) => {
				if (isCanceled) return;
				setResortData(response);
			});
			return () => {
				isCanceled = true;
			};
		}
	}, [activeSession.item.consultingType]);

	const handleScroll = useDebouncedCallback(() => {
		const scrollPosition = Math.round(
			scrollContainerRef.current.scrollHeight -
				scrollContainerRef.current.scrollTop
		);
		const containerHeight = scrollContainerRef.current.clientHeight;
		const isBottom =
			scrollPosition >= containerHeight - 1 &&
			scrollPosition <= containerHeight + 1;

		setIsScrolledToBottom(isBottom);
		onScrolledToBottom && onScrolledToBottom(isBottom);

		const isTop = scrollContainerRef.current.scrollTop < 200;
		handleScrolledToTop(isTop);
	}, 100);

	const handleScrollToBottom = useCallback(
		(timeout = 0) => {
			const scrollContainer = scrollContainerRef.current;

			const unreadDivider = unreadDividerRef.current;
			const unreadItemOffset = unreadDivider?.offsetTop ?? 0;
			if (
				!unreadDivider ||
				scrollContainer.scrollTop >= unreadItemOffset
			) {
				scrollToEnd(scrollContainer, timeout, true);
				setTimeout(handleScroll, timeout);
				return;
			}

			smoothScroll({
				duration: 1000,
				element: scrollContainer,
				to: unreadItemOffset
			});
			setTimeout(handleScroll, 1000);
		},
		[handleScroll]
	);

	useEffect(() => {
		if (!initialized) {
			return;
		}

		setTimeout(() => {
			handleScrollToBottom(500);
			setTimeout(() => {
				setInitialScrollCompleted(true);
			}, 500);
		});
	}, [handleScrollToBottom, initialized]);

	const scrollBottomButtonItem: ButtonItem = useMemo(
		() => ({
			icon: <ArrowDoubleDownIcon />,
			type: BUTTON_TYPES.SMALL_ICON,
			smallIconBackgroundColor: 'alternate',
			title: 'app.scrollDown'
		}),
		[]
	);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<div
				className={clsx(
					className,
					'session__content',
					isDragActive && 'drag-in-progress'
				)}
				ref={scrollContainerRef}
				onScroll={() => initialScrollCompleted && handleScroll()}
			>
				{messages &&
					messages.map((message: MessageItem, index) => {
						return (
							<React.Fragment key={message._id}>
								<FirstUnreadMessageDivider
									visible={
										unreadMessageData?._id === message._id
									}
									message={message}
									ref={unreadDividerRef}
								/>
								<MessageDateDivider
									prevMessage={messages?.[index - 1]}
									message={message}
								/>
								<MessageItemComponent
									askerRcId={activeSession.item.askerRcId}
									isMyMessage={message.own}
									resortData={resortData}
									isUserBanned={bannedUsers.includes(
										message.username
									)}
									subscriptionKeyLost={subscriptionKeyLost}
									{...message}
								/>
							</React.Fragment>
						);
					})}
			</div>
			<div className="session__scrollToBottom__wrapper">
				<div
					className={`session__scrollToBottom ${
						isScrolledToBottom
							? 'session__scrollToBottom--disabled'
							: ''
					}`}
				>
					{unreadMessageData?.count > 0 && (
						<span className="session__unreadCount">
							{unreadMessageData.count > 99
								? translate('session.unreadCount.maxValue')
								: unreadMessageData.count}
						</span>
					)}
					<Button
						item={scrollBottomButtonItem}
						isLink={false}
						buttonHandle={handleScrollToBottom}
					/>
				</div>
			</div>

			{isOverlayActive && (
				<Overlay
					item={overlayItem}
					handleOverlay={handleOverlayAction}
				/>
			)}
		</>
	);
};

const FirstUnreadMessageDivider = forwardRef<
	HTMLDivElement,
	{ visible: boolean; message: MessageItem }
>(({ visible, message }, ref) => {
	const { t: translate } = useTranslation();

	if (!visible) {
		return null;
	}

	return (
		<div
			className="messageItem__divider messageItem__divider--lastRead"
			ref={ref}
		>
			{translate('session.divider.lastRead')}
		</div>
	);
});

const MessageDateDivider = ({
	prevMessage,
	message
}: {
	prevMessage: MessageItem;
	message: MessageItem;
}) => {
	const { t: translate } = useTranslation();

	const visible = useMemo(
		() =>
			(prevMessage?.messageDate?.str ||
				prevMessage?.messageDate?.date) !==
			(message.messageDate.str || message.messageDate.date),
		[
			message.messageDate.date,
			message.messageDate.str,
			prevMessage?.messageDate?.date,
			prevMessage?.messageDate?.str
		]
	);

	if (!visible) {
		return null;
	}

	return (
		<div className="messageItem__divider">
			<Text
				text={translate(
					message.messageDate.str || message.messageDate.date
				)}
				type="divider"
			/>
		</div>
	);
};
