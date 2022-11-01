import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ButtonFeedback } from '../../../components/base/ButtonFeedback';

export default {
	title: 'Base/ButtonFeedback',
	component: ButtonFeedback,
	argTypes: {
		icon: { table: { disable: true } }
	}
} as ComponentMeta<typeof ButtonFeedback>;

const Template: ComponentStory<typeof ButtonFeedback> = (args) => (
	<ButtonFeedback {...args} />
);

export const Button = Template.bind({});
Button.args = {
	label: 'Feedback',
	icon: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M14 11C14 11.55 13.55 12 13 12H4C3.45 12 3 11.55 3 11C3 10.45 3.45 10 4 10H13C13.55 10 14 10.45 14 11ZM3 7C3 7.55 3.45 8 4 8H13C13.55 8 14 7.55 14 7C14 6.45 13.55 6 13 6H4C3.45 6 3 6.45 3 7ZM10 15C10 14.45 9.55 14 9 14H4C3.45 14 3 14.45 3 15C3 15.55 3.45 16 4 16H9C9.55 16 10 15.55 10 15ZM18.01 12.87L18.72 12.16C19.11 11.77 19.74 11.77 20.13 12.16L20.84 12.87C21.23 13.26 21.23 13.89 20.84 14.28L20.13 14.99L18.01 12.87ZM17.3 13.58L12.14 18.74C12.05 18.83 12 18.95 12 19.09V20.5C12 20.78 12.22 21 12.5 21H13.91C14.04 21 14.17 20.95 14.26 20.85L19.42 15.69L17.3 13.58Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	)
};
