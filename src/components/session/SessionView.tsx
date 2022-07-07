import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { history } from '../app/app';
import { useParams } from 'react-router-dom';
import { Loading } from '../app/Loading';
import {
	LegalLinkInterface,
	RocketChatContext,
	SessionTypeContext,
	UserDataContext
} from '../../globalState';
import {
	desktopView,
	mobileDetailView,
	mobileListView
} from '../app/navigationHandler';
import { apiGetGroupChatInfo } from '../../api';
import { SESSION_LIST_TAB, SESSION_LIST_TYPES } from './sessionHelpers';
import { JoinGroupChatView } from '../groupChat/JoinGroupChatView';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { decodeUsername } from '../../utils/encryptionHelpers';
import { useResponsive } from '../../hooks/useResponsive';
import './session.styles';
import useUpdatingRef from '../../hooks/useUpdatingRef';
import { useSearchParam } from '../../hooks/useSearchParams';
import { useSession } from '../../hooks/useSession';
import { SessionStream } from './SessionStream';

interface SessionViewProps {
	legalLinks: Array<LegalLinkInterface>;
}

export const SessionView = ({ legalLinks }: SessionViewProps) => {
	const { rcGroupId: groupIdFromParam, sessionId: sessionIdFromParam } =
		useParams();

	const currentGroupId = useUpdatingRef(groupIdFromParam);
	const currentSessionId = useUpdatingRef(sessionIdFromParam);

	const { type, path: listPath } = useContext(SessionTypeContext);
	const { userData } = useContext(UserDataContext);
	const { ready: rcReady } = useContext(RocketChatContext);

	const [loading, setLoading] = useState(true);
	const [readonly, setReadonly] = useState(true);
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
		if (!rcReady) {
			return;
		}

		if (activeSessionReady && !activeSession) {
			history.push(
				listPath +
					(sessionListTab ? `?sessionListTab=${sessionListTab}` : '')
			);
			return;
		} else if (activeSessionReady) {
			if (
				activeSession.rid !== currentGroupId.current &&
				activeSession.item.id.toString() === currentSessionId.current
			) {
				history.push(
					`${listPath}/${activeSession.rid}/${activeSession.item.id}${
						sessionListTab
							? `?sessionListTab=${sessionListTab}`
							: ''
					}`
				);
				return;
			}

			if (type !== SESSION_LIST_TYPES.ENQUIRY) {
				setReadonly(false);
			}

			setLoading(false);
		}

		return () => {
			setReadonly(true);
			setLoading(true);
		};
	}, [
		activeSessionReady,
		activeSession,
		sessionListTab,
		type,
		bannedUsers,
		rcReady,
		currentSessionId,
		currentGroupId,
		listPath
	]);

	if (loading || !activeSession) {
		return <Loading />;
	}

	if (
		activeSession.isGroup &&
		(!activeSession.item.subscribed ||
			bannedUsers.includes(userData.userName))
	) {
		return (
			<ActiveSessionContext.Provider
				value={{ activeSession, reloadActiveSession }}
			>
				<JoinGroupChatView
					forceBannedOverlay={forceBannedOverlay}
					bannedUsers={bannedUsers}
					legalLinks={legalLinks}
				/>
			</ActiveSessionContext.Provider>
		);
	}

	return (
		<ActiveSessionContext.Provider
			value={{ activeSession, reloadActiveSession, readActiveSession }}
		>
			<SessionStream
				readonly={readonly}
				legalLinks={legalLinks}
				checkMutedUserForThisSession={checkMutedUserForThisSession}
				bannedUsers={bannedUsers}
			/>
		</ActiveSessionContext.Provider>
	);
};
