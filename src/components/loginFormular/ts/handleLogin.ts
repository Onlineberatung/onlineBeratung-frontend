import { autoLogin } from '../../registrationFormular/ts/autoLogin';
import {
	warningLabelForTranslatableAndParentId,
	removeWarningLabels,
	removeInputErrorClass
} from '../../registrationFormular/ts/warningLabels';

export const getFormData = (e: Event) => {
	e.preventDefault();
	removeWarningLabels();
	removeInputErrorClass();

	const username = handleUsernameOnSubmit();
	const password = handlePasswordOnSubmit();

	if (username && password) {
		autoLogin(username, password, true);
	}
};

const handleUsernameOnSubmit = () => {
	const usernameValue = (document.getElementById(
		'username'
	) as HTMLInputElement).value;
	const usernameSet = usernameValue.length > 0;

	if (!usernameSet) {
		warningLabelForTranslatableAndParentId(
			'warningLabels.username.missing',
			'username'
		);
		return null;
	}
	return usernameValue;
};

const handlePasswordOnSubmit = () => {
	const passwordValue = (document.getElementById(
		'passwordInput'
	) as HTMLInputElement).value;
	const passwordSet = passwordValue.length > 0;

	if (!passwordSet) {
		warningLabelForTranslatableAndParentId(
			'warningLabels.password.missing',
			'passwordInput'
		);
		return null;
	}
	return passwordValue;
};

export const handleLoginError = () => {
	warningLabelForTranslatableAndParentId(
		'warningLabels.login.failed',
		'passwordInput'
	);
	removeLoginPasswordWarningClasses();
};

export const removeLoginPasswordWarningClasses = () => {
	const passwordInputWrapper = document.querySelector(
		'.inputField__wrapper.formWrapper.passwordInput'
	);
	(passwordInputWrapper.querySelector(
		'input'
	) as HTMLElement).classList.remove('inputField__input--error');
	const inputRow = passwordInputWrapper.querySelector('div') as HTMLElement;
	inputRow.classList.remove('formWrapper__inputRow--error');
	inputRow.classList.add('formWrapper__inputRow--baseline');
};
