import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
	ProgressbarVertical,
	STATUS_DEFAULT
} from '../../../components/base/ProgressbarVertical';

export default {
	title: 'Base/ProgressbarVertical',
	component: ProgressbarVertical,
	argTypes: {
		number: { control: { type: 'number', min: 1, max: 99, step: 1 } }
	}
} as ComponentMeta<typeof ProgressbarVertical>;

const Template: ComponentStory<typeof ProgressbarVertical> = (args) => (
	<ProgressbarVertical {...args} />
);

export const Default = Template.bind({});
Default.args = {
	status: STATUS_DEFAULT,
	label: 'Lorem Ipsum',
	number: 1,
	placeholderLabel: 'Placeholder',
	buttonLabel: 'Bestätigen'
};
