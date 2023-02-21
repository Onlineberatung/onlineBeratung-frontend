import * as React from 'react';
import { createContext, FC, useState } from 'react';

export const AnonymousConversationStartedContext = createContext<any>(null);

export const AnonymousConversationStartedProvider: FC = ({ children }) => {
	const [anonymousConversationStarted, setAnonymousConversationStarted] =
		useState(null);

	return (
		<AnonymousConversationStartedContext.Provider
			value={{
				anonymousConversationStarted,
				setAnonymousConversationStarted
			}}
		>
			{children}
		</AnonymousConversationStartedContext.Provider>
	);
};
