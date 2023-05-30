import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserDataContext } from '../../../globalState';
import {
	browserNotificationsSettings,
	saveBrowserNotificationsSettings
} from '../../../utils/notificationHelpers';
import { Headline } from '../../headline/Headline';
import { Switch } from '../../Switch';
import { Text } from '../../text/Text';
import { NotificationDenied } from './NotificationDenied';
import styles from './styles.module.scss';

export const BrowserNotification = () => {
	const { isFirstVisit } = useContext(UserDataContext);
	const [localBrowserSettings, setNotificationsSettings] = useState(
		browserNotificationsSettings()
	);
	const isEnabled =
		localBrowserSettings.enabled && Notification.permission === 'granted';
	const { t } = useTranslation();
	const [checked, setChecked] = useState(isEnabled);

	useEffect(() => {
		setTimeout(() => {
			saveBrowserNotificationsSettings({ visited: true });
		}, 5000);
	}, []);

	const onChange = useCallback((value) => {
		if (Notification.permission === 'granted') {
			saveBrowserNotificationsSettings({ enabled: value });
			setNotificationsSettings(browserNotificationsSettings());
			setChecked(value);
		} else if (Notification.permission !== 'denied') {
			Notification.requestPermission().then((permission) => {
				saveBrowserNotificationsSettings({ enabled: true });
				setChecked(permission === 'granted');
			});
		}
	}, []);

	const onChangeSetting = useCallback((key, value) => {
		setNotificationsSettings((prev) => ({ ...prev, [key]: value }));
		saveBrowserNotificationsSettings({ [key]: value });
	}, []);

	return (
		<div className="notifications__content">
			<div className="profile__content__title">
				<div className={styles.badgeTitleContainer}>
					<Headline
						text={t('profile.browserNotifications.title')}
						semanticLevel="5"
					/>
					{isFirstVisit &&
						!browserNotificationsSettings().visited && (
							<span className={styles.badge} />
						)}
				</div>
				<Text
					text={t('profile.browserNotifications.description')}
					type="standard"
					className="tertiary"
				/>
			</div>

			{Notification.permission === 'denied' ? (
				<NotificationDenied />
			) : (
				<Switch
					titleKey="profile.browserNotifications.toggle"
					checked={!!checked}
					onChange={onChange}
				/>
			)}

			{checked && (
				<>
					<hr />
					<Switch
						titleKey="profile.browserNotifications.initialEnquiry.title"
						checked={!!localBrowserSettings.initialEnquiry}
						onChange={(checked) =>
							onChangeSetting('initialEnquiry', checked)
						}
					/>
					<Switch
						titleKey="profile.browserNotifications.newMessage.title"
						descriptionKey="profile.browserNotifications.newMessage.description"
						checked={!!localBrowserSettings.newMessage}
						onChange={(checked) =>
							onChangeSetting('newMessage', checked)
						}
					/>
				</>
			)}
		</div>
	);
};
