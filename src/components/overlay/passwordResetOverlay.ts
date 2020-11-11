import { initPasswordResetOverlay } from './handlePasswordResetOverlay';

{
	const confirmationOverlayDemo = document.querySelector(
		'.confirmationOverlay-demo'
	);
	confirmationOverlayDemo?.addEventListener(
		'click',
		initPasswordResetOverlay
	);
}
