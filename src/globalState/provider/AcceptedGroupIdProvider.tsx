import * as React from 'react';
import { createContext, useState } from 'react';

export let AcceptedGroupId: string;

export const AcceptedGroupIdContext = createContext(null);

export function AcceptedGroupIdProvider(props) {
	const [acceptedGroupId, setAcceptedGroupId] = useState(null);

	return (
		<AcceptedGroupIdContext.Provider
			value={{ acceptedGroupId, setAcceptedGroupId }}
		>
			{props.children}
		</AcceptedGroupIdContext.Provider>
	);
}
