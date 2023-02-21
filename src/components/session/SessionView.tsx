import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Loading } from '../app/Loading';
import { SessionTypeContext, UserDataContext } from '../../globalState';
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
import { Session } from './Session';
import { RoomProvider } from '../../globalState/provider/RoomProvider';

export const SessionView = () => {
	const { rcGroupId: groupIdFromParam, sessionId: sessionIdFromParam } =
		useParams<{ rcGroupId: string; sessionId: string }>();
	const history = useHistory();

	const currentGroupId = useUpdatingRef(groupIdFromParam);
	const currentSessionId = useUpdatingRef(sessionIdFromParam);

	const { type, path: listPath } = useContext(SessionTypeContext);
	const { userData } = useContext(UserDataContext);

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

	if (loading || !activeSession) {
		return <Loading />;
	}

	if (isUnjoinedGroup) {
		return (
			<ActiveSessionContext.Provider
				value={{ activeSession, reloadActiveSession }}
			>
				<RoomProvider>
					<JoinGroupChatView
						forceBannedOverlay={forceBannedOverlay}
						bannedUsers={bannedUsers}
					/>
				</RoomProvider>
			</ActiveSessionContext.Provider>
		);
	}

	if (isUnacceptedLiveChat) {
		return (
			<ActiveSessionContext.Provider
				value={{ activeSession, reloadActiveSession }}
			>
				<RoomProvider>
					<AcceptLiveChatView bannedUsers={bannedUsers} />
				</RoomProvider>
			</ActiveSessionContext.Provider>
		);
	}

	return (
		<ActiveSessionContext.Provider
			value={{ activeSession, reloadActiveSession, readActiveSession }}
		>
			<RoomProvider loadLastUnreadMessageTime={true}>
				<div className="session__wrapper">
					<Session
						bannedUsers={bannedUsers}
						checkMutedUserForThisSession={
							checkMutedUserForThisSession
						}
					/>
				</div>
			</RoomProvider>
		</ActiveSessionContext.Provider>
	);
};
