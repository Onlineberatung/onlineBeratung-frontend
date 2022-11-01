import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
	Filtertag,
	VARIANT_DEFAULT,
	VARIANT_REMOVEABLE,
	VARIANT_READONLY
} from '../../../components/base/Filtertag';

export default {
	title: 'Base/Filtertag',
	component: Filtertag,
	argTypes: {
		iconRemove: { table: { disable: true } },
		iconPerson: { table: { disable: true } },
		variant: { table: { disable: true } },
		withIcon: { control: 'boolean' }
	}
} as ComponentMeta<typeof Filtertag>;

const Template: ComponentStory<typeof Filtertag> = (args) => (
	<Filtertag {...args} />
);

export const Default = Template.bind({});
Default.args = {
	variant: VARIANT_DEFAULT,
	label: 'Lorem ipsum',
	iconPerson: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19V18C20 15.34 14.67 14 12 14Z"
				fill="black"
				fill-opacity="0.9"
			/>
		</svg>
	)
};

export const Removeable = Template.bind({});
Removeable.args = {
	variant: VARIANT_REMOVEABLE,
	label: 'Lorem ipsum',
	iconPerson: '',
	iconRemove: (
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

export const Readonly = Template.bind({});
Readonly.args = {
	variant: VARIANT_READONLY,
	label: 'Lorem ipsum',
	iconPerson: ''
};
