import {
	COLUMN_LEFT,
	SingleComponentType,
	TabGroups
} from '../../utils/tabsHelper';
import { Help } from '../help/Help';

export const profileRoutesHelp = (): (TabGroups | SingleComponentType)[] => [
	{
		title: 'profile.routes.help.videoCall',
		url: '/videoCall',
		elements: [
			{
				component: Help,
				column: COLUMN_LEFT
			}
		]
	}
];
