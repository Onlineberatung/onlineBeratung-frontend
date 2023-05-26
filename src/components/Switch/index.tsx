import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactSwitch from 'react-switch';
import { ReactSwitchProps } from 'react-switch';
import { Text } from '../text/Text';
import styles from './switch.module.scss';

interface SwitchProps extends ReactSwitchProps {
	titleKey: string;
	descriptionKey?: string;
}

export const Switch = ({ titleKey, descriptionKey, ...props }: SwitchProps) => {
	const { t } = useTranslation();

	return (
		<div className="mb--2">
			<div className="flex flex--jc-sb ">
				<Text text={t(titleKey)} type="standard" />
				<ReactSwitch
					className="mr--1"
					uncheckedIcon={false}
					checkedIcon={false}
					width={48}
					height={26}
					onColor="#0A882F"
					offColor="#8C878C"
					boxShadow="0px 1px 4px rgba(0, 0, 0, 0.6)"
					handleDiameter={27}
					activeBoxShadow="none"
					{...props}
				/>
			</div>
			{descriptionKey && (
				<Text
					text={t(descriptionKey)}
					type="infoMedium"
					className={styles.description}
				/>
			)}
		</div>
	);
};
