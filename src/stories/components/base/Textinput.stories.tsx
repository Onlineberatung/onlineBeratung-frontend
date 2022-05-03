import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Textinput } from '../../../components/base/Textinput';

export default {
	title: 'Base/Textinput',
	component: Textinput,
	argTypes: {
		password: { options: ['text', 'password'], control: { type: 'radio' } },
		variant: {
			options: [
				'disabled',
				'default',
				'selected',
				'activated',
				'success',
				'warning',
				'error'
			],
			control: { type: 'radio' }
		},
		withIcon: { control: 'boolean' },
		eyeIcon: { table: { disable: true } },
		lockIcon: { table: { disable: true } }
	}
} as ComponentMeta<typeof Textinput>;

const Template: ComponentStory<typeof Textinput> = (args) => (
	<Textinput {...args} />
);

export const Default = Template.bind({});
Default.args = {
	inputText: 'Placeholder Text',
	label: 'Label',
	helperText: 'Helper text',
	lockIcon: (
		<svg
			width="16"
			height="21"
			viewBox="0 0 16 21"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M14 7H13V5C13 2.24 10.76 0 8 0C5.24 0 3 2.24 3 5V7H2C0.9 7 0 7.9 0 9V19C0 20.1 0.9 21 2 21H14C15.1 21 16 20.1 16 19V9C16 7.9 15.1 7 14 7ZM8 16C6.9 16 6 15.1 6 14C6 12.9 6.9 12 8 12C9.1 12 10 12.9 10 14C10 15.1 9.1 16 8 16ZM5 7V5C5 3.34 6.34 2 8 2C9.66 2 11 3.34 11 5V7H5Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	),
	eyeIcon: (
		<svg
			width="22"
			height="15"
			viewBox="0 0 22 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0ZM11 12.5C8.24 12.5 6 10.26 6 7.5C6 4.74 8.24 2.5 11 2.5C13.76 2.5 16 4.74 16 7.5C16 10.26 13.76 12.5 11 12.5ZM11 4.5C9.34 4.5 8 5.84 8 7.5C8 9.16 9.34 10.5 11 10.5C12.66 10.5 14 9.16 14 7.5C14 5.84 12.66 4.5 11 4.5Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	)
};
