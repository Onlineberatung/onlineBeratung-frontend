import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
	NotificationVideo,
	TYPE_DEFAULT,
	TYPE_EXTENDED
} from '../../../components/base/NotificationVideo';

export default {
	title: 'Base/NotificationVideo',
	component: NotificationVideo,
	argTypes: {
		type: { table: { disable: true } },
		iconAccept: { table: { disable: true } },
		iconVideo: { table: { disable: true } },
		iconReject: { table: { disable: true } },
		iconClose: { table: { disable: true } }
	}
} as ComponentMeta<typeof NotificationVideo>;

const Template: ComponentStory<typeof NotificationVideo> = (args) => (
	<NotificationVideo {...args} />
);

export const Default = Template.bind({});
Default.args = {
	type: TYPE_DEFAULT,
	initialLetters: 'U1',
	userName: 'User 1',
	text: 'ruft Sie an...',
	label: '',
	infoText: '',
	iconAccept: (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M16.23 12.26L13.69 11.97C13.08 11.9 12.48 12.11 12.05 12.54L10.21 14.38C7.38004 12.94 5.06004 10.63 3.62004 7.79001L5.47004 5.94001C5.90004 5.51001 6.11004 4.91001 6.04004 4.30001L5.75004 1.78001C5.63004 0.77001 4.78004 0.0100098 3.76004 0.0100098H2.03004C0.900041 0.0100098 -0.0399593 0.95001 0.0300407 2.08001C0.560041 10.62 7.39004 17.44 15.92 17.97C17.05 18.04 17.99 17.1 17.99 15.97V14.24C18 13.23 17.24 12.38 16.23 12.26Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	),
	iconVideo: (
		<svg
			width="18"
			height="12"
			viewBox="0 0 18 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M14 4.5V1C14 0.45 13.55 0 13 0H1C0.45 0 0 0.45 0 1V11C0 11.55 0.45 12 1 12H13C13.55 12 14 11.55 14 11V7.5L16.29 9.79C16.92 10.42 18 9.97 18 9.08V2.91C18 2.02 16.92 1.57 16.29 2.2L14 4.5Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	),
	iconReject: (
		<svg
			width="24"
			height="10"
			viewBox="0 0 24 10"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4.51004 9.48011L6.51004 7.89011C6.99004 7.51011 7.27003 6.93011 7.27003 6.32011V3.72011C10.29 2.74011 13.56 2.73011 16.59 3.72011V6.33011C16.59 6.94011 16.87 7.52011 17.35 7.90011L19.34 9.48011C20.14 10.1101 21.28 10.0501 22 9.33011L23.22 8.11011C24.02 7.31011 24.02 5.98011 23.17 5.23011C16.76 -0.429893 7.10003 -0.429893 0.690035 5.23011C-0.159965 5.98011 -0.159965 7.31011 0.640035 8.11011L1.86003 9.33011C2.57003 10.0501 3.71004 10.1101 4.51004 9.48011Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	),
	iconClose: (
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
	)
};

export const Extended = Template.bind({});
Extended.args = {
	type: TYPE_EXTENDED,
	initialLetters: 'HP',
	userName: 'Hans Peter',
	text: 'ruft Sie an...',
	label: 'In Jitsi Meet annehmen',
	infoText:
		'Ihr Browser unterstützt leider keine Ende-zu-Ende Verschlüsselung. Du kannst dir die Jitsi Meet App herunterladen und den Anruf in der Jitsi Meet App annehmen oder dich über einen der Browser Google Chrome oder MIcrosoft Edge anmelden und den Anruf annehmen.',
	iconAccept: (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M16.23 12.26L13.69 11.97C13.08 11.9 12.48 12.11 12.05 12.54L10.21 14.38C7.38004 12.94 5.06004 10.63 3.62004 7.79001L5.47004 5.94001C5.90004 5.51001 6.11004 4.91001 6.04004 4.30001L5.75004 1.78001C5.63004 0.77001 4.78004 0.0100098 3.76004 0.0100098H2.03004C0.900041 0.0100098 -0.0399593 0.95001 0.0300407 2.08001C0.560041 10.62 7.39004 17.44 15.92 17.97C17.05 18.04 17.99 17.1 17.99 15.97V14.24C18 13.23 17.24 12.38 16.23 12.26Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	),
	iconVideo: (
		<svg
			width="18"
			height="12"
			viewBox="0 0 18 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M14 4.5V1C14 0.45 13.55 0 13 0H1C0.45 0 0 0.45 0 1V11C0 11.55 0.45 12 1 12H13C13.55 12 14 11.55 14 11V7.5L16.29 9.79C16.92 10.42 18 9.97 18 9.08V2.91C18 2.02 16.92 1.57 16.29 2.2L14 4.5Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	),
	iconReject: (
		<svg
			width="24"
			height="10"
			viewBox="0 0 24 10"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4.51004 9.48011L6.51004 7.89011C6.99004 7.51011 7.27003 6.93011 7.27003 6.32011V3.72011C10.29 2.74011 13.56 2.73011 16.59 3.72011V6.33011C16.59 6.94011 16.87 7.52011 17.35 7.90011L19.34 9.48011C20.14 10.1101 21.28 10.0501 22 9.33011L23.22 8.11011C24.02 7.31011 24.02 5.98011 23.17 5.23011C16.76 -0.429893 7.10003 -0.429893 0.690035 5.23011C-0.159965 5.98011 -0.159965 7.31011 0.640035 8.11011L1.86003 9.33011C2.57003 10.0501 3.71004 10.1101 4.51004 9.48011Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	),
	iconClose: (
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
	)
};
