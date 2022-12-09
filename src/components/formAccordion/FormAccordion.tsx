import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import './formAccordion.styles';
import {
	RequiredComponentsInterface,
	RegistrationNotesInterface,
	ConsultingTypeInterface,
	ConsultantDataInterface,
	AgencyDataInterface,
	useTenant,
	LegalLinkInterface
} from '../../globalState';
import { FormAccordionItem } from '../formAccordion/FormAccordionItem';
import { AgencySelection } from '../agencySelection/AgencySelection';
import { ReactComponent as PinIcon } from '../../resources/img/icons/pin.svg';
import { RegistrationUsername } from '../registration/RegistrationUsername';
import { RegistrationAge } from '../registration/RegistrationAge';
import { RegistrationState } from '../registration/RegistrationState';
import { RegistrationPassword } from '../registration/RegistrationPassword';
import {
	AccordionItemValidity,
	VALIDITY_INITIAL,
	VALIDITY_INVALID,
	VALIDITY_VALID
} from '../registration/registrationHelpers';
import {
	ConsultingTypeAgencySelection,
	useConsultingTypeAgencySelection
} from '../consultingTypeSelection/ConsultingTypeAgencySelection';
import { MainTopicSelection } from '../mainTopicSelection/MainTopicSelection';
import { useTranslation } from 'react-i18next';
import { PreselectedAgency } from '../agencySelection/PreselectedAgency';
import { Text } from '../text/Text';
import { Checkbox, CheckboxItem } from '../checkbox/Checkbox';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import { FormAccordionRegistrationText } from './FormAccordionRegistrationText';
import { setValueInCookie } from '../sessionCookie/accessSessionCookie';

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
	preselectedTopic?: number;
	legalLinks: Array<LegalLinkInterface>;
	handleSubmitButtonClick: Function;
	isSubmitButtonDisabled: boolean;
	setIsDataProtectionSelected: Function;
	isDataProtectionSelected: boolean;
}

