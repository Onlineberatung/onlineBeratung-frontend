import { TopicGroup } from '../../../globalState/interfaces/TopicGroups';
import { TopicsDataInterface } from '../../../globalState/interfaces/TopicsDataInterface';

export const topicGroups: TopicGroup[] = [
	{
		id: 1,
		name: 'Alter',
		topicIds: [1]
	},
	{
		id: 2,
		name: 'Besondere Lebenssituationen und Krisen',
		topicIds: [2, 3]
	},
	{
		id: 3,
		name: 'Existenzsicherung',
		topicIds: [4]
	}
];

const topics: TopicsDataInterface[] = [
	{
		id: 1,
		name: 'Beratung für straffällig gewordene Menschen und ihre Angehörigen',
		description:
			'Sie waren in Haft und haben Fragen zu Ansprüchen auf Sozialleistungen? Sie brauchen Unterstützung bei der Wohnungs- und Arbeitssuche? Sie haben persönliche Probleme? Rund um die Haft gibt es Situationen, die man nicht alleine stemmen kann. Wir helfen Ihnen vertraulich und kostenfrei.',
		internalIdentifier: 'string',
		status: 'string',
		createDate: 'string',
		updateDate: 'string'
	},
	{
		id: 2,
		name: 'Beratung bei Wohnungsnotfällen',
		description:
			'Sie haben keine Wohnung oder Angst Ihr Zuhause zu verlieren? Sie leben in unzumutbaren Wohnverhältnissen? Sie sind in einer Notlage? Wir helfen Ihnen vertraulich und kostenfrei hier in der Online-Beratung.',
		internalIdentifier: 'string',
		status: 'string',
		createDate: 'string',
		updateDate: 'string'
	},
	{
		id: 3,
		name: 'Beratung für Menschen in Prostitution und Menschenhandel',
		description:
			'Sie sind Sexarbeiter:in und erleben häufig Stigmatisierung, Diskriminierung und Abwertung? Sie wollen nicht mehr als Sexarbeiter:in arbeiten? Wir unterstützen sie darin, Ihre Rechte durchzusetzen, organisieren notwendige Hilfen und helfen beim Ausstieg.',
		internalIdentifier: 'string',
		status: 'string',
		createDate: 'string',
		updateDate: 'string'
	},
	{
		id: 4,
		name: 'Suchtberatung und -prävention',
		description:
			'Sie haben ein Suchtproblem oder machen sich Sorgen um betroffene Freunde und Verwandte? Sie haben Fragen zu Sucht und Abhängigkeit - Alkohol, Drogen, Medikamente, Glücksspiel, Computer-/Medienkonsum? Wir beraten Sie vertraulich und kostenfrei hier in der Online-Beratung.',
		internalIdentifier: 'string',
		status: 'string',
		createDate: 'string',
		updateDate: 'string'
	}
];

export const getTopic = (topicId: number) => {
	return topics.filter((topic) => topic.id === topicId)?.[0];
};
