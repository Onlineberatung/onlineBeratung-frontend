import * as React from 'react';
import { createContext, useState } from 'react';

export const AnonymousConversationStartedContext = createContext<any>(null);

export function AnonymousConversationStartedProvider(props) {
	const [anonymousConversationStarted, setAnonymousConversationStarted] =
		useState(null);

	return (
		<AnonymousConversationStartedContext.Provider
			value={{
				anonymousConversationStarted,
				setAnonymousConversationStarted
			}}
		>
			{props.children}
		</AnonymousConversationStartedContext.Provider>
	);
}
