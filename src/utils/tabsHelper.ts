import {
	SingleComponentType,
	TabGroups,
	TabType
} from '../components/profile/profile.routes';

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
