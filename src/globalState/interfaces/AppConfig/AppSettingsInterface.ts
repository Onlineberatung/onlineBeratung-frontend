export interface AppSettingsInterface {
	/** Feature flag to enable SSO on budibase */
	budibaseSSO?: boolean;
	/** App setting to get calendar link */
	calendarAppUrl?: string;
	/** App setting to get the link for tools service */
	budibaseUrl?: string;
	/** App setting to get the link for appointment service */
	calcomUrl?: string;
	/** Feature flag to enable walkthrough (false by default here & true in the theme repo) */
	enableWalkthrough?: boolean;
	/** Feature flag to enable Video-Termine page */
	disableVideoAppointments?: boolean;
	/** Feature flag to enable the multi tenancy with a single domain ex: lands */
	multitenancyWithSingleDomainEnabled?: boolean;
	/** Feature flag to enable request to retrieve settings from the tenant service */
	useTenantService: boolean;
	/** Feature flag to enable cluster settings from the api instead of the config file */
	useApiClusterSettings: boolean;
	/** When the Feature flag multitenancyWithSingleDomainEnabled is used we need to know the main subdomain */
	mainTenantSubdomainForSingleDomainMultitenancy?: string;
	/** when enabled shows the overview page  */
	useOverviewPage?: boolean;
	/** feature flag for the documentation  */
	documentationEnabled?: boolean;
	/** when enabled and e2ee is active (see rocket.chat) attachments will be e2e encrypted */
	attachmentEncryption?: boolean;
}
