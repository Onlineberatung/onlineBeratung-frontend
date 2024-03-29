import * as React from 'react';
import classNames from 'classnames';
import './radioButton.styles';
import { PropsWithChildren } from 'react';

export interface RadioButtonItem {
	type: 'default' | 'box' | 'smaller';
	className?: string;
	inputId: string;
	handleRadioButton: (e: React.ChangeEvent<HTMLInputElement>) => void;
	name: string;
	value: string;
	checked?: boolean;
	onKeyDown?: Function;
}

export const RadioButton = ({
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
			className={classNames(
				`radioButton radioButton--${type}`,
				className
			)}
		>
			<div className="radioButton__contentWrapper">
				<input
					onChange={(e) => handleRadioButton(e)}
					id={inputId}
					className="radioButton__input"
					type="radio"
					name={name}
					value={value}
					checked={checked}
					onKeyDown={(e) => (onKeyDown ? onKeyDown(e) : null)}
				/>
				<label className="radioButton__label" htmlFor={inputId}>
					{children}
				</label>
			</div>
		</div>
	);
};
