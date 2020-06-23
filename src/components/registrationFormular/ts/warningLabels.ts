import { translate } from '../../../resources/ts/i18n/translate';

export const warningLabelForTranslatableAndParentId = (
	warningTranslatable: string,
	parentId: string,
	isTranslated: boolean = false
) => {
	const label = createWarningLabel(
		isTranslated ? warningTranslatable : translate(warningTranslatable)
	);
	const parentElement = document.getElementById(parentId) as HTMLInputElement;
	if (parentId != 'passwordConfirmation') {
		insertAfter(label, parentElement);
	}
	setInputErrorClass(parentElement);
	if (parentId != 'termsAcceptedLabel') {
		scrollToFormTop();
	}
};

export const removeWarningLabels = () => {
	const warningLabels = document.querySelectorAll(
		'.formWrapper__infoText.warning'
	);
	Array.from(warningLabels).forEach((warningLabel) => {
		warningLabel.remove();
	});
};

export const removeCheckboxWarningLabel = () => {
	document
		.getElementById('termsAccepted')
		.classList.remove('checkbox__input--error');
};

const setInputErrorClass = (target: HTMLInputElement) => {
	const parent = target.offsetParent.closest('.formWrapper__inputRow');

	if (parent) {
		parent.classList.add('formWrapper__inputRow--error');
		target.classList.add('inputField__input--error');
	}

	if (target.id === 'termsAcceptedLabel') {
		document
			.getElementById('termsAccepted')
			.classList.add('checkbox__input--error');
	}
};

export const removeInputErrorClass = () => {
	const inputFields = document.querySelectorAll('input');
	Array.from(inputFields).forEach((inputField) => {
		inputField.classList.remove('inputField__input--error');
	});
};

const createWarningLabel = (warningText: string) => {
	let warningLabel = document.createElement('p');
	warningLabel.innerHTML = warningText;
	warningLabel.classList.add('formWrapper__infoText');
	warningLabel.classList.add('warning');
	return warningLabel;
};

const insertAfter = (newNode: HTMLElement, referenceNode: HTMLElement) => {
	const label = referenceNode.parentNode.querySelector('label');
	if (
		referenceNode.id === 'ageSelect__wrapper' ||
		referenceNode.id === 'stateSelect__wrapper'
	) {
		referenceNode.appendChild(newNode);
	} else if (label && label.id === 'termsAcceptedLabel') {
		label.appendChild(newNode);
	} else {
		referenceNode.parentNode.insertBefore(newNode, label.nextSibling);
	}
};

const scrollToFormTop = () => {
	window.scrollTo(0, 0);
};

export const initInputWarningLabelHandler = () => {
	const inputElements = document.querySelectorAll('input');
	Array.from(inputElements).forEach((inputElement) => {
		inputElement.addEventListener('keyup', handleWarningLabelOnInput);
	});
};

export const handleWarningLabelOnInput = (
	e: Event,
	removeWhiteSpot: boolean = false
) => {
	const thisInputWrapper = (e.target as HTMLElement).parentElement;
	const warningLabel = thisInputWrapper.querySelector('.warning');
	const whiteSpotWarning = warningLabel
		? warningLabel.querySelector('.warning__link')
		: null;
	if (warningLabel && (!whiteSpotWarning || removeWhiteSpot)) {
		warningLabel.remove();
		thisInputWrapper.parentElement.classList.remove(
			'formWrapper__inputRow--error'
		);
		(e.target as HTMLElement).classList.remove('inputField__input--error');
		document
			.getElementById('postcode')
			.removeAttribute('data-postcodefallback');
	}
};

export const handleSelectWarningLabel = (e: Event) => {
	const warningLabel = (e.target as HTMLElement)
		.closest('.select__wrapper')
		.querySelector('.warning');
	warningLabel ? warningLabel.remove() : null;
};

export const handleWarningLabelOnCheckbox = (e: Event) => {
	if (
		(e.target as HTMLElement).className ===
		'checkbox__input checkbox__input--error'
	) {
		const warningLabel = (e.target as HTMLElement).parentElement.querySelector(
			'.warning'
		);
		warningLabel.remove();
		removeCheckboxWarningLabel();
	}
};
