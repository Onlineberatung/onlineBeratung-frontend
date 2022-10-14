import * as React from 'react';
import { ReactComponent as CheckmarkIcon } from '../../resources/img/icons/checkmark.svg';
import './checkbox.styles';

export interface CheckboxItem {
	inputId: string;
	name: string;
	labelId: string;
	labelClass?: string;
	label: string;
	value?: string;
	description?: string;
	checked: boolean;
}

export const Checkbox = (props) => {
	const checkboxItem = props.item;

	return (
		<div className="checkbox__wrapper formWrapper__inputRow">
			<input
				onClick={(e) => props.checkboxHandle(e)}
				onKeyPress={(e) => props.onKeyPress(e)}
				id={checkboxItem.inputId}
				className="checkbox__input"
				type="checkbox"
				name={checkboxItem.name}
				value={checkboxItem.value}
				defaultChecked={checkboxItem.checked}
			/>
			{checkboxItem.checked && (
				<CheckmarkIcon
					className="checkbox__icon"
					onClick={(e) => {
						const checkboxElement = document.getElementById(
							checkboxItem.inputId
						) as HTMLInputElement;
						checkboxElement.checked = !checkboxElement.checked;
						props.checkboxHandle(e);
					}}
				/>
			)}
			<label
				id={checkboxItem.labelId}
				className={`checkbox__label ${checkboxItem.labelClass}`}
				htmlFor={checkboxItem.inputId}
				dangerouslySetInnerHTML={{
					__html: `${checkboxItem.label}${
						checkboxItem.description
							? `<br>${checkboxItem.description}`
							: ''
					}`
				}}
			/>
		</div>
	);
};
