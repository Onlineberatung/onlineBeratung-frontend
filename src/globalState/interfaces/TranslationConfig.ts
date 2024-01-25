export interface TranslationConfig {
	weblate: {
		host?: string;
		path: string;
		project: string;
		key?: string;
		percentage: number;
	};
	cache?: {
		disabled: boolean;
		time: number;
	};
}
