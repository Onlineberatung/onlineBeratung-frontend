import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ReactComponent as NewWindow } from '../../../resources/img/icons/new-window.svg';
import { Headline } from '../../headline/Headline';
import { Text } from '../../text/Text';
import styles from './styles.module.scss';

export const Documentation = () => {
	const { t } = useTranslation();

	return (
		<div className="notifications__content">
			<div className="profile__content__title">
				<Headline
					text={t('profile.documentation.title')}
					semanticLevel="5"
				/>
				<Text
					text={t('profile.documentation.description')}
					type="infoMedium"
					className="tertiary"
				/>
			</div>

			<Link to="/docs" target="_blank" className={styles.link}>
				<NewWindow
					title={t('profile.documentation.link')}
					aria-label={t('profile.documentation.link')}
				/>{' '}
				{t('profile.documentation.link')}
			</Link>
		</div>
	);
};
