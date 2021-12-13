import * as React from 'react';
import { useState, useEffect } from 'react';
import { translate } from '../../utils/translate';
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
import { isNumber } from '../../utils/isNumber';
import { PreselectedAgency } from '../agencySelection/PreselectedAgency';
import {
	AgencyDataInterface,
	ConsultingTypeInterface
} from '../../globalState';
import { FormAccordion } from '../formAccordion/FormAccordion';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/willkommen.svg';
import { getUrlParameter } from '../../utils/getUrlParameter';
import './registrationForm.styles';

interface RegistrationFormProps {
	consultingType: ConsultingTypeInterface;
}

interface FormAccordionData {
	username: string;
	password: string;
	agencyId: string;
	postcode: string;
	state?: string;
	age?: string;
}

export const RegistrationForm = ({ consultingType }: RegistrationFormProps) => {
	const [formAccordionData, setFormAccordionData] =
		useState<FormAccordionData>();
	const [preselectedAgencyData, setPreselectedAgencyData] =
		useState<AgencyDataInterface | null>(null);
	const [isUsernameAlreadyInUse, setIsUsernameAlreadyInUse] =
		useState<boolean>(false);
	const [isDataProtectionSelected, setIsDataProtectionSelected] =
		useState(false);
	const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
	const [overlayActive, setOverlayActive] = useState(false);
	const [initialPostcode, setInitialPostcode] = useState('');

	const prefillPostcode = () => {
		const postcodeParameter = getUrlParameter('postcode');
		const aidParameter = getUrlParameter('aid');
		const agencyId = isNumber(aidParameter) ? aidParameter : null;

		if (agencyId) {
			getAgencyDataById(agencyId);
		}

		if (postcodeParameter) {
			setInitialPostcode(postcodeParameter);
		}

		if (consultingType.registration.autoSelectAgency) {
			apiAgencySelection({
				postcode: postcodeParameter || DEFAULT_POSTCODE,
				consultingType: consultingType.id
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
				agencyData.consultingType === consultingType.id
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
			consultingType: consultingType.id.toString(),
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
				data-consultingtype={consultingType.id}
			>
				<h3 className="registrationForm__overline">
					{consultingType.titles.long}
				</h3>
				<h2 className="registrationForm__headline">
					{translate('registration.headline')}
				</h2>

				<FormAccordion
					consultingType={consultingType}
					isUsernameAlreadyInUse={isUsernameAlreadyInUse}
					preselectedAgencyData={preselectedAgencyData}
					initialPostcode={initialPostcode}
					handleFormAccordionData={(formData) =>
						setFormAccordionData(formData)
					}
					additionalStepsData={consultingType.requiredComponents}
					registrationNotes={consultingType.registration.notes}
				/>

				{preselectedAgencyData &&
					consultingType.registration.autoSelectPostcode && (
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
