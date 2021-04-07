import '../../polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage } from '../stage/stage';
import { useEffect, useState } from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { Button, BUTTON_TYPES } from '../button/Button';
import registrationResortsData from './registrationData';
import { CheckboxItem, Checkbox } from '../checkbox/Checkbox';
import { buttonItemSubmit, ResortData } from './registrationHelpers';
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
	redirectToHelpmail,
	redirectToRegistrationWithoutAid
} from './prefillPostcode';
import { getUrlParameter } from '../../resources/scripts/helpers/getUrlParameter';
import {
	getConsultingTypeFromRegistration,
	isU25Registration
} from '../../resources/scripts/helpers/resorts';
import {
	OverlayWrapper,
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem
} from '../overlay/Overlay';
import { redirectToApp } from './autoLogin';
import { isNumber } from '../../resources/scripts/helpers/isNumber';
import '../../resources/styles/styles';
import './registration.styles';
import {
	autoselectAgencyForConsultingType,
	autoselectPostcodeForConsultingType
} from '../agencySelection/agencySelectionHelpers';
import { PreselectedAgency } from '../agencySelection/PreselectedAgency';
import { AgencyDataInterface } from '../../globalState';
import { FormAccordion } from '../formAccordion/FormAccordion';
import { WelcomeScreen } from './WelcomeScreen';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/willkommen.svg';

export const initRegistration = () => {
	ReactDOM.render(
		<Registration />,
		document.getElementById('registrationRoot')
	);
};

interface FormAccordionData {
	username: string;
	password: string;
	agencyId: string;
	postcode: string;
	state?: string;
	age?: string;
}

const Registration = () => {
	const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);
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
		<div className="registration">
			<Stage hasAnimation={true}></Stage>

			<div className="registration__content">
				{showWelcomeScreen ? (
					<WelcomeScreen
						resortTitle={resortData.welcomeTitle}
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
								preselectedAgencyData={preselectedAgencyData}
								handleFormAccordionData={(formData) =>
									setFormAccordionData(formData)
								}
								additionalStepsData={
									resortData.requiredComponents
								}
							></FormAccordion>

							{preselectedAgencyData &&
								autoselectPostcodeForConsultingType(
									consultingType
								) && (
									<PreselectedAgency
										prefix={translate(
											'registration.agency.preselected.prefix'
										)}
										agencyData={preselectedAgencyData}
									/>
								)}

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
