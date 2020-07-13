export interface UserDataInterface {
	absenceMessage?: string;
	absent: boolean;
	agencies: [AgencyDataInterface];
	consultingTypes?: [
		{ [consultingType: number]: ConsultingTypeDataInterface }
	];
	email?: string;
	firstName?: string;
	formalLanguage: boolean;
	grantedAuthorities: [string];
	inTeamAgency: boolean;
	lastName?: string;
	userId: string;
	userName: string;
	userRoles: [string];
}

export interface AgencyDataInterface {
	description?: string;
	id: string;
	name: string;
	postcode: string;
	teamAgency: boolean;
}

export interface ConsultingTypeDataInterface {
	agency: AgencyDataInterface;
	isRegistered: boolean;
	sessionData: Object;
}
