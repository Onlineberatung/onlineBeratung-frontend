import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, BUTTON_TYPES } from '../../../button/Button';
import { Text } from '../../../text/Text';
import { ReactComponent as PlusIcon } from '../../../../resources/img/icons/plus-mui.svg';
import { SetEmailModal } from '../SetEmailModal';
import styles from './styles.module.scss';

export const NoEmailSet = () => {
	const { t } = useTranslation();
	const [isOverlayActive, setIsOverlayActive] = useState(false);

	return (
		<div className={styles.container}>
			<Text
				type="infoMedium"
				text={t('profile.notifications.noEmail.info')}
			/>

			<Button
				className={styles.button}
				buttonHandle={() => setIsOverlayActive(true)}
				item={{
					label: t('profile.notifications.noEmail.button'),
					type: BUTTON_TYPES.TERTIARY,
					icon: <PlusIcon />
				}}
			/>

			{isOverlayActive && (
				<SetEmailModal onClose={() => setIsOverlayActive(false)} />
			)}
		</div>
	);
};
