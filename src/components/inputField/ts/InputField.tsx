import * as React from 'react';
import { useState } from 'react';
import { translate } from '../../../resources/ts/i18n/translate';

export interface InputFieldItemTSX {
	id: string;
	type: string;
	class: string;
	name: string;
	labelTranslatable: string;
	infoText?: string;
	content: string;
	maxLength?: number;
	pattern?: string;
	disabled?: boolean;
}

export interface InputFieldProps {
	item: InputFieldItemTSX;
	inputHandle: Function;
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

	return (
		<div className="inputField__wrapper formWrapper">
			<div className="formWrapper__inputRow">
				<div className="formWrapper__inputWrapper">
					<input
						onChange={handleInputValidation}
						id={inputItem.id}
						type={showPassword ? 'text' : inputItem.type}
						className={`inputField__input ${inputItem.class}`}
						value={inputItem.content ? inputItem.content : ``}
						name={inputItem.name}
						placeholder={translate(inputItem.labelTranslatable)}
						disabled={inputItem.disabled}
					/>
					<label
						className="formWrapper__inputWrapper__label"
						htmlFor={inputItem.id}
					>
						{translate(inputItem.labelTranslatable)}
					</label>
					{inputItem.type === 'password' ? (
						<span
							onClick={() => setShowPassword(!showPassword)}
							className="passwordReset__passVisibility"
						>
							<span
								className={[
									'passwordReset__togglePass',
									'passwordReset__togglePass--' +
										(showPassword ? 'open' : 'close')
								].join(' ')}
							></span>
						</span>
					) : null}
					<p
						className="formWrapper__infoText"
						dangerouslySetInnerHTML={{ __html: inputItem.infoText }}
					></p>
				</div>
			</div>
		</div>
	);
};
