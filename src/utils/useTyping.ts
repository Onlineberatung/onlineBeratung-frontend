import { useCallback, useEffect, useRef, useState } from 'react';
import { SOCKET_COLLECTION } from '../api';
import { decodeUsername, encodeUsername } from './encryptionHelpers';

const TYPING_TIMEOUT_MS = 4000;
const TYPING_TRIGGER_MS = 1000;

/**
 * Subscribe to existing rocket.chat socket
 * to send and receive typing status messages
 * and get a list of "... is typing" users
 *
 * @param groupId string
 * @param userName string
 */
export default function useTyping(groupId, userName) {
	const typingTimeout = useRef(null);
	const lastTypingTrigger = useRef(0);
	const [typingUsers, setTypingUsers] = useState([]);
	const [subscribed, setSubscribed] = useState(false);

	useEffect(() => {
		return () => {
			if (typingTimeout.current) {
				window.clearTimeout(typingTimeout.current);
				typingTimeout.current = null;
			}
			setTypingUsers([]);
		};
	}, [groupId, userName]);

	/**
	 * handle rocket.chat typing message and
	 * maintenance a list of (not) typing users
	 */
	const handleTypingResponse = useCallback(
		([encUsername, isTyping]) => {
			const users = [...typingUsers];
			const typingUsername = decodeUsername(encUsername);
			if (typingUsername === userName) {
				return;
			} else if (isTyping && !typingUsers.includes(typingUsername)) {
				users.push(typingUsername);
			} else if (!isTyping && typingUsers.includes(typingUsername)) {
				users.splice(typingUsers.indexOf(typingUsername), 1);
			}
			setTypingUsers(users);
		},
		[typingUsers, userName]
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
					console.log('TRIGGER');
					window['socket'].sendTypingState(
						SOCKET_COLLECTION.NOTIFY_ROOM,
						[
							`${groupId}/typing`,
							encodeUsername(userName).toLowerCase(),
							true
						]
					);
					lastTypingTrigger.current = now;
				} else {
					console.log('SKIP TRIGGER');
				}

				const cancelTyping = () => {
					window['socket'].sendTypingState(
						SOCKET_COLLECTION.NOTIFY_ROOM,
						[
							`${groupId}/typing`,
							encodeUsername(userName).toLowerCase(),
							false
						]
					);
					typingTimeout.current = null;
					lastTypingTrigger.current = 0;
				};

				if (isCleared) {
					cancelTyping();
				} else {
					typingTimeout.current = setTimeout(() => {
						cancelTyping();
					}, TYPING_TIMEOUT_MS);
				}
			}
		},
		[groupId, subscribed, userName]
	);

	return { subscribeTyping, handleTyping, typingUsers };
}
