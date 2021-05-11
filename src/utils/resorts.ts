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
