import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
	apiGetSessionRoomBySessionId,
	apiGetSessionRoomsByGroupIds
} from '../api/apiGetSessionRooms';
import {
	AnonymousConversationFinishedContext,
	buildExtendedSession,
	ExtendedSessionInterface
} from '../globalState';
import { apiSetSessionRead, FETCH_ERRORS } from '../api';
import { apiGetChatRoomById } from '../api/apiGetChatRoomById';

export const useSession = (
	rid: string | null,
	sessionId?: number,
	chatId?: number
): {
	session: ExtendedSessionInterface;
	reload: () => void;
	read: () => void;
	ready: boolean;
} => {
	const [ready, setReady] = useState(false);
	const [session, setSession] = useState<ExtendedSessionInterface>(null);
	const { anonymousConversationFinished } = useContext(
		AnonymousConversationFinishedContext
	);
	const repetitiveId = useRef(null);
	const abortController = useRef<AbortController>(null);

	useEffect(() => {
		repetitiveId.current = session?.item?.repetitive
			? session.item.id
			: null;
	}, [session]);

	const loadSession = useCallback(() => {
		if (abortController.current) {
			abortController.current.abort();
		}

		abortController.current = new AbortController();

		let promise;

		if (!rid && !sessionId && !chatId) {
			return;
		}

		if (anonymousConversationFinished) {
			return;
		}

		if (chatId) {
			promise = apiGetChatRoomById(
				chatId,
				abortController.current.signal
			);
		} else if (sessionId) {
			promise = apiGetSessionRoomBySessionId(
				sessionId,
				abortController.current.signal
			);
		} else {
			promise = apiGetSessionRoomsByGroupIds(
				[rid],
				abortController.current.signal
			);
		}

		return promise
			.then(({ sessions: [activeSession] }) => {
				if (activeSession) {
					setSession(buildExtendedSession(activeSession, rid));
				}
				setReady(true);
			})
			.catch((e) => {
				if (e.message === FETCH_ERRORS.ABORT) {
					return;
				}

				if (repetitiveId.current) {
					return apiGetChatRoomById(repetitiveId.current).then(
						({ sessions: [session] }) => {
							setSession(buildExtendedSession(session, rid));
							setReady(true);
						}
					);
				}
				setSession(null);
				setReady(true);
			});
	}, [rid, sessionId, chatId, anonymousConversationFinished]);

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
			if (abortController.current) {
				abortController.current.abort();
				abortController.current = null;
			}
		};
	}, [loadSession]);

	return { session, ready, reload: loadSession, read: readSession };
};
