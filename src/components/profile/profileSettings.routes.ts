import { hasUserAuthority, AUTHORITIES } from '../../globalState';
import { AppConfigInterface } from '../../globalState/interfaces';
import {
	COLUMN_LEFT,
	COLUMN_RIGHT,
	SingleComponentType,
	TabGroups
} from '../../utils/tabsHelper';
import { PasswordReset } from '../passwordReset/PasswordReset';
import { TwoFactorAuth } from '../twoFactorAuth/TwoFactorAuth';
import { ConsultantNotifications } from './ConsultantNotifications';
import { DeleteAccount } from './DeleteAccount';
import { Locale } from './Locale';

export const profileRoutesSettings = (
	selectableLocales: string[],
	settings: AppConfigInterface
): (TabGroups | SingleComponentType)[] => [
	{
		title: 'profile.routes.settings.security.title',
		url: '/sicherheit',
		elements: [
			{
				component: PasswordReset,
				column: COLUMN_LEFT,
				order: 1
			},
			{
				condition: (userData) => userData.twoFactorAuth?.isEnabled,
				component: TwoFactorAuth,
				column: COLUMN_LEFT
			}
		]
	},
	{
		title: 'profile.routes.notifications.title',
		url: '/email',
		elements: [
			{
				condition: (userData) =>
					hasUserAuthority(
						AUTHORITIES.CONSULTANT_DEFAULT,
						userData
					) && !settings?.releaseToggles?.enableNewNotifications,
				component: ConsultantNotifications,
				column: COLUMN_RIGHT,
				order: 1
			}
		]
	},
	{
		title: 'profile.routes.display',
		url: '/anzeige',
		elements: [
			{
				condition: () => selectableLocales.length > 1,
				component: Locale,
				column: COLUMN_RIGHT,
				order: 1
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
];
