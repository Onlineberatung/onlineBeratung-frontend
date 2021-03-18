import * as React from 'react';
import { useEffect, useState } from 'react';
import './formAccordion.styles';
import { FormAccordionItem } from '../formAccordion/FormAccordionItem';
import { AgencySelection } from '../agencySelection/AgencySelection';
import { autoselectPostcodeForConsultingType } from '../agencySelection/agencySelectionHelpers';
import { ReactComponent as PinIcon } from '../../resources/img/icons/pin.svg';
import { translate } from '../../resources/scripts/i18n/translate';
import { RegistrationUsername } from '../registration/RegistrationUsername';
import { RegistrationPassword } from '../registration/RegistrationPassword';
import { AccordionItemValidity } from '../registration/registrationHelpers';

interface FormAccordionProps {
	consultingType: number;
	isUsernameAlreadyInUse: boolean;
	prefilledAgencyData: any;
	handleFormAccordionData: Function;
}

export const FormAccordion = (props: FormAccordionProps) => {
	const [activeItem, setActiveItem] = useState<number>(1);
	const [isUsernameValid, setIsUsernameValid] = useState<
		AccordionItemValidity
	>('initial');
	const [username, setUsername] = useState<string>();
	const [isPasswordValid, setIsPasswordValid] = useState<
		AccordionItemValidity
	>('initial');
	const [password, setPassword] = useState<string>();
	const [isSelectedAgencyValid, setIsSelectedAgencyValid] = useState<
		AccordionItemValidity
	>('initial');
	const [agency, setAgency] = useState<{ id; postcode }>();

	useEffect(() => {
		if (
			autoselectPostcodeForConsultingType(props.consultingType) &&
			props.prefilledAgencyData
		) {
			setIsSelectedAgencyValid('valid');
			setAgency({
				id: props.prefilledAgencyData.id,
				postcode: props.prefilledAgencyData.postcode
			});
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (
			isUsernameValid === 'valid' &&
			isPasswordValid === 'valid' &&
			isSelectedAgencyValid === 'valid'
		) {
			props.handleFormAccordionData({
				username: username,
				password: password,
				agencyId: agency?.id.toString(),
				postcode: agency?.postcode
			});
		} else {
			props.handleFormAccordionData(null);
		}
	}, [isUsernameValid, isSelectedAgencyValid, username, agency]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (props.isUsernameAlreadyInUse) {
			setActiveItem(1);
		}
	}, [props.isUsernameAlreadyInUse]);

	const accordionItemData = [
		{
			title: translate('registration.username.headline'),
			nestedComponent: (
				<RegistrationUsername
					isUsernameAlreadyInUse={props.isUsernameAlreadyInUse}
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
			nestedComponent: (
				<RegistrationPassword
					onPasswordChange={(password) => setPassword(password)}
					onValidityChange={(validity) =>
						setIsPasswordValid(validity)
					}
				/>
			),
			isValid: isPasswordValid
		}
	];

	if (!autoselectPostcodeForConsultingType(props.consultingType)) {
		accordionItemData.push({
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
		});
	}

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
						onStepSubmit={(i) => setActiveItem(i + 1)}
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
