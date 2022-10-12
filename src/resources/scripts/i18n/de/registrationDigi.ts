import { CounsellingRelation } from '../../../../enums/ConsellingRelation';
import { Gender } from '../../../../enums/Gender';

const registrationDigi = {
	'headline': 'Registrierung',
	'overline': 'Herzlich willkommen',
	'teaser.consultant':
		'Bitte registrieren Sie sich, um mit Ihrer Beraterin / Ihrem Berater in Kontakt zu kommen',
	'accordion.step1.title': 'Ihr Beratungsanliegen',
	'accordion.step2.title': 'Ihre Beratungsstelle in der Nähe',
	'accordion.step3.title': 'Ihr Account',
	'age.headline': 'Wie alt sind Sie?',
	'age.label': 'Jahre',
	'ageAndGender.step.title': 'Bitte machen Sie Angaben über sich',
	'gender.headline': 'Was ist Ihr Geschlecht?',
	[`gender.options.${Gender.Female.toLowerCase()}`]: 'Weiblich',
	[`gender.options.${Gender.Male.toLowerCase()}`]: 'Männlich',
	[`gender.options.${Gender.Diverse.toLowerCase()}`]: 'Divers',
	[`gender.options.${Gender.NotProvided.toLowerCase()}`]: 'Keine Angabe',
	'counsellingRelation.step.title': 'Was ist der Grund für Ihr Anliegen?',
	[`counsellingRelation.options.${CounsellingRelation.Self.toLowerCase()}`]:
		'Ich bin selbst von Suchtproblemen betroffen.',
	[`counsellingRelation.options.${CounsellingRelation.Relative.toLowerCase()}`]:
		'Ich bin Angehörige/r von Jemanden mit Suchtproblemen.',
	'topics.step.title': 'Welche Probleme liegen Ihrer Meinung nach vor?',
	'mainTopics.step.title':
		'Welches dieser Problemfelder ist für Sie aktuell am Wichtigsten?',
	'mainTopics.selectAtLestOneTopic':
		'Bisher haben Sie keine Problemfelder ausgewählt. Um ihre Registrierung zu vervollständigen, müssen sie mindestens ein Problem ausgewählt haben.',
	'username.step.title': 'Bitte wählen Sie Ihren Benutzernamen',
	'password.step.title': 'Bitte wählen Sie Ihr Passwort',
	'agency.fullFillAllFields':
		'Leider konnten wir keine Beratungsstelle in Ihrer Nähe finden. Sie können auch eine Postleitzahl in der Nähe Ihres Wohnortes angeben.',
	'agency.noAgencyFound':
		'Leider können wir dir derzeit keine passende Online-Beratungsstelle in deiner Nähe anbieten.',
	'agency.error.title': 'Keine Beratungsstelle in der Nähe gefunden'
};

export default registrationDigi;
