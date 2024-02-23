export interface TenantDataInterface {
	id: number | null;
	name: string;
	theming: {
		logo: string;
		associationLogo: string | null;
		favicon: string;
		primaryColor: string;
		secondaryColor: string;
	};
	content: {
		impressum: string;
		privacy: string;
		termsAndConditions: string;
		claim: string;
		dataPrivacyConfirmation: string;
		termsAndConditionsConfirmation: string;
		renderedPrivacy: string;
	};
	settings?: TenantDataSettingsInterface;
}

export interface TenantDataSettingsInterface {
	activeLanguages: string[];
	featureAppointmentsEnabled: boolean;
	featureDemographicsEnabled: boolean;
	featureGroupChatV2Enabled: boolean;
	featureStatisticsEnabled: boolean;
	featureToolsEnabled: boolean;
	featureToolsOICDToken: string;
	featureTopicsEnabled: boolean;
	topicsInRegistrationEnabled: boolean;
	featureAttachmentUploadDisabled: boolean;
}
