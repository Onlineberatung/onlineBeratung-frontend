export interface UserDataInterface {
	formalLanguage: boolean;
	absenceMessage?: string;
	absent: boolean;
	agencies: [AgencyDataInterface];
	email?: string;
	firstName?: string;
	grantedAuthorities: [string];
	inTeamAgency: boolean;
	lastName?: string;
	userId: string;
	userName: string;
	userRoles: [string];
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
}
