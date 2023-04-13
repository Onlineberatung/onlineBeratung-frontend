// DOB-83: Replace this with auto-generated interfaces from dtsgen.

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

export type RegistrationWelcomeScreenInterface = {
	anonymous: {
		title: string;
		text: string;
	};
};

export interface ConsultingTypeBasicInterface {
	id: number;
	showAskerProfile: boolean;
	titles: {
		default: string;
		short: string;
		long: string;
		welcome: string;
		registrationDropdown: string;
	};
	isAnonymousConversationAllowed: boolean;
	isVideoCallAllowed: boolean;
	isSubsequentRegistrationAllowed: boolean;
	urls: {
		registrationPostcodeFallbackUrl: string;
		requiredAidMissingRedirectUrl: string;
	};
	registration: {
		autoSelectAgency: boolean;
		autoSelectPostcode: boolean;
		notes: RegistrationNotesInterface;
	};
	groupChat: {
		isGroupChat: boolean;
		groupChatRules: [string];
	};
}

export interface ConsultingTypeInterface extends ConsultingTypeBasicInterface {
	description: string;
	slug: string;
	furtherInformation?: {
		label: string;
		url: string;
	};
	requiredComponents?: RequiredComponentsInterface;
	languageFormal: boolean;
	welcomeScreen: RegistrationWelcomeScreenInterface;
}
