import * as React from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import { UserDataContext } from '../context/UserDataContext';
import { AUTHORITIES, hasUserAuthority } from '../helpers/stateHelpers';
import useUpdatingRef from '../../hooks/useUpdatingRef';

export const AnonymousConversationFinishedContext = createContext<any>(null);

export function AnonymousConversationFinishedProvider(props) {
	const { userData } = useContext(UserDataContext);
	const userDataRef = useUpdatingRef(userData);
	const [anonymousConversationFinished, setAnonymousConversationFinished] =
		useState<string>(null);

	// Temporary fix until refactoring because this state is only relevant for RS.
	const handleAnonymousConversationFinished = useCallback(
		(state) => {
			if (
				hasUserAuthority(
					AUTHORITIES.ANONYMOUS_DEFAULT,
					userDataRef.current
				)
			) {
				setAnonymousConversationFinished(state);
			}
		},
		[userDataRef]
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
