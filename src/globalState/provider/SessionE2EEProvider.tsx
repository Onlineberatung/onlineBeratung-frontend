import * as React from 'react';
import { createContext, FC, useContext } from 'react';
import { useE2EE, UseE2EEParams } from '../../hooks/useE2EE';
import { ActiveSessionContext } from './ActiveSessionProvider';

export const SessionE2EEContext = createContext<
	Omit<UseE2EEParams, 'ready'> & {
		feedback: Omit<UseE2EEParams, 'ready'>;
	}
>(null);

export const SessionE2EEProvider: FC = ({ children }) => {
	const { activeSession } = useContext(ActiveSessionContext);
	const { ready, ...e2eeParams } = useE2EE(activeSession?.rid);
	const { ready: feedbackReady, ...feedbackE2EEParams } = useE2EE(
		activeSession.item?.feedbackGroupId
	);

	if (!ready || !feedbackReady) {
		return null;
	}

	return (
		<SessionE2EEContext.Provider
			value={{ ...e2eeParams, feedback: feedbackE2EEParams }}
		>
			{children}
		</SessionE2EEContext.Provider>
	);
};
