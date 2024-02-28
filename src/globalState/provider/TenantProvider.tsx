import * as React from 'react';
import { createContext, useState, useContext, useCallback } from 'react';
import { setTenantSettings } from '../../utils/tenantSettingsHelper';
import { TenantDataInterface } from '../interfaces';

export const TenantContext = createContext<{
	tenant: TenantDataInterface;
	setTenant(tenant: TenantDataInterface): void;
}>(null);

export function TenantProvider(props) {
	const [tenant, setTenant] = useState<TenantDataInterface>();

	const setSettings = useCallback((tenant) => {
		setTenantSettings(tenant.settings);
		setTenant(tenant);
	}, []);

	return (
		<TenantContext.Provider value={{ tenant, setTenant: setSettings }}>
			{props.children}
		</TenantContext.Provider>
	);
}

export function useTenant() {
	return useContext(TenantContext)?.tenant || null;
}
