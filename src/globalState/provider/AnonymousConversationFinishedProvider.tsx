import * as React from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import { UserDataContext } from './UserDataProvider';
import { AUTHORITIES, hasUserAuthority } from '../helpers/stateHelpers';

export const AnonymousConversationFinishedContext = createContext<any>(null);

export function AnonymousConversationFinishedProvider(props) {
	const { userData } = useContext(UserDataContext);
	const [anonymousConversationFinished, setAnonymousConversationFinished] =
		useState<string>(null);

	// Temporary fix until refactoring because this state is only relevant for RS.
	const handleAnonymousConversationFinished = useCallback(
		(state) => {
			if (hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)) {
				setAnonymousConversationFinished(state);
			}
		},
		[userData]
	);

	return (
		<AnonymousConversationFinishedContext.Provider
			value={{
				anonymousConversationFinished,
				setAnonymousConversationFinished:
					handleAnonymousConversationFinished
			}}
		>
			{props.children}
		</AnonymousConversationFinishedContext.Provider>
	);
}
