import * as React from 'react';
import { createContext, useState } from 'react';

export const TenantContext = createContext<any>('default');

export function TenantProvider(props) {
	const [tenant, setTenant] = useState({});

	return (
		<TenantContext.Provider value={{ tenant, setTenant }}>
			{props.children}
		</TenantContext.Provider>
	);
}
