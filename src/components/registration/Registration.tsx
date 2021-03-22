import '../../polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage } from '../stage/stage';
import { GeneratedInputs } from '../inputField/InputField';
import { useEffect, useState } from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { Button } from '../button/Button';
import registrationResortsData from './registrationData';
import { CheckboxItem, Checkbox } from '../checkbox/Checkbox';
import {
	buttonItemSubmit,
	getOptionOfSelectedValue,
	overlayItemRegistrationSuccess
} from './registrationHelpers';
import {
	apiPostRegistration,
	FETCH_ERRORS,
	apiAgencySelection,
	apiGetAgencyById
} from '../../api';
import { config } from '../../resources/scripts/config';
import { setTokenInCookie } from '../sessionCookie/accessSessionCookie';
import { SelectDropdown } from '../select/SelectDropdown';
import { RadioButton } from '../radioButton/RadioButton';
import { TagSelect } from '../tagSelect/TagSelect';
import {
	DEFAULT_POSTCODE,
	redirectToHelpmail,
	redirectToRegistrationWithoutAid
} from './prefillPostcode';
import { getUrlParameter } from '../../resources/scripts/helpers/getUrlParameter';
import {
	getConsultingTypeFromRegistration,
	isU25Registration
} from '../../resources/scripts/helpers/resorts';
import { OverlayWrapper, Overlay, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { redirectToApp } from './autoLogin';
import { isNumber } from '../../resources/scripts/helpers/isNumber';
import '../../resources/styles/styles';
import './registration.styles';
import { Text, LABEL_TYPES } from '../text/Text';
import { autoselectAgencyForConsultingType } from '../agencySelection/agencySelectionHelpers';
import { SelectedAgencyInfo } from '../selectedAgencyInfo/SelectedAgencyInfo';
import { AgencyDataInterface } from '../../globalState';
import { FormAccordion } from '../formAccordion/FormAccordion';
import { WelcomeScreen } from './WelcomeScreen';

export const initRegistration = () => {
	ReactDOM.render(
		<Registration />,
		document.getElementById('registrationRoot')
	);
};

export interface ResortData {
	consultingType: string;
	overline: string;
	requiredComponents?: any[];
	useInformal: boolean;
	voluntaryComponents?: any[];
}

interface FormAccordionData {
	username: string;
	password: string;
	agencyId: string;
	postcode: string;
}

const Registration = () => {
	const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);
	const [formAccordionData, setFormAccordionData] = useState<
		FormAccordionData
	>();
	const [
		prefilledAgencyData,
		setPrefilledAgencyData
	] = useState<AgencyDataInterface | null>(null);
	const [isUsernameAlreadyInUse, setIsUsernameAlreadyInUse] = useState<
		boolean
	>(false);
	const [
		valuesOfGeneratedInputs,
		setValuesOfGeneratedInputs
	] = useState<GeneratedInputs | null>(null);
	const [isDataProtectionSelected, setIsDataProtectionSelected] = useState(
		false
	);
	const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
	const [consultingType] = useState(getConsultingTypeFromRegistration());
	const [overlayActive, setOverlayActive] = useState(false);

	const resortDataArray = Object.entries(registrationResortsData).filter(
		(resort) => resort[1].consultingType === consultingType?.toString()
	);

	let resortData: ResortData;
	if (resortDataArray.length > 1) {
		const resortName = document.getElementById('registrationRoot')?.dataset
			.resortname;
		resortData = resortDataArray.filter(
			(resort) => resort[0] === resortName
		)[0][1];
	} else {
		resortData = resortDataArray[0][1];
	}

	// SET FORMAL/INFORMAL COOKIE
	setTokenInCookie('useInformal', resortData.useInformal ? '1' : '');

	const prefillPostcode = () => {
		const agencyId = isNumber(getUrlParameter('aid'))
			? getUrlParameter('aid')
			: null;

		if (agencyId) {
			getAgencyDataById(agencyId);
		} else if (isU25Registration()) {
			redirectToHelpmail();
		}

		if (autoselectAgencyForConsultingType(consultingType)) {
			apiAgencySelection({
				postcode: DEFAULT_POSTCODE,
				consultingType: consultingType
			})
				.then((response) => {
					const agencyData = response[0];
					setPrefilledAgencyData(agencyData);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	const getAgencyDataById = (agencyId) => {
		apiGetAgencyById(agencyId)
			.then((response) => {
				const agencyData = response[0];
				agencyData.consultingType === consultingType
					? setPrefilledAgencyData(agencyData)
					: redirectToRegistrationWithoutAid();
			})
			.catch((error) => {
				if (error.message === FETCH_ERRORS.NO_MATCH) {
					redirectToRegistrationWithoutAid();
				}
			});
	};

	const isRegistrationValid = () => {
		const validation: boolean[] = [];
		const generalValidation = formAccordionData && isDataProtectionSelected;

		validation.push(generalValidation ? true : false);

		// U25 and gemeinsamstatteinsam
		if (consultingType === 1) {
			validation.push(
				valuesOfGeneratedInputs &&
					valuesOfGeneratedInputs['age'] &&
					valuesOfGeneratedInputs['state']
					? true
					: false
			);
		}

		return validation.indexOf(false) === -1;
	};

	useEffect(() => {
		prefillPostcode();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(
		() => {
			if (isRegistrationValid()) {
				setIsSubmitButtonDisabled(false);
			} else {
				setIsSubmitButtonDisabled(true);
			}
		},
		/* eslint-disable */
		[formAccordionData, valuesOfGeneratedInputs, isDataProtectionSelected]
	);
	/* eslint-enable */

	const handleForwardToRegistration = () => {
		setShowWelcomeScreen(false);
		window.scrollTo({ top: 0 });
	};

	const checkboxItemDataProtection: CheckboxItem = {
		inputId: 'dataProtectionCheckbox',
		name: 'dataProtectionCheckbox',
		labelId: 'dataProtectionLabel',
		label: translate('registration.dataProtection.label'),
		checked: isDataProtectionSelected
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT_WITH_BLUR) {
			redirectToApp();
		}
	};

	const handleRegistrationError = (response: XMLHttpRequest) => {
		const error = response.getResponseHeader(FETCH_ERRORS.X_REASON);
		if (error && error === 'USERNAME_NOT_AVAILABLE') {
			setIsUsernameAlreadyInUse(true);
			setIsSubmitButtonDisabled(true);
			window.scrollTo({ top: 0 });
		}
	};

	const handleSubmitButtonClick = () => {
		setIsUsernameAlreadyInUse(false);

		const generalRegistrationData = {
			username: formAccordionData.username,
			password: encodeURIComponent(formAccordionData.password),
			agencyId: formAccordionData.agencyId,
			postcode: formAccordionData.postcode,
			consultingType: consultingType?.toString(),
			termsAccepted: isDataProtectionSelected.toString()
		};

		let generatedRegistrationData = {};

		if (valuesOfGeneratedInputs) {
			const {
				addictiveDrugs,
				...voluntaryFieldsWithOneValue
			} = valuesOfGeneratedInputs;

			generatedRegistrationData = {
				...(valuesOfGeneratedInputs['addictiveDrugs'] && {
					addictiveDrugs: valuesOfGeneratedInputs[
						'addictiveDrugs'
					].join(',')
				}),
				...voluntaryFieldsWithOneValue
			};
		}

		const registrationData = {
			...generalRegistrationData,
			...generatedRegistrationData
		};

		apiPostRegistration(
			config.endpoints.registerAsker,
			registrationData,
			() => setOverlayActive(true),
			(response) => handleRegistrationError(response)
		);
	};

	const handleGeneratedInputfieldValueChange = (
		inputValue,
		inputName,
		areMultipleValuesAllowed?
	) => {
		if (areMultipleValuesAllowed) {
			const values =
				valuesOfGeneratedInputs && valuesOfGeneratedInputs[inputName]
					? valuesOfGeneratedInputs[inputName]
					: [];
			const index = values.indexOf(inputValue);
			if (index > -1) {
				values.splice(index, 1);
			} else {
				values.push(inputValue);
			}
			setValuesOfGeneratedInputs({
				...valuesOfGeneratedInputs,
				[inputName]: values
			});
		} else {
			setValuesOfGeneratedInputs({
				...valuesOfGeneratedInputs,
				[inputName]: inputValue
			});
		}
	};

	const renderInputComponent = (component, index) => {
		if (component.componentType === 'SelectDropdown') {
			return (
				<SelectDropdown
					key={index}
					handleDropdownSelect={(e) =>
						handleGeneratedInputfieldValueChange(
							e.value,
							component.name
						)
					}
					defaultValue={
						valuesOfGeneratedInputs
							? getOptionOfSelectedValue(
									component.item.selectedOptions,
									valuesOfGeneratedInputs[component.name]
							  )
							: null
					}
					{...component.item}
				/>
			);
		} else if (component.componentType === 'RadioButton') {
			return component.radioButtons.map((radio, index) => {
				return (
					<RadioButton
						key={index}
						name={component.name}
						handleRadioButton={(e) =>
							handleGeneratedInputfieldValueChange(
								e.target.value,
								component.name
							)
						}
						type="box"
						value={index}
						{...radio}
					/>
				);
			});
		} else if (component.componentType === 'TagSelect') {
			return component.tagSelects.map((tag, index) => {
				return (
					<TagSelect
						key={index}
						name={component.name}
						value={index}
						handleTagSelectClick={(e) =>
							handleGeneratedInputfieldValueChange(
								e.target.value,
								component.name,
								true
							)
						}
						{...tag}
					/>
				);
			});
		}
	};

	const voluntaryComponents = resortData.voluntaryComponents
		? resortData.voluntaryComponents.map((component, index) => {
				return (
					<div key={index} className="registration__contentRow">
						<h3>{component.headline}</h3>
						{renderInputComponent(component, index)}
					</div>
				);
		  })
		: null;

	const requiredComponents = resortData.requiredComponents
		? resortData.requiredComponents.map((component, index) => {
				return renderInputComponent(component, index);
		  })
		: null;

	return (
		<div className="registration">
			<Stage hasAnimation={true}></Stage>

			<div className="registration__content">
				{showWelcomeScreen ? (
					<WelcomeScreen
						resortTitle={resortData.overline}
						handleForwardToRegistration={
							handleForwardToRegistration
						}
					/>
				) : (
					<>
						<form
							id="registrationForm"
							data-consultingtype={consultingType}
						>
							<h3 className="registration__overline">
								{resortData.overline}
							</h3>
							<h2 className="registration__headline">
								{translate('registration.headline')}
							</h2>

							<FormAccordion
								consultingType={consultingType}
								isUsernameAlreadyInUse={isUsernameAlreadyInUse}
								prefilledAgencyData={prefilledAgencyData}
								handleFormAccordionData={(formData) =>
									setFormAccordionData(formData)
								}
							></FormAccordion>

							<div className="registration__dataProtection">
								<Checkbox
									item={checkboxItemDataProtection}
									checkboxHandle={() =>
										setIsDataProtectionSelected(
											!isDataProtectionSelected
										)
									}
								/>
							</div>

							<Button
								className="registration__submit"
								item={buttonItemSubmit}
								buttonHandle={handleSubmitButtonClick}
								disabled={isSubmitButtonDisabled}
							/>

							{/* ----------------------------- Required Fields ---------------------------- */}
							<div className="registration__generalInformation">
								{prefilledAgencyData && (
									<SelectedAgencyInfo
										prefix={translate(
											'registration.agency.prefilled.prefix'
										)}
										agencyData={prefilledAgencyData}
										consultingType={
											autoselectAgencyForConsultingType(
												consultingType
											)
												? consultingType
												: null
										}
									/>
								)}
								{consultingType === 1 && (
									<Text
										className="registration__passwordNote"
										labelType={LABEL_TYPES.NOTICE}
										text={translate(
											'registration.password.note'
										)}
										type="infoSmall"
									/>
								)}
								{resortData.requiredComponents
									? requiredComponents
									: null}
							</div>

							{/* ----------------------------- Voluntary Fields ---------------------------- */}
							{resortData.voluntaryComponents && (
								<div className="registration__voluntaryInformation">
									<div>
										<h2>
											{translate(
												'registration.voluntary.headline'
											)}
										</h2>
										<p>
											{translate(
												'registration.voluntary.subline'
											)}
										</p>
									</div>
									{voluntaryComponents}
								</div>
							)}

							{/* ----------------------------- Submit Section ---------------------------- */}
							<div className="registration__footer">
								<p className="registration__requiredInfoText formWrapper__infoText">
									{translate(
										'registration.required.infoText'
									)}
								</p>
							</div>
						</form>

						{/* ----------------------------- TO LOGIN BUTTON ---------------------------- */}
						<div className="registration__toLogin">
							<p className="registration__toLogin__text">
								{translate('registration.login.helper')}
							</p>
							<div className="registration__toLogin__button">
								<a href={config.urls.toLogin}>
									<Button
										item={{
											label: translate(
												'registration.login.label'
											),
											type: 'TERTIARY'
										}}
										isLink={true}
									/>
								</a>
							</div>
						</div>
						{overlayActive && (
							<OverlayWrapper>
								<Overlay
									item={overlayItemRegistrationSuccess}
									handleOverlay={handleOverlayAction}
								/>
							</OverlayWrapper>
						)}
					</>
				)}
			</div>
		</div>
	);
};
