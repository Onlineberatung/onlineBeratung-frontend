import * as React from 'react';
import { PropsWithChildren } from 'react';
import { Radio as MuiRadio, FormControlLabel } from '@mui/material';
import clsx from 'clsx';
import './radioButtonMui.styles.scss';

export interface RadioButtonItem {
	type: 'default' | 'box' | 'smaller';
	className?: string;
	inputId: string;
	handleRadioButton: (e: React.ChangeEvent<HTMLInputElement>) => void;
	name: string;
	value: string;
	checked?: boolean;
	onKeyDown?: (...args: any[]) => void;
}

export const RadioButtonMui = ({
	type,
	className,
	inputId,
	handleRadioButton,
	name,
	value,
	checked,
	onKeyDown,
	children
}: PropsWithChildren<RadioButtonItem>) => {
	return (
		<div
			className={clsx(
				`radioButtonMui radioButtonMui--${type}`,
				className
			)}
		>
			<FormControlLabel
				control={
					<MuiRadio
						id={inputId}
						name={name}
						value={value}
						checked={checked}
						onChange={handleRadioButton}
						onKeyDown={onKeyDown}
					/>
				}
				label={children}
			/>
		</div>
	);
};
