import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
	Button,
	SIZE_PRIMARY,
	SIZE_SECONDARY,
	SIZE_TERTIARY,
	SIZE_SMALL,
	SIZE_FEEDBACK,
	SIZE_ICON,
	SIZE_SCROLLTOP
} from '../../../components/base/Button';

export default {
	title: 'Base/Button',
	component: Button,
	argTypes: {
		disabled: { type: 'boolean' },
		inverted: { type: 'boolean' },
		icon: { table: { disable: true } },
		size: { table: { disable: true } }
	}
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
	size: SIZE_PRIMARY,
	label: 'Primary Button',
	icon: (
		<svg
			width="20"
			height="18"
			viewBox="0 0 20 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1.4 17.4L18.85 9.92002C19.66 9.57002 19.66 8.43002 18.85 8.08002L1.4 0.600017C0.74 0.310017 0.00999999 0.800017 0.00999999 1.51002L0 6.12002C0 6.62002 0.37 7.05002 0.87 7.11002L15 9.00002L0.87 10.88C0.37 10.95 0 11.38 0 11.88L0.00999999 16.49C0.00999999 17.2 0.74 17.69 1.4 17.4Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	)
};

export const Secondary = Template.bind({});
Secondary.args = {
	size: SIZE_SECONDARY,
	label: 'Secondary Button',
	icon: (
		<svg
			width="20"
			height="18"
			viewBox="0 0 20 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1.4 17.4L18.85 9.92002C19.66 9.57002 19.66 8.43002 18.85 8.08002L1.4 0.600017C0.74 0.310017 0.00999999 0.800017 0.00999999 1.51002L0 6.12002C0 6.62002 0.37 7.05002 0.87 7.11002L15 9.00002L0.87 10.88C0.37 10.95 0 11.38 0 11.88L0.00999999 16.49C0.00999999 17.2 0.74 17.69 1.4 17.4Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	)
};

export const Tertiary = Template.bind({});
Tertiary.args = {
	size: SIZE_TERTIARY,
	label: 'Tertiary Button',
	icon: (
		<svg
			width="20"
			height="18"
			viewBox="0 0 20 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1.4 17.4L18.85 9.92002C19.66 9.57002 19.66 8.43002 18.85 8.08002L1.4 0.600017C0.74 0.310017 0.00999999 0.800017 0.00999999 1.51002L0 6.12002C0 6.62002 0.37 7.05002 0.87 7.11002L15 9.00002L0.87 10.88C0.37 10.95 0 11.38 0 11.88L0.00999999 16.49C0.00999999 17.2 0.74 17.69 1.4 17.4Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	)
};

export const Small = Template.bind({});
Small.args = {
	size: SIZE_SMALL,
	label: 'Small button'
};

export const Feedback = Template.bind({});
Feedback.args = {
	size: SIZE_FEEDBACK,
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

export const Icon = Template.bind({});
Icon.args = {
	size: SIZE_ICON,
	icon: (
		<svg
			width="20"
			height="18"
			viewBox="0 0 20 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1.4 17.4L18.85 9.92002C19.66 9.57002 19.66 8.43002 18.85 8.08002L1.4 0.600017C0.74 0.310017 0.00999999 0.800017 0.00999999 1.51002L0 6.12002C0 6.62002 0.37 7.05002 0.87 7.11002L15 9.00002L0.87 10.88C0.37 10.95 0 11.38 0 11.88L0.00999999 16.49C0.00999999 17.2 0.74 17.69 1.4 17.4Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	)
};

export const ScrollTop = Template.bind({});
ScrollTop.args = {
	size: SIZE_SCROLLTOP,
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
