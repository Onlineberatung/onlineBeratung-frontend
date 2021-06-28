import * as React from 'react';
import { createContext, useState } from 'react';

export let UpdateAnonymousEnquiries: boolean;

export const UpdateAnonymousEnquiriesContext = createContext<any>(null);

export function UpdateAnonymousEnquiriesProvider(props) {
	const [updateAnonymousEnquiries, setUpdateAnonymousEnquiries] =
		useState(null);

	return (
		<UpdateAnonymousEnquiriesContext.Provider
			value={{ updateAnonymousEnquiries, setUpdateAnonymousEnquiries }}
		>
			{props.children}
		</UpdateAnonymousEnquiriesContext.Provider>
	);
}
