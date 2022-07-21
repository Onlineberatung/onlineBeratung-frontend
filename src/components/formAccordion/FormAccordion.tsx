import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import './formAccordion.styles';
import {
	RequiredComponentsInterface,
	RegistrationNotesInterface,
	ConsultingTypeInterface,
	ConsultantDataInterface,
	AgencyDataInterface,
	useTenant
} from '../../globalState';
import { FormAccordionItem } from '../formAccordion/FormAccordionItem';
import { AgencySelection } from '../agencySelection/AgencySelection';
import { ReactComponent as PinIcon } from '../../resources/img/icons/pin.svg';
import { translate } from '../../utils/translate';
import { RegistrationUsername } from '../registration/RegistrationUsername';
import { RegistrationAge } from '../registration/RegistrationAge';
import { RegistrationState } from '../registration/RegistrationState';
import { RegistrationPassword } from '../registration/RegistrationPassword';
import {
	AccordionItemValidity,
	stateData,
	VALIDITY_INITIAL,
	VALIDITY_INVALID,
	VALIDITY_VALID
} from '../registration/registrationHelpers';
import {
	ConsultingTypeAgencySelection,
	useConsultingTypeAgencySelection
} from '../consultingTypeSelection/ConsultingTypeAgencySelection';
import { MainTopicSelection } from '../mainTopicSelection/MainTopicSelection';

interface FormAccordionProps {
	consultingType?: ConsultingTypeInterface;
	consultant?: ConsultantDataInterface;
	isUsernameAlreadyInUse: boolean;
	preselectedAgencyData: any;
	onChange: Function;
	onValidation: Function;
	additionalStepsData?: RequiredComponentsInterface;
	registrationNotes?: RegistrationNotesInterface;
	initialPostcode?: string;
	mainTopicId?: number;
}

