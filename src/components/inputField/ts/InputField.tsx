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
}

export interface InputFieldProps {
	item: InputFieldItemTSX;
	inputHandle: Function;
}

export const InputField = (props: InputFieldProps) => {
	const inputItem = props.item;
	const [showPassword, setShowPassword] = useState(false);
	return (
		<div className="inputField__wrapper formWrapper">
			<div className="formWrapper__inputRow">
				<div className="formWrapper__inputWrapper">
					<input
						onChange={(e) => props.inputHandle(e)}
						id={inputItem.id}
						type={showPassword ? 'text' : inputItem.type}
						className={`inputField__input ${inputItem.class}`}
						value={inputItem.content ? inputItem.content : ``}
						name={inputItem.name}
						placeholder={translate(inputItem.labelTranslatable)}
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
