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
	description?: string;
	id: string;
	name: string;
	postcode: string;
	teamAgency: boolean;
}
