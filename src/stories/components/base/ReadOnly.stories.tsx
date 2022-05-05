import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReadOnly, STATUS_DEFAULT } from '../../../components/base/ReadOnly';

export default {
	title: 'Base/ReadOnly',
	component: ReadOnly,
	argTypes: {
		icon: { table: { disable: true } }
	}
} as ComponentMeta<typeof ReadOnly>;

const Template: ComponentStory<typeof ReadOnly> = (args) => (
	<ReadOnly {...args} />
);

export const Default = Template.bind({});
Default.args = {
	status: STATUS_DEFAULT,
	title: 'Title',
	text: 'Placeholder Text',
	helperText: 'Helper text'
};
