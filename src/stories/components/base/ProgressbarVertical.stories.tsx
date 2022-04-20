import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
	ProgressbarVertical,
	STATUS_DEFAULT,
	STATUS_ACTIVE,
	STATUS_DONE
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
	button: 'Bestätigen'
};

export const Active = Template.bind({});
Active.args = {
	status: STATUS_ACTIVE,
	label: 'Lorem Ipsum',
	number: 1,
	placeholderLabel: 'Placeholder',
	button: 'Bestätigen'
};

export const Done = Template.bind({});
Done.args = {
	status: STATUS_DONE,
	label: 'Lorem Ipsum',
	number: 1,
	placeholderLabel: 'Placeholder',
	button: 'Bestätigen'
};
