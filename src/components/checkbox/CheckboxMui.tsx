import * as React from 'react';
import { MouseEvent, KeyboardEvent, PropsWithChildren } from 'react';
import { Checkbox as MuiCheckbox, FormControlLabel } from '@mui/material';
import './checkboxMui.styles.scss';

export interface CheckboxItem {
	inputId: string;
	name: string;
	labelId: string;
	labelClass?: string;
	label?: string;
	description?: string;
	value?: string;
	checked: boolean;
	checkboxHandle: (
		e:
			| MouseEvent<HTMLInputElement | SVGSVGElement>
			| KeyboardEvent<HTMLInputElement>
	) => void;
	onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

export const CheckboxMui = ({
	checkboxHandle,
	onKeyDown,
	checked,
	inputId,
	name,
	value,
	label,
	labelId,
	labelClass,
	description,
	children
}: PropsWithChildren<CheckboxItem>) => {
	const labelContent = label ? (
		<span>
			{label}
			{description && (
				<>
					<br />
					{description}
				</>
			)}
		</span>
	) : (
		<>
			{children}
			{description && (
				<>
					<br />
					{description}
				</>
			)}
		</>
	);

	return (
		<div className="checkboxMui__wrapper formWrapper__inputRow">
			<FormControlLabel
				control={
					<MuiCheckbox
						id={inputId}
						name={name}
						value={value}
						checked={checked}
						onChange={checkboxHandle as any}
						onKeyDown={onKeyDown}
					/>
				}
				label={labelContent}
				id={labelId}
				className={labelClass}
			/>
		</div>
	);
};
