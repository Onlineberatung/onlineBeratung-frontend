export interface ConsultingTypeGroupChildInterface {
	id: number;
	titles: {
		default: string;
		long: string;
	};
}

export interface ConsultingTypeGroupInterface {
	title: string;
	consultingTypes: Array<ConsultingTypeGroupChildInterface>;
}
