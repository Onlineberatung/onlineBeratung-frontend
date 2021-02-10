import * as React from 'react';
import { useState } from 'react';
import './formAccordion.styles';
import { FormAccordionItem } from '../formAccordion/FormAccordionItem';

const accordionItemData = [
	{
		title: 'Bitte wählen Sie Ihren Benutzernamen',
		content:
			'sunt voluptatem libero ducimus error quam voluptas, ipsum rerum explicabo repellendus inventore doloribus, vitae architecto!'
	},
	{
		title: 'Bitte wählen Sie Ihr Passwort',
		content:
			'sunt voluptatem libero ducimus error quam voluptas, ipsum rerum explicabo repellendus inventore doloribus, vitae architecto!'
	},
	{
		title: 'Bitte wählen Sie eine Beratungsstelle in Ihrer Nähe',
		content:
			'sunt voluptatem libero ducimus error quam voluptas, ipsum rerum explicabo repellendus inventore doloribus, vitae architecto!'
	}
];

export const FormAccordion = () => {
	const [activeItem, setActiveItem] = useState<number>(1);

	const handleStepSubmit = (indexOfItem) => {
		// TODO: case index + 1 > items.length
		setActiveItem(indexOfItem + 1);
	};

	const handleItemHeaderClick = (indexOfItem) => {
		setActiveItem(indexOfItem);
	};

	return (
		<div className="formAccordion">
			{accordionItemData.map((accordionItem, i) => {
				return (
					<FormAccordionItem
						index={i + 1}
						isActive={i + 1 === activeItem}
						onStepSubmit={handleStepSubmit}
						onItemHeaderClick={handleItemHeaderClick}
						title={accordionItem.title}
						content={accordionItem.content}
						key={i}
					></FormAccordionItem>
				);
			})}
		</div>
	);
};
