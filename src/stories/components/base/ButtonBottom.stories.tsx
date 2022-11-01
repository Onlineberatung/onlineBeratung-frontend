import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ButtonBottom } from '../../../components/base/ButtonBottom';

export default {
	title: 'Base/ButtonBottom',
	component: ButtonBottom,
	argTypes: {
		icon: { table: { disable: true } }
	}
} as ComponentMeta<typeof ButtonBottom>;

const Template: ComponentStory<typeof ButtonBottom> = (args) => (
	<ButtonBottom {...args} />
);

export const Button = Template.bind({});
Button.args = {
	icon: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M16.8732 5.37917C17.3621 4.89032 18.1517 4.89032 18.6406 5.37917C19.1294 5.86801 19.1294 6.65768 18.6406 7.13399L12.8873 12.8873C12.3984 13.3761 11.6088 13.3761 11.1199 12.8873L5.36663 7.13399C4.87779 6.64514 4.87779 5.85547 5.36663 5.36663C5.85547 4.87779 6.64514 4.87779 7.13398 5.36663L12.0099 10.23L16.8732 5.37917ZM16.8732 13.6395C17.3621 13.1506 18.1518 13.1506 18.6406 13.6395C19.1294 14.1283 19.1294 14.918 18.6531 15.3943L12.8998 21.1476C12.411 21.6364 11.6213 21.6364 11.1325 21.1476L5.37918 15.3943C4.89034 14.9054 4.89034 14.1158 5.37918 13.6269C5.86802 13.1381 6.65769 13.1381 7.14653 13.6269L12.0099 18.4903L16.8732 13.6395Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	)
};
