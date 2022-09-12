export type ServerAppConfigInterface = {
	[key: string]: ServerAppConfigValueInterface;
} & ServerAppConfigCustomInterface;

interface ServerAppConfigCustomInterface {
	mainTenantSubdomainForSingleDomainMultitenancy?: ServerAppConfigValueInterface<string>;
}

interface ServerAppConfigValueInterface<T = boolean> {
	value: T;
	readOnly: boolean;
}
