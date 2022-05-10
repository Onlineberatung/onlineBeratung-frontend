import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Divider, SIZE_PRIMARY } from '../../../components/base/Divider';

export default {
	title: 'Base/Divider',
	component: Divider
} as ComponentMeta<typeof Divider>;

const Template: ComponentStory<typeof Divider> = (args) => (
	<Divider {...args} />
);

export const Default = Template.bind({});
Default.args = {
	size: SIZE_PRIMARY,
	label: ''
};
