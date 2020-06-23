import { redirectToApp } from '../../registrationFormular/ts/autoLogin';

export const initRegistrationOverlay = () => {
	const confirmationOverlay = document.querySelector(
		'.overlay__registration'
	);
	addOverlayClasses(confirmationOverlay);

	const overlayButton = document.getElementById('confirmRegistrationOverlay');
	overlayButton.addEventListener('click', redirectToApp);
};

const addOverlayClasses = (overlay: Element) => {
	const overlaySibling = overlay.previousElementSibling;
	overlay.classList.add('overlay--flex');
	overlaySibling.classList.add('registration__blur');
	document
		.getElementById('loginLogoWrapper')
		.classList.add('registration__blur');
};
