const twoFactorAuth = {
	'title': '2-Faktor-Authentifizierung',
	'subtitle':
		'Sichern Sie Ihr Konto vor einem möglichen unbefugten Zugriff. Nutzen Sie einen 2. Faktor (App oder E-Mail) für die Anmeldung in der Online-Beratung',
	'switch.active.label': '2-Faktor-Authentifizierung aktiviert',
	'switch.deactive.label': '2-Faktor-Authentifizierung deaktiviert',
	'activate.step1.email': 'Per E-Mail',
	'activate.step1.app': 'Mit Authenticator Application',
	'activate.step1.title': '2. Faktor wählen',
	'activate.step1.copy':
		'Möchten Sie Ihr Konto mit einer App oder mit Ihrer E-Mail-Adresse zusätzlich schützen?',
	'activate.step1.visualisation.label': 'Auswahl',
	'activate.radio.label.app': 'App',
	'activate.radio.label.email': 'E-Mail-Adresse',
	'activate.radio.tooltip.app':
		'Installieren Sie sich die App. Die App generiert Ihnen einen Code den Sie bei der Anmeldung eingeben müssen.',
	'activate.radio.tooltip.email':
		'Sie erhalten bei der Anmeldung eine E-Mail mit einem Code. Diesen Code müssen Sie dann eingeben.',
	'activate.email.step2.title': 'E-Mail-Adresse angeben',
	'activate.email.step2.copy': 'Bitte geben Sie hier Ihre E-Mail-Adresse an.',
	'activate.email.step2.visualisation.label': 'Angabe',
	'activate.email.step3.title': 'E-Mail-Adresse bestätigen',
	'activate.email.step3.copy.1': 'Wir haben Ihnen gerade eine E-Mail an',
	'activate.email.step3.copy.2':
		'geschickt. Bitte geben Sie den Code aus der E-Mail hier ein.',
	'activate.email.step3.visualisation.label': 'Verknüpfung',
	'activate.email.step4.title':
		'E-Mail-Authentifizierung erfolgreich eingerichtet.',
	'activate.email.step4.visualisation.label': 'Bestätigung',
	'activate.app.step2.title': 'Installieren Sie sich die App',
	'activate.app.step2.copy':
		'Installieren Sie sich FreeOTP oder Google Authentificator auf Ihrem Smartphone oder Tablet. Beide Apps sind im Google Play oder Apple App Store verfügbar.',
	'activate.app.step2.visualisation.label': 'Installation',
	'activate.app.step2.tool1': 'FreeOTP App:',
	'activate.app.step2.tool2': 'Google Authenticator App:',
	'activate.app.step2.tool1.url.google':
		'https://play.google.com/store/apps/details?id=org.fedorahosted.freeotp',
	'activate.app.step2.tool1.url.apple':
		'https://apps.apple.com/de/app/freeotp-authenticator/id872559395',
	'activate.app.step2.tool2.url.google':
		'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
	'activate.app.step2.tool2.url.apple':
		'https://apps.apple.com/de/app/google-authenticator/id388497605',
	'activate.app.step2.download.google': 'Download im Google Play Store',
	'activate.app.step2.download.apple': 'Download im Apple App Store',
	'activate.app.step3.title': 'Verknüpfen Sie die App und Ihren Account',
	'activate.app.step3.copy':
		'Sie haben zwei Möglichkeiten die App mit Ihrem Account zu verknüpfen:',
	'activate.app.step3.visualisation.label': 'Verknüpfung',
	'activate.app.step3.connect.qrCode':
		'Öffnen Sie die App und scannen Sie den folgenden QR-Code:',
	'activate.app.step3.connect.divider': 'oder',
	'activate.app.step3.connect.key':
		'Geben Sie den folgenden 32-stelligen Schlüssel ein:',
	'activate.app.step4.title': 'Einmal-Code eingeben',
	'activate.app.step4.copy':
		'Geben Sie den Einmal-Code ein, der von der App generiert wird und klicken Sie auf „Speichern“, um die Einrichtung abzuschließen.',
	'activate.app.step4.visualisation.label': 'Bestätigung',
	'activate.otp.input.label': 'Einmal-Code',
	'activate.otp.input.label.short': 'Der eingegebene Code ist zu kurz.',
	'activate.otp.input.label.error':
		'Die Authentifizierung ist fehlgeschlagen. Bitte wiederholen Sie den Vorgang.',
	'overlayButton.next': 'Weiter',
	'overlayButton.back': 'Zurück',
	'overlayButton.save': 'Speichern',
	'overlayButton.close': 'Schliessen',
	'overlayButton.confirm': 'Bestätigen',
	'activate.email.input.label': 'E-Mail-Adresse angeben',
	'activate.email.input.valid': 'E-Mail-Adresse angeben',
	'activate.email.input.invalid': 'E-Mail-Adresse ungültig',
	'activate.email.input.duplicate': 'E-Mail-Adresse wird bereits verwendet',
	'activate.email.input.duplicate.info':
		'Diese E-Mail-Adresse wird bereits von einer anderen Person verwendet. Bitte geben Sie eine andere E-Mail-Adresse an. Oder nutzen Sie die App als 2. Faktor.',
	'activate.email.input.info':
		'Sie können nur eine E-Mail-Adresse bei uns hinterlegen. Falls Sie die E-Mail-Adresse hier ändern, erhalten Sie auf diese E-Mail-Adresse zukünftig auch die Benachrichtigungen.',
	'activate.email.resend.hint':
		'Wir haben Ihnen einen Code an Ihre E-Mail-Adresse geschickt. Bitte geben Sie den Code ein.',
	'activate.email.resend.headline': 'Es hat nicht funktioniert?',
	'activate.email.resend.new': 'Neuen Code senden',
	'activate.email.resend.sent': 'Neuer Code gesendet',
	'email.change.confirmOverlay.title': 'E-Mail-Adresse bearbeiten',
	'email.change.confirmOverlay.copy.1':
		'Sie nutzen diese E-Mail-Adresse als 2. Faktor für eine sichere Anmeldung.',
	'email.change.confirmOverlay.copy.2':
		'Deaktivieren Sie die 2-Faktor-Authentifizierung um die E-Mail-Adresse zu bearbeiten.',
	'email.change.confirmOverlay.button.confirm':
		'Authentifizierung deaktivieren',
	'email.change.confirmOverlay.button.deny': 'Abbrechen',
	'email.delete.confirmOverlay.copy':
		'wird die 2-Faktor-Authentifizierung deaktiviert.',
	'switch.type.label': 'Ihr 2. Faktor',
	'switch.type.EMAIL': 'E-Mail',
	'switch.type.APP': 'App',
	'nag.title': 'Schützen Sie Ihr Konto',
	'nag.copy':
		'Sichern Sie Ihr Konto vor einem möglichen unbefugtem Zugriff. Nutzen Sie einen 2. Faktor (App oder E-Mail) für die Anmeldung in der Online-Beratung.',
	'nag.button.later': 'Später erinnern',
	'nag.button.protect': 'Jetzt schützen'
};

export default twoFactorAuth;
