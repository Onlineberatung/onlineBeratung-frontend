import * as React from 'react';
import { createContext, useState } from 'react';

export const WebsocketConnectionDeactivatedContext = createContext<any>(null);

export function WebsocketConnectionDeactivatedProvider(props) {
	const [websocketConnectionDeactivated, setWebsocketConnectionDeactivated] =
		useState<boolean>(null);

	return (
		<WebsocketConnectionDeactivatedContext.Provider
			value={{
				websocketConnectionDeactivated,
				setWebsocketConnectionDeactivated
			}}
		>
			{props.children}
		</WebsocketConnectionDeactivatedContext.Provider>
	);
}
