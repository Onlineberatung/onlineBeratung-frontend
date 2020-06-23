import { getFormData, removeLoginPasswordWarningClasses } from './handleLogin';
import { initPasswordToggle } from '../../registrationFormular/ts/togglePasswordView';
import {
	initInputWarningLabelHandler,
	warningLabelForTranslatableAndParentId
} from '../../registrationFormular/ts/warningLabels';
import { getUrlParameter } from '../../../resources/ts/helpers/getUrlParameter';

const handleEnter = (e: KeyboardEvent) => {
	if (e.code === 'Enter') {
		getFormData(e);
	}
};

const handleResetMessage = (resetMessage: string) => {
	const resetMessageTranslatable =
		resetMessage === 'mail'
			? 'warningLabels.login.reset.mail'
			: 'warningLabels.login.reset.pw';
	warningLabelForTranslatableAndParentId(
		resetMessageTranslatable,
		'passwordInput'
	);
	removeLoginPasswordWarningClasses();
	const resetMessageLabel = document.querySelector(
		'.formWrapper__infoText.warning'
	);
	resetMessageLabel.classList.add('resetLabel');
};

const initResetMessage = () => {
	const resetMessage = getUrlParameter('reset');
	resetMessage ? handleResetMessage(resetMessage) : null;
};

{
	const submitButton = document.getElementById('loginSubmit');
	submitButton.addEventListener('click', getFormData);

	const userInput = document.getElementById('username');
	userInput.addEventListener('keydown', handleEnter);
	const passwordInput = document.getElementById('passwordInput');
	passwordInput.addEventListener('keydown', handleEnter);

	initPasswordToggle();

	initInputWarningLabelHandler();

	initResetMessage();
}
