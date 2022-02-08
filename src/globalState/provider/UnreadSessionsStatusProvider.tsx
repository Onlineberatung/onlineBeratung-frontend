import * as React from 'react';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

type UnreadSessionsStatusType = {
	mySessions: number;
	newDirectMessage: boolean;
	resetedAnimations: boolean;
	initialAnimation: boolean;
};

type UnreadSessionsStatusContextType = {
	unreadSessionsStatus: UnreadSessionsStatusType;
	setUnreadSessionsStatus: Dispatch<SetStateAction<UnreadSessionsStatusType>>;
};

export const UnreadSessionsStatusContext =
	createContext<UnreadSessionsStatusContextType | null>(null);

export function UnreadSessionsStatusProvider(props) {
	const [unreadSessionsStatus, setUnreadSessionsStatus] =
		useState<UnreadSessionsStatusType>({
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
