import * as React from 'react';
import { useEffect, useState } from 'react';
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
	handleFormAccordionData: Function;
}

export const FormAccordion = (props: FormAccordionProps) => {
	const [activeItem, setActiveItem] = useState<number>(1);
	const [isUsernameValid, setIsUsernameValid] = useState<
		AccordionItemValidity
	>('initial');
	const [username, setUsername] = useState<string>(undefined);
	const [isSelectedAgencyValid, setIsSelectedAgencyValid] = useState<
		AccordionItemValidity
	>('initial');
	const [agency, setAgency] = useState<{ id; postcode }>(undefined);

	useEffect(() => {
		if (isUsernameValid === 'valid' && isSelectedAgencyValid === 'valid') {
			props.handleFormAccordionData({
				username: username,
				agencyId: agency?.id.toString(),
				postcode: agency?.postcode
			});
		} else {
			props.handleFormAccordionData(null);
		}
	}, [isUsernameValid, isSelectedAgencyValid, username, agency, props]);

	const agencySelection = !autoselectPostcodeForConsultingType(
		props.consultingType
	) && {
		title: translate('registration.agencySelection.headline'),
		nestedComponent: (
			<AgencySelection
				selectedConsultingType={props.consultingType}
				icon={<PinIcon />}
				preselectedAgency={props.prefilledAgencyData}
				onAgencyChange={(agency) => setAgency(agency)}
				onValidityChange={(validity) =>
					setIsSelectedAgencyValid(validity)
				}
			/>
		),
		isValid: isSelectedAgencyValid
	};

	const accordionItemData = [
		{
			title: translate('registration.username.headline'),
			nestedComponent: (
				<RegistrationUsername
					onUsernameChange={(username) => setUsername(username)}
					onValidityChange={(validity) =>
						setIsUsernameValid(validity)
					}
				/>
			),
			isValid: isUsernameValid
		},
		{
			title: translate('registration.password.headline'),
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
