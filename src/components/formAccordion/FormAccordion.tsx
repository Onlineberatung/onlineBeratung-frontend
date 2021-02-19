import * as React from 'react';
import { useState } from 'react';
import './formAccordion.styles';
import { FormAccordionItem } from '../formAccordion/FormAccordionItem';
import { AgencySelection } from '../agencySelection/AgencySelection';
import { autoselectPostcodeForConsultingType } from '../agencySelection/agencySelectionHelpers';
import { ReactComponent as PinIcon } from '../../resources/img/icons/pin.svg';
import { translate } from '../../resources/scripts/i18n/translate';

interface FormAccordionProps {
	consultingType: number;
	prefilledAgencyData: any;
	// setFormData: Function;
}

export const FormAccordion = (props: FormAccordionProps) => {
	const [activeItem, setActiveItem] = useState<number>(1);
	// const [registrationFormData, setRegistrationFormData] = useState<>{};

	let formData = {
		agencyId: '',
		postcode: ''
	};

	const agencySelection = !autoselectPostcodeForConsultingType(
		props.consultingType
	) && {
		title: translate('registration.agencySelection.headline'),
		content: (
			<AgencySelection
				selectedConsultingType={props.consultingType}
				icon={<PinIcon />}
				setAgency={(agency) => {
					formData.agencyId = agency?.id || '';
					formData.postcode = agency?.postcode || '';
				}}
				preselectedAgency={props.prefilledAgencyData}
			/>
		)
	};

	const accordionItemData = [
		{
			title: 'Bitte wählen Sie Ihren Benutzernamen',
			content: null
		},
		{
			title: 'Bitte wählen Sie Ihr Passwort',
			content: null
		},
		agencySelection
	];

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
