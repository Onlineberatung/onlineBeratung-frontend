import { AUTHORITIES, hasUserAuthority } from '../../globalState';
import { ConsultantInformation } from './ConsultantInformation';
import { ConsultantSpokenLanguages } from './ConsultantSpokenLanguages';
import { ConsultantAgencies } from './ConsultantAgencies';
import { AskerConsultingTypeData } from './AskerConsultingTypeData';
import { consultingTypeSelectOptionsSet } from './profileHelpers';
import { AskerRegistration } from './AskerRegistration';
import { ConsultantPrivateData } from './ConsultantPrivateData';
import { AskerAboutMeData } from './AskerAboutMeData';
import { ConsultantStatistics } from './ConsultantStatistics';
import { AbsenceFormular } from './AbsenceFormular';
import { PasswordReset } from '../passwordReset/PasswordReset';
import { TwoFactorAuth } from '../twoFactorAuth/TwoFactorAuth';
import { DeleteAccount } from './DeleteAccount';

export interface TabGroups {
	title: string;
	url: string;
	condition?: (userData, consultingTypes) => boolean;
	elements: SingleComponentType[];
}

export interface TabType {
	title: string;
	url: string;
	condition?: (userData, consultingTypes) => boolean;
	elements: (TabGroups | SingleComponentType)[];
}

export type SingleComponentType = {
	condition?: (userData, consultingTypes) => boolean;
	component: any;
	boxed?: boolean;
	order?: number;
	fullWidth?: boolean;
};

export type TabsType = TabType[];

const routes: TabsType = [
	{
		title: 'Allgemeines',
		url: '/allgemeines',
		elements: [
			{
				title: 'Öffentliche Daten',
				url: '/oeffentlich',
				elements: [
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantInformation
					},
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantSpokenLanguages
					},
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantAgencies
					},
					{
						condition: (userData) =>
							!hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: AskerConsultingTypeData,
						boxed: false,
						order: 2
					},
					{
						condition: (userData, consultingTypes) =>
							!hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							) &&
							consultingTypeSelectOptionsSet(
								userData,
								consultingTypes
							).length > 0,
						component: AskerRegistration,
						order: 3
					}
				]
			},
			{
				title: 'Private Daten',
				url: '/privat',
				elements: [
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantPrivateData
					},
					{
						condition: (userData) =>
							!hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: AskerAboutMeData,
						order: 1
					}
				]
			}
		]
	},
	{
		title: 'Meine Aktivitäten',
		url: '/aktivitaeten',
		condition: (userData) =>
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData),
		elements: [
			{
				title: 'Meine Statistik',
				url: '/statistik',
				elements: [
					{
						component: ConsultantStatistics
					}
				]
			},
			{
				title: 'Meine Abwesenheit',
				url: '/abwesenheit',
				elements: [
					{
						component: AbsenceFormular
					}
				]
			}
		]
	},
	{
		title: 'Sicherheit',
		url: '/sicherheit',
		elements: [
			{
				title: 'Passwort ändern',
				url: '/passwort',
				elements: [
					{
						component: PasswordReset
					}
				]
			},
			{
				title: '2-Faktor-Authentifizierung',
				url: '/2fa',
				elements: [
					{
						condition: (userData) =>
							userData.twoFactorAuth?.isEnabled,
						component: TwoFactorAuth
					}
				]
			},
			{
				condition: (userData) =>
					hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData),
				component: DeleteAccount,
				boxed: false,
				order: 99,
				fullWidth: true
			}
		]
	}
];

export default routes;
