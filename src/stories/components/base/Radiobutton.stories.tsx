import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
	Radiobutton,
	STATUS_DEFAULT
} from '../../../components/base/Radiobutton';

export default {
	title: 'Base/Radiobutton',
	component: Radiobutton,
	argTypes: {
		icon: { table: { disable: true } }
	}
} as ComponentMeta<typeof Radiobutton>;

const Template: ComponentStory<typeof Radiobutton> = (args) => (
	<Radiobutton {...args} />
);

export const Default = Template.bind({});
Default.args = {
	status: STATUS_DEFAULT,
	label: 'Placeholder Text',
	helperText: 'Helper Text'
};
