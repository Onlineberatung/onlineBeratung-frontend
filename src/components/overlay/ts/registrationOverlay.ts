import { initRegistrationOverlay } from './handleRegistrationOverlay';

{
	const confirmationOverlayDemo = document.querySelector(
		'.confirmationOverlay-demo'
	);
	confirmationOverlayDemo.addEventListener('click', initRegistrationOverlay);
}
