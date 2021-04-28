export type RequiredComponentsInterface = {
	age?: any;
	state?: any;
};

export interface ConsultingTypeInterface {
	consultingType: number;
	overline: string;
	welcomeTitle: string;
	requiredComponents?: RequiredComponentsInterface;
	useInformal: boolean;
	voluntaryComponents?: any[];
	requiredAidMissingRedirectUrl?: string;
}
