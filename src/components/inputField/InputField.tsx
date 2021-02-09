import * as React from 'react';
import { useState } from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { Text } from '../text/Text';
import { ReactComponent as ShowPasswordIcon } from '../../resources/img/icons/eye.svg';
import { ReactComponent as HidePasswordIcon } from '../../resources/img/icons/eye-closed.svg';
import './inputField.styles';
import './passwordFields.styles';

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
}

export interface InputFieldProps {
	item: InputFieldItem;
	inputHandle: Function;
	keyUpHandle?: Function;
}

export interface GeneratedInputs {
	addictiveDrugs?: string[];
	relation?: string;
	age?: string;
	gender?: string;
	state?: string;
}

export const InputField = (props: InputFieldProps) => {
	const inputItem = props.item;
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
		<div className="inputField__wrapper formWrapper">
			<div className="formWrapper__inputRow">
				<div
					className={`formWrapper__inputWrapper ${
						inputItem.icon
							? `formWrapper__inputWrapper--withIcon`
							: ``
					} ${
						inputItem.warningActive
							? `formWrapper__inputWrapper--error`
							: ''
					}
						`}
				>
					{inputItem.icon ? (
						<span className="inputField__icon">
							{inputItem.icon}
						</span>
					) : null}
					<input
						onChange={handleInputValidation}
						id={inputItem.id}
						type={showPassword ? 'text' : inputItem.type}
						className={`inputField__input${
							inputItem.class ? ' ' + inputItem.class : ''
						}`}
						value={inputItem.content ? inputItem.content : ``}
						name={inputItem.name}
						placeholder={inputItem.label}
						disabled={inputItem.disabled}
						autoComplete="off"
						onKeyUp={handleKeyUp}
					/>
					<label
						className="formWrapper__inputWrapper__label"
						htmlFor={inputItem.id}
					>
						{inputItem.label}
					</label>
					{inputItem.type === 'password' ? (
						<span
							onClick={() => setShowPassword(!showPassword)}
							className="passwordFields__fieldGroup__passVisibility"
						>
							<span className="passwordFields__fieldGroup__togglePass">
								{showPassword ? (
									<HidePasswordIcon />
								) : (
									<ShowPasswordIcon />
								)}
							</span>
						</span>
					) : null}
					{inputItem.postcodeFallbackLink ? (
						<p className="formWrapper__infoText warning">
							{translate('warningLabels.postcode.unavailable')}{' '}
							<a
								className="warning__link"
								href={inputItem.postcodeFallbackLink}
								target="_blank"
								rel="noreferrer"
							>
								{translate('warningLabels.postcode.search')}
							</a>
						</p>
					) : null}
					{inputItem.warningActive && inputItem.warningLabel ? (
						<p
							className="formWrapper__infoText warning"
							dangerouslySetInnerHTML={{
								__html: inputItem.warningLabel
							}}
						></p>
					) : null}
					{inputItem.infoText && (
						<Text
							text={inputItem.infoText}
							className="formWrapper__infoText"
						/>
					)}
				</div>
			</div>
		</div>
	);
};
