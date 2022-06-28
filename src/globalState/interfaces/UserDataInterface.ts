import { ConsultingTypeInterface } from './ConsultingTypeInterface';

export interface UserDataInterface {
	absenceMessage?: string;
	absent: boolean;
	agencies: AgencyDataInterface[];
	consultingTypes?: [
		{ [consultingType: number]: ConsultingTypeDataInterface }
	];
	email?: string;
	firstName?: string;
	formalLanguage: boolean;
	grantedAuthorities: [string];
	hasAnonymousConversations: boolean;
	inTeamAgency: boolean;
	lastName?: string;
	userId: string;
	userName: string;
	e2eEncryptionEnabled: boolean;
	twoFactorAuth?: TwoFactorAuthInterface;
	languages?: string[];
	isWalkThroughEnabled?: boolean;
}

export interface ConsultantDataInterface
	extends Omit<UserDataInterface, 'userId'> {
	consultantId: string;
	agencies: (AgencyDataInterface & {
		consultingTypeRel?: ConsultingTypeInterface;
	})[];
}

export interface AgencyDataInterface {
	city: string;
	consultingType: number;
	description: string;
	id: number;
	name: string;
	offline: boolean;
	postcode: string;
	teamAgency: boolean;
	url?: string;
	external?: boolean;
}

export interface ConsultingTypeDataInterface {
	agency: AgencyDataInterface;
	isRegistered: boolean;
	sessionData: Object;
}

export interface TwoFactorAuthInterface {
	isEnabled: boolean;
	isActive: boolean;
	secret: string;
	qrCode: string;
	isShown: boolean;
}

export interface AgencyLanguagesInterface {
	languages: string[];
}
