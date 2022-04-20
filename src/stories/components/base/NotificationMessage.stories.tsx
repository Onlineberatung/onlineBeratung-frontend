import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { NotificationMessage } from '../../../components/base/NotificationMessage';

export default {
	title: 'Base/NotificationMessage',
	component: NotificationMessage,
	argTypes: {
		letterIcon: { table: { disable: true } },
		closeIcon: { table: { disable: true } },
		sendIcon: { table: { disable: true } },
		smileyIcon: { table: { disable: true } }
	}
} as ComponentMeta<typeof NotificationMessage>;

const Template: ComponentStory<typeof NotificationMessage> = (args) => (
	<NotificationMessage {...args} />
);

export const Default = Template.bind({});
Default.args = {
	letterIcon: (
		<svg
			width="22"
			height="18"
			viewBox="0 0 22 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M19.8 0H2.2C0.99 0 0 0.99 0 2.2V15.4C0 16.61 0.99 17.6 2.2 17.6H19.8C21.01 17.6 22 16.61 22 15.4V2.2C22 0.99 21.01 0 19.8 0ZM19.36 4.675L12.166 9.174C11.451 9.625 10.549 9.625 9.834 9.174L2.64 4.675C2.365 4.499 2.2 4.202 2.2 3.883C2.2 3.146 3.003 2.706 3.63 3.091L11 7.7L18.37 3.091C18.997 2.706 19.8 3.146 19.8 3.883C19.8 4.202 19.635 4.499 19.36 4.675Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	),
	userName: 'Benutzername',
	closeIcon: (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12.8925 0.3025C12.5025 -0.0874998 11.8725 -0.0874998 11.4825 0.3025L6.5925 5.1825L1.7025 0.2925C1.3125 -0.0975 0.6825 -0.0975 0.2925 0.2925C-0.0975 0.6825 -0.0975 1.3125 0.2925 1.7025L5.1825 6.5925L0.2925 11.4825C-0.0975 11.8725 -0.0975 12.5025 0.2925 12.8925C0.6825 13.2825 1.3125 13.2825 1.7025 12.8925L6.5925 8.0025L11.4825 12.8925C11.8725 13.2825 12.5025 13.2825 12.8925 12.8925C13.2825 12.5025 13.2825 11.8725 12.8925 11.4825L8.0025 6.5925L12.8925 1.7025C13.2725 1.3225 13.2725 0.6825 12.8925 0.3025Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	),
	messageText: 'Lorem ipsum dolor sit ...',
	sendIcon: (
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
	),
	smileyIcon: (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M9.99 0C4.47 0 0 4.48 0 10C0 15.52 4.47 20 9.99 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 9.99 0ZM6.5 6C7.33 6 8 6.67 8 7.5C8 8.33 7.33 9 6.5 9C5.67 9 5 8.33 5 7.5C5 6.67 5.67 6 6.5 6ZM14.71 12.72C13.8 14.67 12.04 16 10 16C7.96 16 6.2 14.67 5.29 12.72C5.13 12.39 5.37 12 5.74 12H14.26C14.63 12 14.87 12.39 14.71 12.72ZM13.5 9C12.67 9 12 8.33 12 7.5C12 6.67 12.67 6 13.5 6C14.33 6 15 6.67 15 7.5C15 8.33 14.33 9 13.5 9Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	),
	label: 'Nachricht schreiben'
};
