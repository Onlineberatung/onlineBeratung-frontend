import { AppSettingsInterface } from '../../globalState/interfaces';
import {
	COLUMN_LEFT,
	SingleComponentType,
	TabGroups
} from '../../utils/tabsHelper';
import { Help } from '../help/Help';
import { Documentation } from './Documentation';

export const profileRoutesHelp = (
	settings: AppSettingsInterface
): (TabGroups | SingleComponentType)[] => [
	{
		title: 'profile.routes.help.videoCall',
		url: '/videoCall',
		elements: [
			{
				component: Help,
				column: COLUMN_LEFT,
				condition: () => !settings?.documentationEnabled
			}
		]
	},
	{
		title: 'profile.documentation.title',
		url: '/docs',
		externalLink: true,
		elements: [
			{
				component: Documentation,
				column: COLUMN_LEFT,
				condition: () => !!settings?.documentationEnabled
			}
		]
	}
];
