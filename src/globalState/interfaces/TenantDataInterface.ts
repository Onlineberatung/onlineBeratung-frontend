export interface TenantDataInterface {
	id: number | null;
	name: string;
	theming: {
		logo: string;
		favicon: string;
		primaryColor: string;
		secondaryColor: string;
	};
	content: {
		impressum: string;
		privacy: string;
		termsAndConditions: string;
		claim: string;
	};
	settings?: {
		topicsInRegistrationEnabled: boolean;
		featureTopicsEnabled: boolean;
	};
}
