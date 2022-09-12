export interface ServerAppConfigInterface {
	[key: string]: ServerAppConfigValueInterface;
}

interface ServerAppConfigValueInterface {
	value: boolean;
	readOnly: boolean;
}
