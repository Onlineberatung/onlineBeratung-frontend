import * as React from 'react';
import { createContext, useState } from 'react';
import { SESSION_LIST_TYPES } from '../../components/session/sessionHelpers';

export let UpdateSessionList: SESSION_LIST_TYPES;

export const UpdateSessionListContext = createContext<any>(null);

export function UpdateSessionListProvider(props) {
	const [updateSessionList, setUpdateSessionList] = useState(null);

	return (
		<UpdateSessionListContext.Provider
			value={{ updateSessionList, setUpdateSessionList }}
		>
			{props.children}
		</UpdateSessionListContext.Provider>
	);
}
