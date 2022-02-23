import { isAndroid, isIOS } from 'react-device-detect';

const videoCallInformal = {
	'incomingCall.unsupported.description':
		'%username% versucht Dich anzurufen ...',
	'incomingCall.unsupported.hint.desktop':
		'Dein Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Bitte wechsle zu einem der Browser <a href="https://www.google.de/chrome/" target="_blank">Google Chrome</a> oder <a href="https://www.microsoft.com/de-de/edge" target="_blank">Microsoft Edge</a>, um den Anruf annehmen zu können.',
	'incomingCall.unsupported.hint.mobile': isAndroid
		? 'Dein Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Du kannst dir die <a href="https://play.google.com/store/apps/details?id=org.jitsi.meet">Jitsi Meet App</a> herunterladen und den Anruf in der Jitsi Meet App annehmen oder dich über einen der Browser <a href="https://play.google.com/store/apps/details?id=com.android.chrome">Google Chrome</a> oder <a href="https://play.google.com/store/apps/details?id=com.microsoft.emmx">Microsoft Edge</a> anmelden und den Anruf annehmen.'
		: isIOS
		? 'Dein Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Du kannst dir die <a href="https://apple.co/3h7X81U">Jitsi Meet App</a> herunterladen und den Anruf in der Jitsi Meet App annehmen oder dich über einen der Browser <a href="https://apple.co/3CcLwE3">Google Chrome</a> oder <a href="https://apple.co/3JQYieS">Microsoft Edge</a> anmelden und den Anruf annehmen.'
		: 'Dein Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Du kannst dich über einen der Browser Google Chrome oder Microsoft Edge anmelden um den Anruf anzunehmen.',
	'incomingCall.unsupported.hint.tablet': isAndroid
		? 'Dein Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Du kannst dir die <a href="https://play.google.com/store/apps/details?id=org.jitsi.meet">Jitsi Meet App</a> herunterladen und den Anruf in der Jitsi Meet App annehmen oder dich über einen der Browser <a href="https://play.google.com/store/apps/details?id=com.android.chrome">Google Chrome</a> oder <a href="https://play.google.com/store/apps/details?id=com.microsoft.emmx">Microsoft Edge</a> anmelden und den Anruf annehmen.'
		: isIOS
		? 'Dein Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Du kannst dir die <a href="https://apple.co/3h7X81U">Jitsi Meet App</a> herunterladen und den Anruf in der Jitsi Meet App annehmen oder dich über einen der Browser <a href="https://apple.co/3CcLwE3">Google Chrome</a> oder <a href="https://apple.co/3JQYieS">Microsoft Edge</a> anmelden und den Anruf annehmen.'
		: 'Dein Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Du kannst dich über einen der Browser Google Chrome oder Microsoft Edge anmelden um den Anruf anzunehmen.',
	'incomingCall.ignored': 'hat versucht Dich zu erreichen.',
	'incomingCall.rejected.prefix': 'Du hast versucht',
	'overlay.unsupported.headline':
		'Dein Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung',
	'overlay.unsupported.copy.browser':
		'Bitte wechsele zu einem der Browser <a href="https://www.google.de/chrome/" target="_blank">Google Chrome</a> oder <a href="https://www.microsoft.com/de-de/edge" target="_blank">Microsoft Edge</a>, um die maximale Sicherheit zu ermöglichen und diese Funktion nutzen zu können.',
	'overlay.unsupported.copy.mobile': isAndroid
		? 'Du kannst entweder die <a href="https://play.google.com/store/apps/details?id=org.jitsi.meet">Jitsi Meet App</a> herunterladen und den Anruf über Jitsi Meet starten oder Dich über einen der Browser <a href="https://play.google.com/store/apps/details?id=com.android.chrome" target="_blank">Google Chrome</a> oder <a href="https://play.google.com/store/apps/details?id=com.microsoft.emmx" target="_blank">Microsoft Edge</a> einloggen, um diese Funktion nutzen zu können.'
		: isIOS
		? 'Du kannst entweder die <a href="https://apple.co/3h7X81U">Jitsi Meet App</a> herunterladen und den Anruf über Jitsi Meet starten oder Dich über einen der Browser <a href="https://apple.co/3CcLwE3" target="_blank">Google Chrome</a> oder <a href="https://apple.co/3JQYieS" target="_blank">Microsoft Edge</a> einloggen, um diese Funktion nutzen zu können.'
		: 'Du kannst Dich über einen der Browser Google Chrome oder Microsoft Edge einloggen, um diese Funktion nutzen zu können.',
	'overlay.unsupported.copy.tablet': isAndroid
		? 'Du kannst entweder die <a href="https://play.google.com/store/apps/details?id=org.jitsi.meet">Jitsi Meet App</a> herunterladen und den Anruf über Jitsi Meet starten oder Dich über einen der Browser <a href="https://play.google.com/store/apps/details?id=com.android.chrome" target="_blank">Google Chrome</a> oder <a href="https://play.google.com/store/apps/details?id=com.microsoft.emmx" target="_blank">Microsoft Edge</a> einloggen, um diese Funktion nutzen zu können.'
		: isIOS
		? 'Du kannst entweder die <a href="https://apple.co/3h7X81U">Jitsi Meet App</a> herunterladen und den Anruf über Jitsi Meet starten oder Dich über einen der Browser <a href="https://apple.co/3CcLwE3" target="_blank">Google Chrome</a> oder <a href="https://apple.co/3JQYieS" target="_blank">Microsoft Edge</a> einloggen, um diese Funktion nutzen zu können.'
		: 'Du kannst Dich über einen der Browser Google Chrome oder Microsoft Edge einloggen, um diese Funktion nutzen zu können.'
};

export default videoCallInformal;
