import * as React from 'react';
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import { RocketChatSubscriptionsContext } from './RocketChatSubscriptionsProvider';
import {
	EVENT_MESSAGE,
	SUB_STREAM_ROOM_MESSAGES
} from '../../components/app/RocketChat';
import { RocketChatContext } from './RocketChatProvider';
import { getValueFromCookie } from '../../components/sessionCookie/accessSessionCookie';
import { apiGetSessionRoomsByGroupIds } from '../../api/apiGetSessionRooms';
import {
	getChatItemForSession,
	getSessionType,
	isGroupChat,
	SESSION_TYPE_ARCHIVED,
	SESSION_TYPE_ENQUIRY,
	SESSION_TYPE_FEEDBACK,
	SESSION_TYPE_GROUP,
	SESSION_TYPE_LIVECHAT,
	SESSION_TYPE_SESSION,
	SESSION_TYPE_TEAMSESSION
} from '../../components/session/sessionHelpers';
import useDebounceCallback from '../../hooks/useDebounceCallback';
import useUpdatingRef from '../../hooks/useUpdatingRef';

type UnreadStatusContextProps = {
	sessions: string[];
	teamsessions: string[];
	feedback: string[];
	enquiry: string[];
	livechat: string[];
	group: string[];
	archiv: string[];
};

const initialData = {
	livechat: [],
	enquiry: [],
	archiv: [],
	feedback: [],
	sessions: [],
	teamsessions: [],
	group: []
};

export const RocketChatUnreadContext =
	createContext<UnreadStatusContextProps>(initialData);

type RocketChatUnreadProviderProps = {
	children: ReactNode;
};

export function RocketChatUnreadProvider({
	children
}: RocketChatUnreadProviderProps) {
	const rcUid = useRef(getValueFromCookie('rc_uid'));

	const { subscriptions, rooms } = useContext(RocketChatSubscriptionsContext);

	const { subscribe, unsubscribe, ready } = useContext(RocketChatContext);

	const [subscribed, setSubscribed] = useState<boolean>(false);
	const [initialized, setInitialized] = useState<boolean>(false);
	const [unreadStatus, setUnreadStatus] =
		useState<UnreadStatusContextProps>(initialData);

	const handleSessions = useCallback((sessions, rcDatas) => {
		if (sessions.length === 0 || rcDatas.length === 0) {
			return;
		}

		setUnreadStatus((unreadStatus) => {
			const newUnreadStatus = { ...unreadStatus };
			rcDatas.forEach((rcData) => {
				if (!rcData.unread) {
					Object.keys(newUnreadStatus).forEach((n) => {
						const index = newUnreadStatus[n].indexOf(rcData.rid);
						if (index < 0) return;
						newUnreadStatus[n].splice(index, 1);
					});
					return;
				}

				const session = sessions.find((s) => {
					const chatItem = getChatItemForSession(s);

					return (
						chatItem.groupId === rcData.rid ||
						(!isGroupChat(chatItem) &&
							chatItem?.feedbackGroupId === rcData.rid)
					);
				});

				if (!session) return;

				const sessionType = getSessionType(session, rcData.rid);

				switch (sessionType) {
					case SESSION_TYPE_LIVECHAT:
						newUnreadStatus.livechat.push(rcData.rid);
						break;
					case SESSION_TYPE_ENQUIRY:
						newUnreadStatus.enquiry.push(rcData.rid);
						break;
					case SESSION_TYPE_ARCHIVED:
						newUnreadStatus.archiv.push(rcData.rid);
						break;
					case SESSION_TYPE_FEEDBACK:
						newUnreadStatus.feedback.push(rcData.rid);
						break;
					case SESSION_TYPE_GROUP:
						newUnreadStatus.group.push(rcData.rid);
						break;
					case SESSION_TYPE_SESSION:
						newUnreadStatus.sessions.push(rcData.rid);
						break;
					case SESSION_TYPE_TEAMSESSION:
						newUnreadStatus.teamsessions.push(rcData.rid);
				}
			});

			Object.keys(newUnreadStatus).forEach((n) => {
				newUnreadStatus[n] = [...new Set(newUnreadStatus[n])];
			});

			return newUnreadStatus;
		});
	}, []);

	const onMessage = useCallback(
		(args) => {
			if (args.length === 0) return;

			const messages = args
				.map(([[message]]) => message)
				// Ignore my own send messages and edited messages
				.filter((message) => message.rid !== 'GENERAL')
				.filter(
					(message) =>
						message.u._id !== rcUid.current && !message.editedBy
				);

			if (messages.length === 0) {
				return;
			}

			apiGetSessionRoomsByGroupIds(messages.map((m) => m.rid)).then(
				({ sessions }) => {
					handleSessions(sessions, messages);
				}
			);
		},
		[handleSessions]
	);

	const onDebounceMessage = useUpdatingRef(
		useDebounceCallback(onMessage, 500, true)
	);

	// Subscribe to all my messages
	useEffect(() => {
		if (ready && !subscribed) {
			setSubscribed(true);
			subscribe(
				{
					name: SUB_STREAM_ROOM_MESSAGES,
					event: EVENT_MESSAGE,
					roomId: '__my_messages__'
				},
				onDebounceMessage
			);
		} else if (!ready) {
			setSubscribed(false);
		}
	}, [onDebounceMessage, ready, subscribe, subscribed, unsubscribe]);

	// Initialize all subscriptions with unread status
	useEffect(() => {
		if (!rooms?.length || !subscriptions?.length || initialized) {
			return;
		}
		setInitialized(true);

		const unreadSubscriptions = subscriptions
			.filter((s) => s.rid !== 'GENERAL')
			.filter((s) => s.unread);

		if (unreadSubscriptions.length === 0) {
			return;
		}

		apiGetSessionRoomsByGroupIds(
			unreadSubscriptions.map((s) => s.rid)
		).then(({ sessions }) => {
			handleSessions(sessions, unreadSubscriptions);
		});
	}, [subscriptions, rooms, handleSessions, initialized]);

	return (
		<RocketChatUnreadContext.Provider value={{ ...unreadStatus }}>
			{children}
		</RocketChatUnreadContext.Provider>
	);
}
