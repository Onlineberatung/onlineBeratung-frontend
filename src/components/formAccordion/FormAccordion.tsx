import * as React from 'react';
import { useState } from 'react';
import './formAccordion.styles';
import { FormAccordionItem } from '../formAccordion/FormAccordionItem';
import { RegistrationUsername } from '../registration/RegistrationUsername';

const accordionItemData = [
	{
		title: 'Bitte wählen Sie Ihren Benutzernamen',
		content: <RegistrationUsername />
	},
	{
		title: 'Bitte wählen Sie Ihr Passwort',
		content: null
	},
	{
		title: 'Bitte wählen Sie eine Beratungsstelle in Ihrer Nähe',
		content: null
	}
];

export const FormAccordion = () => {
	const [activeItem, setActiveItem] = useState<number>(1);

	const handleStepSubmit = (indexOfItem) => {
		// TODO: case index + 1 > items.length
		if (indexOfItem + 1 > accordionItemData.length) {
			setActiveItem(0);
		} else {
			setActiveItem(indexOfItem + 1);
		}
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
