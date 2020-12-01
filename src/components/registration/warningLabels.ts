import { translate } from '../../resources/scripts/i18n/translate';

export const warningLabelForTranslatableAndParentId = (
	warningTranslatable: string,
	parentId: string,
	isTranslated: boolean = false
) => {
	const label = createWarningLabel(
		isTranslated ? warningTranslatable : translate(warningTranslatable)
	);
	const parentElement = document.getElementById(parentId) as HTMLInputElement;
	if (parentId !== 'passwordConfirmation') {
		insertAfter(label, parentElement);
	}
	setInputErrorClass(parentElement);
	if (parentId !== 'termsAcceptedLabel') {
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

export const removeWarningLabelById = (inputFieldId) => {
	const inputField = document.getElementById(inputFieldId);
	if (inputField) {
		const warningLabel = inputField.parentNode?.querySelector('.warning');
		if (warningLabel) {
			warningLabel.remove();
		}
	}
};

const setInputErrorClass = (target: HTMLInputElement) => {
	const parent = target.offsetParent?.closest('.formWrapper__inputRow');

	if (parent) {
		parent.classList.add('formWrapper__inputRow--error');
		target.classList.add('inputField__input--error');
	}

	if (target.id === 'termsAcceptedLabel') {
		document
			.getElementById('termsAccepted')
			?.classList.add('checkbox__input--error');
	}
};

export const removeInputErrorClass = (inputFieldId) => {
	const inputField = document.getElementById(inputFieldId);
	if (inputField) {
		inputField.classList.remove('inputField__input--error');
	}
};

const createWarningLabel = (warningText: string) => {
	let warningLabel = document.createElement('p');
	warningLabel.innerHTML = warningText;
	warningLabel.classList.add('formWrapper__infoText');
	warningLabel.classList.add('warning');
	return warningLabel;
};

const insertAfter = (newNode: HTMLElement, referenceNode: HTMLElement) => {
	const label = referenceNode.parentNode?.querySelector('label');
	if (
		referenceNode.id === 'ageSelect__wrapper' ||
		referenceNode.id === 'stateSelect__wrapper'
	) {
		referenceNode.appendChild(newNode);
	} else if (label && label.id === 'termsAcceptedLabel') {
		label.appendChild(newNode);
	} else if (label) {
		referenceNode.parentNode?.insertBefore(newNode, label.nextSibling);
	}
};

const scrollToFormTop = () => {
	window.scrollTo(0, 0);
};
