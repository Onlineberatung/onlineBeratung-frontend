export interface APIToolsInterface {
	description: string;
	sharedWithAdviceSeeker: boolean;
	sharedWithConsultant: boolean;
	title: string;
	toolId: string;
	url: string;
}

export interface ToolsListInterface {
	title: string;
	description: string;
	buttonLink: string;
	shared: boolean;
}
