export const en = {
	absence: {
		'overlay': {
			'headline': 'Welcome back!',
			'copy': 'Your absence message is currently activated. <br> Do you want to deactivate it?',
			'button1.label': 'Yes',
			'button2.label': 'No',
			'changeSuccess': {
				headline:
					'The status of your absence message has been successfully updated.',
				buttonLabel: 'Close'
			}
		},
		'checkbox.label': 'Inform advice seekers about my absence',
		'input.infoText':
			'Advice seekers will see absence message, but will still be able to write to you.'
	},
	aliases: {
		lastMessage: {
			e2ee_activated: 'Information about your data security',
			further_steps: 'This is how it continues',
			reassign_consultant: {
				CONFIRMED: 'reassigned',
				REJECTED: 'Assignment rejected',
				REQUESTED: 'Assignment request'
			},
			master_key_lost: '',
			// WORKAROUND for reassignment lastMessage bug
			reassign_consultant_reset_last_message: 'reassigned'
		}
	},
	anonymous: {
		listItem: {
			activeLabel: 'Active'
		},
		overlay: {
			finishChat: {
				'headline': 'Do you want to end this chat?',
				'consultant.copy':
					'The advice seeker will be informed about this and will not be able to access the chat history afterwards.',
				'asker.copy':
					'When you exit this chat, you will no longer have access to your chat history.',
				'button1': 'End chat',
				'button2': 'Cancel',
				'success': {
					headline: 'The chat has ended successfully.',
					button: 'Go to Caritas.de'
				}
			},
			chatWasFinished: {
				headline: 'Your consultant has ended the chat.',
				copy: 'You will no longer have access to your chat history.',
				button: 'Go to Caritas.de'
			}
		},
		session: {
			'finishChat': 'End chat',
			'systemMessage.chatFinished': 'The chat has been closed.',
			'infoMessage.chatFinished':
				'The messages are deleted 48h after the chat ends.'
		},
		waitingroom: {
			'title.start': 'Waiting room',
			'dataProtection': {
				headline: 'Welcome',
				subline:
					'Please confirm our privacy policy. After that, our consultants may start a chat with you.',
				description:
					'After that, our consultants may start a chat with you.',
				button: 'I agree'
			},
			'errorPage': {
				headline: 'Oops!',
				description:
					'We are sorry something must have gone wrong.<br>Try again.',
				button: 'Reload'
			},
			'closed': {
				headline: 'Our live chat is currently unavailable',
				description:
					'On our <a target="_blank" href="{{websiteUrl}}">Website</a> you can find the opening hours of the chat in the respective subject area.',
				illustrationTitle: 'chat closed'
			},
			'headline': 'Please be patient',
			'subline':
				'Currently, all consultants are in discussion. We will be there for you as soon as possible.',
			'username': {
				text: 'Your username is:',
				loading: 'Will be loaded...'
			},
			'info.accountDeletion':
				'To protect your anonymity, we delete your messages no later than 48 hours after the chat has ended.',
			'redirect': {
				title: 'You do not need an answer immediately? And do not want to wait for a free chat?',
				subline:
					'Register and leave us a message. We will get back to you within 2 business days. <br><br>Go to <a href="registration">registration</a>'
			},
			'overlay': {
				acceptance: {
					headline: 'Welcome!',
					copy: 'Your consultant is waiting for you in the chat. Are you ready?',
					button: 'Chat now'
				},
				rejection: {
					headline: 'Chat time ended.',
					copy: 'Sorry, we could not respond to your request within the chat time. Please register and leave us your message. We will get back to you within 2 business days.',
					button: 'To registration'
				}
			}
		}
	},
	app: {
		'title': 'Consulting & Help',
		'claim': 'Online. Anonymous. Secure.',
		'save': 'Save',
		'remove': 'Remove',
		'download': 'Download',
		'stage.title': 'Consulting & Help',
		'logout': 'Log out',
		'close': 'close',
		'open': 'open',
		'delete': 'delete',
		'scrollDown': 'Scroll down',
		'menu': 'More settings',
		'back': 'back',
		'next': 'next',
		'successful': 'Successful',
		'faulty': 'Faulty',
		'selectLanguage': 'Select language',
		'wait': 'Please wait'
	},
	appointments: {
		title: 'Appointment overview',
		newAppointment: 'New video appointment',
		showMore: 'Show more',
		showLess: 'Show less',
		notification: {
			'saved.title': 'The appointment was saved successfully.'
		},
		noAppointments: 'Currently there are no dates',
		onlineMeeting: {
			start: 'Start video call',
			overlay: {
				add: {
					'headline': 'New video call',
					'button.cancel': 'Cancel',
					'button.add': 'Save'
				},
				edit: {
					headline: 'Edit video call'
				},
				start: {
					'headline': 'Start video call',
					'copy': 'You are now starting the video call. Invited participants can join now with the invitation link.',
					'button.cancel': 'Cancel',
					'button.start': 'Start'
				},
				delete: {
					'headline': 'Delete video call',
					'copy': 'Do you really want to delete this video call?',
					'button.cancel': 'Cancel',
					'button.delete': 'Delete'
				}
			},
			form: {
				title: 'Title',
				description: 'Description',
				date: 'Date',
				time: 'Start (hh:mm)'
			}
		},
		copy: {
			link: {
				'title': 'Copy invitation link to clipboard',
				'text': 'Copy link',
				'notification.title': 'Link copied',
				'notification.text':
					'Invitation link to the video call copied to clipboard!'
			}
		},
		qrCode: {
			headline: 'Invitation link QR code',
			text: 'If you share your QR code with someone, that person can scan it with their phone camera to join the video call directly. Alternatively, you can download the code.'
		}
	},
	archive: {
		overlay: {
			session: {
				'success.copy':
					'You have successfully archived the advice seeker.',
				'success.button': 'Close'
			},
			teamsession: {
				'success.copy':
					'You have successfully archived the advice seeker for you and your team.',
				'success.button': 'Close'
			}
		},
		submitInfo: {
			headline: 'The consultation is archived.',
			message:
				'As soon as you or the advice seeker writes a message, the message history is automatically put back into the advice seeker list.'
		}
	},
	attachments: {
		'error': {
			format: {
				headline: 'Your file could not be sent.',
				message:
					'our file could not be sent. Allowed are images (jpg and png), and documents (docx and pdf). Please try again.'
			},
			size: {
				headline: 'Your selected file is too big.',
				message: 'You can upload max. {{attachment_filesize}}MB.'
			},
			quota: {
				headline: 'You have reached the limit for uploading.',
				message: 'Please try again tomorrow.'
			},
			other: {
				headline: 'There was an error uploading the file.',
				message: 'Please try again.'
			}
		},
		'list': {
			'label.received': 'You have received a file.',
			'label.sent': 'You have sent a file.'
		},
		'type': {
			'label.png': 'PNG',
			'label.jpeg': 'JPG',
			'label.pdf': 'PDF',
			'label.docx': 'DOCX',
			'label.xlsx': 'XLSX',
			'label.mb': 'MB'
		},
		'download.label': 'Download'
	},
	banner: {
		ie: {
			text: 'This application is not optimized for use with <strong>Internet Explorer</strong>. For an optimal user experience, please use a modern browser.'
		}
	},
	banUser: {
		'ban': {
			'trigger': 'Banish',
			'info.1': 'You have banned ',
			'info.2': ' .',
			'overlay.close': ' Close note'
		},
		'is.banned': ' Banned',
		'banned': {
			headline: 'You have been banned.',
			info: 'We have asked you to respect the chat rules.<br/><br/>Because you have repeatedly failed to comply with the chat rules today, we have excluded you from todays chat.<br/><br/>Familiarize yourself with the chat rules!<br/><br/>If you are ready to follow the chat rules, you are welcome to chat again from tomorrow!'
		}
	},
	booking: {
		'availability': {
			description:
				'Indicate your general availability here so that people seeking advice can book appointments with you.',
			title: 'Your availability'
		},
		'calender': {
			'add': 'Add calendar',
			'integration': {
				office365: 'Office 365/ Outlook Calendar',
				caldav: 'CalDav Server Calendar',
				google: 'Google Calendar',
				apple: 'Apple Calendar'
			},
			'synchronise': 'Synchronize',
			'synchroniseCalender': {
				title: 'Synchronize calendar',
				description:
					'Synchronize your calendar, which you use at your counseling center, with online counseling. Your availability will then be automatically adjusted and appointment conflicts prevented.'
			},
			'synchronised.calendars': 'Synchronized calendars'
		},
		'schedule': 'Arrange appointment',
		'mobile.calendar.label': 'Create appointment',
		'event': {
			'your.counselor': 'Your consultant',
			'asker': 'Advice seeker',
			'description': 'Your message for the appointment',
			'show': {
				more: 'Show more',
				less: 'Show less'
			},
			'booking': {
				cancel: 'Cancel appointment',
				reschedule: 'Move appointment'
			},
			'copy': {
				'link.notification.title': 'copied link',
				'link.notification.text':
					'Entry link to video call copied to clipboard!'
			},
			'tab': {
				booked: 'Booked appointments',
				canceled: 'Cancelled',
				expired: 'Passed',
				settings: 'Settings'
			}
		},
		'my': {
			'booking.title': 'Currently there are no appointments planned.',
			'booking.schedule': 'Make an appointment now with'
		},
		'info.video': 'Video consulting',
		'video.button.label': 'Start video call'
	},
	chatFlyout: {
		askerProfil: 'Advice seeker profile',
		dataProtection: 'Data protection',
		feedback: 'Feedback',
		groupChatInfo: 'Chat info',
		imprint: 'Imprint',
		editGroupChat: 'Chat settings',
		leaveGroupChat: 'Leave chat',
		stopGroupChat: 'End chat',
		archive: 'Archive',
		dearchive: 'Dearchive',
		remove: 'Delete'
	},
	consultant: {
		'jobTitle': 'Consultant',
		'absent.message': ' is absent'
	},
	date: {
		day: {
			0: {
				long: 'Sunday',
				short: 'Sun'
			},
			1: {
				long: 'Monday',
				short: 'Mon'
			},
			2: {
				long: 'Tuesday',
				short: 'Tue'
			},
			3: {
				long: 'Wednesday',
				short: 'Wed'
			},
			4: {
				long: 'Thursday',
				short: 'Thr'
			},
			5: {
				long: 'Friday',
				short: 'Fri'
			},
			6: {
				long: 'Saturday',
				short: 'Sat'
			}
		},
		month: {
			0: {
				long: 'January',
				short: 'Jan'
			},
			1: {
				long: 'February',
				short: 'Feb'
			},
			2: {
				long: 'March',
				short: 'Mar'
			},
			3: {
				long: 'April',
				short: 'Apr'
			},
			4: {
				long: 'May',
				short: 'May'
			},
			5: {
				long: 'June',
				short: 'Jun'
			},
			6: {
				long: 'July',
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
				long: 'October',
				short: 'Oct'
			},
			10: {
				long: 'November',
				short: 'Nov'
			},
			11: {
				long: 'December',
				short: 'Dec'
			}
		}
	},
	deleteAccount: {
		'button.label': 'Delete account',
		'confirmOverlay': {
			'copy': '<strong>This process cannot be reversed.</strong><br><br>Your account will be deleted within the next 48 hours. Your data will be deleted in accordance with the applicable data protection regulations.<br><br>Please enter your password to delete your account now.',
			'button.confirm': 'yes',
			'button.deny': 'no',
			'headline': 'Do you really want to delete your account?',
			'input.label': 'Password',
			'input.warning': 'Your password is not correct.'
		},
		'successOverlay': {
			headline:
				'You have successfully deleted your Caritas Consulting & Help account.',
			button: 'close'
		}
	},
	deleteSession: {
		confirmOverlay: {
			'headline': 'Delete chat',
			'copy': 'Do you really want to delete the chat?',
			'button.confirm': 'yes',
			'button.deny': 'no'
		},
		successOverlay: {
			headline: 'You have deleted the chat successfully.',
			button: 'ok'
		},
		errorOverlay: {
			headline:
				'Oops! We could not delete the chat right now. Please try again.',
			button: 'ok'
		}
	},
	e2ee: {
		attachment: {
			encrypted: 'Decrypt file for download',
			is_decrypting: 'File is being decrypted',
			decryption_error: 'Error while decrypting',
			save: 'Download file',
			error: {
				title: 'Unfortunately, we could not decrypt and download the file.',
				text: 'Ask the sender to resend the file. Then download the new file.'
			}
		},
		message: {
			'encryption.text': 'Message encrypted',
			'encryption.error': 'Message encrypted - error during decryption'
		},
		inProgress: {
			headline: 'One moment please.',
			copy: "Your safety is important to us! We're encrypting your chat right now. This can take a moment.",
			confirm: 'Please wait until the encryption is finished!'
		},
		hint: 'Your messages are encrypted end-to-end. That means no one outside this chat can read the messages. Not even the online consulting platform.',
		subscriptionKeyLost: {
			message: {
				primary:
					'A chat participant no longer has access to the message history.',
				secondary:
					'A chat participant had temporarily lost access to the message history. Now all chat participants can access the message history again.',
				more: 'Show more'
			},
			notice: {
				title: 'Your security is important to us!',
				text: 'Since you have reset your password, the messages are not readable for you at the moment. As soon as a chat participant opens the chat again, you can read the messages and write new ones.',
				link: 'Send notification',
				more: 'Show more'
			},
			overlay: {
				'headline': 'End-to-end encryption',
				'copy': 'Your messages are encrypted end-to-end for security reasons. That means no one outside this chat can read the messages. Not even the online consulting platform.<br/><br/>If the password is reset, the messages are temporarily unreadable. As soon as another chat participant opens the chat again, the messages can be re-encrypted. This means that all chat participants can read and write messages again.',
				'button.close': 'Close'
			}
		},
		roomNotFound: {
			'notice.line1': 'Ohh!',
			'notice.line2': 'We are sorry, something must have gone wrong.',
			'notice.line3': 'Please reload the page and try again.',
			'notice.link': 'Reload page'
		}
	},
	enquiry: {
		'acceptButton': {
			known: 'Accept request',
			anonymous: 'Start chat'
		},
		'anonymous': {
			'infoLabel.start': 'Now start the chat with ',
			'infoLabel.end': '.'
		},
		'write': {
			input: {
				'placeholder': {
					asker: 'Write us what moves you.',
					consultant: 'Write a message to client',
					feedback: {
						main: 'Send a message to Peer',
						peer: 'Send a message to Teamleader'
					},
					groupChat: 'Write message'
				},
				'button.title': 'Send message',
				'attachement': 'add attachement',
				'emojies': 'add emoji',
				'format': 'format text'
			},
			infotext: {
				headline: 'Here is room for your concerns.',
				iconTitle: 'Welcome',
				copy: {
					title: 'Perhaps the following points will help you with the formulation:',
					facts: '<ul><li>What happened?</li><li>What is your current situation?</li><li>What is on your mind?</li><li>Do you have a specific question or do you perhaps not yet know exactly what could help you?</li></ul>'
				}
			},
			overlay: {
				headline: 'Thank you for your message!',
				copy: 'Within two business days you will receive a response from us.',
				button: 'Go to the message'
			}
		},
		'language.selection.headline':
			'Please select the language in which you would like to be advised.'
	},
	error: {
		statusCodes: {
			400: {
				headline: 'Ups!',
				description: 'The URL you entered is invalid.'
			},
			401: {
				headline: 'Too bad!',
				description: 'You are not authorized to view this page.'
			},
			404: {
				headline: 'Ohh!',
				description:
					'We are sorry something must have gone wrong.<br>We could not find the page you requested.'
			},
			500: {
				headline: 'Ups!',
				description:
					'It looks like we have a server problem at the moment.<br>Try again later.'
			}
		},
		login: 'Login'
	},
	furtherSteps: {
		'consultant.info':
			'The person seeking advice was informed about the next steps as follows.',
		'headline': 'This is how it continues:',
		'arrowTitle': 'Next',
		'step1.info': 'We have received your message.',
		'step1.iconTitle': 'Open envelope',
		'step2.info': 'Now we will find a suitable consultant for you.',
		'step2.iconTitle': 'Consultant with glasses',
		'step3.info': 'Your advisor will respond within 2 business days.',
		'step3.iconTitle': 'Speak bubbles',
		'emailNotification': {
			headline: 'Receive e-mail notification & reset password',
			infoText:
				'If you provide your e-mail address (voluntary)<br><ul><li>receive an email notification when your advisor has written to you</li><li>you can reset your password if you have forgotten it.</li></ul>Your email address cannot be seen by the advisors.',
			button: 'Enter e-mail address'
		},
		'twoFactorAuth': {
			headline: 'The protection of your data is important to us',
			infoText:
				'Secure your account from possible unauthorized access. Use a second factor (app or email) to log in to online counseling.',
			button: 'Protect account'
		},
		'email': {
			'overlay': {
				'headline': 'Enter e-mail address',
				'input.label': 'E-mail',
				'input.valid': 'Your e-mail address is valid.',
				'input.invalid': 'Your e-mail address is not valid.',
				'input.unavailable':
					'This e-mail address is already registered.',
				'button1.label': 'Save',
				'button2.label': 'Close'
			},
			'success.overlay.headline':
				'Your e-mail address was successfully saved.'
		}
	},
	groupChat: {
		'active.sessionInfo.subscriber': 'Participants',
		'cancel.button.label': 'Cancel',
		'create': {
			'title': 'New chat',
			'subtitle': 'Chat topic',
			'topicInput': {
				label: 'Chat topic',
				warning: {
					short: 'The theme is too short',
					long: 'The topic is too long'
				}
			},
			'dateInput.label': 'Date',
			'beginDateInput.label': 'Start (hh:mm)',
			'durationSelect': {
				label: 'Duration',
				option1: '30 minutes',
				option2: '1 hour',
				option3: '1,5 hour',
				option4: '2 hour',
				option5: '2,5 hour',
				option6: '3 hour'
			},
			'repetitiveCheckbox.label': 'Repeat weekly',
			'button.label': 'Create chat',
			'listItem.label': 'New chat'
		},
		'createSuccess': {
			overlay: {
				headline: 'You have successfully created a chat.',
				buttonLabel: 'Close'
			}
		},
		'createError': {
			overlay: {
				headline: 'An error has occurred. Please try again.',
				buttonLabel: 'Close'
			}
		},
		'copy': {
			link: {
				text: 'Copy invitation link',
				notification: {
					title: 'Link copied',
					text: 'Link copied to clipboard!'
				}
			}
		},
		'edit.title': 'Chat settings',
		'info': {
			headline: 'Chat-Info',
			subscribers: {
				headline: 'Participants',
				empty: 'no participants available'
			},
			settings: {
				headline: 'Chat settings',
				topic: 'Chat topic',
				startDate: 'Date',
				startTime: 'Start',
				duration: 'Duration',
				repetition: {
					label: 'Repetitions',
					single: 'unique',
					weekly: 'weekly'
				},
				edit: 'Edit'
			}
		},
		'join': {
			'button.label.join': 'Join',
			'button.label.start': 'Start chat',
			'content.headline': 'Rules of the chat',
			'warning.message':
				'Your advisor/moderator has not started the chat yet. As soon as your consultant/moderator has started the chat, you can chat with us. Please be patient a little longer.',
			'chatClosedOverlay': {
				headline: 'The chat has already ended.',
				button1Label: 'To the overview',
				button2Label: 'Logout'
			}
		},
		'joinError': {
			overlay: {
				headline: 'An error has occurred. Please try again.',
				buttonLabel: 'Close'
			}
		},
		'leaveChat': {
			securityOverlay: {
				headline: 'Do you really want to leave the chat?',
				button1Label: 'Leave chat',
				button2Label: 'Cancel'
			},
			successOverlay: {
				headline: 'The chat has been successfully exited.',
				button1Label: 'To the overview',
				button2Label: 'Logout'
			}
		},
		'listItem': {
			activeLabel: 'Active',
			subjectEmpty: {
				self: 'You have created the chat.',
				other: 'The chat was created.'
			}
		},
		'save.button.label': 'Save',
		'stopChat': {
			securityOverlay: {
				headline: 'Do you really want to end the chat?',
				copyRepeat:
					'The chat history will be deleted and all users will be removed.',
				copySingle:
					'The chat will be deleted and all users will be removed.',
				button1Label: 'End chat',
				button2Label: 'Cancel'
			},
			successOverlay: {
				headline: 'The chat has ended successfully.',
				button1Label: 'To the overview',
				button2Label: 'Logout'
			}
		},
		'stopped': {
			overlay: {
				headline: 'The chat has ended.',
				button1Label: 'To the overview',
				button2Label: 'Logout'
			}
		},
		'updateSuccess': {
			overlay: {
				headline: 'Your changes have been saved successfully.',
				button1Label: 'Close'
			}
		}
	},
	help: {
		googleChrome: 'Google Chrome',
		msEdge: 'Microsoft Edge',
		safari: 'Safari',
		openInNewTab: 'Open in new tab',
		videoCall: {
			waitingRoom: {
				headline: "It's not you, it's your browser.",
				infoBox: {
					headline: 'Your browser does not support video calls.',
					text: 'To participate in video calls, please use Google Chrome, Microsoft Edge or Safari.'
				},
				subline1:
					"Don't have Google Chrome, Microsoft Edge, or Safari yet?",
				text1: 'Download one of the browsers.',
				subline2:
					'Already have Google Chrome, Microsoft Edge, or Safari?',
				text2: 'Now open your link to the online consultation with one of the supported browsers.',
				copyLink: 'Copy link',
				copiedLink: 'Link copied!'
			},
			banner: {
				content:
					'Please use a different browser for video calls to work.',
				more: 'Learn more'
			},
			asker: {
				headline: 'Video Call',
				intro: 'To participate in video calls, you must log in using one of the supported browsers. The chat consultation still works with Firefox.',
				steps: {
					'1.1': 'Follow the link to ',
					'1.2': ' or ',
					'1.3': ' (only for macOS and iOS available)',
					'2': 'Download one of the supported browsers',
					'3': 'Install it on your PC/laptop/tablet/smartphone.',
					'4': {
						'1': 'Now open the online consultation with this browser.',
						'2': 'Open the online consultation with one of these browsers.'
					},
					'5': 'Sign up for online counseling.',
					'6': 'Ask your advisor to call you again.',
					'headline': {
						'1': 'Step by step guide',
						'2': 'Already have Google Chrome, Microsoft Edge or Safari?'
					}
				}
			},
			consultant: {
				headline: 'Video Call',
				intro: 'To perform a video call, you must log in using one of the supported browsers. The chat consultation still works with Firefox.',
				steps: {
					'1.1': 'Follow the link to ',
					'1.2': ' or ',
					'1.3': ' (only for macOS and iOS available)',
					'2': 'Download one of the supported browsers. You may need the support of your IT for this.',
					'3': 'Install it on your PC/laptop/tablet/smartphone.',
					'4': {
						'1': 'Now open the online consultation with this browser.',
						'2': 'Open the online consultation with one of these browsers.'
					},
					'5': 'Sign up for online counseling.',
					'6': 'Start the video call.',
					'headline': {
						'1': 'Step by step guide',
						'2': 'Already have Google Chrome, Microsoft Edge or Safari?'
					}
				}
			},
			loginLink: {
				title: 'Copy link to clipboard',
				text: 'Copy link',
				notification: {
					title: 'Link copied',
					text: 'Link copied to clipboard!'
				}
			}
		}
	},
	jitsi: {
		btn: {
			default: 'Copy video link',
			copied: 'Video link has been copied to the clipboard'
		}
	},
	languages: {
		de: 'German',
		aa: 'Afar',
		ab: 'Abkhaz',
		ae: 'Avestic',
		af: 'African',
		ak: 'Acan',
		am: 'Amharic',
		an: 'Aragonese',
		ar: 'Arabic',
		as: 'Assamese',
		av: 'Avaric',
		ay: 'Aymara',
		az: 'Azerbaijani',
		ba: 'Bashkir',
		be: 'Belarusian',
		bg: 'Bulgarian',
		bh: 'Bihari',
		bi: 'Bislama',
		bm: 'Bambara',
		bn: 'Bengali',
		bo: 'Tibetan',
		br: 'Breton',
		bs: 'Bosnian',
		ca: 'Catalan, Valencian',
		ce: 'Chechen',
		ch: 'Chamorro',
		co: 'Corsican',
		cr: 'Cree',
		cs: 'Czech',
		cu: 'Church Slavonic, Old Church Slavonic',
		cv: 'Chuvash',
		cy: 'Welsh',
		da: 'Danish',
		dv: 'Dhivehi',
		dz: 'Dzongkha',
		ee: 'Ewe',
		el: 'Greek',
		en: 'English',
		eo: 'Esperanto',
		es: 'Spanish, Castilian',
		et: 'Estonian',
		eu: 'Basque',
		fa: 'Persian',
		ff: 'Fulfulde',
		fi: 'Finnish',
		fj: 'Fiji',
		fo: 'Faroese',
		fr: 'French',
		fy: 'West Frisian',
		ga: 'Irish',
		gd: 'Scottish Gaelic',
		gl: 'Galician, Galegian',
		gn: 'Guaraní',
		gu: 'Gujarati',
		gv: 'Manx,\nManx Gaelic',
		ha: 'Hausa',
		he: 'Hebrew',
		hi: 'Hindi',
		ho: 'Hiri Motu',
		hr: 'Croatian',
		ht: 'Haitian',
		hu: 'Hungarian',
		hy: 'Armenian',
		hz: 'Otjiherero',
		ia: 'Interlingua',
		id: 'Indonesian',
		ie: 'Interlingue',
		ig: 'Igbo',
		ii: 'Yi',
		ik: 'Inupiaq',
		io: 'Ido',
		is: 'Icelandic',
		it: 'Italian',
		iu: 'Inuctitut',
		ja: 'Japanese',
		jv: 'Javanese',
		ka: 'Georgian',
		kg: 'Cicongo',
		ki: 'Kikuyu',
		kj: 'oshiKwanyama',
		kk: 'Kazakh',
		kl: 'Greenlandic, Kalaallisut',
		km: 'Khmer',
		kn: 'Kannada',
		ko: 'Korean',
		kr: 'Kanuri',
		ks: 'Kashmiri',
		ku: 'Kurdish',
		kv: 'Comi',
		kw: 'Cornish',
		ky: 'Kyrgyz',
		la: 'Latin',
		lb: 'Luxembourgish',
		lg: 'Luganda',
		li: 'Limburgish, Southern Lower Franconian',
		ln: 'Lingála',
		lo: 'Lao',
		lt: 'Lithuanian',
		lu: 'Kiluba',
		lv: 'Latvian',
		mg: 'Malagasy, Malagassi',
		mh: 'Marshallese',
		mi: 'Maori',
		mk: 'Macedonian',
		ml: 'Malayalam',
		mn: 'Mongolian',
		mr: 'Marathi',
		ms: 'Malay',
		mt: 'Maltese',
		my: 'Burmese',
		na: 'Nauruan',
		nb: 'Bokmål',
		nd: 'Nord-Ndebele',
		ne: 'Nepali',
		ng: 'Ndonga',
		nl: 'Dutch, Belgian Dutch',
		nn: 'Nynorsk',
		no: 'Norwegian',
		nr: 'South Ndebele',
		nv: 'Navajo',
		ny: 'Chichewa',
		oc: 'Occitan',
		oj: 'Ojibwe',
		om: 'Oromo',
		or: 'Oriya',
		os: 'Ossetian',
		pa: 'Panjabi, Pandschabi',
		pi: 'Pali',
		pl: 'Polish',
		ps: 'Pashto',
		pt: 'Portuguese',
		qu: 'Quechua',
		rm: 'Graubünden Romansh, Romansh',
		rn: 'Kirundi',
		ro: 'Romanian',
		ru: 'Russian',
		rw: 'Kinyarwanda, Rwandan',
		sa: 'Sanskrit',
		sc: 'Sardinian',
		sd: 'Sindhi',
		se: 'Northern Sami',
		sg: 'Sango',
		si: 'Sinhala',
		sk: 'Slovak',
		sl: 'Slovenian',
		sm: 'Samoan',
		sn: 'Shona',
		so: 'Somali',
		sq: 'Albanian',
		sr: 'Serbian',
		ss: 'Siswati',
		st: 'Sesotho, Southern Sotho',
		su: 'Sundanese',
		sv: 'Swedish',
		sw: 'Swahili',
		ta: 'Tamil',
		te: 'Telugu',
		tg: 'Tajik',
		th: 'Thai',
		ti: 'Tigrinya',
		tk: 'Turkmen',
		tl: 'Tagalog',
		tn: 'Setswana',
		to: 'Tongan',
		tr: 'Turkish',
		ts: 'Xitsonga',
		tt: 'Tatar',
		tw: 'Twi',
		ty: 'Tahitian, Tahitian',
		ug: 'Uyghur',
		uk: 'Ukrainian',
		ur: 'Urdu',
		uz: 'Uzbek',
		ve: 'Tshivenda',
		vi: 'Vietnamese',
		vo: 'Volapük',
		wa: 'Walloon',
		wo: 'Wolof',
		xh: 'isiXhosa',
		yi: 'Yiddish',
		yo: 'Yoruba',
		za: 'Zhuang',
		zh: 'Chinese',
		zu: 'isiZulu'
	},
	login: {
		'headline': 'Login',
		'user.label': 'Username/E-mail',
		'seperator': 'or',
		'password': {
			label: 'Password',
			hide: 'hide password',
			show: 'show password',
			reset: {
				warn: {
					overlay: {
						'title':
							'Resetting the password may make it impossible to access your messages.',
						'description':
							'Do you still want to reset the password?',
						'button.accept': 'Yes, reset',
						'button.cancel': 'Back to login'
					}
				}
			}
		},
		'warning': {
			failed: {
				'unauthorized': {
					text: 'Username or password are not correct. Please try again.',
					otp: 'Your access data is not correct. Please try again.'
				},
				'app.otp.missing':
					'Please enter the code from your app for two-factor authentication.',
				'email.otp.missing':
					'Please enter the code from your email for two-factor authentication.',
				'deletedAccount':
					'Your account was marked for deletion. Your data will be deleted within the next 24 hours.'
			}
		},
		'resend.otp.email.label': 'Send code once again',
		'button.label': 'Login',
		'resetPasswort.label': 'Forgot password?',
		'register': {
			infoText: {
				title: 'Not registered yet?',
				copy: 'We will be happy to advise you on the following topics:'
			},
			linkLabel: 'To the consulting topics'
		},
		'legal': {
			infoText: {
				impressum: 'Imprint',
				dataprotection: 'Privacy policy'
			}
		},
		'consultant': {
			overlay: {
				'success': {
					headline: 'Welcome',
					button: 'Next'
				},
				'cancel.button': 'To the overview'
			}
		}
	},
	message: {
		'today': 'Today',
		'isMyMessage.name': 'Me',
		'yesterday': 'Yesterday',
		'tomorrow': 'Tomorrow',
		'dayBeforeYesterday': 'Day before yesterday',
		'forward': {
			label: 'Forwarded message from {{username}}, {{date}} at {{time}}',
			title: 'Forward text message to\nFeedback'
		},
		'copy.title': 'Copy message to clipboard',
		'write.peer.checkbox.label': 'Request feedback',
		'submit': {
			booking: {
				headline: 'Or make an appointment now',
				buttonLabel: 'Make an appointment for consultation'
			}
		},
		'appointmentSet': {
			'title': 'Your appointment was created',
			'addToCalendar': 'Add to calendar',
			'cancel': 'Cancel date',
			'between': 'between',
			'and': 'and',
			'info.video': 'Video consulting'
		},
		'appointmentCancelled.title': 'Your appointment was canceled',
		'appointmentRescheduled.title': 'Your appointment was postponed',
		'appointment': {
			component: {
				header: {
					confirmation: 'Date confirmation',
					cancellation: 'Date cancellation',
					change: 'Date change'
				}
			}
		},
		'delete': {
			delete: 'Delete',
			deleted: {
				own: 'You have deleted this message.',
				other: 'This message was deleted.'
			},
			overlay: {
				headline: 'Delete message',
				copy: 'Do you really want to delete the message?',
				cancel: 'Cancel',
				confirm: 'Delete'
			}
		},
		'note.title': 'Note',
		'unread': 'unread',
		'read': 'read',
		'sent': 'sent',
		'groupChat': 'Group chat',
		'liveChat': 'Live chat',
		'newEnquiry': 'New enquiry'
	},
	navigation: {
		'asker': {
			sessions: {
				large: 'My consultations',
				small: 'Messages'
			}
		},
		'consultant': {
			enquiries: 'Initial inquiries',
			sessions: {
				large: 'My consultations',
				small: 'Messages'
			},
			teamsessions: {
				large: 'Team consultations',
				small: 'Team Con.'
			},
			peersessions: {
				large: 'Peer consultations',
				small: 'Peer Con.'
			}
		},
		'profile': 'Profile',
		'appointments': 'Video dates',
		'booking.events': 'My dates',
		'language': 'Language',
		'overview': 'Overview',
		'tools': 'My tools'
	},
	notifications: {
		'message.new': 'Sie haben eine neue Nachricht!',
		'enquiry.new': 'You have a new live chat request!',
		'initialRequest.new': 'You have a new initial request!',
		'warning': 'warning',
		'error': 'failed',
		'success': 'successful',
		'info': 'info'
	},
	overlay: {
		'step.headline.prefix': '. Step | ',
		'timeout': {
			headline: 'One moment please.',
			confirm: 'Are you sure you want to leave this page?'
		}
	},
	overview: {
		title: 'Welcome back!',
		myMessagesTitle: '{{countStr}} unread messages',
		initialInquiriesTitle: '{{countStr}} enquiries',
		upcomingAppointments: 'Your next {{countStr}} appointments',
		upcomingAppointment: 'Your next appointment',
		emptyMessages: 'You have everything in view, all messages are read!',
		emptyInitialMessage: 'Very good, all initial requests are processed!',
		emptyAppointments:
			'There are no appointments today, make appointments with those seeking advice to change that',
		emptyAppointmentsMobile:
			'No appointments at the moment, make appointments with those seeking advice to change that',
		viewAll: 'Show all',
		myMessagesEmpty: 'You have everything in view, all messages are read!',
		initialInquiriesEmpty: 'Very good, all initial requests are processed!',
		appointmentsEmpty:
			'There are no appointments today, make appointments with those seeking advice to change that',
		start: 'Start'
	},
	preconditions: {
		cookie: {
			headline: 'Please enable cookies to continue',
			paragraph: {
				1: 'Please enable cookies in your browser to enable login.',
				2: 'After enabling cookies in your browser, simply click the button below to return to the previous page.'
			},
			button: 'Back to previous page'
		}
	},
	profile: {
		'noContent': 'Not specified',
		'header.title': 'Profile',
		'functions': {
			'title': 'Functions',
			'absence': {
				'title': 'My absence',
				'label': 'Deposit an out of office message',
				'activated.label':
					'Deactivate your absence to leave a message or edit it.'
			},
			'security': {
				title: 'Security',
				button: 'Change password'
			},
			'password': {
				reset: {
					'title': 'Password',
					'subtitle':
						'If you wish, you can change your password here. First enter your current password to set a new one.',
					'old': {
						label: 'Current password',
						incorrect: 'Your password is not correct.'
					},
					'new.label': 'New password',
					'confirm.label': 'Confirm new password',
					'secure': 'Your password is safe.',
					'insecure': 'Your password is not secure.',
					'same': 'Your password is identical.',
					'not.same': 'Your password is not identical.',
					'instructions':
						'<span class="text--bold">Your password must meet the following criteria to guarantee a protected consultation:</span><ul class="pl--2 my--1"><li>upper/lower case</li><li>min. one number</li><li>min. one special character (e.g.: ?, !, +, #, &, ...)</li><li>min. 9 characters</li></ul>',
					'overlay': {
						'headline':
							'You have successfully changed your password. You will now be redirected to the login.',
						'button.label': 'Login'
					}
				}
			},
			'spokenLanguages.saveError':
				'A problem occurred while saving. Please try again.',
			'masterKey.saveError':
				'A problem occurred while changing the password. Please try again.'
		},
		'data': {
			title: {
				asker: 'About me',
				private: 'Private data',
				information: 'Contact data',
				agencies: 'My consulting centers'
			},
			info: {
				private: 'This data cannot be viewed by those seeking advice.',
				public: 'With the display name you will appear to those seeking advice.'
			},
			edit: {
				'button.cancel': 'Cancel',
				'button.save': 'Save',
				'button.edit': 'edit'
			},
			profileIcon: 'Profile icon',
			userName: 'User name',
			displayName: 'Display name',
			firstName: 'First name',
			lastName: 'Last name',
			email: 'E-mail address',
			emailInfo:
				'Adding your Email address is optional, and only used to notify you when your counsellor answers in the chat. Your Email address is not visible to counsellors.',
			agency: {
				label: 'Beratungsstelle',
				registrationLink: {
					title: 'Copy registration link to counseling center to clipboard',
					text: 'Copy link',
					notification: {
						title: 'Link copied',
						text: 'Registration link to the counseling center copied to clipboard!'
					}
				}
			},
			personal: {
				registrationLink: {
					title: 'Copy contact link to clipboard',
					text: 'Copy contact link',
					notification: {
						title: 'Link copied',
						text: 'The link was successfully copied to the clipboard!'
					},
					tooltip:
						'Share your personal contact link with someone so they can start an online consultation directly with you.'
				}
			},
			register: {
				'headline':
					'Do you also need advice or help on other topics?<br>We will be happy to support you.',
				'consultingTypeSelect.label': 'Topics',
				'consultingModeInfo': {
					groupChats:
						'In self-help, those affected exchange information with each other about a topic or concern. Those affected talk about their problems, feelings and hopes and learn how others have overcome problems. The groups are led by moderators.',
					singleChats:
						'In these subject areas you will receive a personal consultation. Write us your request!'
				},
				'button.label': 'Register'
			},
			registerSuccess: {
				overlay: {
					'headline':
						'You have successfully registered for a new topic.',
					'button1.label': 'Write message',
					'groupChats.button.label': 'To the overview',
					'button2.label': 'Logout'
				}
			},
			registerError: {
				overlay: {
					'headline': 'An error has occurred. Please try again.',
					'button.label': 'Close'
				}
			}
		},
		'externalRegistration': {
			headline:
				'Your chosen counseling center uses a different application for counseling',
			copy: {
				start: 'Would you like to apply for "',
				end: '" switch to the other application and register there?'
			},
			submit: 'Switch now',
			cancel: 'Cancel'
		},
		'footer': {
			imprint: 'Imprint',
			dataprotection: 'Data protection'
		},
		'routes': {
			general: {
				title: 'General',
				public: 'Public data',
				privat: 'Private data'
			},
			activities: {
				title: 'My activities',
				statistics: 'My statistics',
				absence: 'My absence',
				availability: 'My availability'
			},
			notifications: {
				title: 'Notifications',
				email: 'E-mail notification'
			},
			settings: {
				title: 'Settings',
				security: {
					'title': 'Security',
					'changePassword': 'Change password',
					'2fa': 'Two-factor authentication'
				}
			},
			help: {
				title: 'Help',
				videoCall: 'Video-Call'
			},
			display: 'Display'
		},
		'spokenLanguages': {
			title: 'My languages',
			info: 'Select the language(s) in which you can advise those seeking advice. German is preselected as the default language and cannot be removed.'
		},
		'statistics': {
			title: 'My statistics',
			period: {
				prefix: 'Your numbers of the',
				lastMonth: 'last month',
				currentMonth: 'current month',
				currentYear: 'current year',
				lastYear: 'past year',
				display: {
					default: 'DD.MM.JJJJ - DD.MM.JJJJ',
					prefix: 'In the period from ',
					suffix: ' you have:'
				}
			},
			complete: {
				'title':
					'You can download your statistics for your selected consulting period here:',
				'filename': 'Statistics online consulting',
				'download.label': 'Download Excel file'
			},
			csvHeader: {
				numberOfAppointments: 'Appointments booked',
				numberOfAssignedSessions: 'Consultations accepted',
				numberOfSentMessages: 'Messages written',
				numberOfSessionsWhereConsultantWasActive: 'Active consulting',
				videoCallDuration: 'Duration of video calls in minutes:seconds'
			}
		},
		'unsetEmail': {
			confirmOverlay: {
				'headline': 'Do you really want to delete your email address?',
				'copy': 'When you delete their email address:',
				'benefit.1':
					'you will not receive an email notification when your advisor has written to you',
				'benefit.2':
					'you will not be able to reset your password in case you forget it.',
				'button.confirm': 'Delete',
				'button.deny': 'Cancel'
			},
			errorOverlay: {
				headline:
					'Oops! We could not delete the email address just now. Please try again',
				button: 'ok'
			},
			successOverlay: {
				headline: 'You have successfully deleted your email address.',
				button: 'ok'
			}
		},
		'notifications': {
			'title': 'E-mail notification',
			'subtitle': 'We will notify you when you:',
			'description':
				'We will inform you by e-mail when you have received a new message.',
			'follow.up.email.label':
				'Have received a message from an accepted advice seeker.',
			'mainEmail': {
				title: 'Allow email notifications'
			},
			'initialEnquiry': {
				title: 'Receive a new initial enquiry'
			},
			'newMessage': {
				title: 'New chat message',
				description:
					'One of your assigned advice seekers has replied to you'
			},
			'reassignmentConsultant': {
				title: 'Re-assignment of an advice seeker',
				description:
					'A colleague has reassigned an advise seeker to you'
			},
			'reassignmentAdviceSeeker': {
				title: 'Change of counsellor',
				description:
					'Your counsellor has asked for permission to reassign you to a new counsellor'
			},
			'appointmentNotificationEnabled': {
				title: 'Appointments',
				description:
					'An appointment was scheduled, postponed or cancelled'
			},
			'error': {
				title: 'Something went wrong.',
				description:
					'Unfortunately, we cannot update your settings at the moment. Please try again later.'
			},
			'toggleError': {
				title: 'Something went wrong.',
				description:
					'Unfortunately, we cannot activate your notifications at this time. Please try again later.'
			},
			'noEmail': {
				info: 'You have not yet added an email address.',
				button: 'Add email address',
				modal: {
					title: 'Add email address',
					description:
						'Your e-mail address is voluntary and will only be used to inform you about new chat messages from your counsellor. Your email address is not visible to your advisor.',
					confirm: 'Add',
					emailInput: {
						label: 'EMail',
						valid: 'Your email address is valid.',
						invalid: 'Your email address is not valid.',
						unavailable: 'This email address is already in use.'
					},
					errorTitle: 'Something went wrong.',
					errorMessage:
						'Unfortunately, we cannot save your e-mail address at the moment. Please try again later or contact our support.'
				}
			}
		},
		'browserNotifications': {
			title: 'Browser Notifications',
			description:
				"If you're online, we'll notify you in this browser when you've got a new message.",
			toggle: 'Receive notifications in this browser',
			initialEnquiry: {
				title: 'A new initial request has been received'
			},
			newMessage: {
				title: 'New chat message',
				description:
					'One of the counselees assigned to you has answered you'
			},
			denied: {
				message:
					'You have opted out of receiving notifications for this browser. To enable push notifications, you must first allow them in your browser settings.'
			}
		},
		'documentation': {
			title: 'User Manual',
			description:
				'Do you have any questions? The user manual will provide you with detailed information on the main functionalities of the online counselling platform.',
			link: 'Go to user manual'
		},
		'liveChat': {
			title: 'My live chat availability',
			subtitle:
				'Activate your availability and see the waiting anoymous advice seekers in the initial requests under "Live Chat Requests".',
			toggleLabel: 'available'
		},
		'appLanguage': {
			title: 'Language',
			info: 'Set the language of the application here.'
		}
	},
	qrCode: {
		'download.filename': 'qr-code-{{filename}}',
		'link.text': 'Show QR code',
		'personal': {
			overlay: {
				headline: 'Your personal QR code',
				info: 'If you share your QR code with someone, they can scan it with their phone camera to contact you directly. Alternatively, you can download the code.'
			}
		},
		'agency': {
			overlay: {
				headline: 'Counseling centers QR code',
				info: 'If you share the QR code with someone, that person can scan it with their phone camera to register directly with the counseling center {{agency}}. Alternatively, you can download the code.'
			}
		},
		'overlay': {
			'download': 'Download QR code as .png',
			'close': 'Close',
			'image.alt': 'QR-Code'
		},
		'iconTitle': 'QR code'
	},
	registration: {
		'headline': 'Registration',
		'overline': 'Welcome to online consulting',
		'title.start': 'Registration',
		'form.title': 'Complete registration',
		'login': {
			helper: 'Already registered?',
			label: 'Login'
		},
		'stepbar': {
			step: 'Step',
			of: 'of'
		},
		'topic': {
			headline: 'On what topic are you looking for advice?',
			subline: 'Select a topic from our consulting offer.'
		},
		'zipcode': {
			headline:
				'To be able to advise you in the best possible way we need your zip code',
			subline: 'Why? Because then our professionals:',
			bullet1: '• know the aids around your place of residence',
			bullet2: '• know the laws of your state',
			label: 'Your zipcode'
		},
		'agency': {
			'preselected.prefix': 'Your pre-selected counseling center: ',
			'preselected.isTeam': 'You will be advised by a team.',
			'headline': 'Choose your consulting center',
			'search': 'Search for your zipcode',
			'result': {
				headline: 'Consulting centers for zipcode',
				external: {
					headline:
						'The found counseling center uses another application for counseling',
					subline:
						'Please try a different zip code or visit our website to find a counseling center near you.',
					link: 'Switch now',
					languages: 'This counseling center advises you on:'
				},
				noresult: {
					headline: 'No online counseling center found',
					subline:
						'Please try a different zip code or visit our website to find a counseling center near you.',
					label: 'To the advice center search'
				}
			}
		},
		'consultingType.preselected.prefix': 'Your pre-selected topic: ',
		'username.headline': 'Choose username',
		'user': {
			label: 'Username',
			infoText:
				'To protect your anonymity, we advise you not to use your real name or initials.<br>Please choose a suitable username with min. 5 characters.',
			suitable: 'Your username is suitable.',
			unsuitable: 'Your username is too short.',
			unavailable: 'The username is already taken.'
		},
		'agencySelection': {
			'headline': 'Choose consulting center',
			'title.start': 'Consultation centers to the zip code',
			'title.end': ':',
			'languages.info': 'This counseling center advises you on:',
			'languages.more': 'Languages',
			'intro': {
				overline:
					'Why does a counseling center near you also help you online?',
				subline: 'Because then the professional staff:',
				point1: 'knows the regional help structures,',
				point2: 'is familiar with the legal requirements,',
				point3: 'can also advise you on site if necessary.'
			},
			'postcode': {
				label: 'Your zip code',
				unavailable: {
					title: 'No counseling center found nearby',
					text: 'Unfortunately, we do not have an online counseling center near you at the moment. On our website you can find local counseling centers for your concern.'
				},
				search: 'To the advice center search'
			},
			'noAgencies':
				'Unfortunately, no counseling centers can be found at the moment.'
		},
		'agencyPreselected': {
			headline: 'Please enter your postal code',
			intro: {
				overline: 'Why do we need your postal code?',
				subline: 'Our experts:',
				point1: 'then know the aids around your place of residence',
				point2: 'know the laws of your state'
			}
		},
		'consultingTypeAgencySelection': {
			consultingType: {
				'headline': 'Please select a topic',
				'infoText':
					'Your consultant is active in several subject areas. Please select your desired subject area.',
				'select.label': 'Topic'
			},
			agency: {
				headline: 'Please select a counseling center',
				infoText:
					'Your consultant is active in several counseling centers. Please select your desired counseling center.'
			}
		},
		'password': {
			'headline': 'Please choose your password',
			'input.label': 'Password',
			'confirmation.label': 'Repeat password',
			'secure': 'Your password is secure.',
			'insecure': 'Your password is not secure.',
			'same': 'Your password is identical.',
			'notSame': 'Your password is not identical.',
			'intro':
				'To guarantee protected consultation, your password must meet the following criteria:',
			'criteria': {
				fulfilled: 'fulfilled',
				upperLowerCase: 'Upper/lower case',
				number: 'at least one number',
				specialChar: 'at least one special character',
				length: 'At least 9 characters'
			}
		},
		'age': {
			headline: 'Specify age',
			dropdown: 'Select age*'
		},
		'state': {
			headline: 'Specify state',
			dropdown: 'Select state*',
			options: {
				'0': 'outside Germany',
				'1': 'Baden-Württemberg',
				'2': 'Bavaria',
				'3': 'Berlin',
				'4': 'Brandenburg',
				'5': 'Bremen',
				'6': 'Hamburg',
				'7': 'Hesse',
				'8': 'Mecklenburg-Western Pomerania',
				'9': 'Lower Saxony',
				'10': 'North Rhine-Westphalia',
				'11': 'Rhineland-Palatinate',
				'12': 'Saarland',
				'13': 'Saxony',
				'14': 'Saxony-Anhalt',
				'15': 'Schleswig-Holstein',
				'16': 'Thuringia'
			}
		},
		'mainTopic': {
			headline:
				'Which of these problem areas is currently most important to you?',
			noTopics:
				'Unfortunately, no topics can be selected at the moment. Continue the registration in the next step.'
		},
		'dataProtection': {
			label: {
				prefix: 'I have the ',
				and: ' and ',
				suffix: ' noted. For authentication and navigation, this website uses cookies. I agree with this.'
			}
		},
		'submitButton.label': 'Register',
		'overlay': {
			success: {
				headline: 'Welcome<br>to the consulting & help of Caritas.',
				copy: 'You have successfully registered.',
				button: 'Compose message'
			}
		},
		'accordion': {
			item: {
				continueButton: {
					label: 'Next',
					title: 'Continue to the next step'
				}
			}
		},
		'welcomeScreen': {
			subline: 'How does Caritas Counseling & Assistance work?',
			info1: {
				title: 'Simple registration',
				text: 'For individual and protected consultation'
			},
			info2: {
				title: 'Compose message',
				text: 'You send your message to a local counseling center'
			},
			info3: {
				title: 'Personal and professional advice',
				text: 'Within 2 working days you will get an answer'
			},
			info4: {
				title: 'Anonymous and free of charge',
				text: 'You remain anonymous and receive free advice and assistance'
			},
			register: {
				helperText: 'Not registered yet?',
				buttonLabel: 'Register'
			}
		},
		'teaser.consultant':
			'Please register to get in touch with your consultant'
	},
	releaseNote: {
		'content': {
			headline: 'We have news!',
			intro: 'Heres whats changed with online counseling:',
			checkbox: 'Do not show this message again.'
		},
		'overlay.close': 'Close'
	},

	termsAndConditionOverlay: {
		title: {
			termsAndCondition: 'Updating our terms of use',
			privacy: 'Updating our privacy policy',
			termsAndConditionAndPrivacy:
				'Updating our terms of use and privacy policy'
		},
		labels: {
			termsAndCondition: 'Terms of Use',
			privacy: 'Privacy Policy',
			here: 'here'
		},
		contentLine1: {
			termsAndCondition:
				'We have updated the terms of use of the online counseling. In order to be able to continue using the online counseling, we need your consent.',
			privacy:
				'We have updated the privacy policy of the online counseling. You can find the current version and get more information here.',
			termsAndConditionAndPrivacy:
				'We have updated the terms of use and privacy policy of the online counseling. In order to be able to continue using the online counseling, we need your consent.'
		},
		contentLine2: {
			termsAndCondition:
				'I have read the Terms of Use.\n I agree to this.',
			termsAndConditionAndPrivacy:
				'I have read the Terms of Use and Privacy Policy.\n I agree to this.'
		},
		buttons: {
			decline: 'Decline',
			accept: 'Agree',
			continue: 'Continue'
		}
	},

	session: {
		'acceptance': {
			'overlay.headline':
				'You have successfully accepted the initial request and can now find it under "My consultations".',
			'button.label': 'Answers'
		},
		'alreadyAssigned': {
			overlay: {
				'headline': 'You have already assigned this consultation.',
				'button.cancel': 'Close',
				'button.redirect': 'Answers'
			}
		},
		'anonymous': {
			'takenByOtherConsultant.overlay.headline':
				'This initial request has already been accepted by another consultant.',
			'takenByOtherConsultant.button.label': 'Close'
		},
		'assignOther': {
			'inProgress': 'Counseling is being assigned.',
			'overlay': {
				'headline': {
					'1': 'Do you want to assign {{client}} to {{newConsultant}}?',
					'2': 'You have successfully assigned the consultation.'
				},
				'subtitle.noTeam':
					'{{newConsultant}} is thus responsible for the advice seeker and can read the complete message history. They no longer have access to the messages.',
				'subtitle.team.self':
					'{{newConsultant}} is thus responsible for the advice seeker. If {{toAskerName}} agrees to the assignment, you will find the chat history in your messages and no longer under team consulting.',
				'subtitle.team.other':
					'{{newConsultant}} is thus responsible for the advice seeker. If {{toAskerName}} agrees to the assignment, you will find the chat history under Team Consulting and no longer in your messages.'
			},
			'button.label': 'Cancel'
		},
		'assignSelf': {
			'inProgress': 'The consultation is being assigned to you.',
			'overlay': {
				'headline1':
					'You have successfully accepted the consultation. It has been moved to My consultations.',
				'headline2': 'Assign consultation',
				'subtitle': 'Do you really want to assign this consultation?',
				'button.cancel': 'Cancel',
				'button.assign': 'Assign'
			},
			'button1.label': 'Answers',
			'button2.label': 'Close'
		},
		'consultant.prefix': 'Consultant - ',
		'divider.lastRead': 'Last read',
		'empty': 'Please select a message',
		'feedback.label': 'Feedback',
		'groupChat.consultant.prefix': 'Moderator - ',
		'u25.assignment.placeholder': 'Assign consultation',
		'unreadCount.maxValue': '99+',
		'dragAndDrop': {
			explanation: {
				insideDropArea: 'Place the file here to upload it.',
				outsideDropArea: 'Drag the file into the field to upload it.'
			},
			restrictions:
				'.jpg, .png, .pdf, .docx, .xlsx up to a maximum of {{attachment_filesize}}MB'
		},
		'reassign': {
			system: {
				message: {
					reassign: {
						title: '{{oldConsultant}} would like to pass you to {{newConsultant}}.',
						description: {
							noTeam: '{{newConsultant}} can thus read the complete message history and is responsible for you. {{oldConsultant}} no longer has access to the messages.',
							team: '{{newConsultant}} can thus read the complete message history and is responsible for you.'
						},

						question: 'Do you agree to the transfer?',
						accept: 'Accept',
						decline: 'Decline',
						sent: {
							title: 'Request for assignment sent',
							description: {
								noTeam: 'Once {{client1}} agrees to the assignment, {{client2}} is passed to {{newConsultant}} with the complete message history.',
								team: {
									self: 'Once {{client1}} agrees to the assignment, {{newConsultant}} will be responsible for {{client2}}. You will then find the chat history under Team Consulting and no longer here in your messages.',
									other: 'Once {{client1}} agrees to the assignment, {{newConsultant}} will be responsible for {{client2}}. You will then find the chat history in your messages and no longer here under Team Consulting.'
								}
							}
						},
						accepted: {
							'title': {
								self: '{{oldConsultant}} has passed {{client}} to you.',
								other: '{{oldConsultant}} has passed {{newConsultant}} to {{client}}.'
							},
							'description': {
								self: 'You are now responsible for {{client}}.',
								other: '{{consultant}} is now responsible for {{client}}.'
							},
							'consultant.title':
								'{{newConsultant}} kümmert sich nun um Sie und Ihre Anliegen.',
							'new.consultant.description':
								'We have notified {{newConsultant1}}. You can now send messages to {{newConsultant2}}.',
							'old.consultant.description':
								'We have notified {{newConsultant}}. {{oldConsultant}} is no longer responsible for you'
						},
						declined: {
							'title': '{{client}} has rejected the assignment.',
							'description': {
								self: 'You are still responsible for {{client}}.',
								other: '{{consultant}} is still responsible for {{client}}.'
							},
							'old.consultant.title':
								'{{oldConsultant}} will continue to take care of you and your concerns.'
						}
					}
				}
			}
		}
	},
	sessionList: {
		'teamsession': 'Team consulting',
		'empty': {
			known: 'There are no requests at the moment',
			anonymous:
				'Currently, no anonymous advice seekers are waiting for a live chat',
			mySessions: 'You currently have no active consultations',
			teamSessions: 'Your team has no active consultations',
			peersessions: 'You currently have no active peer counselling',
			archived: 'There are no consultations in the archive yet'
		},
		'unavailable': {
			description:
				'Activate your availability to receive initial inquiries from advice seekers',
			buttonLabel: 'Activate availability'
		},
		'preview': {
			'headline': 'Initial inquiries',
			'registered.tab': 'Initial inquiries',
			'anonymous.tab': 'Live chat requests'
		},
		'view': {
			'headline': 'My consultations',
			'asker.tab': 'Advice seekers',
			'archive.tab': 'Archive'
		},
		'user': {
			headline: 'My consultations',
			consultantUnknown: 'Search for consultants underway',
			writeEnquiry: 'Write message now',
			peer: 'Peer'
		},
		'peersessions.headline': 'Peer consultations',
		'asker.welcome': 'Welcome back!',
		'filter': {
			placeholder: 'Filter',
			option: {
				all: 'All consultations',
				feedbackMain: 'Feedback needed',
				feedbackPeer: 'Feedback available'
			}
		},
		'reloadButton.label': 'Reload',
		'createChat.buttonTitle': 'Create chat',
		'time.label.postfix': 'Clock'
	},
	statusOverlay: {
		error: {
			headline: 'An error occurred while sending the message',
			text: 'A problem has occurred, please try again'
		},
		success: {
			headline: 'Your message was sent',
			text: 'Thank you for your inquiry. We will reply to you within 48 hours on weekdays. If you have provided your email address, you will receive a notification as soon as our response is received.'
		}
	},
	text: {
		'label.hint': 'Hint'
	},
	tools: {
		'button.label': 'Open',
		'shared': 'Shared with the advisor',
		'calendar.title': 'My Calendar',
		'calendar.description':
			'Enter your holidays or other appointments in the calendar so that those seeking advice cannot book any appointments with you during this time.<br/>Log in with the same e-mail address and password that you use here for the online use advice.',
		'calendar.button.label': 'Open'
	},
	twoFactorAuth: {
		title: 'Two-factor authentication',
		edit: 'edit',
		subtitle:
			'In addition to your password, use a second factor for logging in. This will provide additional security for your account.',
		switch: {
			'active.label': 'Two-factor authentication enabled',
			'deactive.label': 'Two-factor authentication disabled',
			'type': {
				label: 'Your second factor',
				EMAIL: 'E-Mail',
				APP: 'App'
			}
		},
		activate: {
			step1: {
				'email': 'Per E-Mail',
				'app': 'With Authenticator Application',
				'title': 'Select second factor',
				'copy': 'Install a suitable Authenticator app on your smartphone or tablet. Alternatively, you can also use your e-mail address as a second factor.',
				'visualisation.label': 'Selection',
				'disable': 'Disable authentication'
			},
			radio: {
				label: {
					app: 'App',
					email: 'E-mail address'
				},
				tooltip: {
					app: 'Install the app. The app will generate a code for you to enter when you log in.',
					email: 'You will receive an email with a code when you register. You must then enter this code.'
				}
			},
			email: {
				input: {
					label: 'Enter e-mail address',
					valid: 'Enter e-mail address',
					invalid: 'E-mail address invalid',
					duplicate: {
						label: 'E-mail address is already in use',
						info: 'This email address is already in use by someone else. Please enter a different email address. Or use the app as a second factor.'
					},
					info: 'You can only leave one email address with us. If you change the e-mail address here, you will also receive the notifications on this e-mail address in the future.'
				},
				resend: {
					hint: 'We have sent you a code to your email address. Please enter the code.',
					headline: 'It did not work?',
					new: 'Send new code',
					sent: 'New code sent'
				},
				step2: {
					'title': 'Enter e-mail address',
					'copy': 'Please enter your e-mail address here.',
					'visualisation.label': 'Specification'
				},
				step3: {
					'title': 'E-Mail-Adresse bestätigen',
					'copy': {
						'1': 'We have just sent you an email to',
						'2': 'sent. Please enter the code from the email here.'
					},
					'visualisation.label': 'Link'
				},
				step4: {
					'title': 'E-mail authentication successfully set up.',
					'visualisation.label': 'Confirmation'
				}
			},
			app: {
				step2: {
					'title': 'Install the app',
					'copy': 'Please install a suitable authenticator app on your smartphone or tablet, such as the FreeOTP or Google Authentificator app. Both apps are available in the Google Play or Apple App Store.',
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
						google: 'Download from Google Play Store',
						apple: 'Download from Apple App Store'
					}
				},
				step3: {
					'title': 'Add the online consultation to the app',
					'copy': 'You have two options to add the online consultation to the app:',
					'visualisation.label': 'Add',
					'connect': {
						qrCode: 'Open the app and scan the following QR code:',
						divider: 'or',
						key: 'Open the app and enter the following 32-digit key:'
					}
				},
				step4: {
					'title': 'Enter one time code',
					'copy': 'Enter the one-time code generated by the app and click "Save" to complete the setup.',
					'visualisation.label': 'Link'
				},
				step5: {
					'title': 'App shortcut successfully set up.',
					'visualisation.label': 'Confirmation'
				}
			},
			otp: {
				input: {
					label: {
						text: 'Single-use code',
						short: 'The entered code is too short.',
						error: 'Authentication has failed. Please repeat the process.'
					}
				}
			}
		},
		overlayButton: {
			next: 'Next',
			back: 'Back',
			save: 'Save',
			close: 'Close',
			confirm: 'Confirm'
		},
		email: {
			'change': {
				confirmOverlay: {
					'title': 'E-Mail-Adresse bearbeiten',
					'copy': {
						'1': 'They use this email address as a second factor for secure login.',
						'2': 'Disable two-factor authentication to edit the email address.'
					},
					'binding': {
						copy: {
							'1': 'You cannot change your email address as long as you use it as a second factor for secure login.',
							'2': 'Change the second factor from "Email address" to "App". Then you can change your email address.'
						}
					},
					'button.confirm': 'Disable authentication',
					'button.deny': 'Cancel'
				}
			},
			'delete.confirmOverlay.copy':
				'the two-factor authentication is disabled.'
		},
		nag: {
			'title': 'Protect your account',
			'copy': 'Secure your account from possible unauthorized access. Use a second factor (app or email) to log in to the online fry.',
			'button.later': 'Later remember',
			'button.protect': 'Protect now',
			'obligatory': {
				moment: {
					title: 'Protect your account no later than {{date}}',
					copy: 'You have to deposit up to {{date1}} a second factor (app or email) for logging into the online consultation. This is for security and protects your account from possible unauthorized access.<br><br><b>Attention: Without a second factor you are not allowed to consult online after {{date2}}.</b>'
				},
				title: 'Protect your account now',
				copy: 'You now need to store a second factor for (App or E-mail) logging into the online consultation.  This is for security and protects your account from possible unauthorized access. <br><br><b>This is for security and protects your account from possible unauthorized access.</b>'
			}
		}
	},
	typingIndicator: {
		'singleUser.typing': 'writes',
		'twoUsers': {
			connector: 'and',
			typing: 'write'
		},
		'multipleUsers.typing': 'Participants write'
	},
	user: {
		userAddiction: {
			relation: {
				'headline': 'Background',
				'0': 'Affected',
				'1': 'Affiliated',
				'2': 'Other'
			},
			age: {
				'headline': 'Age',
				'selectLabel': 'Select age',
				'0': '0-17',
				'1': '18-20',
				'2': '21-30',
				'3': '31-40',
				'4': '41-59',
				'5': '60+',
				'null': 'no information'
			},
			gender: {
				'headline': 'Gender',
				'0': 'Female',
				'1': 'Male',
				'2': 'Divers'
			}
		},
		userU25: {
			age: {
				'selectLabel': 'Select age*',
				'0': 'under 12',
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
				'15': 'over 25',
				'50': '20',
				'51': '21',
				'52': '22',
				'53': '23',
				'54': '24',
				'55': '25',
				'56': '26'
			},
			state: {
				'selectLabel': 'Select state*',
				'0': 'outside Germany',
				'1': 'Baden-Württemberg',
				'2': 'Bavaria',
				'3': 'Berlin',
				'4': 'Brandenburg',
				'5': 'Bremen',
				'6': 'Hamburg',
				'7': 'Hesse',
				'8': 'Mecklenburg-Western Pomerania',
				'9': 'Lower Saxony',
				'10': 'North Rhine-Westphalia',
				'11': 'Rhineland-Palatinate',
				'12': 'Saarland',
				'13': 'Saxony',
				'14': 'Saxony-Anhalt',
				'15': 'Schleswig-Holstein',
				'16': 'Thuringia'
			},
			gender: {
				'headline': 'Gender',
				'0': 'Female',
				'1': 'Male',
				'2': 'Divers'
			},
			relation: {
				'headline': 'Background',
				'0': 'Affected',
				'1': 'Affiliated',
				'2': 'Other'
			}
		}
	},
	userProfile: {
		tools: {
			description: 'Unlock tools for the person seeking advice. ',
			openModal: 'View tool descriptions',
			optionsPlaceholder: 'Choose an option...',
			title: 'Tools',
			options: {
				saveError:
					'A problem occurred during the tool change. Please try again.'
			},
			share: {
				sharedContent: 'To the shared content',
				title: 'See what content has been shared with you here.',
				info: 'Only assigned counselors can view the content of those seeking advice. If you access the content from the team consultation, the advice seekers are not preselected.'
			},
			modal: {
				confirm: 'Unlock',
				deny: 'Cancel',
				description:
					'Select the tools you want to make available to the counselee.',
				title: 'Tool for those seeking advice'
			}
		},
		data: {
			title: 'Information of the person seeking advice',
			resort: 'Department',
			postcode: 'Postal code',
			relation: 'Background',
			age: 'Age',
			gender: 'Gender',
			state: 'State'
		},
		reassign: {
			title: 'Allocation',
			description:
				'You can assign the conversation to another team member. This person is then responsible for the person seeking advice.'
		}
	},
	videoCall: {
		button: {
			rejectCall: 'Reject call',
			startCall: 'Start audio call',
			answerCall: 'Accept audio call',
			startVideoCall: 'Start video call',
			answerVideoCall: 'Accept video call'
		},
		incomingCall: {
			description: 'calls...',
			unsupported: {
				description: '{{username}} tries to call you',
				hint: 'Your browser does not meet the necessary security requirements. Please use a different browser so that you can participate in video calls.',
				button: 'Open help'
			},
			ignored: 'has been trying to reach you.',
			rejected: {
				'prefix': 'You have tried',
				'suffix': 'to reach.',
				'teamconsultant.prefix': 'Has tried'
			}
		},
		info: 'Call information',
		overlay: {
			unsupported: {
				'headline': 'The video call cannot be started',
				'copy': 'Your device does not meet all the necessary technical requirements for a video call. Please follow these instructions to be able to start a video call. You may need the support of your IT department.',
				'button.close': 'Close',
				'button.manual': 'To the instructions'
			},
			encryption: {
				e2e: 'This video call is secured with end-to-end encryption.',
				transport:
					'This video call is secured with the transport encryption.'
			}
		},
		statusPage: {
			closed: {
				title: 'Your video call ended successfully.',
				action: 'Please close this tab to return to Advice & Help.'
			},
			unauthorized: {
				title: 'No entry!',
				reason: 'Unfortunately you are not authorized to view this page.',
				action: 'Please close this tab to return to Advice & Help.'
			}
		}
	},
	videoConference: {
		waitingroom: {
			'title.start': 'Waiting room',
			'dataProtection': {
				'headline': 'A warm welcome',
				'subline': 'Please confirm our privacy policy.',
				'description':
					'After that, our consultants may start a video call with you.',
				'label.text':
					'I have taken note of the {{legal_links}}. This website uses cookies for authentication and navigation. I agree with this.',
				'label.and': 'and',
				'button': 'Confirm'
			},
			'waitingImageTitle': 'Waiting person with coffee',
			'welcomeImageTitle': 'Welcome',
			'errorImageTitle': 'Faile',
			'headline': 'Please be patient',
			'subline':
				'The video call has not yet started. You will be forwarded as soon as your consultant starts the video call.',
			'paused': {
				headline: 'The video call was ended',
				subline:
					'The video call has ended. If your consultant is only absent, you will be forwarded to the video call as soon as your consultant resumes the video call.'
			},
			'errorPage': {
				'headline': 'The video call was not found',
				'description':
					'We cannot find a video call for your link because the video call has either been deleted or already terminated. If you still have problems, please ask your consultant.',
				'consultant.description':
					'We cannot find a video call for your link because the video call has either been deleted or already terminated.',
				'rejected': {
					headline: 'You were not admitted',
					description:
						'You have not been admitted. Unfortunately, you cannot participate in this video call because your advisor has not approved you.'
				},
				'button': 'Reload'
			}
		}
	},
	walkthrough: {
		title: 'Tour',
		subtitle:
			'To explain the individual functions, we have prepared a short tour for you <br /> You can cancel it at any time or start it again in your profile.',
		switch: {
			'active.label': 'Tour active',
			'deactive.label': 'Tour activated'
		},
		step: {
			next: 'Next',
			prev: 'Back',
			done: 'Ready',
			step: 'Step',
			of: 'from',
			0: {
				title: 'Tour',
				intro: 'To explain the individual functions, we have prepared a short tour for you. <br /><br /> They can cancel it at any time or start it again in their profile.'
			},
			1: {
				title: 'Initial inquiries',
				intro: "Here you will find an overview of all open requests that are not yet assigned to a consultant. Your entire team has access to this overview.\n<br /><br /> The oldest requests are at the top, the newest at the bottom, to make it easier for you to find the ones you received first.\n<br /><br /> The moment you click on 'Accept request', the request will be immediately moved to your 'My consultations' section and the other consultants will not see it anymore."
			},
			2: {
				title: 'Live chat requests',
				intro: 'From here you can start a chat with a person seeking advice who is currently in the waiting room. <br /><br /> Those seeking advice are identified by an anonymous name, such as "Advice Seeker 11". <br /><br /> If you want to start the chat, click on "Start chat" and you will be able to continue the conversation under the "My consultations" section.'
			},
			3: {
				title: 'My consultations',
				intro: 'In this section you will find all the requests that you have accepted. \n<br /><br /> The message history that was last edited is at the top.\nIf the person seeking advice is currently online in the waiting room, you will see the label "Active" right next to the name.'
			},
			4: {
				title: 'Archive',
				intro: 'To avoid being distracted by conversations that are not active, you can archive some of the conversations. <br /><br /> They will then not be deleted, but only moved to the "Archive" tab. <br /><br /> Every time you or the advice seeker write something in an archived conversation, that message history is put back into the advice seeker list.'
			},
			5: {
				title: 'Team consultations',
				intro: 'In this section you can view and contribute to all active consultations that someone in your team is currently working on.'
			},
			6: {
				title: 'Profile',
				intro: 'In the profile area you can manage personal and public information, enable out-of-office messaging during your vacation, change your password and use many other features (like setting up 2-factor authentication).'
			}
		}
	}
};
