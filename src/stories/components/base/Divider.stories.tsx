import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
	Divider,
	SIZE_PRIMARY,
	SIZE_SECONDARY,
	SIZE_TERTIARY
} from '../../../components/base/Divider';

export default {
	title: 'Base/Divider',
	component: Divider
} as ComponentMeta<typeof Divider>;

const Template: ComponentStory<typeof Divider> = (args) => (
	<Divider {...args} />
);

//Strukturansicht in Storybook
export const Primary = Template.bind({});
Primary.args = {
	size: SIZE_PRIMARY
};

export const Secondary = Template.bind({});
Secondary.args = {
	size: SIZE_SECONDARY,
	label: 'Label'
};

export const Tertiary = Template.bind({});
Tertiary.args = {
	size: SIZE_TERTIARY,
	label: 'Label'
};
