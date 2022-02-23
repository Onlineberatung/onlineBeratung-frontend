import { isAndroid, isIOS } from 'react-device-detect';

const videoCall = {
	'button.rejectCall': 'Anruf ablehnen',
	'button.startCall': 'Anruf starten',
	'button.answerCall': 'Anruf annehmen',
	'button.startVideoCall': 'Videoanruf starten',
	'button.answerVideoCall': 'Videoanruf annehmen',
	'incomingCall.description': 'ruft an...',
	'incomingCall.unsupported.description':
		'%username% versucht Sie anzurufen ...',
	'incomingCall.unsupported.hint.browser':
		'Ihr Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Bitte wechseln Sie zu einem der Browser <a href="https://www.google.de/chrome/" target="_blank">Google Chrome</a> oder <a href="https://www.microsoft.com/de-de/edge" target="_blank">Microsoft Edge</a>, um den Anruf annehmen zu können.',
	'incomingCall.unsupported.hint.mobile': isAndroid
		? 'Ihr Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Sie können sich die <a href="https://play.google.com/store/apps/details?id=org.jitsi.meet">Jitsi Meet App</a> herunterladen und den Anruf über die Jitsi Meet App annehmen oder sich über einen der Browser <a href="https://play.google.com/store/apps/details?id=com.android.chrome">Google Chrome</a> oder <a href="https://play.google.com/store/apps/details?id=com.microsoft.emmx">Microsoft Edge</a> einloggen um den Anruf annehmen.'
		: isIOS
		? 'Ihr Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Sie können sich die <a href="https://apple.co/3h7X81U">Jitsi Meet App</a> herunterladen und den Anruf über die Jitsi Meet App annehmen oder sich über einen der Browser <a href="https://apple.co/3CcLwE3">Google Chrome</a> oder <a href="https://apple.co/3JQYieS">Microsoft Edge</a> einloggen um den Anruf annehmen.'
		: 'Ihr Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Sie können sich über einen der Browser Google Chrome oder Microsoft Edge anmelden um den Anruf anzunehmen.',
	'incomingCall.unsupported.hint.tablet': isAndroid
		? 'Ihr Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Sie können sich die <a href="https://play.google.com/store/apps/details?id=org.jitsi.meet">Jitsi Meet App</a> herunterladen und den Anruf über die Jitsi Meet App annehmen oder sich über einen der Browser <a href="https://play.google.com/store/apps/details?id=com.android.chrome">Google Chrome</a> oder <a href="https://play.google.com/store/apps/details?id=com.microsoft.emmx">Microsoft Edge</a> einloggen um den Anruf annehmen.'
		: isIOS
		? 'Ihr Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Sie können sich die <a href="https://apple.co/3h7X81U">Jitsi Meet App</a> herunterladen und den Anruf über die Jitsi Meet App annehmen oder sich über einen der Browser <a href="https://apple.co/3CcLwE3">Google Chrome</a> oder <a href="https://apple.co/3JQYieS">Microsoft Edge</a> einloggen um den Anruf annehmen.'
		: 'Ihr Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Sie können sich über einen der Browser Google Chrome oder Microsoft Edge anmelden um den Anruf anzunehmen.',
	'incomingCall.ignored': 'hat versucht Sie zu erreichen.',
	'incomingCall.rejected.prefix': 'Sie haben versucht',
	'incomingCall.rejected.suffix': 'zu erreichen.',
	'incomingCall.rejected.teamconsultant.prefix': 'hat versucht',
	'overlay.unsupported.headline':
		'Ihr Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung',
	'overlay.unsupported.copy.browser':
		'Bitte wechseln Sie zu einem der Browser <a href="https://www.google.de/chrome/" target="_blank">Google Chrome</a> oder <a href="https://www.microsoft.com/de-de/edge" target="_blank">Microsoft Edge</a>, um die maximale Sicherheit zu ermöglichen und diese Funktion nutzen zu können.',
	'overlay.unsupported.copy.mobile': isAndroid
		? 'Sie können entweder die <a href="https://play.google.com/store/apps/details?id=org.jitsi.meet">Jitsi Meet App</a> herunterladen und den Anruf über Jitsi Meet starten oder sich über einen der Browser <a href="https://play.google.com/store/apps/details?id=com.android.chrome" target="_blank">Google Chrome</a> oder <a href="https://play.google.com/store/apps/details?id=com.microsoft.emmx" target="_blank">Microsoft Edge</a> einloggen, um diese Funktion nutzen zu können.'
		: isIOS
		? 'Sie können entweder die <a href="https://apple.co/3h7X81U">Jitsi Meet App</a> herunterladen und den Anruf über Jitsi Meet starten oder sich über einen der Browser <a href="https://apple.co/3CcLwE3" target="_blank">Google Chrome</a> oder <a href="https://apple.co/3JQYieS" target="_blank">Microsoft Edge</a> einloggen, um diese Funktion nutzen zu können.'
		: 'Sie können sich über einen der Browser Google Chrome oder Microsoft Edge einloggen, um diese Funktion nutzen zu können.',
	'overlay.unsupported.copy.tablet': isAndroid
		? 'Sie können entweder die <a href="https://play.google.com/store/apps/details?id=org.jitsi.meet">Jitsi Meet App</a> herunterladen und den Anruf über Jitsi Meet starten oder sich über einen der Browser <a href="https://play.google.com/store/apps/details?id=com.android.chrome" target="_blank">Google Chrome</a> oder <a href="https://play.google.com/store/apps/details?id=com.microsoft.emmx" target="_blank">Microsoft Edge</a> einloggen, um diese Funktion nutzen zu können.'
		: isIOS
		? 'Sie können entweder die <a href="https://apple.co/3h7X81U">Jitsi Meet App</a> herunterladen und den Anruf über Jitsi Meet starten oder sich über einen der Browser <a href="https://apple.co/3CcLwE3" target="_blank">Google Chrome</a> oder <a href="https://apple.co/3JQYieS" target="_blank">Microsoft Edge</a> einloggen, um diese Funktion nutzen zu können.'
		: 'Sie können sich über einen der Browser Google Chrome oder Microsoft Edge einloggen, um diese Funktion nutzen zu können.',
	'overlay.unsupported.button.close': 'Schließen',
	'overlay.unsupported.button.app': 'Anruf in Jitsi Meet starten'
};

export default videoCall;
