import * as React from 'react';
import { useState } from 'react';
import './formAccordion.styles';
import { FormAccordionItem } from '../formAccordion/FormAccordionItem';
import { AgencySelection } from '../agencySelection/AgencySelection';
import { autoselectPostcodeForConsultingType } from '../agencySelection/agencySelectionHelpers';
import { ReactComponent as PinIcon } from '../../resources/img/icons/pin.svg';
import { translate } from '../../resources/scripts/i18n/translate';
import { RegistrationUsername } from '../registration/RegistrationUsername';
import { AccordionItemValidity } from '../registration/registrationHelpers';

interface FormAccordionProps {
	consultingType: number;
	prefilledAgencyData: any;
	// setFormData: Function;
}

export const FormAccordion = (props: FormAccordionProps) => {
	const [activeItem, setActiveItem] = useState<number>(1);
	const [isUsernameValid, setIsUsernameValid] = useState<
		AccordionItemValidity
	>('initial');
	// const [registrationFormData, setRegistrationFormData] = useState<>{};

	let formData = {
		agencyId: '',
		postcode: ''
	};

	const agencySelection = !autoselectPostcodeForConsultingType(
		props.consultingType
	) && {
		title: translate('registration.agencySelection.headline'),
		nestedComponent: (
			<AgencySelection
				selectedConsultingType={props.consultingType}
				icon={<PinIcon />}
				setAgency={(agency) => {
					formData.agencyId = agency?.id || '';
					formData.postcode = agency?.postcode || '';
				}}
				preselectedAgency={props.prefilledAgencyData}
			/>
		),
		isValid: 'initial'
	};

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
		agencySelection
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
