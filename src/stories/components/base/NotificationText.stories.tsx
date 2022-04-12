import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
	NotificationText,
	TYPE_INFO,
	TYPE_SUCCESS,
	TYPE_WARNING,
	TYPE_ERROR
} from '../../../components/base/NotificationText';

export default {
	title: 'Base/NotificationText',
	component: NotificationText,
	argTypes: {
		type: { table: { disable: true } },
		icon: { table: { disable: true } }
	}
} as ComponentMeta<typeof NotificationText>;

const Template: ComponentStory<typeof NotificationText> = (args) => (
	<NotificationText {...args} />
);

export const Info = Template.bind({});
Info.args = {
	type: TYPE_INFO,
	headline: 'Info lorem ipsum',
	text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.',
	icon: (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 15C9.45 15 9 14.55 9 14V10C9 9.45 9.45 9 10 9C10.55 9 11 9.45 11 10V14C11 14.55 10.55 15 10 15ZM11 7H9V5H11V7Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	)
};

export const Success = Template.bind({});
Success.args = {
	type: TYPE_SUCCESS,
	headline: 'Success lorem ipsum',
	text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.',
	icon: (
		<svg
			width="21"
			height="20"
			viewBox="0 0 21 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M19.2878 3.8863L9.28778 13.8863C8.89778 14.2763 8.26778 14.2763 7.87778 13.8863L5.04778 11.0563C4.65778 10.6663 4.65778 10.0363 5.04778 9.6463C5.43778 9.2563 6.06778 9.2563 6.45778 9.6463L8.57778 11.7663L17.8678 2.4763C18.2578 2.0863 18.8878 2.0863 19.2778 2.4763C19.6778 2.8663 19.6778 3.4963 19.2878 3.8863ZM13.7678 0.736297C12.0778 0.0462965 10.1578 -0.193703 8.15778 0.166297C4.08778 0.896297 0.83778 4.1763 0.14778 8.2463C-0.99222 14.9963 4.62778 20.7763 11.3378 19.9063C15.2978 19.3963 18.6178 16.4463 19.6578 12.5963C20.0578 11.1263 20.0978 9.7063 19.8678 8.3763C19.7378 7.5763 18.7478 7.2663 18.1678 7.8363C17.9378 8.0663 17.8378 8.4063 17.8978 8.7263C18.1178 10.0563 18.0178 11.4763 17.3778 12.9863C16.2178 15.6963 13.6978 17.6863 10.7678 17.9563C5.66778 18.4263 1.43778 14.1063 2.06778 8.9763C2.49778 5.4363 5.34778 2.5563 8.87778 2.0663C10.6078 1.8263 12.2478 2.1563 13.6478 2.8763C14.0378 3.0763 14.5078 3.0063 14.8178 2.6963C15.2978 2.2163 15.1778 1.4063 14.5778 1.0963C14.3078 0.976296 14.0378 0.846297 13.7678 0.736297Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	)
};

export const Warning = Template.bind({});
Warning.args = {
	type: TYPE_WARNING,
	headline: 'Warning lorem ipsum',
	text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.',
	icon: (
		<svg
			width="22"
			height="19"
			viewBox="0 0 22 19"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1.73004 19.0001H20.26C21.03 19.0001 21.51 18.1701 21.13 17.5001L11.86 1.50006C11.47 0.830059 10.51 0.830059 10.13 1.50006L0.860045 17.5001C0.480045 18.1701 0.960045 19.0001 1.73004 19.0001ZM12 16.0001H10V14.0001H12V16.0001ZM11 12.0001C10.45 12.0001 10 11.5501 10 11.0001V9.00006C10 8.45006 10.45 8.00006 11 8.00006C11.55 8.00006 12 8.45006 12 9.00006V11.0001C12 11.5501 11.55 12.0001 11 12.0001Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	)
};

export const Error = Template.bind({});
Error.args = {
	type: TYPE_ERROR,
	headline: 'Error lorem ipsum',
	text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.',
	icon: (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM14.3 14.3C13.91 14.69 13.28 14.69 12.89 14.3L10 11.41L7.11 14.3C6.72 14.69 6.09 14.69 5.7 14.3C5.31 13.91 5.31 13.28 5.7 12.89L8.59 10L5.7 7.11C5.31 6.72 5.31 6.09 5.7 5.7C6.09 5.31 6.72 5.31 7.11 5.7L10 8.59L12.89 5.7C13.28 5.31 13.91 5.31 14.3 5.7C14.69 6.09 14.69 6.72 14.3 7.11L11.41 10L14.3 12.89C14.68 13.27 14.68 13.91 14.3 14.3Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	)
};
