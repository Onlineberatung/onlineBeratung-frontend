export const getConsultingTypeFromRegistration = () => {
	const registrationRoot = document.getElementById('registrationRoot');
	return registrationRoot?.dataset?.consultingtype
		? parseInt(registrationRoot.dataset.consultingtype)
		: undefined;
};

export const isU25Registration = (): boolean =>
	getConsultingTypeFromRegistration() === 1;

export const isGenericConsultingType = (currentType: number): boolean => {
	const genericTypes = [
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19,
		20,
		21
	];
	return genericTypes.includes(currentType);
};

export const getResortKeyForConsultingType = (currentType: number) => {
	return RESORT_KEYS[currentType] || 'default';
};

export const RESORT_KEYS = {
	0: 'addiction',
	1: 'u25',
	2: 'pregnancy',
	3: 'parenting',
	4: 'cure',
	5: 'debt',
	6: 'social',
	7: 'seniority',
	8: 'disability',
	9: 'planB',
	10: 'law',
	11: 'offender',
	12: 'aids',
	13: 'rehabilitation',
	14: 'children',
	15: 'kreuzbund',
	16: 'migration',
	17: 'emigration',
	18: 'hospice',
	19: 'regional',
	20: 'men',
	21: 'supportGroupVechta'
};

const groupChatConsultingTypes = ['15', '21'];
export const isGroupChatConsultingType = (consultingType: number): boolean => {
	return groupChatConsultingTypes.includes(consultingType?.toString());
};

export const groupChatRuleTexts = {
	kreuzbund: [
		'In der Sucht-Selbsthilfe duzen wir uns, sowohl in den Gruppen vor Ort als auch hier im Chat. Wer damit Probleme hat, teile das im Chat mit – wir stellen uns gerne darauf ein!',
		'Menschen sind verschieden, ihre Meinungen sind es auch. Aufeinander zu achten sowie wertschätzende Chat-Beiträge gewährleisten ein helfendes Miteinander.',
		'Moderator_innen haben die Aufgabe, dafür zu sorgen, dass sich die Chat-Teilnehmenden austauschen können. Sie bieten gegebenenfalls auch Sucht-Themen zur Diskussion an. Ihren Aufforderungen ist zu folgen, beispielsweise dann, wenn Chat-Regeln nicht eingehalten werden.'
	],
	supportGroupVechta: [
		'In der Selbsthilfe duzen wir uns, sowohl in den Gruppen vor Ort als auch hier im Chat. Wer damit Probleme hat, teile das im Chat mit – wir stellen uns gerne darauf ein!',
		'Menschen sind verschieden, ihre Meinungen sind es auch. Aufeinander zu achten sowie wertschätzende Chat-Beiträge gewährleisten ein helfendes Miteinander.',
		'Moderator_innen haben die Aufgabe, dafür zu sorgen, dass sich die Chat-User_innen austauschen können. Ihren Aufforderungen ist zu folgen, beispielsweise dann, wenn Chat-Regeln nicht eingehalten werden.'
	]
};
