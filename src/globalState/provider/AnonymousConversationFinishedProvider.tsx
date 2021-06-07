import * as React from 'react';
import { createContext, useState } from 'react';

export const AnonymousConversationFinishedContext = createContext<any>(null);

export function AnonymousConversationFinishedProvider(props) {
	const [
		anonymousConversationFinished,
		setAnonymousConversationFinished
	] = useState<boolean>(null);

	return (
		<AnonymousConversationFinishedContext.Provider
			value={{
				anonymousConversationFinished,
				setAnonymousConversationFinished
			}}
		>
			{props.children}
		</AnonymousConversationFinishedContext.Provider>
	);
}
