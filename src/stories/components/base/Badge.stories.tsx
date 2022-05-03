import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Badge, VARIANT_ACTIVE } from '../../../components/base/Badge';

export default {
	title: 'Base/Badge',
	component: Badge
} as ComponentMeta<typeof Badge>;

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {
	variant: VARIANT_ACTIVE,
	label: 'Label'
};
