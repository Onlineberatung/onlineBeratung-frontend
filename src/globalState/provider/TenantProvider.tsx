import * as React from 'react';
import { createContext, useState } from 'react';

interface TenantProps {
	subdomain: string;
	host: string;
	protocol: string;
	origin: string;
	id: number;
	name: string;
	slogan: string;
	primaryColor: string;
	secondaryColor: string;
	logo: string;
}

const initialTenantProps = {
	subdomain: '',
	host: '',
	protocol: '',
	origin: '',
	id: undefined,
	name: '',
	slogan: '',
	primaryColor: '',
	secondaryColor: '',
	logo: ''
};

export const TenantContext = createContext<any>({});

export function TenantProvider(props) {
	const [tenant, setTenant] = useState<TenantProps>(initialTenantProps);

	return (
		<TenantContext.Provider value={{ tenant, setTenant }}>
			{props.children}
		</TenantContext.Provider>
	);
}
