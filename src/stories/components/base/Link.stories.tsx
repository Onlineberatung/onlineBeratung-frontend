import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
// import { ArrowRightIcon } from '../../../resources/img/icons';

import {
	Link,
	SIZE_LARGE,
	SIZE_SMALL,
	SIZE_INLINE
} from '../../../components/base/Link';

export default {
	title: 'Base/Link',
	component: Link
} as ComponentMeta<typeof Link>;

const Template: ComponentStory<typeof Link> = (args) => <Link {...args} />;

export const Large = Template.bind({});
Large.args = {
	size: SIZE_LARGE,
	label: 'Loremipsum',
	reference: 'https://www.caritas.de/',
	// icon: <ForwardIcon /> //TODO
	icon: (
		<svg
			width="12"
			height="20"
			viewBox="0 0 12 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M0.523899 0.52616C-0.174633 1.22469 -0.174633 2.35309 0.523899 3.05162L7.4734 10.0011L0.523899 16.9506C-0.174633 17.6492 -0.174633 18.7776 0.523899 19.4761C1.22243 20.1746 2.35083 20.1746 3.04936 19.4761L11.2706 11.2549C11.9691 10.5564 11.9691 9.42797 11.2706 8.72944L3.04936 0.508249C2.36874 -0.172373 1.22243 -0.172372 0.523899 0.52616Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	)
};

export const Small = Template.bind({});
Small.args = {
	size: SIZE_SMALL,
	label: 'Loremipsum',
	reference: 'https://www.caritas.de/',
	// icon: <ForwardIcon /> //TODO
	icon: (
		<svg
			width="12"
			height="20"
			viewBox="0 0 12 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M0.523899 0.52616C-0.174633 1.22469 -0.174633 2.35309 0.523899 3.05162L7.4734 10.0011L0.523899 16.9506C-0.174633 17.6492 -0.174633 18.7776 0.523899 19.4761C1.22243 20.1746 2.35083 20.1746 3.04936 19.4761L11.2706 11.2549C11.9691 10.5564 11.9691 9.42797 11.2706 8.72944L3.04936 0.508249C2.36874 -0.172373 1.22243 -0.172372 0.523899 0.52616Z"
				fill="black"
				fill-opacity="0.87"
			/>
		</svg>
	)
};

export const Inline = Template.bind({});
Inline.args = {
	size: SIZE_INLINE,
	label: 'magna aliquyam',
	reference: 'https://www.caritas.de/'
};
