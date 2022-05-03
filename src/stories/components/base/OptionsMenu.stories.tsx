import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { OptionsMenu } from '../../../components/base/OptionsMenu';

export default {
	title: 'Base/OptionsMenu',
	component: OptionsMenu,
	argTypes: {
		icon: { table: { disable: true } }
	}
} as ComponentMeta<typeof OptionsMenu>;

const Template: ComponentStory<typeof OptionsMenu> = (args) => (
	<OptionsMenu {...args} />
);

export const Default = Template.bind({});
Default.args = {
	label1: 'Label 1',
	label11: 'Label 1.1',
	label12: 'Label 1.2',
	label13: 'Label 1.3',
	label2: 'Label 2',
	label21: 'Label 2.1',
	label22: 'Label 2.2',
	label3: 'Label 3',
	label31: 'Label 3.1',
	label4: 'Label 4',
	label41: 'Label 4.1',
	icon: (
		<svg
			width="16"
			height="4"
			viewBox="0 0 16 4"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM14 0C12.9 0 12 0.9 12 2C12 3.1 12.9 4 14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 0 14 0ZM8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	)
};
