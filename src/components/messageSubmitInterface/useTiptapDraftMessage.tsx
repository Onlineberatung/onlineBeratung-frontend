import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
	apiGetDraftMessage,
	apiPostDraftMessage,
	FETCH_ERRORS,
	IDraftMessage
} from '../../api';
import { decryptText, encryptText } from '../../utils/encryptionHelpers';
import { apiPostError, ERROR_LEVEL_WARN } from '../../api/apiPostError';
import { useE2EE } from '../../hooks/useE2EE';
import { ActiveSessionContext } from '../../globalState';
import { EVENT_PRE_LOGOUT } from '../logout/logout';
import {
	addEventListener,
	removeEventListener
} from '../../utils/eventHandler';

const SAVE_DRAFT_TIMEOUT = 10000;

export const useTiptapDraftMessage = (
	enabled: boolean,
	loadFunction: (markdown: string) => void
) => {
	const { activeSession } = useContext(ActiveSessionContext);

	const draftSaveTimeout = useRef<NodeJS.Timeout | null>(null);
	const willUnmount = useRef(false);

	const { keyID, key, encrypted, ready } = useE2EE(activeSession.rid);

	const [loaded, setLoaded] = useState(false);
	const [messageRes, setMessageRes] = useState<IDraftMessage>(null);
	const [message, setMessage] = useState(null);

	// Load the draft message from the api but do not show it because its encrypted
	useEffect(() => {
		const abortController = new AbortController();
		apiGetDraftMessage(activeSession.rid, abortController.signal)
			.then(setMessageRes)
			.catch((e) => {
				if (e.message === FETCH_ERRORS.EMPTY) {
					setLoaded(true);
					return;
				}
				console.error('Error loading Draft Message: ', e);
			});

		return () => {
			abortController?.abort();
		};
	}, [activeSession.rid]);

	// If everything is ready for decryption, decrypt the draft message
	useEffect(() => {
		if (!ready || !messageRes) {
			return;
		}

		if (!messageRes.message) {
			setLoaded(true);
			return;
		}

		if (messageRes.t !== 'e2e') {
			loadFunction(messageRes.message);
			setMessage(messageRes.message);
			setLoaded(true);
			return;
		}

		decryptText(
			messageRes.message,
			keyID,
			key,
			encrypted || messageRes.t === 'e2e',
			messageRes.t === 'e2e',
			'enc.'
		)
			.catch(() => messageRes.message)
			.then((msg) => {
				loadFunction(msg);
				setMessage(msg);
				setLoaded(true);
			});
	}, [messageRes, encrypted, key, keyID, ready, loadFunction]);

	const saveDraftMessage = useCallback(
		async (draftMessage) => {
			if (!enabled || !loaded) {
				return;
			}
			const groupId = activeSession.rid;
			let message = draftMessage ?? '';
			let encryptType = '';
			if (keyID && key && draftMessage) {
				try {
					message = await encryptText(
						draftMessage,
						keyID,
						key,
						'enc.'
					);
					encryptType = 'e2e';
				} catch (e: any) {
					await apiPostError({
						name: e.name,
						message: e.message,
						stack: e.stack,
						level: ERROR_LEVEL_WARN
					});
				}
			}

			await apiPostDraftMessage(groupId, message, encryptType).catch();
		},
		[
			activeSession.rid,
			loaded,
			enabled,
			key,
			keyID
		]
	);

	const onChange = useCallback(
		(markdownMessage) => {
			if (!loaded) {
				return;
			}

			setMessage(markdownMessage);

			if (draftSaveTimeout.current) {
				clearTimeout(draftSaveTimeout.current);
			}

			draftSaveTimeout.current = setTimeout(() => {
				saveDraftMessage(markdownMessage).then();
			}, SAVE_DRAFT_TIMEOUT);
		},
		[loaded, saveDraftMessage]
	);

	useEffect(() => {
		return () => {
			willUnmount.current = true;
		};
	}, []);

	const onLogout = useCallback(
		async (args) => {
			if (draftSaveTimeout.current) {
				clearTimeout(draftSaveTimeout.current);
				draftSaveTimeout.current = null;
			}
			await saveDraftMessage(message);
			return args;
		},
		[message, saveDraftMessage]
	);

	useEffect(() => {
		addEventListener(EVENT_PRE_LOGOUT, onLogout);

		return () => {
			removeEventListener(EVENT_PRE_LOGOUT, onLogout);
		};
	}, [onLogout]);

	useEffect(() => {
		return () => {
			if (!willUnmount.current) {
				return;
			}
			if (draftSaveTimeout.current) {
				clearTimeout(draftSaveTimeout.current);
				draftSaveTimeout.current = null;
			}
			saveDraftMessage(message).then();
		};
	}, [message, saveDraftMessage]);

	return {
		onChange,
		loaded
	};
};
