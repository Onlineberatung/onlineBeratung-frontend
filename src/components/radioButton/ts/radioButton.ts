const initRadioButtons = () => {
	const radioButtonWrappers = document.querySelectorAll(
		'.radioButton__contentWrapper'
	);
	Array.from(radioButtonWrappers).forEach(
		(radioButtonWrapper: HTMLElement) => {
			radioButtonWrapper.addEventListener('click', clickRadioButton);
		}
	);
};

const clickRadioButton = (e: Event) => {
	if ((e.target as HTMLElement).className === 'radioButton__contentWrapper') {
		const radioButton = (e.target as HTMLElement).querySelector(
			'.radioButton__input'
		) as HTMLInputElement;
		radioButton.checked = true;
	}
};

{
	initRadioButtons();
}
