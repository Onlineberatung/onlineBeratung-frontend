import { ConsultingTypeInterface } from './ConsultingTypeInterface';
import { TWO_FACTOR_TYPES } from '../../components/twoFactorAuth/TwoFactorAuth';

export interface UserDataInterface {
	absenceMessage?: string;
	absent?: boolean;
	agencies: AgencyDataInterface[];
	appointmentFeatureEnabled?: boolean;
	consultingTypes?: { [consultingType: number]: ConsultingTypeDataInterface };
	displayName?: string;
	e2eEncryptionEnabled: boolean;
	email?: string;
	emailToggles: { name: string; state: boolean }[];
	firstName?: string;
	formalLanguage: boolean;
	grantedAuthorities: [string];
	hasAnonymousConversations: boolean;
	hasArchive: boolean;
	inTeamAgency: boolean;
	isDisplayNameEditable: boolean;
	isWalkThroughEnabled?: boolean;
	languages?: string[];
	lastName?: string;
	preferredLanguage: string;
	twoFactorAuth?: TwoFactorAuthInterface;
	userId: string;
	userName: string;
	termsAndConditionsConfirmation: string;
	dataPrivacyConfirmation: string;
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
	tenantId?: number;
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
	type?: typeof TWO_FACTOR_TYPES[keyof typeof TWO_FACTOR_TYPES];
}

export interface AgencyLanguagesInterface {
	languages: string[];
}
