import * as React from 'react';
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react';
import './formAccordion.styles';
import {
	RequiredComponentsInterface,
	RegistrationNotesInterface,
	useTenant,
	AgencySpecificContext
} from '../../globalState';
import { FormAccordionItem } from '../formAccordion/FormAccordionItem';
import { RegistrationUsername } from '../registration/RegistrationUsername';
import { RegistrationAge } from '../registration/RegistrationAge';
import { RegistrationState } from '../registration/RegistrationState';
import { RegistrationPassword } from '../registration/RegistrationPassword';
import {
	AccordionItemValidity,
	VALIDITY_INITIAL,
	VALIDITY_VALID
} from '../registration/registrationHelpers';
import { MainTopicSelection } from '../mainTopicSelection/MainTopicSelection';
import { useTranslation } from 'react-i18next';
import { Checkbox, CheckboxItem } from '../checkbox/Checkbox';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import { FormAccordionRegistrationText } from './FormAccordionRegistrationText';
import { setValueInCookie } from '../sessionCookie/accessSessionCookie';
import { ProposedAgencies } from '../../containers/registration/components/ProposedAgencies/ProposedAgencies';
import { useConsultantAgenciesAndConsultingTypes } from '../../containers/registration/hooks/useConsultantAgenciesAndConsultingTypes';
import { FormAccordionData } from '../registration/RegistrationForm';
import { UrlParamsContext } from '../../globalState/provider/UrlParamsProvider';
import { TProvidedLegalLink } from '../../globalState/provider/LegalLinksProvider';

interface FormAccordionProps {
	formAccordionData: FormAccordionData;
	isUsernameAlreadyInUse: boolean;
	onChange: (data: Partial<FormAccordionData>) => void;
	onValidation: Dispatch<SetStateAction<boolean>>;
	additionalStepsData?: RequiredComponentsInterface;
	registrationNotes?: RegistrationNotesInterface;
	legalLinks: TProvidedLegalLink[];
	handleSubmitButtonClick: Function;
	isSubmitButtonDisabled: boolean;
	setIsDataProtectionSelected: Dispatch<SetStateAction<boolean>>;
	isDataProtectionSelected: boolean;
}

export const FormAccordion = ({
	formAccordionData,
	isUsernameAlreadyInUse,
	onChange,
	onValidation,
	additionalStepsData,
	registrationNotes,
	legalLinks,
	handleSubmitButtonClick,
	isSubmitButtonDisabled,
	setIsDataProtectionSelected,
	isDataProtectionSelected
}: FormAccordionProps) => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);
	const tenantData = useTenant();

	const { consultingType, consultant } = useContext(UrlParamsContext);
	const { setSpecificAgency, specificAgency } = useContext(
		AgencySpecificContext
	);
	const { consultingTypes } = useConsultantAgenciesAndConsultingTypes();

	const [activeItem, setActiveItem] = useState<number>(1);

	const topicsAreRequired = useMemo(
		() =>
			tenantData?.settings?.topicsInRegistrationEnabled &&
			tenantData?.settings?.featureTopicsEnabled,
		[tenantData?.settings]
	);

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
		// different data protection between agencies
		formAccordionData.agency?.tenantId &&
			setValueInCookie(
				'tenantId',
				formAccordionData.agency?.tenantId
					? formAccordionData.agency?.tenantId?.toString()
					: '0'
			);
		formAccordionData.agency?.tenantId &&
			setIsDataProtectionSelected(false);
		setSpecificAgency(formAccordionData.agency);
	}, [
		formAccordionData.agency,
		setSpecificAgency,
		setIsDataProtectionSelected
	]);

	useEffect(() => {
		onValidation(
			Object.values(validity).every(
				(validity) => validity === VALIDITY_VALID
			)
		);
	}, [onValidation, validity]);

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
	}, [handleValidity, isDataProtectionSelected]);

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
						`<span><button type="button" class="button-as-link" onclick="window.open('${legalLink.getUrl(
							{ aid: specificAgency?.id }
						)}')">${translate(legalLink.label)}</button></span>`
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
					value={formAccordionData.mainTopic}
					onChange={(topic) => onChange({ mainTopic: topic })}
					onValidityChange={handleValidity}
				/>
			),
			isValid: validity.mainTopic
		});
	}

	const agencySelectionTitle = useMemo(() => {
		let key = 'agency';
		if (consultant) {
			key =
				consultingTypes.length > 1
					? 'consultingTypeAgencySelection.consultingType'
					: 'consultingTypeAgencySelection.agency';
		} else if (!consultingType?.registration?.autoSelectPostcode) {
			key = consultingType?.registration?.autoSelectAgency
				? 'agencyPreselected'
				: 'agencySelection';
		}
		return `registration.${key}.headline`;
	}, [consultant, consultingType, consultingTypes.length]);

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

	accordionItemData.push({
		title: translate(agencySelectionTitle),
		nestedComponent: (
			<ProposedAgencies
				agencySelectionNote={registrationNotes?.agencySelection}
				onValidityChange={handleValidity}
				formAccordionData={formAccordionData}
				onChange={onChange}
				onKeyDown={handleKeyDown}
			/>
		),
		isValid: validity.agency
	});

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
				<FormAccordionRegistrationText
					agency={formAccordionData.agency}
				/>
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
