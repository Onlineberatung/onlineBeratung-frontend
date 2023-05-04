export const deInformal = {
	absence: {
		'overlay': {
			'copy': 'Deine Abwesenheitsnachricht ist momentan aktiviert. <br> Möchtest Du diese deaktivieren?',
			'changeSuccess.headline':
				'Der Status Deiner Abwesenheitsnachricht wurde erfolgreich aktualisiert.'
		},
		'input.infoText':
			'Ratsuchende sehen diese Abwesenheitsnachricht, können Dir aber weiterhin schreiben.'
	},
	aliases: {
		lastMessage: {
			e2ee_activated: 'Informationen zu Deiner Datensicherheit'
		}
	},
	appointments: {
		onlineMeeting: {
			overlay: {
				start: {
					copy: 'Du startest jetzt den Video-Call. Eingeladene Teilnehmer_innen können ab sofort mit dem Einladungslink beitreten.'
				},
				delete: {
					copy: 'Möchtest Du diesen Video-Call wirklich löschen?'
				}
			}
		},
		qrCode: {
			text: 'Wenn Du ihn mit jemandem teilst, kann diese Person ihn mit der Handykamera scannen, um direkt am Video-Call teilzunehmen. Alternativ kannst Du den Code auch herunterladen.'
		}
	},
	archive: {
		overlay: {
			session: {
				'success.copy':
					'Du hast den Ratsuchenden erfolgreich archiviert.'
			},
			teamsession: {
				'success.copy':
					'Du hast den Ratsuchenden für Dich und dein Team erfolgreich archiviert.'
			}
		},
		submitInfo: {
			message:
				'Sobald Du oder der Ratsuchende eine Nachricht schreibt, wird der Nachrichtenverlauf automatisch wieder in die Liste der Ratsuchenden eingeordnet.'
		}
	},
	attachments: {
		error: {
			format: {
				headline: 'Deine Datei konnte nicht gesendet werden.',
				message:
					'Deine Datei konnte nicht gesendet werden. Erlaubt sind Bilder (jpg und png), sowie Dokumente (docx und pdf). Bitte versuche es erneut.'
			},
			size: {
				headline: 'Deine gewählte Datei ist zu groß.',
				message: 'Du kannst max. {{attachment_filesize}}MB hochladen.'
			},
			quota: {
				headline: 'Du hast das Limit zum Hochladen erreicht.',
				message: 'Bitte versuche es morgen erneut.'
			},
			other: {
				message: 'Bitte versuche es erneut.'
			}
		},
		list: {
			'label.received': 'Du hast eine Datei erhalten.',
			'label.sent': 'Du hast eine Datei gesendet.'
		}
	},
	banUser: {
		ban: {
			'info.1': 'Du hast '
		},
		banned: {
			headline: 'Du wurdest gebannt.',
			info: 'Wir haben Dich gebeten, die Chat-Regeln einzuhalten.<br/><br/>Weil Du heute die Chat-Regeln wiederholt nicht eingehalten hast, haben wir Dich für den heutigen Chat ausgeschlossen.<br/><br/>Mache Dich mit den Chat-Regeln vertraut!</br></br>Wenn Du bereit bist, die Chat-Regeln einzuhalten, bist Du ab morgen wieder im Chat willkommen!'
		}
	},
	deleteAccount: {
		confirmOverlay: {
			'headline': 'Möchtest Du Deinen Account wirklich löschen?',
			'copy': '<strong>Dieser Vorgang kann nicht rückgängig gemacht werden.</strong><br><br>Dein Account wird innerhalb der nächsten 48 Stunden gelöscht. Deine Daten werden gemäß der geltenden Datenschutzbestimmungen gelöscht.<br><br>Bitte gebe Dein Passwort ein, um Deinen Account nun zu löschen.',
			'input.warning': 'Dein Passwort ist nicht korrekt.'
		},
		successOverlay: {
			headline:
				'Du hast Deinen Account bei der Caritas Beratung & Hilfe erfolgreich gelöscht.'
		}
	},
	deleteSession: {
		confirmOverlay: {
			copy: 'Möchtest du den Chat wirklich löschen?',
			headline: 'Chat löschen'
		},
		errorOverlay: {
			headline:
				'Ups! Wir konnten den Chat gerade nicht löschen. Bitte versuche es erneut.'
		}
	},
	e2ee: {
		attachment: {
			error: {
				text: 'Bitte den Sender oder die Senderin die Datei erneut zu schicken. Downloade dann die neue Datei.'
			}
		},
		hint: 'Deine Nachrichten sind Ende-zu-Ende verschlüsselt. Das bedeutet, niemand außerhalb dieses Chats kann die Nachrichten lesen. Nicht einmal die Online-Beratungs-Plattform.',
		inProgress: {
			copy: 'Deine Sicherheit ist uns wichtig! Wir verschlüsseln gerade Deinen Chat. Dies kann einen Moment dauern.',
			confirm: 'Bitte warte bis die Verschlüsselung abgeschlossen ist!'
		},
		subscriptionKeyLost: {
			notice: {
				title: 'Deine Sicherheit ist uns wichtig!',
				text: 'Da Du Dein Passwort zurückgesetzt hast, sind die Nachrichten für Dich momentan nicht lesbar. Sobald ein_e Chat-Teilnehmer_in den Chat wieder öffnet, kannst Du die Nachrichten wieder lesen und Neue schreiben.'
			},
			overlay: {
				copy: 'Deine Nachrichten sind aus Sicherheitsgründen Ende-zu-Ende verschlüsselt. Das bedeutet, niemand außerhalb dieses Chats kann die Nachrichten lesen. Nicht einmal die Online-Beratungs-Plattform.<br/><br/>Wenn das Passwort zurückgesetzt wird, sind die Nachrichten vorübergehend nicht lesbar. Sobald ein_e weitere_r Chat-Teilnehmer_in den Chat wieder öffnet, können die Nachrichten neu verschlüsselt werden. Somit können wieder allen Chat-Teilnehmer_innen Nachrichten lesen und schreiben.'
			}
		},
		roomNotFound: {
			'notice.line3': 'Bitte lade die Seite neu und probiere es nochmal.'
		}
	},
	enquiry: {
		'anonymous': {
			'infoLabel.start': 'Starte nun den Chat mit '
		},
		'write': {
			input: {
				placeholder: {
					asker: 'Schreibe uns, was Dich bewegt.'
				}
			},
			infotext: {
				headline: 'Hier ist Platz für Deine Anliegen.',
				copy: {
					title: 'Vielleicht helfen Dir folgende Punkte bei der Formulierung weiter:',
					facts: '<ul><li>Was ist passiert?</li><li>Wie ist Deine aktuelle Situation?</li><li>Was beschäftigt Dich?</li><li>Hast Du eine bestimmte Frage oder weißt Du vielleicht selbst noch nicht so genau was Dir helfen könnte?</li></ul>'
				}
			},
			overlay: {
				headline: 'Vielen Dank für Deine Nachricht!',
				copy: 'Innerhalb von 2 Werktagen erhältst Du eine Antwort von uns.'
			}
		},
		'language.selection.headline':
			'Bitte wähle die Sprache in der Du beraten werden willst.'
	},
	furtherSteps: {
		'step1.info': 'Wir haben Deine Nachricht erhalten.',
		'step2.info': 'Jetzt finden wir eine_n passende_n Berater_in für Dich.',
		'step3.info': 'Dein_e Berater_in antwortet innerhalb von 2 Werktagen.',
		'emailNotification': {
			infoText:
				'Wenn Du Deine E-Mail-Adresse angibst (freiwillig)<br><ul><li>erhälst Du eine E-Mail-Benachrichtigung, wenn Dein_e Berater_in Dir geschrieben hat</li><li>kannst Du Dein Passwort zurücksetzen, falls Du es vergessen hast.</li></ul>Deine E-Mail-Adresse kann von den Berater_innen nicht eingesehen werden.'
		},
		'email': {
			'overlay': {
				'input.valid': 'Deine E-Mail-Adresse ist gültig.',
				'input.invalid': 'Deine E-Mail-Adresse ist nicht gültig.'
			},
			'success.overlay.headline':
				'Deine E-Mail-Adresse wurde erfolgreich gespeichert.'
		},
		'twoFactorAuth': {
			headline: 'Der Schutz Deiner Daten ist uns wichtig',
			infoText:
				'Sichere Dein Konto vor einem möglichen unbefugten Zugriff. Nutze einen zweiten Faktor (App oder E-Mail) für die Anmeldung in der Online-Beratung.'
		}
	},
	groupChat: {
		createSuccess: {
			overlay: {
				headline: 'Du hast erfolgreich einen Chat angelegt.'
			}
		},
		createError: {
			'overlay.headline':
				'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.'
		},
		join: {
			'warning.message':
				'Dein_e Berater_in/Moderator_in hat den Chat noch nicht gestartet. Sobald dein_e Berater_in/Moderator_in den Chat gestartet hat kannst du mit uns chatten. Bitte habe noch etwas Geduld.'
		},
		listItem: {
			subjectEmpty: {
				self: 'Du hast den Chat erstellt.'
			}
		},
		stopChat: {
			'securityOverlay.headline': 'Möchtest Du den Chat wirklich beenden?'
		},
		updateSuccess: {
			overlay: {
				headline: 'Deine Änderungen wurden erfolgreich gespeichert.'
			}
		}
	},
	help: {
		videoCall: {
			waitingRoom: {
				headline: 'Es liegt nicht an Dir, sondern an Deinem Browser.',
				infoBox: {
					headline: 'Dein Browser unterstützt keine Video-Calls.',
					text: 'Damit Du an Video-Calls teilnehmen kannst, verwende bitte Google Chrome, Microsoft Edge oder Safari.'
				},
				subline1:
					'Hast du noch keinen Google Chrome, Microsoft Edge oder Safari?',
				text1: 'Lade einen der Browser herunter.',
				subline2:
					'Du hast bereits Google Chrome, Microsoft Edge oder Safari?',
				text2: 'Öffne nun Deinen Link zur Online-Beratung mit einem der unterstützten Browser.'
			},
			banner: {
				content:
					'Bitte verwenden Sie einen anderen Browser, damit Video-Calls funktionieren können.',
				more: 'Mehr erfahren'
			},
			asker: {
				headline: 'Video-Call',
				intro: 'Damit Du an Video-Calls teilnehmen kannst, musst Du Dich über einen der unterstützten Browser anmelden. Die Chat-Beratung funktioniert weiterhin mit Firefox.',
				steps: {
					'1.1': 'Folge dem Link zu ',
					'1.2': ' oder ',
					'1.3': ' (nur für macOS und iOS verfügbar)',
					'2': 'Lade einen der unterstützten Browser herunter.',
					'3': 'Installiere diesen auf Deinem PC/Laptop/Tablet/Smartphone.',
					'4': {
						'1': 'Öffne nun mit diesem Browser die Online-Beratung.',
						'2': 'Öffne die Online-Beratung mit einem dieser Browser.'
					},
					'5': 'Melde Dich bei der Online-Beratung an.',
					'6': 'Bitte Deine_n Berater_in dich nochmals anzurufen.',
					'headline': {
						'2': 'Du hast bereits Google Chrome, Microsoft Edge oder Safari?'
					}
				}
			},
			consultant: {
				headline: 'Video-Call',
				intro: 'Um einen Video-Call durchführen zu können, musst Du Dich über einen der unterstützten Browser anmelden. Die Chat-Beratung funktioniert weiterhin mit Firefox.',
				steps: {
					'1.1': 'Folge dem Link zu ',
					'1.2': ' oder ',
					'1.3': ' (nur für macOS und iOS verfügbar)',
					'2': 'Lade einen der unterstützten Browser herunter. Dafür brauchst Du möglicherweise die Unterstützung Deiner EDV.',
					'3': 'Installiere diesen auf Deinem PC/Laptop/Tablet/Smartphone.',
					'4': {
						'1': 'Öffne nun mit diesem Browser die Online-Beratung.',
						'2': 'Öffne die Online-Beratung mit einem dieser Browser.'
					},
					'5': 'Melde Dich bei der Online-Beratung an.',
					'6': 'Starte den Video-Call.',
					'headline': {
						'2': 'Du hast bereits Google Chrome, Microsoft Edge oder Safari?'
					}
				}
			}
		}
	},
	message: {
		delete: {
			deleted: {
				own: 'Du hast diese Nachricht gelöscht.'
			},
			overlay: {
				copy: 'Möchtest Du die Nachricht wirklich löschen?'
			}
		}
	},
	notifications: {
		'message.new': 'Du hast eine neue Nachricht!',
		'enquiry.new': 'Du hast eine neue Livechat Anfrage!'
	},
	overlay: {
		timeout: {
			confirm: 'Möchtest Du die Seite wirklich verlassen?'
		}
	},
	overview: {
		upcomingAppointments: 'Deine nächsten {{countStr}} Termine',
		upcomingAppointment: 'Dein nächster Termin'
	},
	preconditions: {
		cookie: {
			headline: 'Bitte aktiviere Cookies, um fortzufahren',
			paragraph: {
				1: 'Bitte aktiviere bei Deinem Browser Cookies, um die Anmeldung zu ermöglichen.',
				2: 'Nachdem Du Cookies in Deinem Browser aktiviert hast, klicke einfach auf die Schaltfläche unten, um zur vorhergehenden Seite zurückzukehren.'
			}
		}
	},
	profile: {
		liveChat: {
			title: 'Meine Live-Chat Verfügbarkeit',
			subtitle:
				'Aktiviere deine Verfügbarkeit und sehe in den Erstanfragen unter „Live-Chat Anfragen“ die wartenden anoymen Ratsuchenden.',
			toggleLabel: 'Bin verfügbar'
		},
		functions: {
			'absence': {
				'label': 'Hinterlege eine Abwesenheitsnachricht',
				'activated.label':
					'Deaktiviere Deine Abwesenheit, um eine Nachricht zu hinterlegen oder sie zu bearbeiten.'
			},
			'password': {
				reset: {
					'subtitle':
						'Wenn Du möchtest, kannst Du hier Dein Passwort ändern. Gebe erst Dein aktuelles Passwort ein, um ein Neues festzulegen.',
					'secure': 'Dein Passwort ist sicher.',
					'insecure': 'Dein Passwort ist nicht sicher.',
					'same': 'Dein Passwort ist identisch.',
					'not.same': 'Dein Passwort ist nicht identisch.',
					'old': {
						incorrect: 'Dein Passwort ist nicht korrekt.'
					},
					'instructions':
						'<span class="text--bold">Dein Passwort muss folgende Kriterien erfüllen, um eine geschützte Beratung zu garantieren:</span><ul class="pl--2 my--1"><li>Groß-/Kleinschreibung</li><li>mind. eine Zahl</li><li>mind. ein Sonderzeichen (z.B.: ?, !, +, #, &, ...)</li><li>mind. 9 Zeichen</li></ul>',
					'overlay': {
						headline:
							'Du hast Dein Passwort erfolgreich geändert. Du wirst nun zum Login weitergeleitet.'
					}
				}
			},
			'spokenLanguages.saveError':
				'Beim Speichern ist ein Problem aufgetaucht. Bitte versuche es erneut.',
			'masterKey.saveError':
				'Beim Passwort Ändern ist ein Problem aufgetaucht. Bitte versuche es erneut.'
		},
		data: {
			register: {
				headline:
					'Benötigst Du auch zu anderen Themen Rat oder Hilfe?<br>Wir unterstützen Dich gerne.',
				consultingModeInfo: {
					singleChats:
						'In diesen Themenfeldern erhältst Du eine persönliche Beratung. Schreibe uns Dein Anliegen!'
				}
			},
			registerSuccess: {
				overlay: {
					headline:
						'Du hast Dich erfolgreich für ein neues Themenfeld registriert.'
				}
			},
			registerError: {
				overlay: {
					headline:
						'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.'
				}
			},
			personal: {
				registrationLink: {
					tooltip:
						'Teile Deinen persönlichen Kontakt-Link mit jemanden, damit diese Person eine Onlineberatung direkt mit Dir starten kann.'
				}
			},
			info: {
				public: 'Mit dem Anzeigenamen erscheinst Du bei den Ratsuchenden.'
			},
			emailInfo:
				'Die Angabe deiner E-Mail ist freiwillig und wird ausschließlich verwendet, um dich über neue Antworten deine_r Berater_in zu informieren. Deine E-mail-Adresse ist für Berater_innen nicht sichtbar.'
		},
		externalRegistration: {
			headline:
				'Deine gewählte Beratungsstelle nutzt eine andere Anwendung für die Beratung',
			copy: {
				start: 'Möchtest Du für „',
				end: '“ zu der anderen Anwendung wechseln und Dich dort registrieren? Deine bisherigen Beratungs- und Hilfethemen findest Du weiterhin hier.'
			}
		},
		statistics: {
			period: {
				prefix: 'Deine Zahlen des',
				display: {
					suffix: ' hast Du:'
				}
			},
			complete: {
				title: 'Deine Statistik über Deinen gewählten Beratungszeitraum kannst Du hier herunterladen:'
			}
		},
		notifications: {
			'subtitle': 'Wir benachrichtigen Dich, wenn Du:',
			'follow.up.email.label':
				'eine Nachricht von angenommenen Ratsuchenden erhalten hast.',
			'description':
				'Wir informieren dich per E-Mail, wenn du eine neue Nachricht erhalten hast.',
			'reassignmentAdviceSeeker': {
				description:
					'Dein_e Berater_in hat um Erlaubnis gebeten, dich einem neuen Berater zuzuweisen.'
			},
			'newMessage': {
				description:
					'Einer der dir zugewiesenen Ratsuchenden hat dir geantwortet'
			},
			'reassignmentConsultant': {
				description:
					'Kollege_in hat dir eine_n Ratsuchende_n zugewiesen.'
			},
			'toggleError': {
				description:
					'Leider können wir deine Benachrichtigungen zur Zeit nicht aktivieren. Bitte versuche es später noch einmal.'
			},
			'noEmail': {
				info: 'Du hast noch keine E-mail-Adresse hinzugefügt.',
				modal: {
					description:
						'Die Angabe deiner E-Mail-Adresse ist freiwillig und wird ausschließlich verwendet, um dich über neue Antworten deines_r Berater_in zu informieren. Deine E-Mail-Adresse ist für Berater_innen nicht sichtbar.',
					errorMessage:
						'Leider können wir Ihre E-mail-Adresse momentan nicht speichern. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie unseren Support.'
				}
			}
		},
		browserNotifications: {
			description:
				'Wenn du online bist, informieren wir dich in diesem Browser, wenn du eine neue Nachricht erhalten hast.',
			newMessage: {
				description:
					'Einer der dir zugewiesenen Ratsuchenden hat dir geantwortet'
			},
			denied: {
				message:
					'Du hast den Empfang von Benachrichtigungen für diesen Browser abgelehnt. Um Push-Benachrichtigungen zu aktivieren, musst du diese zuerst in deinen Browsereinstellungen zulassen.'
			}
		},
		spokenLanguages: {
			info: 'Wähle die Sprache(n) aus, in der Du die Ratsuchenden beraten kannst. Deutsch ist als Standardsprache vorausgewählt und kann nicht entfernt werden.'
		},
		appLanguage: {
			info: 'Stelle hier die Sprache der Anwendung ein.'
		}
	},
	qrCode: {
		personal: {
			overlay: {
				headline: 'Dein persönlicher QR-Code',
				info: 'Wenn Du ihn mit jemandem teilst, kann diese Person ihn mit der Handykamera scannen, um mit Dir direkt Kontakt aufzunehmen. Alternativ kannst Du den Code auch herunterladen.'
			}
		},
		agency: {
			overlay: {
				info: 'Wenn Du den QR-Code mit jemandem teilst, kann diese Person ihn mit der Handykamera scannen, um sich direkt bei der Beratungsstelle {{agency}} zu registrieren. Alternativ kannst du den Code auch herunterladen.'
			}
		}
	},
	registration: {
		'agency': {
			'preselected.prefix': 'Deine vorausgewählte Beratungsstelle: ',
			'preselected.isTeam': 'Du wirst von einem Team beraten.'
		},
		'consultingType.preselected.prefix':
			'Dein vorausgewähltes Themenfeld: ',
		'user': {
			infoText:
				'Um Deine Anonymität zu schützen, raten wir Dir nicht Deinen tatsächlichen Namen oder Initialien zu verwenden.<br>Wähle bitte einen geeigneten Benutzernamen mit min. 5 Zeichen.',
			suitable: 'Dein Benutzername ist geeignet.',
			unsuitable: 'Dein Benutzername ist zu kurz.'
		},
		'agencySelection': {
			intro: {
				overline:
					'Warum hilft Dir auch online eine Beratungsstelle in Deiner Nähe?',
				point3: 'Dich gegebenfalls auch vor Ort beraten kann.'
			},
			languages: {
				info: 'Diese Beratungsstelle berät Dich auf:'
			},
			postcode: {
				label: 'Deine Postleitzahl',
				unavailable: {
					text: 'Momentan haben wir leider noch keine Online-Beratungsstelle in Deiner Nähe. Auf unserer Webseite findest Du Beratungsstellen vor Ort für Dein Anliegen.'
				}
			}
		},
		'agencyPreselected': {
			headline: 'Bitte gib Deine Postleitzahl an',
			intro: {
				overline: 'Warum benötigen wir Deine Postleitzahl?',
				point1: 'kennen dann die Hilfen rund um Deinen Wohnort',
				point2: 'kennen die Gesetze Deines Bundeslandes'
			}
		},
		'consultingTypeAgencySelection': {
			consultingType: {
				headline: 'Bitte wähle ein Themenfeld',
				infoText:
					'Dein_e Berater_in ist in mehreren Themenfeldern tätig. Bitte wähle Dein gewünschtes Themenfeld.'
			},
			agency: {
				headline: 'Bitte wähle eine Beratungsstelle',
				infoText:
					'Dein_e Berater_in ist in mehreren Beratungsstellen tätig. Bitte wähle Deine gewünschte Beratungsstelle.'
			}
		},
		'password': {
			secure: 'Dein Passwort ist sicher.',
			insecure: 'Dein Passwort ist nicht sicher.',
			same: 'Dein Passwort ist identisch.',
			notSame: 'Dein Passwort ist nicht identisch.',
			intro: 'Um eine geschützte Beratung zu garantieren, muss Dein Passwort die folgenden Kriterien erfüllen:'
		},
		'mainTopic': {
			headline:
				'Welches dieser Problemfelder ist für Dich aktuell am Wichtigsten?',
			noTopics:
				'Derzeit können leider keine Themen ausgewählt werden. Führe die Anmeldung im nächsten Schritt fort.'
		},
		'overlay': {
			success: {
				copy: 'Du hast Dich erfolgreich registriert.'
			}
		},
		'welcomeScreen': {
			info2: {
				text: 'Schicke Deine Nachricht an eine lokale Beratungsstelle'
			},
			info3: {
				text: 'Innerhalb von 2 Werktagen bekommst Du eine Antwort'
			}
		},
		'teaser.consultant':
			'Bitte registriere Dich, um mit Deiner Beraterin / Deinem Berater in Kontakt zu kommen'
	},
	session: {
		empty: 'Bitte wähle eine Nachricht aus.',
		acceptance: {
			'overlay.headline':
				'Du hast die Erstanfrage erfolgreich angenommen und findest diese nun unter „Meine Beratungen“.'
		},
		assignOther: {
			overlay: {
				'headline': {
					'1': 'Möchtest Du {{client}} an {{newConsultant}} zuweisen?',
					'2': 'Du hast die Beratung erfolgreich zugewiesen.'
				},
				'subtitle.noTeam':
					'{{newConsultant}} ist somit für die_den Ratsuchende_n verantwortlich und kann den kompletten Nachrichtenverlauf lesen. Du hast keinen Zugiff mehr auf die Nachrichten.',
				'subtitle.team.self':
					'{{newConsultant}} ist somit für die_den Ratsuchende_n verantwortlich. Stimmt {{toAskerName}} der Zuweisung zu, findest Du den Chatverlauf in Deinen Nachrichten und nicht mehr unter Teamberatung.',
				'subtitle.team.other':
					'{{newConsultant}} ist somit für die_den Ratsuchende_n verantwortlich. Stimmt {{toAskerName}} der Zuweisung zu, findest Du den Chatverlauf unter Teamberatung und nicht mehr in Deinen Nachrichten.'
			}
		},
		alreadyAssigned: {
			overlay: {
				headline: 'Du hast diese Beratung bereits zugewiesen.'
			}
		},
		assignSelf: {
			inProgress: 'Die Beratung wird Dir gerade zugewiesen.',
			overlay: {
				headline1:
					'Du hast die Beratung erfolgreich angenommen. Sie wurde in Meine Beratungen verschoben.',
				subtitle: 'Möchtest Du diese Beratung wirklich zuweisen?'
			}
		},
		dragAndDrop: {
			explanation: {
				insideDropArea: 'Lege die Datei hier ab, um sie hochzuladen.',
				outsideDropArea:
					'Ziehe die Datei in das Feld, um sie hochzuladen.'
			}
		},
		reassign: {
			system: {
				message: {
					reassign: {
						title: '{{oldConsultant}} möchte Dich an {{newConsultant}} übergeben.',
						description: {
							noTeam: '{{newConsultant}} kann somit den kompletten Nachrichtenverlauf lesen und ist für Dich verantwortlich. {{oldConsultant}} hat keinen Zugriff mehr auf die Nachrichten.',
							team: '{{newConsultant}} kann somit den kompletten Nachrichtenverlauf lesen und ist für Sie verantwortlich.'
						},
						question: 'Stimmst Du der Übergabe zu?.',
						accepted: {
							'title': {
								self: '{{oldConsultant}} hat Dir {{client}} übergeben.'
							},
							'description': {
								self: 'Du bist nun für {{client}} verantwortlich.'
							},
							'consultant.title':
								'{{newConsultant}} kümmert sich nun um Dich und Deine Anliegen.',
							'new.consultant.description':
								'Wir haben {{newConsultant1}} benachrichtigt. Du kannst nun Nachrichten an {{newConsultant2}} schicken.',
							'old.consultant.description':
								'Wir haben {{newConsultant}} benachrichtigt. {{oldConsultant}} ist nicht mehr für Dich zuständig.'
						},
						declined: {
							'description': {
								self: 'Du bist weiterhin für {{client}} verantwortlich.'
							},
							'old.consultant.title':
								'{{oldConsultant}} kümmert sich weiterhin um Dich und Deine Anliegen.'
						},
						sent: {
							description: {
								team: {
									self: 'Sobald {{client1}} der Zuweisung zustimmt, ist {{newConsultant}} für {{client2}} verantwortlich. Du findest den Chatverlauf dann unter Teamberatung und nicht mehr hier in Deinen Nachrichten.',
									other: 'Sobald {{client1}} der Zuweisung zustimmt, ist {{newConsultant}} für {{client2}} verantwortlich. Du findest den Chatverlauf dann in Deinen Nachrichten und nicht mehr hier unter Teamberatung.'
								}
							}
						}
					}
				}
			}
		}
	},
	sessionList: {
		empty: {
			mySessions: 'Du hast zur Zeit keine aktiven Beratungen',
			teamSessions:
				'Es gibt keine aktiven Teamberatungen. Um eine Teamberatung zu starten, musst du deinen Kunden einem anderen Berater zuweisen. Sobald der Kunde einverstanden ist, können beide Berater gleichzeitig mit dem Kunden chatten.',
			perSessions: 'Du hast zur Zeit keine aktiven Peer-Beratungen'
		}
	},
	statusOverlay: {
		success: {
			headline: 'Deine Nachricht wurde versendet',
			text: 'Vielen Dank für Deine Anfrage. Wir antworten Dir werktags innerhalb von 48 Stunden. Wenn Du Deine E-Mail-Adresse angegeben hast, erhältst Du eine Benachrichtigung, sobald unsere Antwort vorliegt.'
		}
	},
	twoFactorAuth: {
		subtitle:
			'Nutze neben Deinem Passwort einen zweiten Faktor für die Anmeldung. Dadurch wird Dein Konto zusätzlich abgesichert.',
		activate: {
			radio: {
				tooltip: {
					app: 'Installiere Dir die App. Die App generiert Dir einen Code den Du bei der Anmeldung eingeben musst.',
					email: 'Du erhälst bei der Anmeldung eine E-mail mit einem Code. Diesen Code musst Du dann eingeben.'
				}
			},
			step1: {
				copy: 'Installiere Dir auf Deinem Smartphone oder Tablet eine passende Authenticator-App. Alternativ kannst Du auch Deine E-Mail-Adresse als zweiten Faktor verwenden.'
			},
			email: {
				step3: {
					copy: {
						'1': 'Wir haben Dir gerade eine E-Mail an',
						'2': 'geschickt. Bitte gib den Code aus der E-Mail hier ein.'
					}
				},
				input: {
					info: 'Du kannst nur eine E-Mail-Adresse bei uns hinterlegen. Falls Du die E-Mail-Adresse hier änderst, erhältst Du auf diese E-Mail-Adresse zukünftig auch die Benachrichtigungen.',
					duplicate: {
						info: 'Diese E-Mail-Adresse wird bereits von einer anderen Person verwendet. Bitte gib eine andere E-Mail-Adresse an. Oder nutze die App als zweiter Faktor.'
					}
				}
			},
			app: {
				step2: {
					title: 'Installiere Dir die App',
					copy: 'Bitte installier Dir auf Deinem Smartphone oder Tablet eine passende Authenticator-App, wie zum Beispiel die FreeOTP oder Google Authentificator App. Beide Apps sind im Google Play oder Apple App Store verfügbar.'
				},
				step3: {
					'title': 'Für die Online-Beratung zur App hinzu',
					'copy': 'Du hast zwei Möglichkeiten die Online-Beratung zur App hinzuzufügen:',
					'visualisation.label': 'Hinzufügen',
					'connect': {
						qrCode: 'Öffne die App und scanne den folgenden QR-Code:',
						key: 'Öffne die App und gebe den folgenden 32-stelligen Schlüssel ein:'
					}
				},
				step4: {
					title: 'Einmal-Code eingeben',
					copy: 'Gib den Einmal-Code ein, der von der App generiert wird und klicke auf „Speichern“, um die Einrichtung abzuschließen.'
				}
			},
			otp: {
				input: {
					label: {
						error: 'Die Authentifizierung ist fehlgeschlagen. Bitte wiederhole den Vorgang.'
					}
				}
			}
		},
		email: {
			change: {
				confirmOverlay: {
					copy: {
						'1': 'Du nutzt diese E-Mail-Adresse als zweiten Faktor für eine sichere Anmeldung.',
						'2': 'Deaktiviere die Zwei-Faktor-Authentifizierung um die E-Mail-Adresse zu bearbeiten.'
					},
					binding: {
						copy: {
							'1': 'Du kannst Deine E-Mail Adresse nicht ändern solange Du diese als zweiten Faktor für eine sichere Anmeldung verwendest.',
							'2': 'Wechsel den zweiten Faktor von "E-Mail Adresse" zu "App". Dann kannst Du Deine E-Mail Adresse ändern.'
						}
					}
				}
			}
		},
		nag: {
			title: 'Schütze Dein Konto',
			copy: 'Sicher Dein Konto vor einem möglichen unbefugten Zugriff. Nutze einen zweiten Faktor (App oder E-Mail) für die Anmeldung in der Online Bratung.',
			obligatory: {
				moment: {
					title: 'Schütze Dein Konto bis spätestens {{date}}',
					copy: 'Du musst bis zum {{date1}} einen zweiten Faktor (App oder E-Mail) für die Anmeldung in der Online-Beratung hinterlegen. Das dient der Sicherheit und schützt Dein Konto vor einem möglichen unbefugten Zugriff. <br><br><b>Achtung: Ohne einen zweiten Faktor darfst Du nach dem {{date2}} nicht mehr online beraten.</b>'
				},
				title: 'Schütze nun Dein Konto',
				copy: 'Du musst jetzt einen zweiten Faktor (App oder E-Mail) für die Anmeldung in der Online-Beratung hinterlegen. Das dient der Sicherheit und schützt Dein Konto vor einem möglichen unbefugten Zugriff. <br><br><b>Ohne einen zweiten Faktor dürfst Du nicht mehr online beraten.</b>'
			}
		}
	},
	userProfile: {
		reassign: {
			description:
				'Du kannst die Unterhaltung einem anderen Teammitglied zuweisen. Diese Person ist dann für die_den Ratsuchende_n verantwortlich.'
		}
	},
	videoCall: {
		incomingCall: {
			unsupported: {
				description: '{{username}} versucht Dich anzurufen',
				hint: 'Dein Browser erfüllt nicht die notwendigen Sicherheitsanforderungen. Bitte verwende einen anderen Browser, damit Du an Video-Calls teilnehmen kannst.'
			},
			ignored: 'hat versucht Dich zu erreichen.',
			rejected: {
				prefix: 'Du hast versucht'
			}
		},
		overlay: {
			unsupported: {
				copy: 'Dein Gerät erfüllt nicht alle nötigen technischen Vorgaben für einen Video-Call. Bitte folge dieser Anleitung um einen Video-Call starten zu können. Dafür brauchst Du möglicherweise die Unterstützung Deiner EDV.'
			}
		}
	},
	videoConference: {
		waitingroom: {
			dataProtection: {
				subline: 'Bitte bestätige unsere Datenschutzbestimmungen.',
				description:
					'Danach dürfen unsere Berater_innen einen Video-Call mit Dir starten.'
			},
			headline: 'Bitte habe etwas Geduld',
			subline:
				'Der Video-Call hat noch nicht begonnen. Du wirst weitergeleitet sobald Dein_e Berater_in den Video-Call startet.',
			paused: {
				subline:
					'Der Video-Call wurde beendet. Sollte Dein_e Berater_in nur abwesend sein wirst Du in den Video-Call weitergeleitet sobald Dein_e Berater_in den Video-Call fortsetzt.'
			},
			errorPage: {
				'description':
					'Zu Deinem Link können wir keinen Video-Call finden da der Video-Call entweder gelöscht oder bereits beendet wurde. Solltest Du weiterhin Probleme haben frage bitte Deine_n Berater_in.',
				'consultant.description':
					'Zu Deinem Link können wir keinen Video-Call finden da der Video-Call entweder gelöscht oder bereits beendet wurde.',
				'rejected': {
					headline: 'Du wurdest nicht zugelassen',
					description:
						'Du wurdest nicht zugelassen. Leider kannst Du an diesem Video-Call nicht teilnehmen, da Dein_e Berater_in Dich nicht zugelassen hat.'
				}
			}
		}
	},
	walkthrough: {
		step: {
			'0': {
				intro: 'Um Dir die einzelnen Funktionen zu erklären, haben wir einen kurzen Rundgang für Dich vorbereitet. <br /><br /> Du kanst ihn jederzeit abbrechen oder in Deinem Profil erneut starten.'
			},
			'1': {
				intro: "Hier findest Du eine Übersicht über alle offenen Anfragen, die noch keinem Berater zugeordnet sind. Dein gesamtes Team hat Zugriff auf diese Übersicht.\nDie ältesten Anfragen stehen oben, die neuesten ganz unten, damit Du die zuerst eingegangenen leichter finden kannst.\nIn dem Moment, in dem Du auf 'Anfrage Annehmen' klicken, wird die Anfrage sofort in deinen Bereich 'Meine Beratungen' verschoben und die anderen Berater_innen sehen sie nicht mehr."
			},
			'2': {
				intro: 'Von hier aus kannst Du einen Chat mit einem/einer Ratsuchenden beginnen, der/die sich gerade im Warteraum befindet. Die Ratsuchenden werden mit einem anonymen Namen gekennzeichnet, wie zum Beispiel "Ratsuchende_r 11". Wenn Du den Chat starten möchtest, klicke auf "Chat starten" und Du kannst das Gespräch unter der Rubrik "Meine Beratungen" fortsetzen.'
			},
			'3': {
				intro: 'In diesem Bereich findest Du alle Anfragen, die Du angenommen hast. \nDer Nachrichtenverlauf, der zuletzt bearbeitet wurde, steht ganz oben.\nFalls der/die Ratsuchende gerade im Warteraum online ist, siehst Du das Label "Aktiv" direkt neben dem Namen.'
			},
			'4': {
				intro: 'Damit Du nicht durch nicht aktive Unterhaltungen abgelenkt wirst, kannst Du einige der Unterhaltungen archivieren. Sie werden dann nicht gelöscht, sondern nur in die Registerkarte "Archiv" verschoben. Jedes Mal, wenn Du oder der/die Ratsuchende etwas in eine archivierte Unterhaltung schreiben, wird dieser Nachrichtenverlauf wieder in die Liste der Ratsuchenden eingeordnet.'
			},
			'5': {
				intro: 'In diesem Bereich kannst Du alle aktiven Beratungen, die jemand in deinem Team gerade bearbeitet, einsehen und zu ihnen beitragen.'
			},
			'6': {
				intro: 'Im Profilbereich kannst Du persönliche und öffentliche Informationen verwalten, die Abwesenheitsnachricht während Deines Urlaubs aktivieren, Dein Passwort ändern und viele andere Funktionen (wie die Einrichtung der 2-Faktor-Authentifizierung) nutzen.'
			}
		}
	}
};
