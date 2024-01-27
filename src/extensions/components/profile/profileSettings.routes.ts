import { hasUserAuthority, AUTHORITIES } from '../../../../';
import { AppConfigInterface } from '../../../globalState/interfaces';
import { PasswordReset } from '../../../components/passwordReset/PasswordReset';
import { ConsultantNotifications } from '../../../components/profile/ConsultantNotifications';
import { DeleteAccount } from '../../../components/profile/DeleteAccount';
import { TwoFactorAuth } from '../../../components/twoFactorAuth/TwoFactorAuth';
import {
	TabGroups,
	SingleComponentType,
	COLUMN_LEFT,
	COLUMN_RIGHT
} from '../../../utils/tabsHelper';

export const profileRoutesSettings = (
	_selectableLocales: string[],
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
		condition: (userData) =>
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData),
		component: DeleteAccount,
		boxed: false,
		order: 99,
		fullWidth: true
	}
];
