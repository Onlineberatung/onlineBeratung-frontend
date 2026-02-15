import React from 'react';
import { Switch as MuiSwitch, SwitchProps as MuiSwitchProps } from '@mui/material';
import '../Switch/switch-mui.styles.scss';

interface SimpleSwitchProps extends Omit<MuiSwitchProps, 'onChange'> {
	// react-switch uses (checked, event, id) signature
	onChange?: (checked: boolean, event?: React.ChangeEvent<HTMLInputElement>, id?: string) => void;
	// Additional react-switch props for compatibility (ignored, handled by CSS)
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
 * Simple MUI Switch wrapper that maintains API compatibility with react-switch
 * For use without title/description wrapper
 */
const SwitchSimple = ({ 
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
}: SimpleSwitchProps) => {

	// Convert react-switch onChange signature to MUI onChange signature
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			// react-switch signature: onChange(checked, event, id)
			onChange(event.target.checked, event, event.target.id);
		}
	};

	return (
		<MuiSwitch
			className="switch-mui"
			checked={checked}
			onChange={handleChange}
			{...props}
		/>
	);
};

export default SwitchSimple;
