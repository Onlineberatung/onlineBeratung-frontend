export interface AppSettingsInterface {
	/** Feature flag to enable SSO on budibase */
	budibaseSSO: boolean;
	/** Feature flag to get calendar link */
	calendarAppUrl: string;
	/** Feature flag to enable walkthrough (false by default here & true in the theme repo) */
	enableWalkThrough: boolean;
	/** Feature flag to enable Video-Termine page */
	disableVideoAppointments: boolean;
	/** Feature flag to enable the multi tenancy with a single domain ex: lands */
	multitenancyWithSingleDomainEnabled: boolean;
	/** Feature flag to enable request to retrieve settings from the tenant service */
	useTenantService: boolean;
	/** Feature flag to enable cluster settings from the api instead of the config file */
	useApiClusterSettings: boolean;
	/** When the Feature flag multitenancyWithSingleDomainEnabled is used we need to know the main subdomain */
	mainTenantSubdomainForSingleDomainMultitenancy?: string;
	/** when enabled shows the overview page  */
	useOverviewPage?: boolean;
}
