export const de = {
	absence: {
		'overlay': {
			'button1.label': 'Ja',
			'button2.label': 'Nein',
			'changeSuccess': {
				buttonLabel: 'Schließen',
				headline:
					'Der Status Ihrer Abwesenheitsnachricht wurde erfolgreich aktualisiert.'
			},

			'copy': 'Ihre Abwesenheitsnachricht ist momentan aktiviert. <br> Möchten Sie diese deaktivieren?',
			'headline': 'Willkommen zurück!'
		},
		'checkbox.label': 'Ratsuchende über meine Abwesenheit informieren',
		'input.infoText':
			'Ratsuchende sehen diese Abwesenheitsnachricht, können Ihnen aber weiterhin schreiben.'
	},
	aliases: {
		lastMessage: {
			e2ee_activated: 'Informationen zu Ihrer Datensicherheit',
			further_steps: 'So geht es weiter',
			master_key_lost: '',
			reassign_consultant: {
				CONFIRMED: 'neu zugewiesen',
				REJECTED: 'Zuweisung abgelehnt',
				REQUESTED: 'Anfrage zur Zuweisung'
			},
			// WORKAROUND for reassignment lastMessage bug
			reassign_consultant_reset_last_message: 'neu zugewiesen'
		}
	},
	anonymous: {
		listItem: {
			activeLabel: 'Aktiv'
		},
		overlay: {
			chatWasFinished: {
				button: 'Zu Caritas.de',
				copy: 'Sie haben nun keinen Zugriff mehr auf Ihren Chat-Verlauf.',
				headline: 'Ihr_e Berater_in hat den Chat beendet.'
			},
			finishChat: {
				'asker.copy':
					'Wenn Sie diesen Chat beenden, haben Sie keinen Zugriff mehr auf Ihren Chat-Verlauf.',
				'button1': 'Chat beenden',
				'button2': 'Abbrechen',
				'consultant.copy':
					'Der Ratsuchende wird darüber informiert und kann danach nicht mehr auf den Chat-Verlauf zugreifen.',
				'headline': 'Möchten Sie diesen Chat beenden?',
				'success': {
					headline: 'Der Chat wurde erfolgreich beendet.',
					button: 'Zu Caritas.de'
				}
			}
		},
		session: {
			'finishChat': 'Chat beenden',
			'infoMessage.chatFinished':
				'Die Nachrichten werden 48h nach dem Beenden des Chats gelöscht.',
			'systemMessage.chatFinished': 'Der Chat wurde beendet.'
		},
		waitingroom: {
			'dataProtection': {
				button: 'Ich bin einverstanden',
				description:
					'Danach dürfen unsere Berater_innen einen Chat mit Ihnen starten.',
				headline: 'Herzlich Willkommen',
				subline:
					'Bitte bestätigen Sie unsere Datenschutzbestimmungen. Danach dürfen unsere Berater_innen einen Chat mit Ihnen starten.'
			},
			'errorPage': {
				button: 'Neu laden',
				description:
					'Es tut uns leid da ist wohl etwas schief gelaufen.<br>Versuchen Sie es erneut.',
				headline: 'Ups!'
			},
			'closed': {
				headline: 'Momentan ist unser Live-Chat nicht besetzt.',
				description:
					'Auf unserer <a target="_blank" href="{{websiteUrl}}">Website</a> finden Sie im jeweiligen Themenbereich die Öffnungszeiten des Chats.',
				illustrationTitle: 'Chat geschlossen'
			},
			'headline': 'Bitte haben Sie etwas Geduld',
			'info.accountDeletion':
				'Um Ihre Anonymität zu schützen, löschen wir Ihre Nachrichten spätestens 48 Stunden nachdem der Chat beendet wurde.',
			'overlay': {
				acceptance: {
					headline: 'Herzlich Willkommen!',
					copy: 'Sie werden von Ihrer Berater_in im Chat erwartet. Sind Sie bereit?',
					button: 'Jetzt chatten'
				},
				rejection: {
					headline: 'Chat-Zeit beendet.',
					copy: 'Leider konnten wir innerhalb der Chat-Zeit nicht auf Ihr Anliegen eingehen. Registrieren Sie sich und hinterlassen Sie uns Ihre Nachricht. Wir melden uns innerhalb von 2 Werktagen bei Ihnen.',
					button: 'Zur Registrierung'
				}
			},
			'redirect': {
				subline:
					'Registrieren Sie sich und hinterlassen Sie uns eine Nachricht. Wir melden uns innerhalb von 2 Werktagen bei Ihnen. <br><br>Gehen Sie zur <a href="registration">Registrierung</a>',
				title: 'Sie benötigen nicht sofort eine Antwort? Und wollen nicht auf einen freien Chat warten?'
			},
			'subline':
				'Derzeit sind alle Berater_innen im Gespräch. Wir sind schnellstmöglich für Sie da.',
			'title.start': 'Warteraum',
			'username': {
				loading: 'Wird geladen...',
				text: 'Ihr Benutzername lautet:'
			}
		}
	},
	app: {
		'title': 'Beratung & Hilfe',
		'claim': 'Online. Anonym. Sicher.',
		'save': 'Speichern',
		'remove': 'Entfernen',
		'download': 'Herunterladen',
		'stage.title': 'Beratung & Hilfe',
		'logout': 'Abmelden',
		'close': 'Schließen',
		'open': 'Öffnen',
		'delete': 'Eingabe löschen',
		'scrollDown': 'Nach unten scrollen',
		'menu': 'Weitere Funktionen',
		'back': 'Zurück',
		'next': 'Weiter',
		'successful': 'Erfolgreich',
		'faulty': 'Fehlerhaft',
		'selectLanguage': 'Sprache wählen',
		'wait': 'Bitte warten'
	},
	appointments: {
		copy: {
			link: {
				'notification.text':
					'Einladungslink zum Video-Call in Zwischenablage kopiert!',
				'notification.title': 'Link kopiert',
				'text': 'Link kopieren',
				'title': 'Einladungslink in Zwischenablage kopieren'
			}
		},
		noAppointments: 'Aktuell gibt es keine Termine',
		notification: {
			'saved.title': 'Der Termin wurde erfolgreich gespeichert.'
		},
		onlineMeeting: {
			form: {
				date: 'Datum',
				description: 'Beschreibung',
				time: 'Beginn (hh:mm)',
				title: 'Titel'
			},
			start: 'Video-Call starten',
			overlay: {
				add: {
					'button.add': 'Speichern',
					'button.cancel': 'Abbruch',
					'headline': 'Neuer Video-Call'
				},
				delete: {
					'button.cancel': 'Abbruch',
					'button.delete': 'Löschen',
					'copy': 'Möchten Sie diesen Video-Call wirklich löschen?',
					'headline': 'Video-Call löschen'
				},
				edit: {
					headline: 'Video-Call bearbeiten'
				},
				start: {
					'button.cancel': 'Abbruch',
					'button.start': 'Starten',
					'copy': 'Sie starten jetzt den Video-Call. Eingeladene Teilnehmer_innen können ab sofort mit dem Einladungslink beitreten.',
					'headline': 'Video-Call starten'
				}
			}
		},
		qrCode: {
			headline: 'Einladungslink QR-Code',
			text: 'Wenn Sie Ihren QR-Code mit jemandem teilen, kann diese Person ihn mit der Handykamera scannen, um direkt am Video-Call teilzunehmen. Alternativ können Sie den Code auch herunterladen.'
		},
		showLess: 'Weniger anzeigen',
		showMore: 'Mehr anzeigen',
		title: 'Terminübersicht',
		newAppointment: 'Neuer Videotermin'
	},
	archive: {
		overlay: {
			session: {
				'success.button': 'Schließen',
				'success.copy':
					'Sie haben den Ratsuchenden erfolgreich archiviert.'
			},
			teamsession: {
				'success.button': 'Schließen',
				'success.copy':
					'Sie haben den Ratsuchenden für sich und Ihr Team erfolgreich archiviert.'
			}
		},
		submitInfo: {
			message:
				'Sobald Sie oder der Ratsuchende eine Nachricht schreibt, wird der Nachrichtenverlauf automatisch wieder in die Liste der Ratsuchenden eingeordnet.',
			headline: 'Die Beratung ist archiviert.'
		}
	},
	attachments: {
		'download.label': 'Herunterladen',
		'error': {
			format: {
				headline: 'Ihre Datei konnte nicht gesendet werden.',
				message:
					'Ihre Datei konnte nicht gesendet werden. Erlaubt sind Bilder (jpg und png), sowie Dokumente (docx und pdf). Bitte versuchen Sie es erneut.'
			},
			other: {
				headline: 'Es gab einen Fehler beim Hochladen der Datei.',
				message: 'Bitte versuchen Sie es erneut.'
			},
			quota: {
				headline: 'Sie haben das Limit zum Hochladen erreicht.',
				message: 'Bitte versuchen Sie es morgen erneut.'
			},
			size: {
				headline: 'Ihre gewählte Datei ist zu groß.',
				message: 'Sie können max. {{attachment_filesize}}MB hochladen.'
			}
		},
		'list': {
			'label.received': 'Sie haben eine Datei erhalten.',
			'label.sent': 'Sie haben eine Datei gesendet.'
		},
		'type': {
			'label.docx': 'DOCX',
			'label.jpeg': 'JPG',
			'label.mb': 'MB',
			'label.pdf': 'PDF',
			'label.png': 'PNG',
			'label.xlsx': 'XLSX'
		}
	},
	banUser: {
		'ban': {
			'info.1': 'Sie haben ',
			'info.2': ' gebannt.',
			'trigger': 'Bannen',
			'overlay.close': ' Hinweis schließen'
		},
		'banned': {
			headline: 'Sie wurden gebannt.',
			info: 'Wir haben Sie gebeten, die Chat-Regeln einzuhalten.<br/><br/>Weil Sie heute die Chat-Regeln wiederholt nicht eingehalten haben, haben wir Sie für den heutigen Chat ausgeschlossen.<br/><br/>Machen Sie sich mit den Chat-Regeln vertraut!</br></br>Wenn Sie bereit sind, die Chat-Regeln einzuhalten, sind Sie ab morgen wieder im Chat willkommen!'
		},
		'is.banned': ' Gebannt'
	},
	booking: {
		'availability': {
			description:
				'Geben Sie hier Ihre allgemeine Verfügbarkeit an, damit Ratsuchende Termine bei Ihnen buchen können.',
			title: 'Ihre Verfügbarkeit'
		},
		'calender': {
			'add': 'Kalender hinzufügen',
			'integration': {
				office365: 'Office 365/ Outlook Kalender',
				caldav: 'CalDav Server Kalender',
				google: 'Google Kalender',
				apple: 'Apple Kalender'
			},
			'synchronise': 'Synchronisieren',
			'synchroniseCalender': {
				title: 'Kalender synchronisieren',
				description:
					'Synchronisieren Sie Ihren Kalender, den Sie in Ihrer Beratungsstelle nutzen, mit der Online Beratung. Ihre Verfügbarkeit wird dann automatisch angepasst und Terminkonflikte verhindert.'
			},
			'synchronised.calendars': 'Synchronisierte Kalender'
		},
		'event': {
			'asker': 'Ratsuchende_r',
			'booking': {
				cancel: 'Absagen',
				reschedule: 'Verschieben'
			},
			'copy': {
				'link.notification.title': 'Link kopiert',
				'link.notification.text':
					'Einlandungslink zum Video-Call in Zwischenablage kopiert!'
			},
			'description': 'Ihre Nachricht zum Termin',
			'show': {
				more: 'Mehr anzeigen',
				less: 'Weniger anzeigen'
			},
			'tab': {
				booked: 'Gebuchte Termine',
				canceled: 'Storniert',
				expired: 'Vergangen',
				settings: 'Einstellungen'
			},
			'your.counselor': 'Ihr Berater',
			'linkVideo': 'Link zum Video-Call',
			'appointmentType': 'Gewünschte Terminart',
			'location': {
				IN_PERSON: 'In der Beratungsstelle',
				PHONE_CALL: 'Telefon-Beratung',
				VIDEO_CALL: 'Videoberatung',
				CHAT: 'Text-Chat'
			},
			'tooltip': {
				consultant:
					'Falls Sie den Termin nicht in dem vom Rastsuchenden gewählten Modus wahrnehmen können, generieren wir für Sie immer einen Link zum Video-Call als Alternative.',
				adviceSeeker:
					'Falls Ihr:e Berater:in den Termin nicht in dem von Ihnen gewählten Modus wahrnehmen kann, generieren wir für Sie immer einen Link zum Video-Call als Alternative.'
			}
		},
		'info.video': 'Videoberatung',
		'video.button.label': 'Video-Call starten',
		'mobile.calendar.label': 'Termin erstellen',
		'my': {
			'booking.title': 'Aktuell sind keine Termine geplant.',
			'booking.schedule': 'Vereinbaren Sie jetzt einen Termin mit'
		},
		'schedule': 'Termin vereinbaren'
	},
	chatFlyout: {
		askerProfil: 'Ratsuchendenprofil',
		dataProtection: 'Datenschutz',
		documentation: 'Dokumentation',
		feedback: 'Feedback',
		groupChatInfo: 'Chat-Info',
		imprint: 'Impressum',
		editGroupChat: 'Chat-Einstellungen',
		leaveGroupChat: 'Chat verlassen',
		stopGroupChat: 'Chat beenden',
		archive: 'Archivieren',
		dearchive: 'Dearchivieren',
		remove: 'Löschen'
	},
	consultant: {
		'jobTitle': 'Berater_in',
		'absent.message': ' ist abwesend'
	},
	date: {
		day: {
			0: {
				long: 'Sonntag',
				short: 'So'
			},
			1: {
				long: 'Montag',
				short: 'Mo'
			},
			2: {
				long: 'Dienstag',
				short: 'Di'
			},
			3: {
				long: 'Mittwoch',
				short: 'Mi'
			},
			4: {
				long: 'Donnerstag',
				short: 'Do'
			},
			5: {
				long: 'Freitag',
				short: 'Fr'
			},
			6: {
				long: 'Samstag',
				short: 'Sa'
			}
		},
		month: {
			0: {
				long: 'Januar',
				short: 'Jan'
			},
			1: {
				long: 'Februar',
				short: 'Feb'
			},
			2: {
				long: 'März',
				short: 'Mär'
			},
			3: {
				long: 'April',
				short: 'Apr'
			},
			4: {
				long: 'Mai',
				short: 'Mai'
			},
			5: {
				long: 'Juni',
				short: 'Jun'
			},
			6: {
				long: 'Juli',
				short: 'Jul'
			},
			7: {
				long: 'August',
				short: 'Aug'
			},
			8: {
				long: 'September',
				short: 'Sep'
			},
			9: {
				long: 'Oktober',
				short: 'Okt'
			},
			10: {
				long: 'November',
				short: 'Nov'
			},
			11: {
				long: 'Dezember',
				short: 'Dez'
			}
		}
	},
	deleteAccount: {
		'button.label': 'Account löschen',
		'confirmOverlay': {
			'button.confirm': 'Ja',
			'button.deny': 'Nein',
			'copy': '<strong>Dieser Vorgang kann nicht rückgängig gemacht werden.</strong><br><br>Ihr Account wird innerhalb der nächsten 48 Stunden gelöscht. Ihre Daten werden gemäß der geltenden Datenschutzbestimmungen gelöscht.<br><br>Bitte geben Sie Ihr Passwort ein, um Ihren Account nun zu löschen.',
			'headline': 'Möchten Sie Ihren Account wirklich löschen?',
			'input.label': 'Passwort',
			'input.warning': 'Ihr Passwort ist nicht korrekt.'
		},
		'successOverlay': {
			headline:
				'Sie haben Ihren Account bei der Caritas Beratung & Hilfe erfolgreich gelöscht.',
			button: 'Schließen'
		}
	},
	deleteSession: {
		confirmOverlay: {
			'button.confirm': 'Ja',
			'button.deny': 'Nein',
			'copy': 'Möchten Sie den Chat wirklich löschen?',
			'headline': 'Chat löschen'
		},
		errorOverlay: {
			button: 'Ok',
			headline:
				'Ups! Wir konnten den Chat gerade nicht löschen. Bitte versuchen Sie es noch einmal.'
		},
		successOverlay: {
			button: 'Ok',
			headline: 'Sie haben den Chat erfolgreich gelöscht.'
		}
	},
	e2ee: {
		hint: 'Ihre Nachrichten sind Ende-zu-Ende verschlüsselt. Das bedeutet, niemand außerhalb dieses Chats kann die Nachrichten lesen. Nicht einmal die Online-Beratungs-Plattform.',
		message: {
			'encryption.error':
				'Nachricht verschlüsselt - Fehler beim Entschlüsseln',
			'encryption.text': 'Nachricht verschlüsselt'
		},
		attachment: {
			encrypted: 'Datei für Download entschlüsseln',
			is_decrypting: 'Datei wird entschlüsselt',
			decryption_error: 'Fehler beim entschlüsseln',
			save: 'Datei downloaden',
			error: {
				title: 'Leider, konnten wir die Datei nicht entschlüsseln und downloaden.',
				text: 'Bitten Sie den Sender oder die Senderin die Datei erneut zu schicken. Downloaden Sie dann die neue Datei.'
			}
		},
		inProgress: {
			headline: 'Einen Moment bitte.',
			copy: 'Ihre Sicherheit ist uns wichtig! Wir verschlüsseln gerade Ihren Chat. Dies kann einen Moment dauern.',
			confirm:
				'Bitte warten Sie bis die Verschlüsselung abgeschlossen ist!'
		},
		roomNotFound: {
			'notice.line1': 'Ohh!',
			'notice.line2':
				'Es tut uns leid, da ist wohl etwas schief gelaufen.',
			'notice.line3':
				'Bitte laden Sie die Seite neu und probieren Sie es nochmal.',
			'notice.link': 'Seite neu laden'
		},
		subscriptionKeyLost: {
			message: {
				primary:
					'Ein_e Chat-Teilnehmer_in hat keinen Zugriff mehr auf den Nachrichtenverlauf.',
				secondary:
					'Ein_e Chat-Teilnehmer_in hatte zwischenzeitlich keinen Zugriff mehr auf den Nachrichtenverlauf. Nun können alle Chat-Teilnehmer wieder auf den Nachrichtenverlauf zugreifen.',
				more: 'Mehr erfahren'
			},
			notice: {
				link: 'Benachrichtigung schicken',
				text: 'Da Sie Ihr Passwort zurückgesetzt haben, sind die Nachrichten für Sie momentan nicht lesbar. Sobald ein_e Chat-Teilnehmer_in den Chat wieder öffnet, können Sie die Nachrichten wieder lesen und Neue schreiben.',
				title: 'Ihre Sicherheit ist uns wichtig!',
				more: 'Mehr erfahren'
			},
			overlay: {
				'copy': 'Ihre Nachrichten sind aus Sicherheitsgründen Ende-zu-Ende verschlüsselt. Das bedeutet, niemand außerhalb dieses Chats kann die Nachrichten lesen. Nicht einmal die Online-Beratungs-Plattform.<br/><br/>Wenn das Passwort zurückgesetzt wird, sind die Nachrichten vorübergehend nicht lesbar. Sobald ein_e weitere_r Chat-Teilnehmer_in den Chat wieder öffnet, können die Nachrichten neu verschlüsselt werden. Somit können wieder allen Chat-Teilnehmer_innen Nachrichten lesen und schreiben.',
				'button.close': 'Schließen',
				'headline': 'Ende-zu-Ende Verschlüsselung'
			}
		}
	},
	enquiry: {
		'acceptButton': {
			anonymous: 'Chat starten',
			known: 'Anfrage annehmen'
		},
		'anonymous': {
			'infoLabel.start': 'Starten Sie nun den Chat mit ',
			'infoLabel.end': '.'
		},
		'write': {
			infotext: {
				copy: {
					facts: '<ul><li>Was ist passiert?</li><li>Wie ist Ihre aktuelle Situation?</li><li>Was beschäftigt Sie?</li><li>Haben Sie eine bestimmte Frage oder wissen Sie vielleicht selbst noch nicht so genau was Ihnen helfen könnte?</li></ul>',
					title: 'Vielleicht helfen Ihnen folgende Punkte bei der Formulierung weiter:'
				},
				headline: 'Hier ist Platz für Ihre Anliegen.',
				iconTitle: 'Willkommen'
			},
			input: {
				'placeholder': {
					asker: 'Schreiben Sie uns, was Sie bewegt.',
					consultant: 'Nachricht an Klient_in schreiben',
					feedback: {
						main: 'Nachricht an Peer schreiben',
						peer: 'Nachricht an Teamleiter_in schreiben'
					},
					groupChat: 'Nachricht schreiben'
				},
				'button.title': 'Nachricht senden',
				'attachement': 'Anhang hinzufügen',
				'emojies': 'Emoji einfügen',
				'format': 'Text formatieren'
			},
			overlay: {
				copy: 'Innerhalb von zwei Werktagen erhalten Sie eine Antwort von uns.',
				button: 'Zur Nachricht',
				headline: 'Vielen Dank für Ihre Nachricht!'
			}
		},
		'language.selection.headline':
			'Bitte wählen Sie die Sprache, in der Sie beraten werden wollen.'
	},
	error: {
		statusCodes: {
			400: {
				description: 'Die von Ihnen eingegebene URL ist ungültig.',
				headline: 'Ups!'
			},
			401: {
				description:
					'Leider sind Sie nicht berechtigt diese Seite einzusehen.',
				headline: 'Schade!'
			},
			404: {
				description:
					'Es tut uns leid da ist wohl etwas schief gelaufen.<br>Wir konnten die gewünschte Seite nicht finden.',
				headline: 'Ohh!'
			},
			500: {
				description:
					'Wie es aussieht haben wir momentan ein Serverproblem.<br>Versuchen Sie es später noch einmal.',
				headline: 'Ups!'
			}
		},
		login: 'Einloggen'
	},
	furtherSteps: {
		'consultant.info':
			'Der_die Ratsuchende wurde folgendermaßen über die nächsten Schritte informiert.',
		'headline': 'So geht es weiter:',
		'arrowTitle': 'Weiter',
		'step1.info': 'Wir haben Ihre Nachricht erhalten.',
		'step1.iconTitle': 'Geöffneter Brief',
		'step2.info': 'Jetzt finden wir eine_n passende_n Berater_in für Sie.',
		'step2.iconTitle': 'Berater Brille',
		'step3.info': 'Ihr_e Berater_in antwortet innerhalb von 2 Werktagen.',
		'step3.iconTitle': 'Sprechblasen',
		'emailNotification': {
			button: 'E-Mail-Adresse angeben',
			headline:
				'E-Mail-Benachrichtigung erhalten & Passwort zurücksetzen',
			infoText:
				'Wenn Sie Ihre E-Mail-Adresse angeben (freiwillig)<br><ul><li>erhalten Sie eine E-Mail-Benachrichtigung, wenn Ihre Berater_in Ihnen geschrieben hat</li><li>können Sie Ihr Passwort zurücksetzen, falls Sie es vergessen haben.</li></ul>Ihre E-Mail-Adresse kann von den Berater_innen nicht eingesehen werden.'
		},
		'twoFactorAuth': {
			button: 'Konto schützen',
			headline: 'Der Schutz Ihrer Daten ist uns wichtig',
			infoText:
				'Sichern Sie Ihr Konto vor einem möglichen unbefugten Zugriff. Nutzen Sie einen zweiten Faktor (App oder E-Mail) für die Anmeldung in der Online-Beratung.'
		},
		'email': {
			'overlay': {
				'headline': 'E-Mail-Adresse angeben',
				'input.label': 'E-Mail',
				'input.valid': 'Ihre E-Mail-Adresse ist gültig.',
				'input.invalid': 'Ihre E-Mail-Adresse ist nicht gültig.',
				'input.unavailable':
					'Diese E-Mail-Adresse ist bereits registriert.',
				'button1.label': 'Speichern',
				'button2.label': 'Schließen'
			},
			'success.overlay.headline':
				'Ihre E-Mail-Adresse wurde erfolgreich gespeichert.'
		},
		'voluntaryInfo': {
			headline: 'Wir wollen Sie bestmöglichst beraten',
			infoText:
				'Dabei hilft es uns, wenn Sie weitere freiwillige Angaben zu sich und Ihrem Anliegen machen.',
			button: 'Angaben hinzufügen',
			overlay: {
				'button1.label': 'Speichern',
				'button2.label': 'Schließen',
				'copy': 'Für die Beratung würden uns folgende Angaben sehr helfen.',
				'headline': 'Freiwillige Angaben',
				'success.headline':
					'Vielen Dank. Ihre freiwilligen Angaben wurden erfolgreich gespeichert.'
			}
		}
	},
	groupChat: {
		'active.sessionInfo.subscriber': 'Teilnehmende',
		'cancel.button.label': 'Abbrechen',
		'create': {
			'beginDateInput.label': 'Beginn (hh:mm)',
			'button.label': 'Chat anlegen',
			'dateInput.label': 'Datum',
			'durationSelect': {
				label: 'Dauer',
				option1: '30 Minuten',
				option2: '1 Stunde',
				option3: '1,5 Stunden',
				option4: '2 Stunden',
				option5: '2,5 Stunden',
				option6: '3 Stunden'
			},
			'listItem.label': 'Neuer Chat',
			'repetitiveCheckbox.label': 'wöchentlich wiederholen',
			'subtitle': 'Thema des Chats',
			'title': 'Neuer Chat',
			'topicInput': {
				label: 'Thema des Chats',
				warning: {
					long: 'Das Thema ist zu lang',
					short: 'Das Thema ist zu kurz'
				}
			}
		},
		'createError': {
			overlay: {
				headline:
					'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
				buttonLabel: 'Schließen'
			}
		},
		'createSuccess': {
			overlay: {
				buttonLabel: 'Schließen',
				headline: 'Sie haben erfolgreich einen Chat angelegt.'
			}
		},
		'copy': {
			link: {
				text: 'Einladungs-Link kopieren',
				notification: {
					text: 'Link in Zwischenablage kopiert!',
					title: 'Link kopiert'
				}
			}
		},
		'edit.title': 'Chat-Einstellungen',
		'info': {
			headline: 'Chat-Info',
			subscribers: {
				headline: 'Teilnehmende',
				empty: 'keine Teilnehmenden vorhanden'
			},
			settings: {
				duration: 'Dauer',
				edit: 'Bearbeiten',
				headline: 'Chat-Einstellungen',
				repetition: {
					label: 'Wiederholungen',
					single: 'einmalig',
					weekly: 'wöchentlich'
				},
				startDate: 'Datum',
				startTime: 'Beginn',
				topic: 'Thema des Chats'
			}
		},
		'join': {
			'button.label.join': 'Teilnehmen',
			'button.label.start': 'Chat starten',
			'chatClosedOverlay': {
				button1Label: 'Zur Übersicht',
				button2Label: 'Logout',
				headline: 'Der Chat wurde bereits beendet.'
			},
			'content.headline': '"Spielregeln" des Chats',
			'warning.message':
				'Ihr Berater_in/Moderator_in hat den Chat noch nicht gestartet. Sobald Ihr Berater_in/Moderator_in den Chat gestartet hat können Sie mit uns chatten. Bitte haben Sie noch etwas Geduld.'
		},
		'joinError': {
			overlay: {
				buttonLabel: 'Schließen',
				headline:
					'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
			}
		},
		'leaveChat': {
			securityOverlay: {
				button1Label: 'Chat verlassen',
				button2Label: 'Abbrechen',
				headline: 'Möchten Sie den Chat wirklich verlassen?'
			},
			successOverlay: {
				button1Label: 'Zur Übersicht',
				button2Label: 'Logout',
				headline: 'Der Chat wurde erfolgreich verlassen.'
			}
		},
		'listItem': {
			activeLabel: 'Aktiv',
			subjectEmpty: {
				self: 'Sie haben den Chat erstellt.',
				other: 'Der Chat wurde erstellt.'
			}
		},
		'save.button.label': 'Speichern',
		'stopChat': {
			securityOverlay: {
				button1Label: 'Chat beenden',
				button2Label: 'Abbrechen',
				copyRepeat:
					'Der Chatverlauf wird gelöscht und alle User entfernt.',
				copySingle: 'Der Chat wird gelöscht und alle User entfernt.',
				headline: 'Möchten Sie den Chat wirklich beenden?'
			},
			successOverlay: {
				button1Label: 'Zur Übersicht',
				button2Label: 'Logout',
				headline: 'Der Chat wurde erfolgreich beendet.'
			}
		},
		'stopped': {
			overlay: {
				button1Label: 'Zur Übersicht',
				button2Label: 'Logout',
				headline: 'Der Chat wurde beendet.'
			}
		},
		'updateSuccess': {
			overlay: {
				button1Label: 'Schließen',
				headline: 'Ihre Änderungen wurden erfolgreich gespeichert.'
			}
		}
	},
	help: {
		googleChrome: 'Google Chrome',
		msEdge: 'Microsoft Edge',
		openInNewTab: 'In neuem Tab öffnen',
		videoCall: {
			asker: {
				intro: 'Um Ende-zu Ende verschlüsselt zu telefonieren, befolgen Sie folgende Schritte:',
				steps: {
					'1': 'Öffnen Sie den Link zu Google Chrome oder Microsoft Edge.',
					'2': 'Laden Sie sich Chrome oder Edge herunter.',
					'3': 'Installieren Sie Chrome oder Edge auf Ihrem PC/Laptop/Tablet/Smartphone.',
					'4': 'Öffnen Sie nun über Chrome oder Edge die Online-Beratung.',
					'5': 'Melden Sie sich bei der Online-Beratung an.',
					'6': 'Bitten Sie Ihre_n Berater_in Sie nochmals anzurufen.',
					'headline': {
						'1': 'Video-Call',
						'2': 'Sie haben bereits Google Chrome oder Microsoft Edge?'
					}
				}
			},
			consultant: {
				headline: 'Video-Call',
				intro: 'Um einen Video-Call starten zu können, müssen Sie sich über Google Chrome oder Microsoft Edge bei der Online-Beratung anmelden. Somit kann der Video-Call Ende-zu-Ende verschlüsselt werden und Sie können starten.',
				steps: {
					'1.1': 'Folgen Sie dem Link zu ',
					'1.2': ' oder ',
					'2': 'Laden Sie sich Chrome oder Edge herunter. Dafür brauchen Sie möglicherweise die Unterstützung Ihrer EDV.',
					'3': 'Installieren Sie Chrome oder Edge auf Ihrem PC/Laptop/Tablet/Smartphone.',
					'4': 'Öffnen Sie nun über Chrome oder Edge die Online-Beratung.',
					'5': 'Melden Sie sich bei der Online-Beratung an.',
					'6': 'Starten Sie den Video-Call.',
					'headline': {
						'1': 'Schritt für Schritt Anleitung',
						'2': 'Sie haben bereits Google Chrome oder Microsoft Edge?'
					}
				}
			},
			loginLink: {
				notification: {
					text: 'Link in Zwischenablage kopiert!',
					title: 'Link kopiert'
				},
				text: 'Link kopieren',
				title: 'Link in Zwischenablage kopieren'
			}
		}
	},
	jitsi: {
		btn: {
			default: 'Video-Link kopieren',
			copied: 'Video-Link wurde in die Zwischenablage kopiert'
		}
	},
	languages: {
		de: 'Deutsch',
		aa: 'Afar',
		ab: 'Abchasisch',
		ae: 'Avestisch',
		af: 'Afrikaans',
		ak: 'Akan',
		am: 'Amharisch',
		an: 'Aragonesisch',
		ar: 'Arabisch',
		as: 'Assamesisch',
		av: 'Awarisch',
		ay: 'Aymara',
		az: 'Aserbaidschanisch',
		ba: 'Baschkirisch',
		be: 'Belarussisch',
		bg: 'Bulgarisch',
		bh: 'Bihari',
		bi: 'Bislama',
		bm: 'Bambara',
		bn: 'Bengalisch',
		bo: 'Tibetisch',
		br: 'Bretonisch',
		bs: 'Bosnisch',
		ca: 'Katalanisch, Valencianisch',
		ce: 'Tschetschenisch',
		ch: 'Chamorro',
		co: 'Korsisch',
		cr: 'Cree',
		cs: 'Tschechisch',
		cu: 'Kirchenslawisch, Altkirchenslawisch',
		cv: 'Tschuwaschisch',
		cy: 'Walisisch',
		da: 'Dänisch',
		dv: 'Dhivehi',
		dz: 'Dzongkha',
		ee: 'Ewe',
		el: 'Griechisch',
		en: 'Englisch',
		eo: 'Esperanto',
		es: 'Spanisch, Kastilisch',
		et: 'Estnisch',
		eu: 'Baskisch',
		fa: 'Persisch',
		ff: 'Fulfulde',
		fi: 'Finnisch',
		fj: 'Fidschi',
		fo: 'Färöisch',
		fr: 'Französisch',
		fy: 'Westfriesisch',
		ga: 'Irisch',
		gd: 'Schottisch-gälisch',
		gl: 'Galicisch, Galegisch',
		gn: 'Guaraní',
		gu: 'Gujarati',
		gv: 'Manx,\nManx-Gälisch',
		ha: 'Hausa',
		he: 'Hebräisch',
		hi: 'Hindi',
		ho: 'Hiri Motu',
		hr: 'Kroatisch',
		ht: 'Haitianisch',
		hu: 'Ungarisch',
		hy: 'Armenisch',
		hz: 'Otjiherero',
		ia: 'Interlingua',
		id: 'Indonesisch',
		ie: 'Interlingue',
		ig: 'Igbo',
		ii: 'Yi',
		ik: 'Inupiaq',
		io: 'Ido',
		is: 'Isländisch',
		it: 'Italienisch',
		iu: 'Inuktitut',
		ja: 'Japanisch',
		jv: 'Javanisch',
		ka: 'Georgisch',
		kg: 'Kikongo',
		ki: 'Kikuyu',
		kj: 'oshiKwanyama',
		kk: 'Kasachisch',
		kl: 'Grönländisch, Kalaallisut',
		km: 'Khmer',
		kn: 'Kannada',
		ko: 'Koreanisch',
		kr: 'Kanuri',
		ks: 'Kashmiri',
		ku: 'Kurdisch',
		kv: 'Komi',
		kw: 'Kornisch',
		ky: 'Kirgisisch',
		la: 'Latein',
		lb: 'Luxemburgisch',
		lg: 'Luganda',
		li: 'Limburgisch, Südniederfränkisch',
		ln: 'Lingála',
		lo: 'Laotisch',
		lt: 'Litauisch',
		lu: 'Kiluba',
		lv: 'Lettisch',
		mg: 'Malagasy, Malagassi',
		mh: 'Marshallesisch',
		mi: 'Maori',
		mk: 'Mazedonisch',
		ml: 'Malayalam',
		mn: 'Mongolisch',
		mr: 'Marathi',
		ms: 'Malaiisch',
		mt: 'Maltesisch',
		my: 'Birmanisch',
		na: 'Nauruisch',
		nb: 'Bokmål',
		nd: 'Nord-Ndebele',
		ne: 'Nepali',
		ng: 'Ndonga',
		nl: 'Niederländisch, Belgisches Niederländisch',
		nn: 'Nynorsk',
		no: 'Norwegisch',
		nr: 'Süd-Ndebele',
		nv: 'Navajo',
		ny: 'Chichewa',
		oc: 'Okzitanisch',
		oj: 'Ojibwe',
		om: 'Oromo',
		or: 'Oriya',
		os: 'Ossetisch',
		pa: 'Panjabi, Pandschabi',
		pi: 'Pali',
		pl: 'Polnisch',
		ps: 'Paschtunisch',
		pt: 'Portugiesisch',
		qu: 'Quechua',
		rm: 'Bündnerromanisch, Romanisch',
		rn: 'Kirundi',
		ro: 'Rumänisch',
		ru: 'Russisch',
		rw: 'Kinyarwanda, Ruandisch',
		sa: 'Sanskrit',
		sc: 'Sardisch',
		sd: 'Sindhi',
		se: 'Nordsamisch',
		sg: 'Sango',
		si: 'Singhalesisch',
		sk: 'Slowakisch',
		sl: 'Slowenisch',
		sm: 'Samoanisch',
		sn: 'Shona',
		so: 'Somali',
		sq: 'Albanisch',
		sr: 'Serbisch',
		ss: 'Siswati',
		st: 'Sesotho, Süd-Sotho',
		su: 'Sundanesisch',
		sv: 'Schwedisch',
		sw: 'Swahili',
		ta: 'Tamil',
		te: 'Telugu',
		tg: 'Tadschikisch',
		th: 'Thai',
		ti: 'Tigrinya',
		tk: 'Turkmenisch',
		tl: 'Tagalog',
		tn: 'Setswana',
		to: 'Tongaisch',
		tr: 'Türkisch',
		ts: 'Xitsonga',
		tt: 'Tatarisch',
		tw: 'Twi',
		ty: 'Tahitianisch, Tahitisch',
		ug: 'Uigurisch',
		uk: 'Ukrainisch',
		ur: 'Urdu',
		uz: 'Usbekisch',
		ve: 'Tshivenda',
		vi: 'Vietnamesisch',
		vo: 'Volapük',
		wa: 'Wallonisch',
		wo: 'Wolof',
		xh: 'isiXhosa',
		yi: 'Jiddisch',
		yo: 'Yoruba',
		za: 'Zhuang',
		zh: 'Chinesisch',
		zu: 'isiZulu'
	},
	login: {
		'consultant': {
			overlay: {
				'success': {
					headline: 'Herzlich willkommen',
					button: 'Weiter'
				},
				'cancel.button': 'Zur Übersicht'
			}
		},
		'button.label': 'Anmelden',
		'headline': 'Login',
		'legal': {
			infoText: {
				impressum: 'Impressum',
				dataprotection: 'Datenschutzerklärung'
			}
		},
		'password': {
			label: 'Passwort',
			hide: 'Passwort verbergen',
			show: 'Passwort anzeigen',
			reset: {
				warn: {
					overlay: {
						'button.accept': 'Ja, zurücksetzen',
						'button.cancel': 'Zurück zum Login',
						'description':
							'Möchten Sie das Passwort dennoch zurücksetzen?',
						'title':
							'Durch das Zurücksetzen des Passworts kann der Zugriff auf Ihre Nachrichten eventuell nicht mehr gewährleistet werden.'
					}
				}
			}
		},
		'register': {
			infoText: {
				title: 'Noch nicht registriert?',
				copy: 'Wir beraten Sie gerne zu folgenden Themen:'
			},
			linkLabel: 'Zu den Beratungsthemen'
		},
		'resend.otp.email.label': 'Einmal-Code erneut senden',
		'resetPasswort.label': 'Passwort vergessen?',
		'seperator': 'oder',
		'user.label': 'Benutzername/E-Mail',
		'warning': {
			failed: {
				'app.otp.missing':
					'Bitte geben Sie den Code aus Ihrer App für die Zwei-Faktor-Authentifizierung ein.',
				'email.otp.missing':
					'Bitte geben Sie den Code aus Ihrer E-Mail für die Zwei-Faktor-Authentifizierung ein.',
				'unauthorized': {
					otp: 'Ihre Zugangsdaten sind nicht korrekt. Bitte versuchen Sie es erneut.',
					text: 'Benutzername oder Passwort sind nicht korrekt. Bitte versuchen Sie es erneut.'
				},
				'deletedAccount':
					'Ihr Account wurde zur Löschung vorgemerkt. Ihre Daten werden in den nächsten 24 Stunden gelöscht.'
			}
		}
	},
	message: {
		'appointment': {
			component: {
				header: {
					cancellation: 'Terminabsage',
					change: 'Terminänderung',
					confirmation: 'Terminbestätigung'
				}
			}
		},
		'appointmentCancelled.title': 'Ihr Termin wurde abgesagt',
		'appointmentRescheduled.title': 'Ihr Termin wurde verschoben',
		'appointmentSet': {
			'addToCalendar': 'Zum Kalender hinzufügen',
			'and': 'und',
			'between': 'zwischen',
			'cancel': 'Termin absagen',
			'info.video': 'Videoberatung',
			'title': 'Ihr Termin wurde erstellt'
		},
		'copy.title': 'Nachricht in Zwischenablage kopieren',
		'dayBeforeYesterday': 'Vorgestern',
		'forward': {
			label: 'Weitergeleitete Nachricht von {{username}}, {{date}} um {{time}}',
			title: 'Textnachricht an\nFeedback weiterleiten'
		},
		'isMyMessage.name': 'Ich',
		'submit': {
			booking: {
				headline: 'Oder vereinbare jetzt einen Termin',
				buttonLabel: 'Termin zur Beratung vereinbaren'
			}
		},
		'today': 'Heute',
		'tomorrow': 'Morgen',
		'write.peer.checkbox.label': 'Feedback anfordern',
		'yesterday': 'Gestern',
		'delete': {
			delete: 'Löschen',
			deleted: {
				own: 'Sie haben diese Nachricht gelöscht.',
				other: 'Diese Nachricht wurde gelöscht.'
			},
			overlay: {
				headline: 'Nachricht löschen',
				copy: 'Möchten Sie die Nachricht wirklich löschen?',
				cancel: 'Abbrechen',
				confirm: 'Löschen'
			}
		},
		'note.title': 'Notiz',
		'unread': 'ungelesen',
		'read': 'gelesen',
		'sent': 'zugestellt',
		'groupChat': 'Gruppenchat',
		'liveChat': 'Live Chat',
		'newEnquiry': 'Neue Anfrage'
	},
	monitoring: {
		title: 'Monitoring',
		empty: 'Keine Angabe',
		checked: 'Unterpunkte ausgewählt',
		monitoringAddiction: {
			addictiveDrugs: 'Suchtmittel',
			alcohol: 'Alkohol',
			drugs: 'Drogen',
			cannabis: 'Cannabis',
			hallucinogens: 'Halluzinogene',
			amphetamines: 'Amphetamine',
			cocaineCrack: 'Kokain/Crack',
			opioids: 'Opioide',
			others: 'Andere',
			legalHighs: 'Legal Highs/Neue psychoaktive Substanzen',
			tobacco: 'Tabak',
			medication: 'Medikamente',
			gambling: 'Glücksspiel',
			offline: 'Offline',
			online: 'Online',
			internetComputer: 'Internet/Computer',
			chatting: 'Chatten',
			gaming: 'Gaming',
			shopping: 'Shopping',
			pornography: 'Pornographie/Sexsucht',
			surfing: 'Surfen',
			eatingDisorder: 'Essstörung',
			intervention: 'Intervention',
			information: 'Information',
			conveyance: 'Weitervermittlung',
			consulting: 'Beratung',
			doctorClinic: 'Arzt/Ärztin/Klinik',
			debtConsulting: 'Schuldnerberatung',
			pregnancyConsulting: 'Schwangerschaftsberatung',
			psychologicalSupport: 'Psychologische Betreuung',
			childYouthAid: 'Kinder- und Jugendhilfe',
			addictionHelpFacility: 'Suchthilfeeinrichtung',
			delinquentHelp: 'Straffälligenhilfe',
			selfHelp: 'Selbsthilfe',
			generalConsulting: 'Allgemeine Sozialberatung'
		},
		monitoringU25: {
			'generalData': 'Rahmendaten',
			'location': 'Wohnort',
			'freiburg': 'Freiburg',
			'badenWuerttemberg': 'Baden Württemberg',
			'bavaria': 'Bayern',
			'berlin': 'Berlin',
			'brandenburg': 'Brandenburg',
			'bremen': 'Bremen',
			'hamburg': 'Hamburg',
			'hessia': 'Hessen',
			'mecklenburgWesternPomerania': 'Mecklenburg-Vorpommern',
			'lowerSaxony': 'Niedersachsen',
			'northRhineWestphalia': 'Nordrhein-Westfalen',
			'rhinelandPalatinate': 'Rheinland-Pfalz',
			'saarland': 'Saarland',
			'saxony': 'Sachsen',
			'saxonyAnhalt': 'Sachsen-Anhalt',
			'schleswigHolstein': 'Schleswig-Holstein',
			'thuringia': 'Thüringen',
			'abroadAustria': 'Ausland (Österreich)',
			'abroadSwitzerland': 'Ausland (Schweiz)',
			'abroadOthers': 'Ausland (sonstiges)',
			'occupation': 'Erwerbstätigkeit/Arbeitssituation',
			'school': 'Schule',
			'studies': 'Studium',
			'apprenticeship': 'Ausbildung',
			'employed': 'erwerbstätig',
			'unemployed': 'arbeitslos',
			'housingSituation': 'Wohnsituation',
			'family': 'in Familie',
			'partner': 'Partner_in',
			'livingCommunity': 'WG',
			'alone': 'allein lebend',
			'assistedLiving': 'betreute Wohnform',
			'homeless': 'ohne Wohnsitz',
			'consultingData': 'Beratungsdaten',
			'suicidality': 'Suizidalität bei Kontaktaufnahme',
			'crisis': 'Krise ohne Suizidalität',
			'thoughtsOfSuicide': 'Suizidgedanken',
			'acuteThoughtsOfSuicide': 'akute Suizidgedanken',
			'afterSuicideAttempt': 'nach Suizidhandlung',
			'stressfulFactors': 'Belastende Faktoren',
			'mentalOverload': 'Gefühl von Überforderung',
			'anxieties': 'Ängste',
			'futility': 'Sinnlosigkeit',
			'isolation': 'Isolation/Vereinsamung',
			'svv': 'SVV',
			'bullying': 'Mobbing',
			'sexualAbuse': 'sex. Missbrauch / Vergewaltigung',
			'mentalIllness': 'psychische Erkrankung',
			'substanceAbuse': 'Substanzmittelmissbrauch',
			'mediaConsumption': 'Starker Medienkonsum',
			'physicalIllness': 'körperliche Beschwerden / chronische Krankheit',
			'physicalHandicap': 'Körperliche Behinderung',
			'conflictsPartnership': 'Konflikte in der Partnerschaft',
			'divorce': 'Trennung',
			'deceaseLovedOne': 'Tod eines_r Nahestehende_n',
			'mourning.alt': 'Trauer',
			'concernLovedOne': 'Sorge um Nahestehende_n',
			'relationshipRelative': 'Beziehungssituation mit Angehörige_n',
			'relationshipSocialEnvironment':
				'Beziehungssituation im sozialen Umfeld',
			'workSchool': 'Arbeit / Schule / Beruf',
			'housingSituation.alt': 'Wohnsituation',
			'financialSituation': 'finanzielle Situation',
			'debt': 'Verschuldung',
			'experienceOfViolence': 'Gewalterfahrung',
			'stressfulChildhood': 'belastende Kindheit',
			'crime': 'Straftat/Gesetzeskonflikt',
			'migrationProblems': 'Probleme in Zusammenhang mit Migration',
			'sexualOrientation': 'Sexuelle Orientierung',
			'genderIdentity': 'Geschlechtliche Identität',
			'others': 'Sonstige',
			'supportDuration':
				'Dauer der Begleitung (nach Beendigung eintragen)',
			'onetime': 'einmalig',
			'oneMonth': 'bis 1 Monat',
			'threeMonths': 'bis 3 Monate',
			'sixMonths': 'bis 6 Monate',
			'oneYear': 'bis 1 Jahr',
			'oneAndAHalfYear': 'bis 1,5 Jahre',
			'longer': 'länger',
			'inConsultation': 'in Beratung',
			'diagnosis': 'Diagnose',
			'depression': 'Depression',
			'eatingDisorder': 'Essstörung',
			'adhs': 'ADHS',
			'borderline': 'Borderline',
			'autism': 'Autismus',
			'personalityDisorder': 'Persönlichkeitsstörung',
			'traumaRelatedDisorder': 'Traumafolgestörung',
			'anxietyDisorder': 'Angststörung',
			'addiction': 'Sucht',
			'obsessiveCompulsiveDisorder': 'Zwangsstörung',
			'schizophrenia': 'Schizophrenie',
			'furtherConnection': 'Weitere Anbindung',
			'outpatientTherapy': 'Ambulante Therapie',
			'inpationsTherapy': 'Stationäre Therapie/Tagesklinik',
			'consultation': 'Beratung',
			'supportGroups': 'Selbsthilfegruppe',
			'medicalTherapy': 'Medikamentöse Therapie',
			'endOfContact': 'Ende des Kontakts (Mehrfachnennung möglich)',
			'mutually': 'Einvernehmlich beendet',
			'noAnswer': 'Klient_in hat sich nicht mehr gemeldet',
			'suicideAnnouncement': 'Suizidankündigung',
			'suicide': 'Suizid',
			'others.alt': 'Sonstiges',
			'schoolStudies': 'Schule/Studium',
			'partnerLivingCommunity': 'mit Partner_in in WG',
			'concern': 'Sorge um Suizidgefährdete_n',
			'mourning': 'Trauer nach Suizid',
			'addictionDrugs': 'Sucht (Drogen/Medikamente)',
			'addictionAlcohol': 'Sucht (Alkohol)',
			'addictionInternetComputer': 'Sucht (Internet/Computer)',
			'addictionOthers': 'Sucht (sonstiges)',
			'noFirstAnswer': 'Klient_in hat auf Erstmail nicht reagiert',
			'helpfulness': 'Wie hilfreich war der Kontakt für Klient_in?',
			'one': '1 – nicht hilfreich',
			'two': '2',
			'three': '3',
			'four': '4',
			'five': '5',
			'six': '6',
			'seven': '7',
			'eight': '8',
			'nine': '9',
			'ten': '10 – sehr hilfreich'
		}
	},
	navigation: {
		'appointments': 'Video - Termine',
		'asker': {
			sessions: {
				large: 'Meine Beratungen',
				small: 'Nachrichten'
			}
		},
		'booking.events': 'Meine Termine',
		'consultant': {
			enquiries: 'Erstanfragen',
			sessions: {
				large: 'Meine Beratungen',
				small: 'Nachrichten'
			},
			teamsessions: {
				large: 'Team Beratungen',
				small: 'Team Ber.'
			},
			peersessions: {
				large: 'Peer Beratungen',
				small: 'Peer Ber.'
			}
		},
		'language': 'Sprache',
		'overview': 'Übersicht',
		'profile': 'Profil',
		'tools': 'Meine Tools'
	},
	notifications: {
		'message.new': 'Sie haben eine neue Nachricht!',
		'enquiry.new': 'Sie haben eine neue Livechat Anfrage!',
		'initialRequest.new': 'Sie haben eine neue Erstanfrage!',
		'warning': 'Warnung',
		'error': 'Fehlgeschlagen',
		'success': 'Erfolgreich',
		'info': 'Information'
	},
	overlay: {
		'step.headline.prefix': '. Schritt | ',
		'timeout': {
			headline: 'Einen Moment bitte.',
			confirm: 'Möchten Sie die Seite wirklich verlassen?'
		}
	},
	overview: {
		title: 'Willkommen zurück!',
		myMessagesTitle: '{{countStr}} ungelesene Nachrichten',
		initialInquiriesTitle: '{{countStr}} Erstanfragen',
		upcomingAppointments: 'Ihre nächsten {{countStr}} Termine',
		upcomingAppointment: 'Ihr nächster Termin',
		emptyMessages: 'Du hast alles im Blick, alle Nachrichten sind gelesen!',
		emptyInitialMessage: 'Sehr gut, alle Erstanfragen sind bearbeitet!',
		emptyAppointments:
			'Heute stehen keine Termine an, Verabrede dich mit Ratsuchenden um das zu ändern',
		emptyAppointmentsMobile:
			'Keine Termine derzeit, Verabrede dich mit Ratsuchenden um das zu ändern',
		viewAll: 'Alle Anzeigen',
		myMessagesEmpty:
			'Du hast alles im Blick, alle Nachrichten sind gelesen!',
		initialInquiriesEmpty: 'Sehr gut, alle Erstanfragen sind bearbeitet!',
		appointmentsEmpty:
			'Heute stehen keine Termine an, Verabrede dich mit Ratsuchenden um das zu ändern',
		start: 'Starten'
	},
	preconditions: {
		cookie: {
			headline: 'Bitte aktivieren Sie Cookies, um fortzufahren',
			paragraph: {
				1: 'Bitte aktivieren Sie bei Ihrem Browser Cookies, um die Anmeldung zu ermöglichen.',
				2: 'Nachdem Sie Cookies in Ihrem Browser aktiviert haben, klicken Sie einfach auf die Schaltfläche unten, um zur vorhergehenden Seite zurückzukehren.'
			},
			button: 'Zurück zur vorherigen Seite'
		}
	},
	profile: {
		'appLanguage': {
			title: 'Sprache',
			info: 'Stellen Sie hier die Sprache der Anwendung ein.'
		},
		'data': {
			title: {
				agencies: 'Meine Beratungsstellen',
				asker: 'Über mich',
				information: 'Kontaktdaten',
				private: 'Private Daten'
			},
			info: {
				private: 'Diese Daten können die Ratsuchenden nicht einsehen.',
				public: 'Mit dem Anzeigenamen erscheinen Sie bei den Ratsuchenden.'
			},
			edit: {
				'button.cancel': 'Abbrechen',
				'button.save': 'Speichern',
				'button.edit': 'Bearbeiten'
			},
			agency: {
				label: 'Beratungsstelle',
				registrationLink: {
					text: 'Link kopieren',
					title: 'Registrierungslink zur Beratungsstelle in Zwischenablage kopieren',
					notification: {
						text: 'Registrierungslink zur Beratungsstelle in Zwischenablage kopiert!',
						title: 'Link kopiert'
					}
				}
			},
			profileIcon: 'Profilbild',
			userName: 'Benutzername',
			displayName: 'Anzeigename',
			firstName: 'Vorname',
			lastName: 'Nachname',
			email: 'E-Mail-Adresse',
			emailInfo:
				'Die Angabe Ihrer E-Mail ist freiwillig und wird ausschließlich verwendet, um Sie über neue Antworten Ihrer_r Berater_in zu informieren. Ihre E-Mail-Adresse ist für Berater_innen nicht sichtbar.',
			personal: {
				registrationLink: {
					notification: {
						text: 'Der Link wurde erfolgreich in die Zwischenablage kopiert!',
						title: 'Link kopiert'
					},
					text: 'Kontakt-Link kopieren',
					title: 'Kontakt-Link in Zwischenablage kopieren',
					tooltip:
						'Teilen Sie Ihren persönlichen Kontakt-Link mit jemanden, damit diese Person eine Onlineberatung direkt mit Ihnen starten kann.'
				}
			},
			register: {
				'consultingModeInfo': {
					groupChats:
						'In der Selbsthilfe tauschen sich Betroffene über ein Thema oder ein Anliegen miteinander aus. Die Betroffenen sprechen über ihre Probleme, Gefühle und Hoffnungen und erfahren so, wie andere Probleme bewältigt haben. Die Gruppen werden von Moderator_innen geleitet.',
					singleChats:
						'In diesen Themenfeldern erhalten Sie eine persönliche Beratung. Schreiben Sie uns Ihr Anliegen!'
				},
				'button.label': 'Registrieren',
				'consultingTypeSelect.label': 'Themenfelder',
				'headline':
					'Benötigen Sie auch zu anderen Themen Rat oder Hilfe?<br>Wir unterstützen Sie gerne.'
			},
			registerSuccess: {
				overlay: {
					'button1.label': 'Nachricht verfassen',
					'button2.label': 'Abmelden',
					'groupChats.button.label': 'Zur Übersicht',
					'headline':
						'Sie haben sich erfolgreich für ein neues Themenfeld registriert.'
				}
			},
			registerError: {
				overlay: {
					'headline':
						'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
					'button.label': 'Schließen'
				}
			}
		},
		'externalRegistration': {
			cancel: 'Abbrechen',
			copy: {
				end: '“ zu der anderen Anwendung wechseln und sich dort registrieren?',
				start: 'Möchten Sie für „'
			},
			headline:
				'Ihre gewählte Beratungsstelle nutzt eine andere Anwendung für die Beratung',
			submit: 'Jetzt wechseln'
		},
		'footer': {
			dataprotection: 'Datenschutz',
			imprint: 'Impressum'
		},
		'functions': {
			'absence': {
				'title': 'Meine Abwesenheit',
				'label': 'Hinterlegen Sie eine Abwesenheitsnachricht',
				'activated.label':
					'Deaktivieren Sie Ihre Abwesenheit, um eine Nachricht zu hinterlegen oder sie zu bearbeiten.'
			},
			'masterKey.saveError':
				'Beim Passwort Ändern ist ein Problem aufgetaucht. Bitte versuchen Sie es erneut.',
			'password': {
				reset: {
					'confirm.label': 'Neues Passwort bestätigen',
					'insecure': 'Ihr Passwort ist nicht sicher.',
					'instructions':
						'<span class="text--bold">Ihr Passwort muss folgende Kriterien erfüllen, um eine geschützte Beratung zu garantieren:</span><ul class="pl--2 my--1"><li>Groß-/Kleinschreibung</li><li>mind. eine Zahl</li><li>mind. ein Sonderzeichen (z.B.: ?, !, +, #, &, ...)</li><li>mind. 9 Zeichen</li></ul>',
					'new.label': 'Neues Passwort',
					'not.same': 'Ihr Passwort ist nicht identisch.',
					'old': {
						incorrect: 'Ihr Passwort ist nicht korrekt.',
						label: 'Aktuelles Passwort'
					},
					'overlay': {
						'headline':
							'Sie haben Ihr Passwort erfolgreich geändert. Sie werden nun zum Login weitergeleitet.',
						'button.label': 'Einloggen'
					},
					'same': 'Ihr Passwort ist identisch.',
					'secure': 'Ihr Passwort ist sicher.',
					'subtitle':
						'Wenn Sie möchten, können Sie hier Ihr Passwort ändern. Geben Sie erst Ihr aktuelles Passwort ein, um ein Neues festzulegen.',
					'title': 'Passwort'
				}
			},
			'security': {
				title: 'Sicherheit',
				button: 'Passwort ändern'
			},
			'spokenLanguages.saveError':
				'Beim Speichern ist ein Problem aufgetaucht. Bitte versuchen Sie es erneut.',
			'title': 'Funktionen'
		},
		'header.title': 'Profil',
		'noContent': 'Keine Angabe',
		'notifications': {
			'title': 'E-Mail-Benachrichtigungen',
			'subtitle':
				'Wir informieren Sie per E-Mail, wenn Sie eine neue Nachricht erhalten haben.',
			'follow.up.email.label':
				'eine Nachricht von angenommenen Ratsuchenden erhalten haben.',
			'mainEmail': {
				title: 'E-Mail-Benachrichtigungen zulassen'
			},
			'initialEnquiry': {
				title: 'Eine neue Erstanfrage ist eingegangen'
			},
			'newMessage': {
				title: 'Neue Chat-Nachricht',
				description:
					'Einer der Ihnen zugewiesenen Ratsuchenden hat Ihnen geantwortet'
			},
			'reassignmentConsultant': {
				title: 'Neuzuweisung eines Ratsuchenden',
				description:
					'Kollege_in hat ihnen eine_n Ratsuchende_n zugewiesen.'
			},
			'reassignmentAdviceSeeker': {
				title: 'Beraterwechsel',
				description:
					'Ihr_e Berater_in hat um Erlaubnis gebeten, Sie einem neuen Berater zuzuweisen.'
			},
			'error': {
				title: 'Etwas ist schief gelaufen.',
				description:
					'Leider können wir Ihre Einstellungen momentan nicht aktualisieren. Bitte versuchen Sie es später noch einmal.'
			},
			'noEmail': {
				info: 'Sie haben noch keine E-Mail-Adresse hinzugefügt.',
				button: 'E-Mail-Adresse hinzufügen',
				modal: {
					title: 'E-Mail-Adresse hinzufügen',
					description:
						'Die Angabe Ihrer E-Mail ist freiwillig und wird ausschließlich verwendet, um Sie über neue Antworten Ihrer_r Berater_in zu informieren. Ihre E-Mail-Adresse ist für Berater_innen nicht sichtbar.',
					confirm: 'Hinzufügen',
					emailInput: {
						label: 'E-Mail',
						valid: 'Ihre E-Mail-Adresse ist gültig.',
						invalid: 'Ihre E-Mail-Adresse ist nicht gültig.',
						unavailable:
							'Diese E-Mail-Adresse ist bereits registriert.'
					},
					errorTitle: 'Etwas ist schief gelaufen.',
					errorMessage:
						'Leider können wir Ihre Benachrichtigungen zur Zeit nicht aktivieren. Bitte versuchen Sie es später noch einmal.'
				}
			}
		},
		'browserNotifications': {
			title: 'Browser-Benachrichtigungen',
			description:
				'Wenn Sie online sind, informieren wir Sie in diesem Browser, wenn Sie eine neue Nachricht erhalten haben.',
			toggle: 'Benachrichtigungen in diesem Browser erhalten',
			initialEnquiry: {
				title: 'Eine neue Erstanfrage ist eingegangen'
			},
			newMessage: {
				title: 'Neue Chat-Nachricht',
				description:
					'Eine_r der Ihnen zugewiesenen Ratsuchenden hat Ihnen geantwortet'
			},
			denied: {
				message:
					'Sie haben den Empfang von Benachrichtigungen für diesen Browser abgelehnt. Um Push-Benachrichtigungen zu aktivieren, müssen Sie diese zuerst in Ihren Browsereinstellungen zulassen.'
			}
		},
		'documentation': {
			title: 'Handbuch zur Beratungsplattform',
			description:
				'Haben Sie Fragen? Im Handbuch finden Sie detaillierte Informationen zu den wichtigsten Funktionen der Online-Beratungsplattform.',
			link: 'Zum Handbuch'
		},
		'liveChat': {
			title: 'Meine Live-Chat Verfügbarkeit',
			subtitle:
				'Aktivieren Sie Ihre Verfügbarkeit und sehen Sie in den Erstanfragen unter „Live-Chat Anfragen“ die wartenden anoymen Ratsuchenden.',
			toggleLabel: 'Bin verfügbar'
		},
		'routes': {
			activities: {
				absence: 'Meine Abwesenheit',
				statistics: 'Meine Statistik',
				title: 'Meine Aktivitäten',
				availability: 'Meine Verfügbarkeit'
			},
			display: 'Anzeige',
			general: {
				privat: 'Private Daten',
				public: 'Öffentliche Daten',
				title: 'Allgemeines'
			},
			help: {
				title: 'Hilfe',
				videoCall: 'Video-Call'
			},
			notifications: {
				email: 'E-Mail Benachrichtigung',
				title: 'Benachrichtigungen'
			},
			settings: {
				title: 'Einstellungen',
				security: {
					'2fa': 'Zwei-Faktor-Authentifizierung',
					'changePassword': 'Passwort ändern',
					'title': 'Sicherheit'
				}
			}
		},
		'spokenLanguages': {
			info: 'Wählen Sie die Sprache(n) aus, in der Sie die Ratsuchenden beraten können. Deutsch ist als Standardsprache vorausgewählt und kann nicht entfernt werden.',
			title: 'Meine Sprachen'
		},
		'statistics': {
			complete: {
				'title':
					'Ihre Statistik über Ihren gewählten Beratungszeitraum können Sie hier herunterladen:',
				'filename': 'Statistik Online-Beratung',
				'download.label': 'Download Excel Datei'
			},
			csvHeader: {
				numberOfAppointments: 'Termine gebucht',
				numberOfAssignedSessions: 'Beratungen angenommen',
				numberOfSentMessages: 'Nachrichten geschrieben',
				numberOfSessionsWhereConsultantWasActive: 'Aktive Beratungen',
				videoCallDuration: 'Dauer von Video-Calls in Minuten:Sekunden'
			},
			period: {
				currentMonth: 'aktuellen Monats',
				currentYear: 'aktuellen Jahres',
				lastMonth: 'letzten Monats',
				lastYear: 'vergangenen Jahres',
				prefix: 'Ihre Zahlen des',
				display: {
					default: 'DD.MM.JJJJ - DD.MM.JJJJ',
					prefix: 'Im Zeitraum vom ',
					suffix: ' haben Sie:'
				}
			},
			title: 'Meine Statistik'
		},
		'unsetEmail': {
			confirmOverlay: {
				'benefit.1':
					'erhalten Sie keine E-Mail-Benachrichtigung, wenn Ihre Berater_in Ihnen geschrieben hat',
				'benefit.2':
					'können Sie Ihr Passwort nicht zurücksetzen, falls Sie es vergessen haben.',
				'button.confirm': 'Löschen',
				'button.deny': 'Abbrechen',
				'copy': 'Wenn Sie ihre E-Mail-Adresse löschen:',
				'headline': 'Möchten Sie Ihre E-Mail-Adresse wirklich löschen?'
			},
			errorOverlay: {
				button: 'Ok',
				headline:
					'Ups! Wir konnten die E-Mail-Adresse gerade nicht löschen. Bitte versuchen Sie es noch einmal.'
			},
			successOverlay: {
				button: 'Ok',
				headline: 'Sie haben Ihre E-Mail-Adresse erfolgreich gelöscht.'
			}
		}
	},
	qrCode: {
		'agency': {
			overlay: {
				headline: 'Beratungsstellen QR-Code',
				info: 'Wenn Sie den QR-Code mit jemandem teilen, kann diese Person ihn mit der Handykamera scannen, um sich direkt bei der Beratungsstelle {{agency}} zu registrieren. Alternativ können Sie den Code auch herunterladen.'
			}
		},
		'download.filename': 'qr-code-{{filename}}',
		'link.text': 'QR-Code anzeigen',
		'overlay': {
			'close': 'Schließen',
			'download': 'QR-Code als .png herunterladen',
			'image.alt': 'QR-Code'
		},
		'personal': {
			overlay: {
				headline: 'Ihr persönlicher QR-Code',
				info: 'Wenn Sie Ihren QR-Code mit jemandem teilen, kann diese Person ihn mit der Handykamera scannen, um mit Ihnen direkt Kontakt aufzunehmen. Alternativ können Sie den Code auch herunterladen.'
			}
		},
		'iconTitle': 'QR-Code'
	},
	registration: {
		'accordion': {
			item: {
				continueButton: {
					label: 'Weiter',
					title: 'Weiter zum nächsten Schritt'
				}
			}
		},
		'age': {
			dropdown: 'Alter auswählen*',
			headline: 'Alter angeben'
		},
		'agency': {
			'preselected.prefix': 'Ihre vorausgewählte Beratungsstelle: ',
			'preselected.isTeam': 'Sie werden von einem Team beraten.',
			'headline': 'Beratungsstelle wählen'
		},
		'agencySelection': {
			headline: 'Beratungsstelle wählen',
			intro: {
				overline:
					'Warum hilft Ihnen auch online eine Beratungsstelle in Ihrer Nähe?',
				point1: 'die regionalen Hilfestrukturen kennt,',
				point2: 'mit den rechtlichen Voraussetzungen vertraut ist,',
				point3: 'Sie gegebenfalls auch vor Ort beraten kann.',
				subline: 'Weil dann das Fachpersonal:'
			},
			languages: {
				info: 'Diese Beratungsstelle berät Sie auf:',
				more: 'Sprachen'
			},
			noAgencies:
				'Derzeit können leider keine Beratungsstellen gefunden werden.',
			postcode: {
				label: 'Ihre Postleitzahl',
				search: 'Zur Beratungsstellensuche',
				unavailable: {
					text: 'Momentan haben wir leider noch keine Online-Beratungsstelle in Ihrer Nähe. Auf unserer Webseite finden Sie Beratungsstellen vor Ort für Ihr Anliegen.',
					title: 'Keine Beratungsstelle in der Nähe gefunden'
				}
			},
			title: {
				start: 'Beratungsstellen zur Postleitzahl',
				end: ':'
			}
		},
		'agencyPreselected': {
			headline: 'Bitte geben Sie Ihre Postleitzahl an',
			intro: {
				overline: 'Warum benötigen wir Ihre Postleitzahl?',
				subline: 'Unsere Fachleute:',
				point1: 'kennen dann die Hilfen rund um Ihren Wohnort',
				point2: 'kennen die Gesetze Ihres Bundeslandes'
			}
		},
		'consultingType.preselected.prefix': 'Ihr vorausgewähltes Themenfeld: ',
		'consultingTypeAgencySelection': {
			consultingType: {
				'headline': 'Bitte wählen Sie ein Themenfeld',
				'infoText':
					'Ihr_e Berater_in ist in mehreren Themenfeldern tätig. Bitte wählen Sie Ihr gewünschtes Themenfeld.',
				'select.label': 'Themenfeld'
			},
			agency: {
				headline: 'Bitte wählen Sie eine Beratungsstelle',
				infoText:
					'Ihr_e Berater_in ist in mehreren Beratungsstellen tätig. Bitte wählen Sie Ihre gewünschte Beratungsstelle.'
			}
		},
		'dataProtection': {
			label: {
				prefix: 'Ich habe die ',
				and: ' und ',
				suffix: ' zur Kenntnis genommen. Für Authentifizierung und Navigation verwendet diese Webseite Cookies.'
			}
		},
		'form.title': 'Registrierung abschließen',
		'headline': 'Registrierung',
		'login': {
			helper: 'Bereits registriert?',
			label: 'Einloggen'
		},
		'mainTopic': {
			headline:
				'Welches dieser Problemfelder ist für Sie aktuell am Wichtigsten?',
			noTopics:
				'Derzeit können leider keine Themen ausgewählt werden. Führen Sie die Anmeldung im nächsten Schritt fort.'
		},
		'overline': 'Willkommen bei der Online-Beratung',
		'overlay': {
			success: {
				button: 'Nachricht verfassen',
				copy: 'Sie haben sich erfolgreich registriert.',
				headline:
					'Herzlich willkommen<br>bei der Beratung & Hilfe der Caritas.'
			}
		},
		'password': {
			'confirmation.label': 'Passwort wiederholen',
			'criteria': {
				fulfilled: 'Erfüllt',
				upperLowerCase: 'Groß-/Kleinschreibung',
				number: 'mindestens eine Zahl',
				specialChar: 'mindestens ein Sonderzeichen',
				length: 'mindestens 9 Zeichen'
			},
			'headline': 'Passwort wählen',
			'input.label': 'Passwort',
			'insecure': 'Ihr Passwort ist nicht sicher.',
			'intro':
				'Um eine geschützte Beratung zu garantieren, muss Ihr Passwort die folgenden Kriterien erfüllen:',
			'notSame': 'Ihr Passwort ist nicht identisch.',
			'same': 'Ihr Passwort ist identisch.',
			'secure': 'Ihr Passwort ist sicher.'
		},
		'state': {
			dropdown: 'Bundesland auswählen*',
			headline: 'Bundesland angeben',
			options: {
				'0': 'außerhalb Deutschlands',
				'1': 'Baden-Württemberg',
				'2': 'Bayern',
				'3': 'Berlin',
				'4': 'Brandenburg',
				'5': 'Bremen',
				'6': 'Hamburg',
				'7': 'Hessen',
				'8': 'Mecklenburg-Vorpommern',
				'9': 'Niedersachsen',
				'10': 'Nordrhein-Westfalen',
				'11': 'Rheinland-Pfalz',
				'12': 'Saarland',
				'13': 'Sachsen',
				'14': 'Sachsen-Anhalt',
				'15': 'Schleswig-Holstein',
				'16': 'Thüringen'
			}
		},
		'submitButton.label': 'Registrieren',
		'teaser.consultant':
			'Bitte registrieren Sie sich, um mit Ihrer Beraterin / Ihrem Berater in Kontakt zu kommen',
		'title.start': 'Registrierung',
		'user': {
			label: 'Benutzername',
			infoText:
				'Um Ihre Anonymität zu schützen, raten wir Ihnen nicht Ihren tatsächlichen Namen oder Initialien zu verwenden.<br>Wählen Sie bitte einen geeigneten Benutzernamen mit min. 5 Zeichen.',
			suitable: 'Ihr Benutzername ist geeignet.',
			unsuitable: 'Ihr Benutzername ist zu kurz.',
			unavailable: 'Der Benutzername ist bereits vergeben.'
		},
		'username.headline': 'Benutzernamen wählen',
		'welcomeScreen': {
			info1: {
				text: 'Für eine individuelle und geschützte Beratung',
				title: 'Einfache Registrierung'
			},
			info2: {
				text: 'Sie schicken Ihre Nachricht an eine lokale Beratungsstelle',
				title: 'Nachricht verfassen'
			},
			info3: {
				text: 'Innerhalb von 2 Werktagen bekommen Sie eine Antwort',
				title: 'Persönliche und professionelle Beratung'
			},
			info4: {
				text: 'Sie bleiben anonym und erhalten kostenfreie Beratung und Hilfe',
				title: 'Anonym und kostenfrei'
			},
			register: {
				buttonLabel: 'Registrieren',
				helperText: 'Noch nicht registriert?'
			},
			subline: 'Wie läuft die Beratung & Hilfe der Caritas ab?'
		}
	},
	releaseNote: {
		'content': {
			headline: 'Wir haben Neuigkeiten!',
			intro: 'Folgendes hat sich bei der Online-Beratung geändert:',
			checkbox: 'Diese Meldung nicht mehr anzeigen.'
		},
		'overlay.close': 'Schließen'
	},

	termsAndConditionOverlay: {
		title: {
			termsAndCondition: 'Aktualisierung unserer Nutzungsbedingungen',
			privacy: 'Aktualisierung unserer Datenschutzerklärung',
			termsAndConditionAndPrivacy:
				'Aktualisierung unserer Nutzungsbedingungen und Datenschutzerklärung'
		},
		labels: {
			termsAndCondition: 'Nutzungsbedingungen',
			privacy: 'Datenschutzerklärung',
			here: 'hier'
		},
		contentLine1: {
			termsAndCondition:
				'Wir haben die Nutzungsbedingungen der Online-Beratung aktualisiert. Um die Online-Beratung weiter nutzen zu können, benötigen wir Ihre Zustimmung.',
			privacy:
				'Wir haben die Datenschutzerklärung der Online-Beratung aktualisiert. Den aktuellen Stand finden Sie hier.',
			termsAndConditionAndPrivacy:
				'Wir haben die Nutzungsbedingungen und Datenschutzerklärung der Online-Beratung aktualisiert. Um die Online-Beratung weiter nutzen zu können, benötigen wir Ihre Zustimmung.'
		},
		contentLine2: {
			termsAndCondition:
				'Ich habe die Nutzungsbedingungen zur Kenntniss genommen.\n Damit erkläre ich mich einverstanden.',
			termsAndConditionAndPrivacy:
				'Ich habe die Nutzungsbedingungen und Datenschutzerklärung\n' +
				'zur Kenntniss genommen. Damit erkläre ich mich einverstanden.'
		},
		buttons: {
			decline: 'Ablehnen',
			accept: 'Zustimmen',
			continue: 'Weiter'
		}
	},

	session: {
		'acceptance': {
			'overlay.headline':
				'Sie haben die Erstanfrage erfolgreich angenommen und finden diese nun unter „Meine Beratungen“.',
			'button.label': 'Antworten'
		},
		'alreadyAssigned': {
			overlay: {
				'headline': 'Sie haben diese Beratung bereits zugewiesen.',
				'button.cancel': 'Schließen',
				'button.redirect': 'Antworten'
			}
		},
		'anonymous': {
			'takenByOtherConsultant.overlay.headline':
				'Diese Erstanfrage wurde bereits von einem anderen Berater angenommen.',
			'takenByOtherConsultant.button.label': 'Schließen'
		},
		'assignOther': {
			'inProgress': 'Die Beratung wird gerade zugewiesen.',
			'overlay': {
				'headline': {
					'1': 'Möchten Sie {{client}} an {{newConsultant}} zuweisen?',
					'2': 'Sie haben die Beratung erfolgreich zugewiesen.'
				},
				'subtitle.noTeam':
					'{{newConsultant}} ist somit für die_den Ratsuchende_n verantwortlich und kann den kompletten Nachrichtenverlauf lesen. Sie haben keinen Zugiff mehr auf die Nachrichten.',
				'subtitle.team.self':
					'{{newConsultant}} ist somit für die_den Ratsuchende_n verantwortlich. Stimmt {{toAskerName}} der Zuweisung zu, finden Sie den Chatverlauf in Ihren Nachrichten und nicht mehr unter Teamberatung.',
				'subtitle.team.other':
					'{{newConsultant}} ist somit für die_den Ratsuchende_n verantwortlich. Stimmt {{toAskerName}} der Zuweisung zu, finden Sie den Chatverlauf unter Teamberatung und nicht mehr in Ihren Nachrichten.'
			},
			'button.label': 'Schließen'
		},
		'assignSelf': {
			'inProgress': 'Die Beratung wird Ihnen gerade zugewiesen.',
			'overlay': {
				'headline1':
					'Sie haben die Beratung erfolgreich angenommen. Sie wurde in Meine Beratungen verschoben.',
				'headline2': 'Beratung zuweisen',
				'subtitle': 'Möchten Sie diese Beratung wirklich zuweisen?',
				'button.cancel': 'Abbruch',
				'button.assign': 'Zuweisen'
			},
			'button1.label': 'Antworten',
			'button2.label': 'Schließen'
		},

		'consultant.prefix': 'Berater_in - ',
		'divider.lastRead': 'Zuletzt gelesen',
		'empty': 'Bitte wählen Sie eine Nachricht aus',
		'feedback.label': 'Feedback',
		'groupChat.consultant.prefix': 'Moderator_in - ',
		'monitoring.buttonLabel': 'Jetzt dokumentieren',
		'u25.assignment.placeholder': 'Beratung zuweisen',
		'unreadCount.maxValue': '99+',
		'dragAndDrop': {
			explanation: {
				insideDropArea:
					'Legen Sie die Datei hier ab, um sie hochzuladen.',
				outsideDropArea:
					'Ziehen Sie die Datei in das Feld, um sie hochzuladen.'
			},
			restrictions:
				'.jpg, .png, .pdf, .docx, .xlsx bis maximal {{attachment_filesize}} MB'
		},
		'reassign': {
			system: {
				message: {
					reassign: {
						accepted: {
							'title': {
								self: '{{oldConsultant}} hat Ihnen {{client}} übergeben.',
								other: '{{oldConsultant}} hat {{newConsultant}} {{client}} übergeben.'
							},
							'description': {
								self: 'Sie sind nun für {{client}} verantwortlich.',
								other: '{{consultant}} ist nun für {{client}} verantwortlich.'
							},
							'consultant.title':
								'{{newConsultant}} kümmert sich nun um Sie und Ihre Anliegen.',
							'new.consultant.description':
								'Wir haben {{newConsultant1}} benachrichtigt. Sie können nun Nachrichten an {{newConsultant2}} schicken.',
							'old.consultant.description':
								'Wir haben {{newConsultant}} benachrichtigt. {{oldConsultant}} ist nicht mehr für Sie zuständig.'
						},
						accept: 'Akzeptieren',
						decline: 'Ablehnen',
						declined: {
							'description': {
								self: 'Sie sind weiterhin für {{client}} verantwortlich.',
								other: '{{consultant}} ist weiterhin für {{client}} verantwortlich.'
							},
							'title': '{{client}} hat die Zuweisung abgelehnt.',
							'old.consultant.title':
								'{{oldConsultant}} kümmert sich weiterhin um Sie und Ihre Anliegen.'
						},
						description: {
							noTeam: '{{newConsultant}} kann somit den kompletten Nachrichtenverlauf lesen und ist für Sie verantwortlich. {{oldConsultant}} hat keinen Zugriff mehr auf die Nachrichten.',
							team: '{{newConsultant}} kann somit den kompletten Nachrichtenverlauf lesen und ist für Sie verantwortlich.'
						},
						question: 'Stimmen Sie der Übergabe zu?',
						sent: {
							title: 'Anfrage zur Zuweisung versendet',
							description: {
								noTeam: 'Sobald {{client1}} der Zuweisung zustimmt, wird {{client2}} an {{newConsultant}} mit dem kompletten Nachrichtenverlauf übergeben.',
								team: {
									self: 'Sobald {{client1}} der Zuweisung zustimmt, ist {{newConsultant}} für {{client2}} verantwortlich. Sie finden den Chatverlauf dann unter Teamberatung und nicht mehr hier in Ihren Nachrichten.',
									other: 'Sobald {{client1}} der Zuweisung zustimmt, ist {{newConsultant}} für {{client2}} verantwortlich. Sie finden den Chatverlauf dann in Ihren Nachrichten und nicht mehr hier unter Teamberatung.'
								}
							}
						},
						title: '{{oldConsultant}} möchte Sie an {{newConsultant}} übergeben.'
					}
				}
			}
		}
	},
	sessionList: {
		'asker.welcome': 'Willkommen zurück!',
		'createChat.buttonTitle': 'Chat anlegen',
		'empty': {
			anonymous:
				'Aktuell warten keine anonymen Ratsuchenden auf einen Live-Chat',
			known: 'Aktuell liegen keine Erstanfragen vor'
		},
		'unavailable': {
			description:
				'Aktivieren Sie Ihre Verfügbarkeit und erhalten Sie hier die Live-Chat Anfragen von anoymen Ratsuchenden',
			buttonLabel: 'Verfügbarkeit aktivieren'
		},
		'filter': {
			placeholder: 'Filter',
			option: {
				all: 'Alle Beratungen',
				feedbackMain: 'Feedback benötigt',
				feedbackPeer: 'Feedback vorhanden'
			}
		},
		'peersessions.headline': 'Peer-Beratungen',
		'preview': {
			'anonymous.tab': 'Live-Chat Anfragen',
			'headline': 'Erstanfragen',
			'registered.tab': 'Erstanfragen'
		},
		'reloadButton.label': 'Erneut laden',
		'teamsession': 'Team Beratung',
		'time.label.postfix': 'Uhr',
		'user': {
			consultantUnknown: 'Berater_innen-Suche läuft',
			headline: 'Meine Beratungen',
			peer: 'Peer',
			writeEnquiry: 'Jetzt Nachricht schreiben'
		},
		'view': {
			'archive.tab': 'Archiv',
			'asker.tab': 'Ratsuchende',
			'headline': 'Meine Beratungen'
		}
	},
	statusOverlay: {
		error: {
			headline: 'Beim Senden der Nachricht ist ein Fehler aufgetreten',
			text: 'Es ist ein Problem aufgetreten, bitte versuchen Sie es erneut'
		},
		success: {
			headline: 'Ihre Nachricht wurde versendet',
			text: 'Vielen Dank für Ihre Anfrage. Wir antworten Ihnen werktags innerhalb von 48 Stunden. Wenn Sie Ihre E-Mail-Adresse angegeben haben, erhalten Sie eine Benachrichtigung, sobald unsere Antwort vorliegt.'
		}
	},
	text: {
		'label.hint': 'Hinweis'
	},
	tools: {
		'button.label': 'Öffnen',
		'shared': 'Mit dem/der Berater/in geteilt',
		'calendar.title': 'Mein Kalender',
		'calendar.description':
			'Tragen Sie Ihre Urlaube oder sonstigen Termine in den Kalender ein, sodass die Ratsuchenden in dieser Zeit keine Termine bei Ihnen buchen können.<br/>Melden Sie sich mit der gleichen E-mail Adresse und Passwort an, das Sie auch hier bei der Online Beratung verwenden.',
		'calendar.button.label': 'Öffnen'
	},
	twoFactorAuth: {
		activate: {
			step1: {
				'app': 'Mit Authenticator Application',
				'copy': 'Installieren Sie sich auf Ihrem Smartphone oder Tablet eine passende Authenticator-App. Alternativ können Sie auch Ihre E-Mail-Adresse als zweiten Faktor verwenden.',
				'email': 'Per E-Mail',
				'title': 'Zweiten Faktor wählen',
				'visualisation.label': 'Auswahl',
				'disable': 'Authentifizierung deaktivieren'
			},
			radio: {
				label: {
					app: 'App',
					email: 'E-Mail-Adresse'
				},
				tooltip: {
					app: 'Installieren Sie sich die App. Die App generiert Ihnen einen Code den Sie bei der Anmeldung eingeben müssen.',
					email: 'Sie erhalten bei der Anmeldung eine E-Mail mit einem Code. Diesen Code müssen Sie dann eingeben.'
				}
			},
			email: {
				input: {
					duplicate: {
						info: 'Diese E-Mail-Adresse wird bereits von einer anderen Person verwendet. Bitte geben Sie eine andere E-Mail-Adresse an. Oder nutzen Sie die App als zweiten Faktor.',
						label: 'E-Mail-Adresse wird bereits verwendet'
					},
					info: 'Sie können nur eine E-Mail-Adresse bei uns hinterlegen. Falls Sie die E-Mail-Adresse hier ändern, erhalten Sie auf diese E-Mail-Adresse zukünftig auch die Benachrichtigungen.',
					invalid: 'E-Mail-Adresse ungültig',
					label: 'E-Mail-Adresse angeben',
					valid: 'E-Mail-Adresse angeben'
				},
				resend: {
					hint: 'Wir haben Ihnen einen Code an Ihre E-Mail-Adresse geschickt. Bitte geben Sie den Code ein.',
					headline: 'Es hat nicht funktioniert?',
					new: 'Neuen Code senden',
					sent: 'Neuer Code gesendet'
				},
				step2: {
					'copy': 'Bitte geben Sie hier Ihre E-Mail-Adresse an.',
					'title': 'E-Mail-Adresse angeben',
					'visualisation.label': 'Angabe'
				},
				step3: {
					'copy': {
						'1': 'Wir haben Ihnen gerade eine E-Mail an',
						'2': 'geschickt. Bitte geben Sie den Code aus der E-Mail hier ein.'
					},
					'title': 'E-Mail-Adresse bestätigen',
					'visualisation.label': 'Verknüpfung'
				},
				step4: {
					'title':
						'E-Mail-Authentifizierung erfolgreich eingerichtet.',
					'visualisation.label': 'Bestätigung'
				}
			},
			app: {
				step2: {
					'title': 'Installieren Sie sich die App',
					'copy': 'Bitte installieren Sie sich auf Ihrem Smartphone oder Tablet eine passende Authenticator-App, wie zum Beispiel die FreeOTP oder Google Authentificator App. Beide Apps sind im Google Play oder Apple App Store verfügbar.',
					'visualisation.label': 'Installation',
					'tool1': {
						title: 'FreeOTP App:',
						url: {
							google: 'https://play.google.com/store/apps/details?id=org.fedorahosted.freeotp',
							apple: 'https://apps.apple.com/de/app/freeotp-authenticator/id872559395'
						}
					},
					'tool2': {
						title: 'Google Authenticator App:',
						url: {
							google: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
							apple: 'https://apps.apple.com/de/app/google-authenticator/id388497605'
						}
					},
					'download': {
						google: 'Download im Google Play Store',
						apple: 'Download im Apple App Store'
					}
				},
				step3: {
					'title': 'Fügen Sie die Online-Beratung zur App hinzu',
					'copy': 'Sie haben zwei Möglichkeiten die Online-Beratung zur App hinzuzufügen:',
					'visualisation.label': 'Hinzufügen',
					'connect': {
						qrCode: 'Öffnen Sie die App und scannen Sie den folgenden QR-Code:',
						divider: 'oder',
						key: 'Öffnen Sie die App und geben Sie den folgenden 32-stelligen Schlüssel ein:'
					}
				},
				step4: {
					'title': 'Einmal-Code eingeben',
					'copy': 'Geben Sie den Einmal-Code ein, der von der App generiert wird und klicken Sie auf „Speichern“, um die Einrichtung abzuschließen.',
					'visualisation.label': 'Verknüpfung'
				},
				step5: {
					'title': 'App-Verknüpfung erfolgreich eingerichtet.',
					'visualisation.label': 'Bestätigung'
				}
			},
			otp: {
				input: {
					label: {
						error: 'Die Authentifizierung ist fehlgeschlagen. Bitte wiederholen Sie den Vorgang.',
						short: 'Der eingegebene Code ist zu kurz.',
						text: 'Einmal-Code'
					}
				}
			}
		},
		email: {
			'change': {
				confirmOverlay: {
					title: 'E-Mail-Adresse bearbeiten',
					copy: {
						'1': 'Sie nutzen diese E-Mail-Adresse als zweiten Faktor für eine sichere Anmeldung.',
						'2': 'Deaktivieren Sie die Zwei-Faktor-Authentifizierung um die E-Mail-Adresse zu bearbeiten.'
					},
					binding: {
						copy: {
							'1': 'Sie können Ihre E-Mail Adresse nicht ändern solange Sie diese als zweiten Faktor für eine sichere Anmeldung verwenden.',
							'2': 'Wechseln Sie den zweiten Faktor von "E-Mail Adresse" zu "App". Dann können Sie Ihre E-Mail Adresse ändern.'
						}
					},
					button: {
						confirm: 'Authentifizierung deaktivieren',
						deny: 'Abbrechen',
						edit: 'Zweiter Faktor bearbeiten'
					}
				}
			},
			'delete.confirmOverlay.copy':
				'wird die Zwei-Faktor-Authentifizierung deaktiviert.'
		},
		nag: {
			'button.later': 'Später erinnern',
			'button.protect': 'Jetzt schützen',
			'copy': 'Sichern Sie Ihr Konto vor einem möglichen unbefugten Zugriff. Nutzen Sie einen zweiten Faktor (App oder E-Mail) für die Anmeldung in der Online Bratung.',
			'obligatory': {
				moment: {
					title: 'Schützen Sie Ihr Konto bis spätestens {{date}}',
					copy: 'Sie müssen bis zum {{date1}} einen zweiten Faktor (App oder E-Mail) für die Anmeldung in der Online-Beratung hinterlegen. Das dient der Sicherheit und schützt Ihr Konto vor einem möglichen unbefugten Zugriff. <br><br><b>Achtung: Ohne einen zweiten Faktor dürfen Sie nach dem {{date2}} nicht mehr online beraten.</b>'
				},
				title: 'Schützen Sie nun Ihr Konto',
				copy: 'Sie müssen jetzt einen zweiten Faktor (App oder E-Mail) für die Anmeldung in der Online-Beratung hinterlegen. Das dient der Sicherheit und schützt Ihr Konto vor einem möglichen unbefugten Zugriff. <br><br><b>Ohne einen zweiten Faktor dürfen Sie nicht mehr online beraten.</b>'
			},
			'title': 'Schützen Sie Ihr Konto'
		},
		overlayButton: {
			back: 'Zurück',
			close: 'Schließen',
			confirm: 'Bestätigen',
			next: 'Weiter',
			save: 'Speichern'
		},
		subtitle:
			'Nutzen Sie neben Ihrem Passwort einen zweiten Faktor für die Anmeldung. Dadurch wird Ihr Konto zusätzlich abgesichert.',
		switch: {
			'active.label': 'Zwei-Faktor-Authentifizierung aktiviert',
			'deactive.label': 'Zwei-Faktor-Authentifizierung deaktiviert',
			'type': {
				APP: 'App',
				EMAIL: 'E-Mail',
				label: 'Ihr zweiter Faktor'
			}
		},
		title: 'Zwei-Faktor-Authentifizierung',
		edit: 'Bearbeiten'
	},
	typingIndicator: {
		'multipleUsers.typing': 'Teilnehmer_innen schreiben',
		'singleUser.typing': 'schreibt',
		'twoUsers': {
			connector: 'und',
			typing: 'schreiben'
		}
	},
	user: {
		userAddiction: {
			age: {
				'headline': 'Alter',
				'selectLabel': 'Alter auswählen',
				'0': '0-17',
				'1': '18-20',
				'2': '21-30',
				'3': '31-40',
				'4': '41-59',
				'5': '60+',
				'null': 'Keine Angabe'
			},
			addictiveDrugs: {
				'headline': 'Suchtmittel',
				'0': 'Alkohol',
				'1': 'Drogen',
				'2': 'Legal Highs',
				'3': 'Tabak',
				'4': 'Medikamente',
				'5': 'Glücksspiel',
				'6': 'Internet/Computer',
				'7': 'Essstörungen',
				'8': 'Andere'
			},
			gender: {
				'headline': 'Geschlecht',
				'0': 'Weiblich',
				'1': 'Männlich',
				'2': 'Divers'
			},
			relation: {
				'headline': 'Hintergrund',
				'0': 'Betroffen',
				'1': 'Angehörig',
				'2': 'Anderes'
			}
		},
		userU25: {
			age: {
				'selectLabel': 'Alter auswählen*',
				'0': 'unter 12',
				'1': '12',
				'2': '13',
				'3': '14',
				'4': '15',
				'5': '16',
				'6': '17',
				'7': '18',
				'8': '19',
				'9': '20',
				'10': '21',
				'11': '22',
				'12': '23',
				'13': '24',
				'14': '25',
				'15': 'über 25',
				'50': '20',
				'51': '21',
				'52': '22',
				'53': '23',
				'54': '24',
				'55': '25',
				'56': '26'
			},
			gender: {
				'headline': 'Geschlecht',
				'0': 'Weiblich',
				'1': 'Männlich',
				'2': 'Divers'
			},
			relation: {
				'headline': 'Hintergrund',
				'0': 'Betroffen',
				'1': 'Angehörig',
				'2': 'Anderes'
			},
			state: {
				'selectLabel': 'Bundesland auswählen*',
				'0': 'außerhalb Deutschlands',
				'1': 'Baden-Württemberg',
				'2': 'Bayern',
				'3': 'Berlin',
				'4': 'Brandenburg',
				'5': 'Bremen',
				'6': 'Hamburg',
				'7': 'Hessen',
				'8': 'Mecklenburg-Vorpommern',
				'9': 'Niedersachsen',
				'10': 'Nordrhein-Westfalen',
				'11': 'Rheinland-Pfalz',
				'12': 'Saarland',
				'13': 'Sachsen',
				'14': 'Sachsen-Anhalt',
				'15': 'Schleswig-Holstein',
				'16': 'Thüringen'
			}
		}
	},
	userProfile: {
		tools: {
			description: 'Schalten Sie Tools für die_den Ratsuchende_n frei. ',
			openModal: 'Tool-Beschreibungen anzeigen',
			optionsPlaceholder: 'Wähle eine Option...',
			title: 'Tools',
			options: {
				saveError:
					'Beim Werkzeugwechsel ist ein Problem aufgetreten. Bitte versuche es erneut.'
			},
			share: {
				sharedContent: 'Zu den geteilten Inhalten',
				title: 'Sehen Sie hier welche Inhalte mit Ihnen geteilt wurden.',
				info: 'Nur zugewiesene Berater_innen können die Inhalte der Ratsuchenden einsehen. Wenn Sie aus der Teamberatung auf die Inhalte zugreifen, sind die Ratsuchenden nicht vorausgewählt.'
			},
			modal: {
				confirm: 'Freischalten',
				deny: 'Abbrechen',
				description:
					'Wählen Sie die Tools aus, die Sie dem_der Ratsuchenden zur Verfügung stellen möchten.',
				title: 'Tool für die Ratsuchenden'
			}
		},
		data: {
			addictiveDrugs: 'Suchtmittel',
			age: 'Alter',
			gender: 'Geschlecht',
			postcode: 'Postleitzahl',
			relation: 'Hintergrund',
			resort: 'Fachbereich',
			state: 'Bundesland',
			title: 'Angaben des Ratsuchenden'
		},
		monitoring: {
			buttonLabel: 'Jetzt dokumentieren',
			title: 'Monitoring'
		},
		reassign: {
			description:
				'Sie können die Unterhaltung einem anderen Teammitglied zuweisen. Diese Person ist dann für die_den Ratsuchende_n verantwortlich.',
			title: 'Zuweisung'
		}
	},
	videoCall: {
		button: {
			answerCall: 'Video-Call annehmen',
			answerVideoCall: 'Video-Call annehmen',
			rejectCall: 'Video-Call ablehnen',
			startCall: 'Audio-Call starten',
			startVideoCall: 'Video-Call starten'
		},
		incomingCall: {
			description: 'ruft an...',
			ignored: 'hat versucht Sie zu erreichen.',
			rejected: {
				'prefix': 'Sie haben versucht',
				'suffix': 'zu erreichen.',
				'teamconsultant.prefix': 'hat versucht'
			},
			unsupported: {
				button: 'Hilfe öffnen',
				description: 'Video-Call von {{username}}',
				hint: 'Durch die technischen Vorraussetzungen ist der Video-Call nicht Ende-zu-Ende verschlüsselt. Jedoch ist der Video-Call transportverschlüsselt. Bitte folgen Sie der Hilfe, um Ende-zu-Ende verschlüsselt zu telefonieren.'
			}
		},
		info: 'Anrufinformation',
		overlay: {
			encryption: {
				e2e: 'Dieser Video-Call ist mit der Ende-zu-Ende Verschlüsselung gesichert.',
				transport:
					'Dieser Video-Call ist mit der Transportverschlüsselung gesichert.'
			},
			unsupported: {
				'button.close': 'Schließen',
				'button.manual': 'Zur Anleitung',
				'copy': 'Ihr Gerät erfüllt nicht alle nötigen technischen Vorgaben für einen Video-Call. Bitte folgen Sie dieser Anleitung um einen Video-Call starten zu können. Dafür brauchen Sie möglicherweise die Unterstützung Ihrer EDV.',
				'headline': 'Der Video-Call kann nicht gestartet werden'
			}
		},
		statusPage: {
			closed: {
				title: 'Ihr Video-Call wurde erfolgreich beendet.',
				action: 'Bitte schließen Sie diesen Tab, um zu Beratung & Hilfe zurückzukehren.'
			},
			unauthorized: {
				title: 'Kein Zutritt!',
				reason: 'Leider sind Sie nicht berechtigt diese Seite einzusehen.',
				action: 'Bitte schließen Sie diesen Tab, um zu Beratung & Hilfe zurückzukehren.'
			}
		}
	},
	videoConference: {
		waitingroom: {
			'title.start': 'Warteraum',
			'dataProtection': {
				'button': 'Bestätigen',
				'description':
					'Danach dürfen unsere Berater_innen einen Video-Call mit Ihnen starten.',
				'headline': 'Herzlich Willkommen!',
				'label.text':
					'Ich habe die {{legal_links}} zur Kenntnis genommen. Für Authentifizierung und Navigation verwendet diese Webseite Cookies. Damit erkläre ich mich einverstanden.',
				'label.and': 'und',
				'subline':
					'Bitte bestätigen Sie unsere Datenschutzbestimmungen.'
			},
			'waitingImageTitle': 'Wartende Person mit Kaffee',
			'welcomeImageTitle': 'Willkommen',
			'errorImageTitle': 'Fehlgeschlagen',
			'headline': 'Bitte haben Sie etwas Geduld',
			'subline':
				'Der Video-Call hat noch nicht begonnen. Sie werden weitergeleitet sobald Ihr_e Berater_in den Video-Call startet.',
			'paused': {
				headline: 'Der Video-Call wurde beendet',
				subline:
					'Der Video-Call wurde beendet. Sollten Ihr_e Berater_in nur abwesend sein werden Sie in den Video-Call weitergeleitet sobald Ihr_e Berater_in den Video-Call fortsetzt.'
			},
			'errorPage': {
				'button': 'Neu laden',
				'consultant.description':
					'Zu Ihrem Link können wir keinen Video-Call finden da der Video-Call entweder gelöscht oder bereits beendet wurde.',
				'description':
					'Zu Ihrem Link können wir keinen Video-Call finden da der Video-Call entweder gelöscht oder bereits beendet wurde. Sollten Sie weiterhin Probleme haben fragen Sie bitte Ihre_n Berater_in.',
				'headline': 'Der Video-Call wurde nicht gefunden',
				'rejected': {
					description:
						'Sie wurden nicht zugelassen. Leider können Sie an diesem Video-Call nicht teilnehmen, da Ihr_e Berater_in Sie nicht zugelassen hat.',
					headline: 'Sie wurden nicht zugelassen'
				}
			}
		}
	},
	walkthrough: {
		title: 'Rundgang',
		subtitle:
			'Um Ihnen die einzelnen Funktionen zu erklären, haben wir einen kurzen Rundgang für Sie vorbereitet. <br /> Sie können ihn jederzeit abbrechen oder in Ihrem Profil erneut starten.',
		switch: {
			'active.label': 'Rundgang aktiv',
			'deactive.label': 'Rundgang aktiviert'
		},
		step: {
			next: 'Weiter',
			prev: 'Zurück',
			done: 'Fertig',
			step: 'Schritt',
			of: 'von',
			0: {
				title: 'Rundgang',
				intro: 'Um Ihnen die einzelnen Funktionen zu erklären, haben wir einen kurzen Rundgang für Sie vorbereitet. <br /><br /> Sie können ihn jederzeit abbrechen oder in ihrem Profil erneut starten.'
			},
			1: {
				title: 'Erstanfragen',
				intro: "Hier finden Sie eine Übersicht über alle offenen Anfragen, die noch keinem Berater zugeordnet sind. Ihr gesamtes Team hat Zugriff auf diese Übersicht.\n<br /><br /> Die ältesten Anfragen stehen oben, die neuesten ganz unten, damit Sie die zuerst eingegangenen leichter finden können.\n<br /><br /> In dem Moment, in dem Sie auf 'Anfrage Annehmen' klicken, wird die Anfrage sofort in Ihren Bereich 'Meine Beratungen' verschoben und die anderen Berater_innen sehen sie nicht mehr."
			},
			2: {
				title: 'Live-Chat Anfragen',
				intro: 'Von hier aus können Sie einen Chat mit einem/einer Ratsuchenden beginnen, der/die sich gerade im Warteraum befindet. <br /><br /> Die Ratsuchenden werden mit einem anonymen Namen gekennzeichnet, wie zum Beispiel "Ratsuchende_r 11". <br /><br /> Wenn Sie den Chat starten möchten, klicken Sie auf "Chat starten" und Sie können das Gespräch unter der Rubrik "Meine Beratungen" fortsetzen.'
			},
			3: {
				title: 'Meine Beratungen',
				intro: 'In diesem Bereich finden Sie alle Anfragen, die Sie angenommen haben. \n<br /><br /> Der Nachrichtenverlauf, der zuletzt bearbeitet wurde, steht ganz oben.\nFalls der/die Ratsuchende gerade im Warteraum online ist, sehen Sie das Label "Aktiv" direkt neben dem Namen.'
			},
			4: {
				title: 'Archiv',
				intro: 'Damit Sie nicht durch nicht aktive Unterhaltungen abgelenkt werden, können Sie einige der Unterhaltungen archivieren. <br /><br /> Sie werden dann nicht gelöscht, sondern nur in die Registerkarte "Archiv" verschoben. <br /><br /> Jedes Mal, wenn Sie oder der/die Ratsuchende etwas in eine archivierte Unterhaltung schreiben, wird dieser Nachrichtenverlauf wieder in die Liste der Ratsuchenden eingeordnet.'
			},
			5: {
				title: 'Team-Beratungen',
				intro: 'In diesem Bereich können Sie alle aktiven Beratungen, die jemand in Ihrem Team gerade bearbeitet, einsehen und zu ihnen beitragen.'
			},
			6: {
				title: 'Profil',
				intro: 'Im Profilbereich können Sie persönliche und öffentliche Informationen verwalten, die Abwesenheitsnachricht während Ihres Urlaubs aktivieren, Ihr Passwort ändern und viele andere Funktionen (wie die Einrichtung der 2-Faktor-Authentifizierung) nutzen.'
			}
		}
	}
};
