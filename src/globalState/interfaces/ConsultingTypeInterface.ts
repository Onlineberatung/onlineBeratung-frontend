export type RequiredComponentsInterface = {
	age?: any;
	state?: any;
};

export type RegistrationNotesInterface = {
	agencySelection?: string;
	password?: string;
};

export interface ConsultingTypeInterface {
	consultingType: number;
	overline: string;
	welcomeTitle: string;
	isSetEmailAllowed: boolean;
	requiredComponents?: RequiredComponentsInterface;
	useInformal: boolean;
	voluntaryComponents?: any[];
	requiredAidMissingRedirectUrl?: string;
	registrationNotes?: RegistrationNotesInterface;
}
