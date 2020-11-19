import * as React from 'react';
import { createContext, useState } from 'react';

export let UnreadSessionsStatus: string;

export const UnreadSessionsStatusContext = createContext(null);

export function UnreadSessionsStatusProvider(props) {
	const [unreadSessionsStatus, setUnreadSessionsStatus] = useState({
		mySessions: 0,
		newDirectMessage: false,
		resetedAnimations: true,
		initialAnimation: true
	});

	return (
		<UnreadSessionsStatusContext.Provider
			value={{ unreadSessionsStatus, setUnreadSessionsStatus }}
		>
			{props.children}
		</UnreadSessionsStatusContext.Provider>
	);
}
