import * as React from 'react';
import { createContext, useState, useContext, useCallback } from 'react';
import {
	TenantDataInterface,
	TenantDataSettingsInterface
} from '../interfaces/TenantDataInterface';
// Make tenant available globally to be used on other files that are just js context
const tenantSettings: Partial<TenantDataSettingsInterface> = {};

export const TenantContext = createContext<{
	tenant: TenantDataInterface;
	setTenant(tenant: TenantDataInterface): void;
}>(null);

export function TenantProvider(props) {
	const [tenant, setTenant] = useState<TenantDataInterface>();

	const setSettings = useCallback((tenant) => {
		Object.assign(tenantSettings, tenant.settings);
		setTenant(tenant);
	}, []);

	return (
		<TenantContext.Provider value={{ tenant, setTenant: setSettings }}>
			{props.children}
		</TenantContext.Provider>
	);
}

export function useTenant() {
	return useContext(TenantContext).tenant;
}

export const getTenantSettings = () => {
	return tenantSettings;
};
