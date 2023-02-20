import {
	AppConfigInterface,
	AUTHORITIES,
	hasUserAuthority
} from '../../globalState';
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
import { EnableWalkthrough } from './EnableWalkthrough';
import { COLUMN_LEFT, COLUMN_RIGHT, TabsType } from '../../utils/tabsHelper';
import { isDesktop } from 'react-device-detect';
import { OverviewBookings } from './OverviewMobile/Bookings';
import { OverviewSessions } from './OverviewMobile/Sessions';
import { profileRoutesSettings } from './profileSettings.routes';
import { profileRoutesHelp } from './profileHelp.routes';
import { ConsultantLiveChatAvailability } from './ConsultantLiveChatAvailability';
import { TenantDataInterface } from '../../globalState/interfaces/TenantDataInterface';

const shouldShowOverview = (useOverviewPage: boolean) =>
	useOverviewPage && !isDesktop;

const profileRoutes = (
	settings: AppConfigInterface,
	tenant: TenantDataInterface,
	selectableLocales: string[]
): TabsType => [
	{
		title: 'profile.routes.general.title',
		url: '/allgemeines',
		elements: [
			{
				condition: () => shouldShowOverview(settings.useOverviewPage),
				title: 'Overview',
				url: '/overview',
				elements: [
					{
						condition: () =>
							shouldShowOverview(settings.useOverviewPage),
						boxed: false,
						component: OverviewSessions
					},
					{
						condition: () =>
							shouldShowOverview(settings.useOverviewPage),
						component: OverviewBookings,
						boxed: false
					}
				]
			},
			{
				title: 'profile.routes.general.public',
				url: '/oeffentlich',
				elements: [
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantInformation,
						column: COLUMN_LEFT
					},
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantSpokenLanguages,
						column: COLUMN_RIGHT
					},
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantAgencies,
						column: COLUMN_LEFT
					},
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							) && settings.enableWalkthrough,
						component: EnableWalkthrough,
						column: COLUMN_LEFT
					},
					{
						condition: (userData) =>
							!hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: AskerConsultingTypeData,
						boxed: false,
						order: 2,
						column: COLUMN_RIGHT
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
						order: 3,
						column: COLUMN_RIGHT
					}
				]
			},
			{
				title: 'profile.routes.general.privat',
				url: '/privat',
				elements: [
					{
						condition: (userData) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: ConsultantPrivateData,
						column: COLUMN_RIGHT
					},
					{
						condition: (userData) =>
							!hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							),
						component: AskerAboutMeData,
						order: 1,
						column: COLUMN_LEFT
					}
				]
			}
		]
	},
	{
		title: 'profile.routes.activities.title',
		url: '/aktivitaeten',
		condition: (userData) =>
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData),
		elements: [
			{
				title: 'profile.routes.activities.statistics',
				url: '/statistik',
				elements: [
					{
						component: ConsultantStatistics,
						condition: () =>
							!!tenant?.settings?.featureStatisticsEnabled,
						column: COLUMN_LEFT
					}
				]
			},
			{
				title: 'profile.routes.activities.availability',
				url: '/verfuegbarkeit',
				elements: [
					{
						component: ConsultantLiveChatAvailability,
						column: COLUMN_RIGHT,
						condition: (userData, consultingTypes) =>
							hasUserAuthority(
								AUTHORITIES.CONSULTANT_DEFAULT,
								userData
							) &&
							userData.hasAnonymousConversations &&
							userData.agencies.some(
								(agency) =>
									(consultingTypes ?? []).find(
										(consultingType) =>
											consultingType.id ===
											agency.consultingType
									)?.isAnonymousConversationAllowed
							)
					}
				]
			},
			{
				title: 'profile.routes.activities.absence',
				url: '/abwesenheit',
				elements: [
					{
						component: AbsenceFormular,
						column: tenant?.settings?.featureStatisticsEnabled
							? COLUMN_RIGHT
							: COLUMN_LEFT
					}
				]
			}
		]
	},
	{
		title: 'profile.routes.settings.title',
		url: '/einstellungen',
		elements: profileRoutesSettings(selectableLocales)
	},
	{
		title: 'profile.routes.help.title',
		url: '/hilfe',
		elements: profileRoutesHelp()
	}
];

export default profileRoutes;
