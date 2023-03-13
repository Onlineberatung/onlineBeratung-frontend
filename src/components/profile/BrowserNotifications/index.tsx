import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	browserNotificationsSettings,
	saveBrowserNotificationsSettings
} from '../../../utils/notificationHelpers';
import { Headline } from '../../headline/Headline';
import { Switch } from '../../Switch';
import { Text } from '../../text/Text';
import { NotificationDenied } from './NotificationDenied';

export const BrowserNotification = () => {
	const [browserNotificationSettings, setNotificationsSettings] = useState(
		browserNotificationsSettings()
	);
	const isEnabled =
		browserNotificationSettings.enabled &&
		Notification.permission === 'granted';
	const { t } = useTranslation();
	const [checked, setChecked] = useState(isEnabled);

	const onChange = useCallback((value) => {
		if (Notification.permission === 'granted') {
			saveBrowserNotificationsSettings({ enabled: value });
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
				<Headline
					text={t('profile.browserNotifications.title')}
					semanticLevel="5"
				/>
				<Text
					text={t('profile.browserNotifications.description')}
					type="infoMedium"
					className="tertiary"
				/>
			</div>

			{Notification.permission === 'denied' ? (
				<NotificationDenied />
			) : (
				<Switch
					titleKey="profile.browserNotifications.toggle"
					checked={checked}
					onChange={onChange}
				/>
			)}

			{checked && (
				<>
					<hr />
					<Switch
						titleKey="profile.browserNotifications.initialEnquiry.title"
						checked={browserNotificationSettings.initialEnquiry}
						onChange={(checked) =>
							onChangeSetting('initialEnquiry', checked)
						}
					/>
					<Switch
						titleKey="profile.browserNotifications.newMessage.title"
						descriptionKey="profile.browserNotifications.newMessage.description"
						checked={browserNotificationSettings.newMessage}
						onChange={(checked) =>
							onChangeSetting('newMessage', checked)
						}
					/>
				</>
			)}
		</div>
	);
};
