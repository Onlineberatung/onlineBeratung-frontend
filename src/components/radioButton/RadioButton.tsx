import * as React from 'react';
import './radioButton.styles';

export interface RadioButtonItem {
	inputId: string;
	name: string;
	label: string;
	checked: boolean;
}

export const RadioButton = (props) => {
	return (
		<div className="radioButton">
			<div className="radioButton__contentWrapper">
				<input
					onClick={props.handleRadioButton}
					id={props.inputId}
					className="radioButton__input"
					type="radio"
					name={props.name}
					value={props.value}
					defaultChecked={props.checked}
				/>
				<label className="radioButton__label" htmlFor={props.inputId}>
					{props.label}
				</label>
			</div>
		</div>
	);
};
