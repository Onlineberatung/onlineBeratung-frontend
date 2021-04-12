import * as React from 'react';
import { useState, useEffect } from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { Button, BUTTON_TYPES } from '../button/Button';
import { CheckboxItem, Checkbox } from '../checkbox/Checkbox';
import { buttonItemSubmit } from './registrationHelpers';
import {
	apiPostRegistration,
	FETCH_ERRORS,
	apiAgencySelection,
	apiGetAgencyById
} from '../../api';
import { config } from '../../resources/scripts/config';
import { setTokenInCookie } from '../sessionCookie/accessSessionCookie';
import {
	DEFAULT_POSTCODE,
	redirectToRegistrationWithoutAid
} from './prefillPostcode';
import {
	OverlayWrapper,
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem
} from '../overlay/Overlay';
import { redirectToApp } from './autoLogin';
import { isNumber } from '../../resources/scripts/helpers/isNumber';
import {
	autoselectAgencyForConsultingType,
	autoselectPostcodeForConsultingType
} from '../agencySelection/agencySelectionHelpers';
import { PreselectedAgency } from '../agencySelection/PreselectedAgency';
import { AgencyDataInterface, ResortDataInterface } from '../../globalState';
import { FormAccordion } from '../formAccordion/FormAccordion';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/willkommen.svg';
import { LegalInformationLinks } from '../login/LegalInformationLinks';
import { getUrlParameter } from '../../resources/scripts/helpers/getUrlParameter';
import './registrationForm.styles';

interface RegistrationFormProps {
	registrationData: ResortDataInterface;
}

interface FormAccordionData {
	username: string;
	password: string;
	agencyId: string;
	postcode: string;
	state?: string;
	age?: string;
}

export const RegistrationForm = ({
	registrationData
}: RegistrationFormProps) => {
	const [formAccordionData, setFormAccordionData] = useState<
		FormAccordionData
	>();
	const [
		preselectedAgencyData,
		setPreselectedAgencyData
	] = useState<AgencyDataInterface | null>(null);
	const [isUsernameAlreadyInUse, setIsUsernameAlreadyInUse] = useState<
		boolean
	>(false);
	const [isDataProtectionSelected, setIsDataProtectionSelected] = useState(
		false
	);
	const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
	const consultingType = registrationData.consultingType;
	const [overlayActive, setOverlayActive] = useState(false);

	// SET FORMAL/INFORMAL COOKIE
	setTokenInCookie('useInformal', registrationData.useInformal ? '1' : '');

	const prefillPostcode = () => {
		const agencyId = isNumber(getUrlParameter('aid'))
			? getUrlParameter('aid')
			: null;

		if (agencyId) {
			getAgencyDataById(agencyId);
		}

		if (autoselectAgencyForConsultingType(consultingType)) {
			apiAgencySelection({
				postcode: DEFAULT_POSTCODE,
				consultingType: consultingType
			})
				.then((response) => {
					const agencyData = response[0];
					setPreselectedAgencyData(agencyData);
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
					? setPreselectedAgencyData(agencyData)
					: redirectToRegistrationWithoutAid();
			})
			.catch((error) => {
				if (error.message === FETCH_ERRORS.NO_MATCH) {
					redirectToRegistrationWithoutAid();
				}
			});
	};

	useEffect(() => {
		prefillPostcode();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!!(formAccordionData && isDataProtectionSelected)) {
			setIsSubmitButtonDisabled(false);
		} else {
			setIsSubmitButtonDisabled(true);
		}
	}, [formAccordionData, isDataProtectionSelected]);

	const checkboxItemDataProtection: CheckboxItem = {
		inputId: 'dataProtectionCheckbox',
		name: 'dataProtectionCheckbox',
		labelId: 'dataProtectionLabel',
		label: translate('registration.dataProtection.label'),
		checked: isDataProtectionSelected
	};

	const overlayItemRegistrationSuccess: OverlayItem = {
		svg: WelcomeIcon,
		headline: translate('registration.overlay.success.headline'),
		copy: translate('registration.overlay.success.copy'),
		buttonSet: [
			{
				label: translate('registration.overlay.success.button'),
				function: OVERLAY_FUNCTIONS.REDIRECT_WITH_BLUR,
				type: BUTTON_TYPES.PRIMARY
			}
		]
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

		const registrationData = {
			username: formAccordionData.username,
			password: encodeURIComponent(formAccordionData.password),
			agencyId: formAccordionData.agencyId,
			postcode: formAccordionData.postcode,
			consultingType: consultingType?.toString(),
			termsAccepted: isDataProtectionSelected.toString(),
			...(formAccordionData.state && { state: formAccordionData.state }),
			...(formAccordionData.age && { age: formAccordionData.age })
		};

		apiPostRegistration(
			config.endpoints.registerAsker,
			registrationData,
			() => setOverlayActive(true),
			(response) => handleRegistrationError(response)
		);
	};

	return (
		<>
			<form
				className="registrationForm"
				id="registrationForm"
				data-consultingtype={consultingType}
			>
				<h3 className="registrationForm__overline">
					{registrationData.overline}
				</h3>
				<h2 className="registrationForm__headline">
					{translate('registration.headline')}
				</h2>

				<FormAccordion
					consultingType={consultingType}
					isUsernameAlreadyInUse={isUsernameAlreadyInUse}
					preselectedAgencyData={preselectedAgencyData}
					handleFormAccordionData={(formData) =>
						setFormAccordionData(formData)
					}
					additionalStepsData={registrationData.requiredComponents}
				></FormAccordion>

				{preselectedAgencyData &&
					autoselectPostcodeForConsultingType(consultingType) && (
						<PreselectedAgency
							prefix={translate(
								'registration.agency.preselected.prefix'
							)}
							agencyData={preselectedAgencyData}
						/>
					)}

				<div className="registrationForm__dataProtection">
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
					className="registrationForm__submit"
					item={buttonItemSubmit}
					buttonHandle={handleSubmitButtonClick}
					disabled={isSubmitButtonDisabled}
				/>
			</form>

			{/* ----------------------------- LEGAL INFORMATION ---------------------------- */}
			<LegalInformationLinks />

			{/* ----------------------------- TO LOGIN BUTTON ---------------------------- */}
			<div className="registrationForm__toLogin">
				<p className="registrationForm__toLogin__text">
					{translate('registration.login.helper')}
				</p>
				<div className="registrationForm__toLogin__button">
					<a href={config.urls.toLogin}>
						<Button
							item={{
								label: translate('registration.login.label'),
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
	);
};
