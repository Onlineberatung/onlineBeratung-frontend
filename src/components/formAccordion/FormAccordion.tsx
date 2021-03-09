import * as React from 'react';
import { useState } from 'react';
import './formAccordion.styles';
import { FormAccordionItem } from '../formAccordion/FormAccordionItem';
import { RegistrationUsername } from '../registration/RegistrationUsername';
import { AccordionItemValidity } from '../registration/registrationHelpers';

export const FormAccordion = () => {
	const [activeItem, setActiveItem] = useState<number>(1);
	const [isUsernameValid, setIsUsernameValid] = useState<
		AccordionItemValidity
	>('initial');

	const accordionItemData = [
		{
			title: 'Bitte wählen Sie Ihren Benutzernamen',
			nestedComponent: (
				<RegistrationUsername
					onValidityChange={(validity) =>
						setIsUsernameValid(validity)
					}
				/>
			),
			isValid: isUsernameValid
		},
		{
			title: 'Bitte wählen Sie Ihr Passwort',
			nestedComponent: null,
			isValid: 'initial'
		},
		{
			title: 'Bitte wählen Sie eine Beratungsstelle in Ihrer Nähe',
			nestedComponent: null,
			isValid: 'initial'
		}
	];

	const handleStepSubmit = (indexOfItem) => {
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
						isLastItem={i + 1 === accordionItemData.length}
						onStepSubmit={handleStepSubmit}
						onItemHeaderClick={handleItemHeaderClick}
						title={accordionItem.title}
						nestedComponent={accordionItem.nestedComponent}
						key={i}
						isValid={accordionItem.isValid as AccordionItemValidity}
					></FormAccordionItem>
				);
			})}
		</div>
	);
};
