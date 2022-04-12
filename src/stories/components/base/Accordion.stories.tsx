import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Accordion } from '../../../components/base/Accordion';

export default {
	title: 'Base/Accordion',
	component: Accordion,
	argTypes: {
		icon: { table: { disable: true } }
	}
} as ComponentMeta<typeof Accordion>;

const Template: ComponentStory<typeof Accordion> = (args) => (
	<Accordion {...args} />
);

export const Default = Template.bind({});
Default.args = {
	label: 'Title'
};

export const Icon = Template.bind({});
Icon.args = {
	label: 'Title',
	icon: (
		<svg
			className="checkmark--circle"
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
