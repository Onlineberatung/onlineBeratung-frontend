import * as React from 'react';
import { createContext, useState, useContext } from 'react';
import { TenantDataInterface } from '../interfaces/TenantDataInterface';

export const TenantContext = createContext<{
	tenant: TenantDataInterface;
	setTenant(tenant: TenantDataInterface): void;
}>(null);

export function TenantProvider(props) {
	const [tenant, setTenant] = useState<TenantDataInterface>();

	return (
		<TenantContext.Provider value={{ tenant, setTenant }}>
			{props.children}
		</TenantContext.Provider>
	);
}

export function useTenant() {
	return useContext(TenantContext).tenant;
}
