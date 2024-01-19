import * as React from 'react';
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react';
import { RocketChatSubscriptionsContext } from './RocketChatSubscriptionsProvider';
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
import { UserDataContext } from '../context/UserDataContext';
import { AnonymousConversationFinishedContext } from './AnonymousConversationFinishedProvider';
import { useBrowserNotification } from '../../hooks/useBrowserNotification';

type UnreadStatusContextProps = {
	sessions: string[];
	teamsessions: string[];
	feedback: string[];
	enquiry: string[];
	livechat: string[];
	group: string[];
	archiv: string[];
	unknown: string[];
};

const initialData = {
	livechat: [],
	enquiry: [],
	archiv: [],
	feedback: [],
	sessions: [],
	teamsessions: [],
	group: [],
	unknown: []
};

const UNREAD_DAYS = 30;

export const RocketChatUnreadContext =
	createContext<UnreadStatusContextProps>(initialData);

type RocketChatUnreadProviderProps = {
	children: ReactNode;
};

export function RocketChatUnreadProvider({
	children
}: RocketChatUnreadProviderProps) {
	const { maybeSendNewEnquiryNotification } = useBrowserNotification();
	const { subscriptions } = useContext(RocketChatSubscriptionsContext);
	const { anonymousConversationFinished } = useContext(
		AnonymousConversationFinishedContext
	);
	const { userData } = useContext(UserDataContext);
	const [unreadStatus, setUnreadStatus] =
		useState<UnreadStatusContextProps>(initialData);

	const removeUnreadStatus = useCallback((unreadStatus, rid) => {
		Object.keys(unreadStatus).forEach((n) => {
			const index = unreadStatus[n].indexOf(rid);
			if (index < 0) return;
			unreadStatus[n].splice(index, 1);
		});
		return unreadStatus;
	}, []);

	const handleSessions = useCallback(
		(sessions, subscriptions) => {
			if (subscriptions.length === 0) {
				return;
			}
			setUnreadStatus((unreadStatus) => {
				let newUnreadStatus = { ...unreadStatus };
				subscriptions.forEach((subscription) => {
					if (!subscription.unread) {
						newUnreadStatus = removeUnreadStatus(
							newUnreadStatus,
							subscription.rid
						);
						return;
					}

					const session = sessions.find((s) => {
						const chatItem = getChatItemForSession(s);

						return (
							chatItem.groupId === subscription.rid ||
							(!isGroupChat(chatItem) &&
								chatItem?.feedbackGroupId === subscription.rid)
						);
					});

					if (!session) {
						newUnreadStatus.unknown.push(subscription.rid);
						return;
					}

					const sessionType = getSessionType(
						session,
						subscription.rid,
						userData.userId
					);

					// Remove it from all unread groups
					newUnreadStatus = removeUnreadStatus(
						newUnreadStatus,
						subscription.rid
					);

					// Add it to relevant unread group
					switch (sessionType) {
						case SESSION_TYPE_LIVECHAT:
							newUnreadStatus.livechat.push(subscription.rid);
							break;
						case SESSION_TYPE_ENQUIRY:
							newUnreadStatus.enquiry.push(subscription.rid);
							break;
						case SESSION_TYPE_ARCHIVED:
							newUnreadStatus.archiv.push(subscription.rid);
							break;
						case SESSION_TYPE_FEEDBACK:
							newUnreadStatus.feedback.push(subscription.rid);
							break;
						case SESSION_TYPE_GROUP:
							newUnreadStatus.group.push(subscription.rid);
							break;
						case SESSION_TYPE_SESSION:
							newUnreadStatus.sessions.push(subscription.rid);
							break;
						case SESSION_TYPE_TEAMSESSION:
							newUnreadStatus.teamsessions.push(subscription.rid);
							break;
						default:
							newUnreadStatus.unknown.push(subscription.rid);
							break;
					}
				});

				Object.keys(newUnreadStatus).forEach((n) => {
					newUnreadStatus[n] = [...new Set(newUnreadStatus[n])];
				});

				return newUnreadStatus;
			});
		},
		[removeUnreadStatus, userData.userId]
	);

	// Initialize all subscriptions with unread status
	useEffect(() => {
		if (!subscriptions?.length || anonymousConversationFinished) {
			return;
		}

		const unreadMinTime = new Date().getTime() - UNREAD_DAYS * 86400 * 1000;
		const unreadRooms = Object.values(unreadStatus).reduce(
			(acc, curr) => acc.concat(curr),
			[]
		);

		const relevantSubscriptions = subscriptions
			.filter((s) => s.rid !== 'GENERAL')
			// Only take subscriptions younger than UNREAD_DAYS
			.filter((s) => s?._updatedAt?.$date > unreadMinTime)
			// Only handle changed subscriptions
			.filter(
				(s) =>
					(s.unread > 0 && !unreadRooms.includes(s.rid)) ||
					(s.unread === 0 && unreadRooms.includes(s.rid))
			);
		if (relevantSubscriptions.length === 0) {
			return;
		}

		// Extra information only needed for new unread messages. Prevent extra api call if a subscription is set to read
		if (relevantSubscriptions.filter((s) => s.unread > 0).length > 0) {
			apiGetSessionRoomsByGroupIds(
				relevantSubscriptions
					.filter((s) => s.unread > 0)
					.map((s) => s.rid)
			).then(({ sessions }) => {
				// It will send a browser notification if there is a new enquiry
				maybeSendNewEnquiryNotification(sessions);
				handleSessions(sessions, relevantSubscriptions);
			});
		} else {
			handleSessions([], relevantSubscriptions);
		}
	}, [
		subscriptions,
		handleSessions,
		unreadStatus,
		anonymousConversationFinished,
		maybeSendNewEnquiryNotification
	]);

	return (
		<RocketChatUnreadContext.Provider value={{ ...unreadStatus }}>
			{children}
		</RocketChatUnreadContext.Provider>
	);
}
