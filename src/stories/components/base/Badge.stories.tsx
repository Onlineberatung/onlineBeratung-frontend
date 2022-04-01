import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
	Badge,
	SIZE_ACTIVE,
	SIZE_FEEDBACK,
	SIZE_BANNED
} from '../../../components/base/Badge';

export default {
	title: 'Base/Badge',
	component: Badge
} as ComponentMeta<typeof Badge>;

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />;

//Strukturansicht in Storybook
export const Active = Template.bind({});
Active.args = {
	size: SIZE_ACTIVE,
	label: 'Aktiv'
};

export const Feedback = Template.bind({});
Feedback.args = {
	size: SIZE_FEEDBACK,
	label: 'Feedback'
};

export const Banned = Template.bind({});
Banned.args = {
	size: SIZE_BANNED,
	label: 'Gebannt'
};
