import React, { useCallback, useContext } from 'react';
import './help.styles.scss';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import {
	AUTHORITIES,
	hasUserAuthority,
	NotificationsContext,
	NOTIFICATION_TYPE_SUCCESS,
	UserDataContext
} from '../../globalState';
import { HelpVideoCall } from './HelpVideoCall';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';

interface HelpProps {}
export const Help: React.FC<HelpProps> = () => {
	const settings = useAppConfig();
	const { t: translate } = useTranslation();
	const { addNotification } = useContext(NotificationsContext);
	const { userData } = useContext(UserDataContext);

	const copyLoginLink = useCallback(async () => {
		await copyTextToClipboard(`${settings.urls.toLogin}`, () => {
			addNotification({
				notificationType: NOTIFICATION_TYPE_SUCCESS,
				title: translate('help.videoCall.loginLink.notification.title'),
				text: translate('help.videoCall.loginLink.notification.text')
			});
		});
	}, [addNotification, settings.urls.toLogin, translate]);

	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);
	const isAsker = hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData);

	return (
		<div className="help">
			{isConsultant && (
				<HelpVideoCall
					copyLoginLink={copyLoginLink}
					consultant={true}
				/>
			)}
			{isAsker && (
				<HelpVideoCall
					copyLoginLink={copyLoginLink}
					consultant={false}
				/>
			)}
		</div>
	);
};
