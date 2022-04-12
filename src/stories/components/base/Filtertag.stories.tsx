import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
// import { CloseCircle } from '../../../resources/img/icons';

import {
	Filtertag,
	SIZE_DEFAULT,
	SIZE_SELECTED,
	SIZE_REMOVEABLE,
	SIZE_READONLY
} from '../../../components/base/Filtertag';

export default {
	title: 'Base/Filtertag',
	component: Filtertag,
	argTypes: {
		icon: { table: { disable: true } }
	}
} as ComponentMeta<typeof Filtertag>;

const Template: ComponentStory<typeof Filtertag> = (args) => (
	<Filtertag {...args} />
);

export const Default = Template.bind({});
Default.args = {
	size: SIZE_DEFAULT,
	label: 'Lorem ipsum'
};

export const Selected = Template.bind({});
Selected.args = {
	size: SIZE_SELECTED,
	label: 'Lorem ipsum'
};

export const Removeable = Template.bind({});
Removeable.args = {
	size: SIZE_REMOVEABLE,
	label: 'Lorem ipsum',
	// icon: <CloseCircle />, //TODO
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

export const Readonly = Template.bind({});
Readonly.args = {
	size: SIZE_READONLY,
	label: 'Lorem ipsum'
};
