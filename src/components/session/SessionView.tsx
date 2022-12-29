import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Loading } from '../app/Loading';
import {
	RocketChatGlobalSettingsContext,
	SessionTypeContext,
	UserDataContext
} from '../../globalState';
import {
	desktopView,
	mobileDetailView,
	mobileListView
} from '../app/navigationHandler';
import { apiGetGroupChatInfo } from '../../api';
import { SESSION_LIST_TAB } from './sessionHelpers';
import { JoinGroupChatView } from '../groupChat/JoinGroupChatView';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { decodeUsername } from '../../utils/encryptionHelpers';
import { useResponsive } from '../../hooks/useResponsive';
import './session.styles';
import './session.yellowTheme.styles';
import useUpdatingRef from '../../hooks/useUpdatingRef';
import { useSearchParam } from '../../hooks/useSearchParams';
import { useSession } from '../../hooks/useSession';
import { AcceptLiveChatView } from './AcceptLiveChatView';
import { RocketChatSubscriptionsContext } from '../../globalState/provider/RocketChatSubscriptionsProvider';
import { SessionE2EEProvider } from '../../globalState/provider/SessionE2EEProvider';
import { Session } from './Session';
import {
	IArraySetting,
	SETTING_HIDE_SYSTEM_MESSAGES
} from '../../api/apiRocketChatSettingsPublic';
import { usePropsMemo } from '../../hooks/usePropsMemo';
import { IRoom } from '../../types/rc/Room';
import { ISubscriptions } from '../../types/rc/Subscriptions';
import { RocketChatUsersOfRoomProvider } from '../../globalState/provider/RocketChatUsersOfRoomProvider';

export const SessionView = () => {
	const { rcGroupId: groupIdFromParam, sessionId: sessionIdFromParam } =
		useParams<{ rcGroupId: string; sessionId: string }>();
	const history = useHistory();

	const currentGroupId = useUpdatingRef(groupIdFromParam);
	const currentSessionId = useUpdatingRef(sessionIdFromParam);

	const { type, path: listPath } = useContext(SessionTypeContext);
	const { userData } = useContext(UserDataContext);
	const { getSetting, ready: settingsReady } = useContext(
		RocketChatGlobalSettingsContext
	);
	const { rooms, roomsReady, subscriptions, subscriptionsReady } = useContext(
		RocketChatSubscriptionsContext
	);

	const [loading, setLoading] = useState(true);
	const [forceBannedOverlay, setForceBannedOverlay] = useState(false);
	const [bannedUsers, setBannedUsers] = useState<string[]>([]);

	const {
		session: activeSession,
		ready: activeSessionReady,
		reload: reloadActiveSession,
		read: readActiveSession
	} = useSession(groupIdFromParam);

	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	const room = usePropsMemo<IRoom>(
		(prev) =>
			roomsReady &&
			(rooms?.find((room) => room._id === activeSession?.rid) || prev),
		[activeSession?.rid, rooms, roomsReady],
		['_updatedAt.$date']
	);

	const subscription = usePropsMemo<ISubscriptions>(
		(prev) =>
			subscriptionsReady &&
			(subscriptions?.find(
				(subscription) => subscription.rid === activeSession?.rid
			) ||
				prev),
		[activeSession?.rid, subscriptions, subscriptionsReady],
		['_updatedAt.$date']
	);

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

	const checkMutedUserForThisSession = useCallback(() => {
		setForceBannedOverlay(false);
		if (!activeSession?.isGroup) {
			return;
		}

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
	}, [activeSession, userData.userName]);

	useEffect(() => {
		checkMutedUserForThisSession();

		return () => {
			setBannedUsers([]);
		};
	}, [checkMutedUserForThisSession]);

	useEffect(() => {
		if (!activeSessionReady) {
			return;
		}

		if (!activeSession) {
			history.push(
				listPath +
					(sessionListTab ? `?sessionListTab=${sessionListTab}` : '')
			);
			return;
		}

		if (
			activeSession.rid !== currentGroupId.current &&
			activeSession.item.id.toString() === currentSessionId.current
		) {
			history.push(
				`${listPath}/${activeSession.rid}/${activeSession.item.id}${
					sessionListTab ? `?sessionListTab=${sessionListTab}` : ''
				}`
			);
			return;
		}

		setLoading(false);

		return () => {
			setLoading(true);
		};
	}, [
		activeSessionReady,
		activeSession,
		sessionListTab,
		type,
		bannedUsers,
		currentSessionId,
		currentGroupId,
		listPath,
		history
	]);

	const isUnjoinedGroup = useMemo(
		() =>
			activeSession?.isGroup &&
			(!activeSession?.item.subscribed ||
				bannedUsers.includes(userData.userName)),
		[
			activeSession?.isGroup,
			activeSession?.item.subscribed,
			bannedUsers,
			userData.userName
		]
	);

	const isUnacceptedLiveChat = useMemo(
		() =>
			activeSession?.isEnquiry &&
			!activeSession?.isEmptyEnquiry &&
			activeSession.isLive,
		[
			activeSession?.isEmptyEnquiry,
			activeSession?.isEnquiry,
			activeSession?.isLive
		]
	);

	if (
		loading ||
		!activeSession ||
		(!isUnjoinedGroup &&
			!isUnacceptedLiveChat &&
			(!settingsReady || !room || !subscription))
	) {
		return <Loading />;
	}

	if (isUnjoinedGroup) {
		return (
			<ActiveSessionContext.Provider
				value={{ activeSession, reloadActiveSession }}
			>
				<RocketChatUsersOfRoomProvider>
					<SessionE2EEProvider>
						<JoinGroupChatView
							forceBannedOverlay={forceBannedOverlay}
							bannedUsers={bannedUsers}
						/>
					</SessionE2EEProvider>
				</RocketChatUsersOfRoomProvider>
			</ActiveSessionContext.Provider>
		);
	}

	if (isUnacceptedLiveChat) {
		return (
			<ActiveSessionContext.Provider
				value={{ activeSession, reloadActiveSession }}
			>
				<RocketChatUsersOfRoomProvider>
					<SessionE2EEProvider>
						<AcceptLiveChatView bannedUsers={bannedUsers} />
					</SessionE2EEProvider>
				</RocketChatUsersOfRoomProvider>
			</ActiveSessionContext.Provider>
		);
	}

	return (
		<ActiveSessionContext.Provider
			value={{ activeSession, reloadActiveSession, readActiveSession }}
		>
			<RocketChatUsersOfRoomProvider>
				<SessionE2EEProvider>
					<div className="session__wrapper">
						<Session
							bannedUsers={bannedUsers}
							checkMutedUserForThisSession={
								checkMutedUserForThisSession
							}
							room={room}
							subscription={subscription}
							hiddenSystemMessages={
								getSetting<IArraySetting>(
									SETTING_HIDE_SYSTEM_MESSAGES
								)?.value ?? []
							}
						/>
					</div>
				</SessionE2EEProvider>
			</RocketChatUsersOfRoomProvider>
		</ActiveSessionContext.Provider>
	);
};
