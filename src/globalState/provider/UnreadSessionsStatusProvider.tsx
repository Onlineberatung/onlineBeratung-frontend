import * as React from 'react';
import { createContext, useState } from 'react';

export let UnreadSessionsStatus: string;

export const UnreadSessionsStatusContext = createContext(null);

export function UnreadSessionsStatusProvider(props) {
	const [unreadSessionsStatus, setUnreadSessionsStatus] = useState({
		sessions: '0'
	});

	return (
		<UnreadSessionsStatusContext.Provider
			value={{ unreadSessionsStatus, setUnreadSessionsStatus }}
		>
			{props.children}
		</UnreadSessionsStatusContext.Provider>
	);
}
