import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
	Button,
	SIZE_PRIMARY,
	SIZE_SECONDARY,
	SIZE_TERTIARY,
	SIZE_SMALL,
	SIZE_FEEDBACK
} from '../../../components/base/Button';

export default {
	title: 'Base/Button',
	component: Button,
	argTypes: {
		disabled: { type: 'boolean' }
	}
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
	size: SIZE_PRIMARY,
	label: 'Primary Button'
};

export const Secondary = Template.bind({});
Secondary.args = {
	size: SIZE_SECONDARY,
	label: 'Secondary Button'
};

export const Tertiary = Template.bind({});
Tertiary.args = {
	size: SIZE_TERTIARY,
	label: 'Tertiary Button'
};

export const Small = Template.bind({});
Small.args = {
	size: SIZE_SMALL,
	label: 'Small Button'
};

export const Feedback = Template.bind({});
Feedback.args = {
	size: SIZE_FEEDBACK,
	label: 'Feedback Button'
};
