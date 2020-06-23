export const initPasswordToggle = () => {
	const togglePassButtons = document.querySelectorAll(
		'.passwordFields__fieldGroup__passVisibility'
	);
	Array.from(togglePassButtons).forEach((togglePass: HTMLElement) => {
		togglePass.addEventListener('click', togglePasswordView);
	});
};

const togglePasswordView = (e: Event) => {
	e.stopPropagation();

	const thisParent = (e.target as Element).closest(
		'.formWrapper__inputWrapper'
	);
	const thisInput = thisParent.querySelector(
		'.inputField__input'
	) as HTMLInputElement;
	thisInput.type === 'password'
		? (thisInput.type = 'text')
		: (thisInput.type = 'password');

	const togglePass = thisParent.querySelector(
		'.passwordFields__fieldGroup__togglePass'
	);
	togglePass.classList.toggle(
		'passwordFields__fieldGroup__togglePass--close'
	);
	togglePass.classList.toggle('passwordFields__fieldGroup__togglePass--open');
};