export const FormAccordion = ({
	consultingType,
	consultant,
	isUsernameAlreadyInUse,
	preselectedAgencyData,
	onChange,
	onValidation,
	additionalStepsData,
	registrationNotes,
	initialPostcode,
	mainTopicId
}: FormAccordionProps) => {
	const [activeItem, setActiveItem] = useState<number>(1);
	const [agency, setAgency] = useState<AgencyDataInterface>();
	const tenantData = useTenant();

	const [validity, setValidity] = useState({
		username: VALIDITY_INITIAL,
		password: VALIDITY_INITIAL,
		state: additionalStepsData?.state?.isEnabled
			? VALIDITY_INITIAL
			: VALIDITY_VALID,
		age: additionalStepsData?.age?.isEnabled
			? VALIDITY_INITIAL
			: VALIDITY_VALID,
		mainTopic: tenantData?.settings?.topicsInRegistrationEnabled
			? VALIDITY_INITIAL
			: VALIDITY_VALID,
		agency: VALIDITY_INITIAL
	});

	useEffect(() => {
		if (
			consultingType?.registration.autoSelectPostcode &&
			preselectedAgencyData
		) {
			handleValidity('agency', VALIDITY_VALID);
			setAgency(preselectedAgencyData);
		}
	}, [preselectedAgencyData]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		onChange({
			agencyId: agency?.id,
			consultingTypeId: agency?.consultingType,
			postcode: agency?.postcode
		});
	}, [agency]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		onValidation(
			Object.values(validity).every(
				(validity) => validity === VALIDITY_VALID
			)
		);
	}, [validity]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleValidity = useCallback((key, value) => {
		setValidity((prevState) => ({
			...prevState,
			[key]: value
		}));
	}, []);

	useEffect(() => {
		if (isUsernameAlreadyInUse) {
			setActiveItem(1);
		}
	}, [isUsernameAlreadyInUse]);

	const accordionItemData = [
		{
			title: translate('registration.username.headline'),
			nestedComponent: (
				<RegistrationUsername
					isUsernameAlreadyInUse={isUsernameAlreadyInUse}
					onUsernameChange={(username) => onChange({ username })}
					onValidityChange={(validity) =>
						handleValidity('username', validity)
					}
				/>
			),
			isValid: validity.username
		},
		{
			title: translate('registration.password.headline'),
			nestedComponent: (
				<RegistrationPassword
					onPasswordChange={(password) => onChange({ password })}
					onValidityChange={(validity) =>
						handleValidity('password', validity)
					}
					passwordNote={registrationNotes?.password}
				/>
			),
			isValid: validity.password
		}
	];

	if (tenantData?.settings?.topicsInRegistrationEnabled) {
		accordionItemData.push({
			title: translate('registration.mainTopic.headline'),
			nestedComponent: (
				<MainTopicSelection
					name="mainTopic"
					onChange={(mainTopicId) => onChange({ mainTopicId })}
					onValidityChange={handleValidity}
				/>
			),
			isValid: validity.mainTopic
		});
	}

	const {
		agencies: possibleAgencies,
		consultingTypes: possibleConsultingTypes
	} = useConsultingTypeAgencySelection(
		consultant,
		consultingType,
		preselectedAgencyData
	);

	useEffect(() => {
		// If only one agency and one consultingType possible then choose it because selection is not shown
		if (
			consultant &&
			possibleAgencies.length === 1 &&
			possibleConsultingTypes.length === 1
		) {
			setAgency(possibleAgencies[0]);
			handleValidity('agency', VALIDITY_VALID);
		}
	}, [consultant, possibleAgencies, possibleConsultingTypes]); // eslint-disable-line react-hooks/exhaustive-deps

	if (consultant) {
		if (possibleAgencies.length > 1 || possibleConsultingTypes.length > 1) {
			accordionItemData.push({
				title:
					possibleConsultingTypes.length > 1
						? translate(
								'registration.consultingTypeAgencySelection.consultingType.headline'
						  )
						: translate(
								'registration.consultingTypeAgencySelection.agency.headline'
						  ),
				nestedComponent: (
					<ConsultingTypeAgencySelection
						consultant={consultant}
						agency={agency}
						preselectedConsultingType={consultingType}
						preselectedAgency={preselectedAgencyData}
						onChange={setAgency}
						onValidityChange={(validity) =>
							handleValidity('agency', validity)
						}
					/>
				),
				isValid: validity.agency
			});
		}
	} else if (
		consultingType &&
		!consultingType.registration.autoSelectPostcode
	) {
		accordionItemData.push({
			title: preselectedAgencyData
				? translate('registration.agencyPreselected.headline')
				: translate('registration.agencySelection.headline'),
			nestedComponent: (
				<AgencySelection
					consultingType={consultingType}
					icon={<PinIcon />}
					initialPostcode={initialPostcode}
					preselectedAgency={preselectedAgencyData}
					onAgencyChange={(agency) => setAgency(agency)}
					hideExternalAgencies
					onValidityChange={(validity) => {
						if (
							tenantData?.settings?.topicsInRegistrationEnabled &&
							!mainTopicId &&
							validity !== VALIDITY_INITIAL
						) {
							handleValidity('mainTopic', VALIDITY_INVALID);
						}
						handleValidity('agency', validity);
					}}
					agencySelectionNote={registrationNotes?.agencySelection}
					mainTopicId={mainTopicId}
				/>
			),
			isValid: validity.agency
		});
	}

	if (additionalStepsData?.age?.isEnabled) {
		accordionItemData.push({
			title: translate('registration.age.headline'),
			nestedComponent: (
				<RegistrationAge
					dropdownSelectData={{
						label: translate('registration.age.dropdown'),
						options: additionalStepsData.age.options
					}}
					onAgeChange={(age) => onChange({ age })}
					onValidityChange={(validity) =>
						handleValidity('age', validity)
					}
				/>
			),
			isValid: validity.age
		});
	}

	if (additionalStepsData?.state?.isEnabled) {
		accordionItemData.push({
			title: translate('registration.state.headline'),
			nestedComponent: (
				<RegistrationState
					dropdownSelectData={{
						label: translate('registration.state.dropdown'),
						options: stateData
					}}
					onStateChange={(state) => onChange({ state })}
					onValidityChange={(validity) =>
						handleValidity('state', validity)
					}
				/>
			),
			isValid: validity.state
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
					/>
				);
			})}
		</div>
	);
};
