import { useCallback, useEffect, useState } from 'react';
import { apiGetSessionRooms } from '../api/apiGetSessionRooms';
import { buildExtendedSession, ExtendedSessionInterface } from '../globalState';
import { apiSetSessionRead } from '../api';

export const useSession = (
	rid: string
): {
	session: ExtendedSessionInterface;
	reload: () => void;
	read: () => void;
	ready: boolean;
} => {
	const [ready, setReady] = useState(false);
	const [session, setSession] = useState(null);

	const loadSession = useCallback(() => {
		apiGetSessionRooms([rid])
			.then(({ sessions: [activeSession] }) => {
				if (activeSession) {
					setSession(buildExtendedSession(activeSession, rid));
				}
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
