import * as React from 'react';
import { ReactComponent as CheckmarkIcon } from '../../resources/img/icons/checkmark.svg';
import './checkbox.styles';
import { MouseEvent, KeyboardEvent, PropsWithChildren } from 'react';

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
	onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const Checkbox = ({
	checkboxHandle,
	onKeyPress,
	checked,
	inputId,
	name,
	value,
	label,
	labelId,
	labelClass,
	description,
	children
}: PropsWithChildren<CheckboxItem>) => (
	<div className="checkbox__wrapper formWrapper__inputRow">
		<div className="checkbox__icon__container">
			{checked && (
				<CheckmarkIcon
					className="checkbox__icon"
					onClick={checkboxHandle}
				/>
			)}
			<input
				onClick={checkboxHandle}
				onKeyPress={onKeyPress || checkboxHandle}
				id={inputId}
				className="checkbox__input"
				type="checkbox"
				name={name}
				value={value}
				defaultChecked={checked}
			/>
		</div>
		<label
			id={labelId}
			className={`checkbox__label ${labelClass}`}
			htmlFor={inputId}
			dangerouslySetInnerHTML={
				label && {
					__html: `${label}${
						description ? `<br />${description}` : ''
					}`
				}
			}
		>
			{!label ? (
				<>
					{children}
					{description && (
						<>
							<br />
							{description}
						</>
					)}
				</>
			) : null}
		</label>
	</div>
);
