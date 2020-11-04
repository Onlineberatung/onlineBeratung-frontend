import * as React from 'react';
import { createContext, useState } from 'react';

export let StoppedGroupChat: boolean;

export const StoppedGroupChatContext = createContext(null);

export function StoppedGroupChatProvider(props) {
	const [stoppedGroupChat, setStoppedGroupChat] = useState(false);

	return (
		<StoppedGroupChatContext.Provider
			value={{ stoppedGroupChat, setStoppedGroupChat }}
		>
			{props.children}
		</StoppedGroupChatContext.Provider>
	);
}
