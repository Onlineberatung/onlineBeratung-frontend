import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Dropdown, STATUS_DEFAULT } from '../../../components/base/Dropdown';

export default {
	title: 'Base/Dropdown',
	component: Dropdown,
	argTypes: {
		icon: { table: { disable: true } },
		iconDown: { table: { disable: true } },
		iconUp: { table: { disable: true } },
		iconOptions: { table: { disable: true } }
	}
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => (
	<Dropdown {...args} />
);

export const Default = Template.bind({});
Default.args = {
	status: STATUS_DEFAULT,
	text: 'Placeholder Text',
	helperText: 'Helper text',
	iconDown: (
		<svg
			width="20"
			height="12"
			viewBox="0 0 20 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M16.9351 0.52349L9.99105 7.46756L3.04698 0.52349C2.34899 -0.174497 1.22148 -0.174497 0.52349 0.52349C-0.174497 1.22148 -0.174497 2.34899 0.52349 3.04698L8.73826 11.2617C9.43624 11.9597 10.5638 11.9597 11.2617 11.2617L19.4765 3.04698C20.1745 2.34899 20.1745 1.22148 19.4765 0.52349C18.7785 -0.1566 17.6331 -0.174497 16.9351 0.52349Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	),
	iconUp: (
		<svg
			width="20"
			height="12"
			viewBox="0 0 20 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M8.73825 0.52349L0.52349 8.73825C-0.174497 9.43624 -0.174497 10.5638 0.52349 11.2617C1.22148 11.9597 2.34899 11.9597 3.04698 11.2617L10.0089 4.31767L16.953 11.2617C17.651 11.9597 18.7785 11.9597 19.4765 11.2617C20.1745 10.5638 20.1745 9.43624 19.4765 8.73825L11.2617 0.52349C10.5817 -0.174497 9.43624 -0.174497 8.73825 0.52349Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	),
	iconOptions: (
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
