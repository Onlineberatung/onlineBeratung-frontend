import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch as MuiSwitch, SwitchProps as MuiSwitchProps } from '@mui/material';
import { Text } from '../text/Text';
import './switch-mui.styles.scss';

interface SwitchMuiProps extends Omit<MuiSwitchProps, 'onChange'> {
	titleKey: string;
	descriptionKey?: string;
	// react-switch uses (checked, event, id) signature
	onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>, id?: string) => void;
	// Additional react-switch props for compatibility
	onColor?: string;
	offColor?: string;
	width?: number;
	height?: number;
	handleDiameter?: number;
	boxShadow?: string;
	activeBoxShadow?: string;
	uncheckedIcon?: boolean | React.ReactNode;
	checkedIcon?: boolean | React.ReactNode;
}

/**
 * MUI Switch wrapper component that maintains API compatibility with react-switch
 * while using MUI Switch underneath
 */
export const SwitchMui = ({ 
	titleKey, 
	descriptionKey, 
	onChange,
	checked,
	// Ignore react-switch specific styling props (handled by CSS)
	onColor,
	offColor,
	width,
	height,
	handleDiameter,
	boxShadow,
	activeBoxShadow,
	uncheckedIcon,
	checkedIcon,
	...props 
}: SwitchMuiProps) => {
	const { t } = useTranslation();

	// Convert react-switch onChange signature to MUI onChange signature
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			onChange(event.target.checked, event, event.target.id);
		}
	};

	return (
		<div className="mb--2 switch-mui-wrapper">
			<div className="flex flex--jc-sb">
				<Text text={t(titleKey)} type="standard" />
				<MuiSwitch
					className="mr--1 switch-mui"
					checked={checked}
					onChange={handleChange}
					{...props}
				/>
			</div>
			{descriptionKey && (
				<Text
					text={t(descriptionKey)}
					type="infoMedium"
					className="switch-mui-description"
				/>
			)}
		</div>
	);
};
