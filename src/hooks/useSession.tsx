import { useCallback, useEffect, useState } from 'react';
import { apiGetSessionRooms } from '../api/apiGetSessionRooms';
import { buildExtendedSession, ExtendedSessionInterface } from '../globalState';

export const useSession = (
	rid: string
): {
	session: ExtendedSessionInterface;
	reload: () => void;
	ready: boolean;
} => {
	const [ready, setReady] = useState(false);
	const [session, setSession] = useState(null);

	const loadSession = useCallback(() => {
		apiGetSessionRooms([rid]).then(({ sessions: [activeSession] }) => {
			if (activeSession) {
				setSession(buildExtendedSession(activeSession, rid));
			}
			setReady(true);
		});
	}, [rid]);

	useEffect(() => {
		loadSession();

		return () => {
			setReady(false);
			setSession(null);
		};
	}, [loadSession]);

	return { session, ready, reload: loadSession };
};
