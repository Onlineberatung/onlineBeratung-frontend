export interface TenantDataInterface {
	id: number | null;
	name: string;
	subdomain: string;
	host;
	protocol;
	origin;
	theming: {
		logo: string;
		favicon: string;
		primaryColor: string;
		secondaryColor: string;
	};
	content: {
		impressum: string;
		claim: string;
	};
}
