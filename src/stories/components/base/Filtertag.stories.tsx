import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
	Filtertag,
	SIZE_DEFAULT,
	SIZE_SELECTED,
	SIZE_REMOVEABLE,
	SIZE_READONLY
} from '../../../components/base/Filtertag';

export default {
	title: 'Base/Filtertag',
	component: Filtertag
} as ComponentMeta<typeof Filtertag>;

const Template: ComponentStory<typeof Filtertag> = (args) => (
	<Filtertag {...args} />
);

//Strukturansicht in Storybook
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
	icon: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16px"
			height="16px"
			viewBox="0 0 16 16"
		>
			<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm3.077 4.175a.27.27 0 0 0-.383 0L8 6.87 5.306 4.175a.27.27 0 0 0-.383 0l-.844.845a.27.27 0 0 0 0 .382l2.694 2.694L4.08 10.79a.27.27 0 0 0 0 .383l.844.844a.27.27 0 0 0 .383 0L8 9.323l2.694 2.694a.27.27 0 0 0 .383 0l.844-.844a.27.27 0 0 0 0-.383L9.227 8.096l2.694-2.694a.27.27 0 0 0 0-.382Z" />
		</svg>
	) //TODO
};

export const Readonly = Template.bind({});
Readonly.args = {
	size: SIZE_READONLY,
	label: 'Lorem ipsum'
};
