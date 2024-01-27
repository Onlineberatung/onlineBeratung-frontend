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
import { E2EEContext, ActiveSessionContext } from '../../globalState';
import { convertFromRaw, EditorState } from 'draft-js';
import { markdownToDraft } from 'markdown-draft-js';
import { EVENT_PRE_LOGOUT } from '../logout/logout';
import {
	addEventListener,
	removeEventListener
} from '../../utils/eventHandler';

const SAVE_DRAFT_TIMEOUT = 10000;

export const useDraftMessage = (
	enabled: boolean,
	loadFunction: (state: EditorState) => void
) => {
	const { activeSession } = useContext(ActiveSessionContext);
	const { isE2eeEnabled } = useContext(E2EEContext);

	const draftSaveTimeout = useRef(null);
	const willUnmount = useRef(false);

	const { keyID, key, encrypted, ready } = useE2EE(activeSession.rid);

	const [loaded, setLoaded] = useState(false);
	const [messageRes, setMessageRes] = useState<IDraftMessage>(null);
	const [message, setMessage] = useState(null);

	const setEditorWithMarkdownString = useCallback(
		(markdownString: string) => {
			const rawObject = markdownToDraft(markdownString);
			const draftContent = convertFromRaw(rawObject);
			loadFunction(EditorState.createWithContent(draftContent));
		},
		[loadFunction]
	);

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

		if (!isE2eeEnabled || messageRes.t !== 'e2e') {
			setEditorWithMarkdownString(messageRes.message);
			setMessage(messageRes.message);
			setLoaded(true);
			return;
		}

		decryptText(
			messageRes.message,
			keyID,
			key,
			encrypted,
			messageRes.t === 'e2e',
			'enc.'
		)
			.catch(() => messageRes.message)
			.then((msg) => {
				setEditorWithMarkdownString(msg);
				setMessage(msg);
				setLoaded(true);
			});
	}, [
		messageRes,
		encrypted,
		isE2eeEnabled,
		key,
		keyID,
		ready,
		setEditorWithMarkdownString
	]);

	const saveDraftMessage = useCallback(
		async (draftMessage) => {
			if (!enabled || !loaded) {
				return;
			}
			const groupId = activeSession.rid;
			let message = draftMessage ?? '';
			let encryptType = '';
			if (isE2eeEnabled && encrypted && draftMessage) {
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
			encrypted,
			isE2eeEnabled,
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
