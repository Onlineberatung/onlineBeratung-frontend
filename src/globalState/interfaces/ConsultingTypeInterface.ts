export type RequiredComponentsInterface = {
	age?: {
		isEnabled: boolean;
		options: Array<{ value: string; label: string }>;
	};
	state?: {
		isEnabled: boolean;
	};
};

export type RegistrationNotesInterface = {
	agencySelection?: string;
	password?: string;
};

export interface ConsultingTypeInterface {
	id: number;
	titles: {
		long: string;
		welcome: string;
	};
	isSetEmailAllowed: boolean;
	requiredComponents?: RequiredComponentsInterface;
	languageFormal: boolean;
	voluntaryComponents?: any[];
	urls: {
		registrationPostcodeFallbackUrl: string;
		requiredAidMissingRedirectUrl: string;
	};
	registration: {
		notes: RegistrationNotesInterface;
	};
}
