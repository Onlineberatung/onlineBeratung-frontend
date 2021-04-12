export type RequiredComponentsInterface = {
	age?: any;
	state?: any;
};

export interface ResortDataInterface {
	consultingType: number;
	overline: string;
	welcomeTitle: string;
	requiredComponents?: RequiredComponentsInterface;
	useInformal: boolean;
	voluntaryComponents?: any[];
	requiredAidMissingRedirectUrl?: string;
}
