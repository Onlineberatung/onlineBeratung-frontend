import { useCallback, useEffect, useRef, useState } from 'react';
import { apiGetSessionRoomsByGroupIds } from '../api/apiGetSessionRooms';
import {
	buildExtendedSession,
	ExtendedSessionInterface,
	ListItemInterface
} from '../globalState';
import { apiSetSessionRead } from '../api';
import { apiGetChatRoomById } from '../api/apiGetChatRoomById';

export const useSession = (
	rid: string
): {
	session: ExtendedSessionInterface;
	reload: () => void;
	read: () => void;
	ready: boolean;
} => {
	const [ready, setReady] = useState(false);
	const [session, setSession] = useState<ExtendedSessionInterface>(null);
	const repetitiveId = useRef(null);

	useEffect(() => {
		repetitiveId.current = session?.item?.repetitive
			? session.item.id
			: null;
	}, [session]);

	const loadSession = useCallback(() => {
		apiGetSessionRoomsByGroupIds([rid])
			.then(({ sessions: [activeSession] }) => {
				if (activeSession) {
					setSession(buildExtendedSession(activeSession, rid));
				}
			})
			.catch(() => {
				if (repetitiveId.current) {
					return apiGetChatRoomById(repetitiveId.current).then(
						({ sessions: [session] }) => {
							setSession(buildExtendedSession(session, rid));
						}
					);
				}
				setSession(null);
			})
			.finally(() => {
				setReady(true);
			});
	}, [rid]);

	const readSession = useCallback(() => {
		if (!session) {
			return;
		}

		const isCurrentSessionRead = session.isFeedback
			? session.item.feedbackRead
			: session.item.messagesRead;

		if (!isCurrentSessionRead) {
			apiSetSessionRead(session.rid).then();
		}
	}, [session]);

	useEffect(() => {
		loadSession();

		return () => {
			setReady(false);
			setSession(null);
		};
	}, [loadSession]);

	return { session, ready, reload: loadSession, read: readSession };
};
