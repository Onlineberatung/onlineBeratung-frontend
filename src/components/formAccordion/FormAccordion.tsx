import * as React from 'react';
import { useEffect, useState } from 'react';
import './formAccordion.styles';
import { RequiredComponentsInterface } from '../../globalState';
import { FormAccordionItem } from '../formAccordion/FormAccordionItem';
import { AgencySelection } from '../agencySelection/AgencySelection';
import { autoselectPostcodeForConsultingType } from '../agencySelection/agencySelectionHelpers';
import { ReactComponent as PinIcon } from '../../resources/img/icons/pin.svg';
import { translate } from '../../utils/translate';
import { RegistrationUsername } from '../registration/RegistrationUsername';
import { RegistrationAge } from '../registration/RegistrationAge';
import { RegistrationState } from '../registration/RegistrationState';
import { RegistrationPassword } from '../registration/RegistrationPassword';
import { AccordionItemValidity } from '../registration/registrationHelpers';

interface FormAccordionProps {
	consultingType: number;
	isUsernameAlreadyInUse: boolean;
	preselectedAgencyData: any;
	handleFormAccordionData: Function;
	additionalStepsData?: RequiredComponentsInterface;
}

export const FormAccordion = (props: FormAccordionProps) => {
	const [activeItem, setActiveItem] = useState<number>(1);
	const [usernameValidity, setUsernameValidity] = useState<
		AccordionItemValidity
	>('initial');
	const [username, setUsername] = useState<string>();
	const [passwordValidity, setPasswordValidity] = useState<
		AccordionItemValidity
	>('initial');
	const [password, setPassword] = useState<string>();
	const [selectedAgencyValidity, setSelectedAgencyValidity] = useState<
		AccordionItemValidity
	>('initial');
	const [agency, setAgency] = useState<{ id; postcode }>();
	const [stateValidity, setStateValidity] = useState<AccordionItemValidity>(
		'initial'
	);
	const [state, setState] = useState<string>();
	const [ageValidity, setAgeValidity] = useState<AccordionItemValidity>(
		'initial'
	);
	const [age, setAge] = useState<string>();

	useEffect(() => {
		if (
			autoselectPostcodeForConsultingType(props.consultingType) &&
			props.preselectedAgencyData
		) {
			setSelectedAgencyValidity('valid');
			setAgency({
				id: props.preselectedAgencyData.id,
				postcode: props.preselectedAgencyData.postcode
			});
		}
	}, [props.preselectedAgencyData]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(
		() => {
			if (
				usernameValidity === 'valid' &&
				passwordValidity === 'valid' &&
				selectedAgencyValidity === 'valid' &&
				(stateValidity === 'valid' ||
					!props.additionalStepsData?.state) &&
				(ageValidity === 'valid' || !props.additionalStepsData?.age)
			) {
				props.handleFormAccordionData({
					username: username,
					password: password,
					agencyId: agency?.id.toString(),
					postcode: agency?.postcode,
					...(state && { state: state }),
					...(age && { age: age })
				});
			} else {
				props.handleFormAccordionData(null);
			}
		},
		/* eslint-disable */
		[
			usernameValidity,
			selectedAgencyValidity,
			passwordValidity,
			stateValidity,
			ageValidity,
			username,
			agency,
			password,
			state,
			age
		]
	);
	/* eslint-enable */

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
						setUsernameValidity(validity)
					}
				/>
			),
			isValid: usernameValidity
		},
		{
			title: translate('registration.password.headline'),
			nestedComponent: (
				<RegistrationPassword
					onPasswordChange={(password) => setPassword(password)}
					onValidityChange={(validity) =>
						setPasswordValidity(validity)
					}
					hasNoResetNote={props.consultingType === 1}
				/>
			),
			isValid: passwordValidity
		}
	];

	if (!autoselectPostcodeForConsultingType(props.consultingType)) {
		accordionItemData.push({
			title: props.preselectedAgencyData
				? translate('registration.agencyPreselected.headline')
				: translate('registration.agencySelection.headline'),
			nestedComponent: (
				<AgencySelection
					selectedConsultingType={props.consultingType}
					icon={<PinIcon />}
					preselectedAgency={props.preselectedAgencyData}
					onAgencyChange={(agency) => setAgency(agency)}
					onValidityChange={(validity) =>
						setSelectedAgencyValidity(validity)
					}
				/>
			),
			isValid: selectedAgencyValidity
		});
	}

	if (props.additionalStepsData?.age) {
		accordionItemData.push({
			title: translate('registration.age.headline'),
			nestedComponent: (
				<RegistrationAge
					dropdownSelectData={props.additionalStepsData.age}
					onAgeChange={(age) => setAge(age)}
					onValidityChange={(validity) => setAgeValidity(validity)}
				/>
			),
			isValid: ageValidity
		});
	}

	if (props.additionalStepsData?.state) {
		accordionItemData.push({
			title: translate('registration.state.headline'),
			nestedComponent: (
				<RegistrationState
					dropdownSelectData={props.additionalStepsData.state}
					onStateChange={(state) => setState(state)}
					onValidityChange={(validity) => setStateValidity(validity)}
				/>
			),
			isValid: stateValidity
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
