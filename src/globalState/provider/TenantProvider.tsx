import * as React from 'react';
import { createContext, useState } from 'react';
import { TenantDataInterface } from '../interfaces/TenantInterface';

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
	const [tenant, setTenant] =
		useState<TenantDataInterface>(initialTenantProps);

	return (
		<TenantContext.Provider value={{ tenant, setTenant }}>
			{props.children}
		</TenantContext.Provider>
	);
}
