import * as React from 'react';
import { createContext, useState, useContext, useCallback, FC } from 'react';
import { setTenantSettings } from '../../utils/tenantSettingsHelper';
import { TenantDataInterface } from '../interfaces/TenantDataInterface';

export const TenantContext = createContext<{
	tenant: TenantDataInterface;
	setTenant(tenant: TenantDataInterface): void;
}>(null);

export const TenantProvider: FC = ({ children }) => {
	const [tenant, setTenant] = useState<TenantDataInterface>();

	const setSettings = useCallback((tenant) => {
		setTenantSettings(tenant.settings);
		setTenant(tenant);
	}, []);

	return (
		<TenantContext.Provider value={{ tenant, setTenant: setSettings }}>
			{children}
		</TenantContext.Provider>
	);
};

export function useTenant() {
	return useContext(TenantContext)?.tenant || null;
}
