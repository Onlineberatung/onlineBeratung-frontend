import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ButtonSmall } from '../../../components/base/ButtonSmall';

export default {
	title: 'Base/ButtonSmall',
	component: ButtonSmall
} as ComponentMeta<typeof ButtonSmall>;

const Template: ComponentStory<typeof ButtonSmall> = (args) => (
	<ButtonSmall {...args} />
);

export const Button = Template.bind({});
Button.args = {
	label: 'Small Button'
};
