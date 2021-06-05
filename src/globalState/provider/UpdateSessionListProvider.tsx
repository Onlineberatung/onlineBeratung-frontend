import * as React from 'react';
import { createContext, useState } from 'react';

export let UpdateSessionList: boolean;

export const UpdateSessionListContext = createContext<any>(null);

export function UpdateSessionListProvider(props) {
	const [updateSessionList, setUpdateSessionList] = useState(false);

	return (
		<UpdateSessionListContext.Provider
			value={{ updateSessionList, setUpdateSessionList }}
		>
			{props.children}
		</UpdateSessionListContext.Provider>
	);
}
