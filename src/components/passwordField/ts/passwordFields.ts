import {
	strengthColor,
	strengthIndicator,
	inputValuesFit
} from './validateInputValue';

{
	const passwordSelectors = {
		passwordBadClass: 'passwordFields__fieldGroup--red',
		passwordStrongClass: 'passwordFields__fieldGroup--green',
		passwordInput: 'passwordInput',
		passwordConfirmationInput: 'passwordConfirmation',
		passwordGroup: 'passwordFields__fieldGroup__input',
		inputErrorClass: 'formWrapper__inputRow--error'
	};

	const passwordInput = <HTMLInputElement>(
		document.getElementById(passwordSelectors.passwordInput)
	);
	const passwordConfirmation = <HTMLInputElement>(
		document.getElementById(passwordSelectors.passwordConfirmationInput)
	);
	let passwordVal: string = '';
	let passwordConfirmationVal: string = '';

	passwordInput.addEventListener('keyup', () => {
		passwordVal = (passwordInput as HTMLInputElement).value;
		let passwordStrength = strengthIndicator(passwordVal);
		let passwordColor = strengthColor(passwordStrength);

		removePasswordClasses(passwordInput);
		setStrenthColor(passwordInput, passwordColor);

		{
			!passwordVal ? removePasswordClasses(passwordInput) : null;
		}

		setPasswordConfirmationLabel();

		return passwordVal;
	});

	const setPasswordConfirmationLabel = () => {
		passwordConfirmationVal = (passwordConfirmation as HTMLInputElement)
			.value;
		let inputValFit: boolean = inputValuesFit(
			passwordVal,
			passwordConfirmationVal
		);
		removePasswordClasses(passwordConfirmation);

		switch (inputValFit) {
			case true:
				setStrenthColor(passwordConfirmation, 'green');
				break;
			default:
				setStrenthColor(passwordConfirmation, 'red');
		}

		{
			!passwordConfirmationVal
				? removePasswordClasses(passwordConfirmation)
				: null;
		}
	};

	passwordConfirmation.addEventListener(
		'keyup',
		setPasswordConfirmationLabel
	);

	const setStrenthColor = (
		passwordElement: HTMLElement,
		passwordColor: string
	) => {
		let passwordElementParent = passwordElement.parentElement.parentElement;

		switch (passwordColor) {
			case 'green':
				passwordElementParent.classList.add(
					passwordSelectors.passwordStrongClass
				);
				passwordElementParent.classList.remove(
					passwordSelectors.inputErrorClass
				);
				break;
			default:
				passwordElementParent.classList.add(
					passwordSelectors.passwordBadClass
				);
		}
	};

	const removePasswordClasses = (passwordElement: HTMLElement) => {
		let passwordElementParent = passwordElement.parentElement.parentElement;

		passwordElementParent.classList.remove(
			passwordSelectors.passwordBadClass,
			passwordSelectors.passwordStrongClass
		);
	};
}
