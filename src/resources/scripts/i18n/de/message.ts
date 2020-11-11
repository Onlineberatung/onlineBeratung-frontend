const message = {
	'today': 'Heute',
	'isMyMessage.name': 'Ich',
	'yesterday': 'Gestern',
	'dayBeforeYesterday': 'Vorgestern',
	'forwardedLabel': (...replacements) =>
		`Weitergeleitete Nachricht von ${replacements[0]}, ${replacements[1]} um ${replacements[2]}`,
	'forward.title': 'Textnachricht an\nFeedback weiterleiten',
	'copy.title': 'Nachricht in Zwischenablage kopieren',
	'write.peer.checkbox.label': 'Feedback anfordern'
};

export default message;
