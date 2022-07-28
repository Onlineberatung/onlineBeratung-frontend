interface TabType {
	title: string;
	url: string;
	condition?: (userData, consultingTypes) => boolean;
	elements: (TabGroups | SingleComponentType)[];
}

export interface TabGroups {
	title: string;
	url: string;
	condition?: (userData, consultingTypes) => boolean;
	elements: SingleComponentType[];
}

export const COLUMN_LEFT = 0;
export const COLUMN_RIGHT = 1;

export type SingleComponentType = {
	condition?: (userData, consultingTypes) => boolean;
	component: any;
	boxed?: boolean;
	order?: number;
	column?: typeof COLUMN_LEFT | typeof COLUMN_RIGHT;
	fullWidth?: boolean;
};

export type TabsType = TabType[];

export const isTabGroup = (
	item: TabGroups | SingleComponentType
): item is TabGroups => {
	return item.hasOwnProperty('elements');
};

export const solveCondition = (condition, ...params) => {
	return !condition || condition(...params);
};

export const solveGroupConditions = (
	element: TabGroups | SingleComponentType,
	...params
) => {
	return solveCondition(element.condition, ...params) && isTabGroup(element)
		? element.elements.some((elem) =>
				solveCondition(elem.condition, ...params)
		  )
		: true;
};

export const solveTabConditions = (tab: TabType, ...params) => {
	return (
		solveCondition(tab.condition, ...params) &&
		tab.elements.some((element) => solveGroupConditions(element, ...params))
	);
};
