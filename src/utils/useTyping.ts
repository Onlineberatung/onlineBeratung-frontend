import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import update from 'immutability-helper';
import { SOCKET_COLLECTION } from '../api';
import { decodeUsername, encodeUsername } from './encryptionHelpers';

const TYPING_TIMEOUT_MS = 4000;
const TYPING_TRIGGER_MS = 1000;

const ACTION_TYPING = 'typing';
const ACTION_SET = 'set';

type actionTyping = {
	type: typeof ACTION_TYPING;
	username: string;
	isTyping: boolean;
};

type actionSet = {
	type: typeof ACTION_SET;
	users: string[];
};

function reducer(state, action: actionTyping | actionSet) {
	switch (action.type) {
		case ACTION_TYPING:
			if (action.isTyping && !state.includes(action.username)) {
				return update(state, { $push: [action.username] });
			} else if (!action.isTyping && state.includes(action.username)) {
				return update(state, {
					$splice: [[state.indexOf(action.username), 1]]
				});
			}
			return state;
		case ACTION_SET:
			return action.users;
		default:
			throw new Error();
	}
}

/**
 * Subscribe to existing rocket.chat socket
 * to send and receive typing status messages
 * and get a list of "... is typing" users
 */
export default function useTyping(
	groupId: string,
	userName: string,
	displayName: string
) {
	const typingTimeout = useRef(null);
	const lastTypingTrigger = useRef(0);
	const [typingUsers, dispatchTypingUsers] = useReducer(reducer, []);
	const [subscribed, setSubscribed] = useState(false);

	useEffect(() => {
		return () => {
			if (typingTimeout.current) {
				window.clearTimeout(typingTimeout.current);
				typingTimeout.current = null;
			}
			dispatchTypingUsers({
				type: ACTION_SET,
				users: []
			});
		};
	}, [groupId, userName]);

	/**
	 * handle rocket.chat typing message and
	 * maintenance a list of (not) typing users
	 */
	const handleTypingResponse = useCallback(
		([encUsername, isTyping, encDisplayName]) => {
			const typingUsername = decodeUsername(encDisplayName);

			if (typingUsername === displayName) {
				return;
			}

			dispatchTypingUsers({
				type: ACTION_TYPING,
				username: typingUsername,
				isTyping
			});
		},
		[displayName]
	);

	/**
	 * Subscribe to rocket.chat socket message of typing to receive
	 * (not) typing messages
	 */
	const subscribeTyping = useCallback(() => {
		if (window['socket']) {
			window['socket'].addSubscription(
				SOCKET_COLLECTION.NOTIFY_ROOM,
				[`${groupId}/typing`, { useCollection: false, args: [] }],
				handleTypingResponse
			);
			setSubscribed(true);
		}
	}, [groupId, handleTypingResponse]);

	/**
	 * Handle typing and send rocket.chat (not) typing message to
	 * all room members
	 *
	 * @param isCleared boolean Send instant not typing anymore message
	 * e.g. if message is send
	 */
	const handleTyping = useCallback(
		(isCleared) => {
			if (window['socket'] && subscribed) {
				// If typingTimeout already active reset it
				if (typingTimeout.current) {
					window.clearTimeout(typingTimeout.current);
					typingTimeout.current = null;
				}

				const now = Date.now();
				if (lastTypingTrigger.current + TYPING_TRIGGER_MS < now) {
					window['socket'].sendTypingState(
						SOCKET_COLLECTION.NOTIFY_ROOM,
						[
							`${groupId}/typing`,
							encodeUsername(userName).toLowerCase(),
							true,
							encodeUsername(displayName)
						]
					);
					lastTypingTrigger.current = now;
				}

				const cancelTyping = () => {
					window['socket'].sendTypingState(
						SOCKET_COLLECTION.NOTIFY_ROOM,
						[
							`${groupId}/typing`,
							encodeUsername(userName).toLowerCase(),
							false,
							encodeUsername(displayName)
						]
					);
					typingTimeout.current = null;
					lastTypingTrigger.current = 0;
				};

				if (isCleared) {
					// Small timeout on clear to be sure its the last event
					typingTimeout.current = setTimeout(() => {
						cancelTyping();
					}, 250);
				} else {
					typingTimeout.current = setTimeout(() => {
						cancelTyping();
					}, TYPING_TIMEOUT_MS);
				}
			}
		},
		[groupId, subscribed, userName, displayName]
	);

	return { subscribeTyping, handleTyping, typingUsers };
}
