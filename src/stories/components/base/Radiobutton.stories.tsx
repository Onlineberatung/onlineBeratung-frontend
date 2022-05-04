import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Radiobutton } from '../../../components/base/Radiobutton';

export default {
	title: 'Base/Radiobutton',
	component: Radiobutton,
	argTypes: {
		error: { control: 'boolean' },
		disabled: { control: 'boolean' },
		icon: { table: { disable: true } }
	}
} as ComponentMeta<typeof Radiobutton>;

const Template: ComponentStory<typeof Radiobutton> = (args) => (
	<Radiobutton {...args} />
);

export const Default = Template.bind({});
Default.args = {
	label: 'Placeholder Text',
	helperText: 'Helper Text'
};
