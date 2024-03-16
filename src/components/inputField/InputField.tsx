import * as React from 'react';
import { useState } from 'react';
import { Text } from '../text/Text';
import { ReactComponent as ShowPasswordIcon } from '../../resources/img/icons/eye.svg';
import { ReactComponent as HidePasswordIcon } from '../../resources/img/icons/eye-closed.svg';
import './inputField.styles';
import { useTranslation } from 'react-i18next';

export type InputFieldLabelState = 'valid' | 'invalid';

// TODO: clean up interface
export interface InputFieldItem {
	id: string;
	type: string;
	name: string;
	label: string;
	content: string;
	class?: string;
	icon?: JSX.Element;
	infoText?: string;
	maxLength?: number;
	pattern?: string;
	disabled?: boolean;
	postcodeFallbackLink?: string;
	warningLabel?: string;
	warningActive?: boolean;
	labelState?: InputFieldLabelState;
	tabIndex?: number;
}

export interface InputFieldProps {
	item: InputFieldItem;
	inputHandle: Function;
	keyUpHandle?: Function;
	onKeyDown?: Function;
}

export interface GeneratedInputs {
	addictiveDrugs?: string[];
	relation?: string;
	age?: string;
	gender?: string;
	state?: string;
}

// LEGACY COMPONENT, use "Input" instead
export const InputField = (props: InputFieldProps) => {
	const inputItem = props.item;
	const { t: translate } = useTranslation();
	const [showPassword, setShowPassword] = useState(false);

	const handleInputValidation = (e) => {
		const postcode = e.target.value;
		let postcodeValid = true;
		if (inputItem.maxLength) {
			postcodeValid = postcode.length <= inputItem.maxLength;
		}
		if (postcodeValid && postcode.length > 0 && inputItem.pattern) {
			postcodeValid = RegExp(inputItem.pattern).test(postcode);
		}
		if (postcodeValid) {
			props.inputHandle(e);
		}
	};

	const handleKeyUp = (e) => {
		if (props.keyUpHandle) {
			props.keyUpHandle(e);
		}
	};

	return (
		<div
			className={`inputField ${
				inputItem.icon ? `inputField--withIcon` : ``
			}`}
		>
			{inputItem.icon && (
				<span className="inputField__icon" aria-hidden="true">
					{inputItem.icon}
				</span>
			)}
			<input
				onChange={handleInputValidation}
				id={inputItem.id}
				type={showPassword ? 'text' : inputItem.type}
				className={`inputField__input
					${inputItem.class ? ' ' + inputItem.class : ''}
					${inputItem.labelState === 'valid' ? ' inputField__input--valid' : ''}
					${inputItem.labelState === 'invalid' ? ' inputField__input--invalid' : ''}
				`}
				value={inputItem.content ? inputItem.content : ``}
				name={inputItem.name}
				placeholder={inputItem.label}
				disabled={inputItem.disabled}
				autoComplete="off"
				onKeyUp={handleKeyUp}
				onKeyDown={(e) => (props.onKeyDown ? props.onKeyDown(e) : null)}
				tabIndex={inputItem.tabIndex}
			/>
			<label className="inputField__label" htmlFor={inputItem.id}>
				{inputItem.label}
			</label>
			{inputItem.type === 'password' && (
				<span
					onClick={() => setShowPassword(!showPassword)}
					className="inputField__passwordToggle"
				>
					{showPassword ? (
						<HidePasswordIcon
							aria-label={translate('login.password.hide')}
							title={translate('login.password.hide')}
							color={'rgba(0, 0, 0, 0.65)'}
						/>
					) : (
						<ShowPasswordIcon
							aria-label={translate('login.password.show')}
							title={translate('login.password.show')}
							color={'rgba(0, 0, 0, 0.65)'}
						/>
					)}
				</span>
			)}
			{inputItem.infoText && (
				<Text
					className="inputField__infoText"
					text={inputItem.infoText}
					type="infoSmall"
				/>
			)}
		</div>
	);
};
