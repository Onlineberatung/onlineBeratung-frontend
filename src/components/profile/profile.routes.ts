import { AUTHORITIES, hasUserAuthority } from '../../globalState';
import { translate } from '../../utils/translate';
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
import { EnableWalkthrough } from './EnableWalkthrough';
import { config } from '../../resources/scripts/config';
import { Help } from '../help/Help';
import { ConsultantNotifications } from './ConsultantNotifications';
import { COLUMN_LEFT, COLUMN_RIGHT, TabsType } from '../../utils/tabsHelper';

const routes: TabsType = [
	{
		title: translate('profile.routes.general'),
		url: '/allgemeines',
		elements: [
			{
				title: translate('profile.routes.general.public'),
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
							) && config.enableWalkthrough,
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
				title: translate('profile.routes.general.privat'),
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
		title: translate('profile.routes.activities'),
		url: '/aktivitaeten',
		condition: (userData) =>
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData),
		elements: [
			{
				title: translate('profile.routes.activities.statistics'),
				url: '/statistik',
				elements: [
					{
						component: ConsultantStatistics,
						column: COLUMN_LEFT
					}
				]
			},
			{
				title: translate('profile.routes.activities.absence'),
				url: '/abwesenheit',
				elements: [
					{
						component: AbsenceFormular,
						column: COLUMN_RIGHT
					}
				]
			}
		]
	},
	{
		title: translate('profile.routes.notifications'),
		url: '/benachrichtigungen',
		condition: (userData) =>
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData),
		elements: [
			{
				title: translate('profile.routes.notifications.email'),
				url: '/email',
				elements: [
					{
						component: ConsultantNotifications,
						column: COLUMN_LEFT
					}
				]
			}
		]
	},
	{
		title: translate('profile.routes.security'),
		url: '/sicherheit',
		elements: [
			{
				title: translate('profile.routes.security.changePassword'),
				url: '/passwort',
				elements: [
					{
						component: PasswordReset,
						column: COLUMN_LEFT
					}
				]
			},
			{
				title: translate('profile.routes.security.2fa'),
				url: '/2fa',
				elements: [
					{
						condition: (userData) =>
							userData.twoFactorAuth?.isEnabled,
						component: TwoFactorAuth,
						column: COLUMN_RIGHT
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
	},
	{
		title: translate('profile.routes.help'),
		url: '/hilfe',
		elements: [
			{
				title: translate('profile.routes.help.videoCall'),
				url: '/videoCall',
				elements: [
					{
						component: Help,
						column: COLUMN_LEFT
					}
				]
			}
		]
	}
];

export default routes;
