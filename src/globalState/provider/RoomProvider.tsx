import * as React from 'react';
import {
	createContext,
	FC,
	useContext,
	useEffect,
	useMemo,
	useRef
} from 'react';
import { ActiveSessionContext } from './ActiveSessionProvider';
import { IRoom } from '../../types/rc/Room';
import { ISubscriptions } from '../../types/rc/Subscriptions';
import { apiRocketChatGroupMessages } from '../../api/apiRocketChatGroupMessages';
import { useRoom } from '../../hooks/useRoom';
import { useSubscription } from '../../hooks/useSubscription';
import { Loading } from '../../components/app/Loading';
import {
	IArraySetting,
	SETTING_HIDE_SYSTEM_MESSAGES
} from '../../api/apiRocketChatSettingsPublic';
import { RocketChatGlobalSettingsContext } from './RocketChatGlobalSettingsProvider';
import { useUsersOfRoom } from '../../hooks/useUsersOfRoom';
import { MethodGetUsersOfRoomRes } from '../../components/app/RocketChat';
import { useE2EE, UseE2EEParams } from '../../hooks/useE2EE';

export const RoomContext = createContext<{
	room: IRoom;
	subscription: ISubscriptions;
	lastUnreadMessageTime: number | null;
	hiddenSystemMessages: string[];
	usersOfRoom: MethodGetUsersOfRoomRes & {
		reload: (roomId: string) => Promise<MethodGetUsersOfRoomRes>;
	};
	e2eeParams: Omit<UseE2EEParams, 'ready'>;
	feedbackE2eeParams: Omit<UseE2EEParams, 'ready'>;
}>({
	room: null,
	subscription: null,
	lastUnreadMessageTime: null,
	hiddenSystemMessages: undefined,
	usersOfRoom: undefined,
	e2eeParams: undefined,
	feedbackE2eeParams: undefined
});

export const RoomProvider: FC<{
	loadLastUnreadMessageTime?: boolean;
}> = ({ children, loadLastUnreadMessageTime = false }) => {
	const { activeSession } = useContext(ActiveSessionContext);
	const { getSetting } = useContext(RocketChatGlobalSettingsContext);

	const room = useRoom(activeSession?.rid);
	const subscription = useSubscription(activeSession?.rid);
	const usersOfRoom = useUsersOfRoom();
	const { ready: e2eeReady, ...e2eeParams } = useE2EE(activeSession?.rid);
	const { ready: feedbackE2eeReady, ...feedbackE2eeParams } = useE2EE(
		activeSession.item?.feedbackGroupId
	);

	// Because we are removing some messages on the backend side the subscription.unread count can not used to detect
	// the last unread message. Thats why we load the last unread message time from rc
	const lastUnreadMessageTime = useRef<number | null>(undefined);
	useEffect(() => {
		// If subscription is not loaded
		if (subscription === undefined || room === undefined) {
			lastUnreadMessageTime.current = undefined;
			return;
		}

		// If no subscription or no unread messages
		if (!subscription?.unread || !loadLastUnreadMessageTime) {
			lastUnreadMessageTime.current = null;
			return;
		}

		// Prevent reload on every change
		if (lastUnreadMessageTime.current) {
			return;
		}

		apiRocketChatGroupMessages(subscription.rid, {
			offset: room.msgs - subscription.unread,
			count: 1,
			sort: { ts: 1 },
			fields: { ts: 1, _id: 1 }
		})
			.then(({ messages: [{ ts }] }) => {
				lastUnreadMessageTime.current = new Date(ts).getTime();
			})
			.catch(() => {
				lastUnreadMessageTime.current = null;
			});

		return () => {
			lastUnreadMessageTime.current = undefined;
		};
	}, [loadLastUnreadMessageTime, room, subscription]);

	const hiddenSystemMessages = useMemo(
		() =>
			getSetting<IArraySetting>(SETTING_HIDE_SYSTEM_MESSAGES, [])?.value,
		[getSetting]
	);

	// Wait for everything to be loaded
	if (
		[
			room,
			subscription,
			lastUnreadMessageTime,
			hiddenSystemMessages,
			usersOfRoom
		].includes(undefined) ||
		!e2eeReady ||
		!feedbackE2eeReady
	) {
		return <Loading />;
	}

	return (
		<RoomContext.Provider
			value={{
				room,
				subscription,
				lastUnreadMessageTime: lastUnreadMessageTime.current,
				hiddenSystemMessages,
				usersOfRoom,
				e2eeParams,
				feedbackE2eeParams
			}}
		>
			{children}
		</RoomContext.Provider>
	);
};