export const FormAccordion = ({
	consultingType,
	consultant,
	isUsernameAlreadyInUse,
	preselectedAgencyData,
	preselectedTopic,
	onChange,
	onValidation,
	additionalStepsData,
	registrationNotes,
	initialPostcode,
	mainTopicId,
	legalLinks,
	handleSubmitButtonClick,
	isSubmitButtonDisabled,
	setIsDataProtectionSelected,
	isDataProtectionSelected
}: FormAccordionProps) => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);
	const [activeItem, setActiveItem] = useState<number>(1);
	const [agency, setAgency] = useState<AgencyDataInterface>();
	const tenantData = useTenant();
	const topicsAreRequired =
		tenantData?.settings?.topicsInRegistrationEnabled &&
		tenantData?.settings?.featureTopicsEnabled;

	const buttonItemSubmit: ButtonItem = {
		label: translate('registration.submitButton.label'),
		type: BUTTON_TYPES.PRIMARY
	};

	const [validity, setValidity] = useState({
		username: VALIDITY_INITIAL,
		password: VALIDITY_INITIAL,
		state: additionalStepsData?.state?.isEnabled
			? VALIDITY_INITIAL
			: VALIDITY_VALID,
		age: additionalStepsData?.age?.isEnabled
			? VALIDITY_INITIAL
			: VALIDITY_VALID,
		mainTopic: topicsAreRequired ? VALIDITY_INITIAL : VALIDITY_VALID,
		agency: VALIDITY_INITIAL,
		dataProtection: VALIDITY_INITIAL
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
		// different data protection between agencies
		agency?.tenantId &&
			setValueInCookie(
				'tenantId',
				agency?.tenantId ? agency?.tenantId?.toString() : '0'
			);
		agency?.tenantId && setIsDataProtectionSelected(false);
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

	useEffect(() => {
		handleValidity(
			'dataProtection',
			isDataProtectionSelected ? VALIDITY_VALID : VALIDITY_INITIAL
		);
	}, [isDataProtectionSelected]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleKeyDown = (e, isLastInput = true, isFirstInput = true) => {
		if (
			e.key === 'Tab' &&
			!e.shiftKey &&
			isLastInput &&
			activeItem !== accordionItemData.length
		) {
			setActiveItem(activeItem + 1);
		} else if (
			e.key === 'Tab' &&
			e.shiftKey &&
			isFirstInput &&
			activeItem !== 1
		) {
			setActiveItem(activeItem - 1);
		}
	};

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
					onKeyDown={handleKeyDown}
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
					onKeyDown={handleKeyDown}
				/>
			),
			isValid: validity.password
		}
	];

	const checkboxItemDataProtection: CheckboxItem = {
		inputId: 'dataProtectionCheckbox',
		name: 'dataProtectionCheckbox',
		labelId: 'dataProtectionLabel',
		checked: isDataProtectionSelected,
		label: [
			translate('registration.dataProtection.label.prefix'),
			legalLinks
				.filter((legalLink) => legalLink.registration)
				.map(
					(legalLink, index, { length }) =>
						(index > 0
							? index < length - 1
								? ', '
								: translate(
										'registration.dataProtection.label.and'
								  )
							: '') +
						`<span><button type="button" class="button-as-link" onclick="window.open('${
							legalLink.url
						}')">${translate(legalLink.label)}</button></span>`
				)
				.join(''),
			translate('registration.dataProtection.label.suffix')
		].join(' ')
	};

	if (topicsAreRequired) {
		accordionItemData.push({
			title: translate('registration.mainTopic.headline'),
			nestedComponent: (
				<MainTopicSelection
					name="mainTopic"
					preselectedTopic={preselectedTopic}
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
						onKeyDown={handleKeyDown}
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
							topicsAreRequired &&
							!mainTopicId &&
							preselectedTopic < 0 &&
							validity !== VALIDITY_INITIAL
						) {
							handleValidity('mainTopic', VALIDITY_INVALID);
						}
						handleValidity('agency', validity);
					}}
					agencySelectionNote={registrationNotes?.agencySelection}
					mainTopicId={mainTopicId}
					onKeyDown={handleKeyDown}
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
						options: additionalStepsData.age.options.map(
							(option) => ({
								...option,
								label: translate(
									[
										`consultingType.${consultingType.id}.requiredComponents.age.${option.value}`,
										option.label
									],
									{ ns: 'consultingTypes' }
								)
							})
						)
					}}
					onAgeChange={(age) => onChange({ age })}
					onValidityChange={(validity) =>
						handleValidity('age', validity)
					}
					onKeyDown={handleKeyDown}
				/>
			),
			isValid: validity.age
		});
	}

	if (additionalStepsData?.state?.isEnabled) {
		// we want an array from 1 to 16 and the 0 at the end
		let countiesArray = Array.from(Array(17).keys());
		countiesArray.push(countiesArray.shift());

		accordionItemData.push({
			title: translate('registration.state.headline'),
			nestedComponent: (
				<RegistrationState
					dropdownSelectData={{
						label: translate('registration.state.dropdown'),
						options: countiesArray.map((value) => ({
							value: `${value}`,
							label: translate(
								`registration.state.options.${value}`
							)
						}))
					}}
					onStateChange={(state) => onChange({ state })}
					onValidityChange={(validity) =>
						handleValidity('state', validity)
					}
					onKeyDown={handleKeyDown}
				/>
			),
			isValid: validity.state
		});
	}

	if (
		preselectedAgencyData &&
		!possibleAgencies?.length &&
		consultingType?.registration.autoSelectPostcode
	) {
		accordionItemData.push({
			title: translate('registration.agency.headline'),
			nestedComponent: (
				<PreselectedAgency
					prefix={translate('registration.agency.preselected.prefix')}
					agencyData={preselectedAgencyData}
					onKeyDown={handleKeyDown}
				/>
			),
			isValid: validity.agency
		});
	}

	if (
		consultingType?.registration.autoSelectPostcode &&
		!preselectedAgencyData &&
		!possibleAgencies?.length
	) {
		accordionItemData.push({
			title: translate('registration.agency.headline'),
			nestedComponent: (
				<div
					className="registrationForm__no-agency-found"
					onKeyDown={handleKeyDown}
				>
					<Text
						text={translate(
							'registration.agencySelection.noAgencies'
						)}
						type="infoMedium"
					/>
				</div>
			),
			isValid: VALIDITY_INITIAL
		});
	}

	accordionItemData.push({
		title: translate('registration.form.title'),
		nestedComponent: (
			<div>
				<div
					className="registrationForm__dataProtection"
					onKeyDown={handleKeyDown}
				>
					<Checkbox
						item={checkboxItemDataProtection}
						checkboxHandle={() =>
							setIsDataProtectionSelected(
								!isDataProtectionSelected
							)
						}
						onKeyPress={(event) => {
							if (event.key === 'Enter') {
								setIsDataProtectionSelected(
									!isDataProtectionSelected
								);
							}
						}}
					/>
				</div>
				<FormAccordionRegistrationText agency={agency} />
				<Button
					className="registrationForm__submit"
					item={buttonItemSubmit}
					buttonHandle={handleSubmitButtonClick}
					disabled={isSubmitButtonDisabled}
				/>
			</div>
		),
		isValid: validity.dataProtection
	});

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
