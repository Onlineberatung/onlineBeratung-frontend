import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../text/Text';
import styles from './styles.module.scss';

export const NotificationDenied = () => {
	const { t } = useTranslation();

	return (
		<div className={styles.container}>
			<Text
				type="infoMedium"
				text={t('profile.browserNotifications.denied.message')}
			/>
		</div>
	);
};
