import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { translate } from '../../utils/translate';
import { Button, BUTTON_TYPES } from '../button/Button';
import { CheckboxItem, Checkbox } from '../checkbox/Checkbox';
import { buttonItemSubmit } from './registrationHelpers';
import {
	apiPostRegistration,
	FETCH_ERRORS,
	apiAgencySelection,
	X_REASON
} from '../../api';
import { config } from '../../resources/scripts/config';
import { DEFAULT_POSTCODE } from './prefillPostcode';
import {
	OverlayWrapper,
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem
} from '../overlay/Overlay';
import { redirectToApp } from './autoLogin';
import { PreselectedAgency } from '../agencySelection/PreselectedAgency';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	ConsultingTypeInterface,
	LegalLinkInterface
} from '../../globalState';
import { FormAccordion } from '../formAccordion/FormAccordion';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/welcome.svg';
import { getUrlParameter } from '../../utils/getUrlParameter';
import './registrationForm.styles';
import {
	getErrorCaseForStatus,
	redirectToErrorPage
} from '../error/errorHandling';

interface RegistrationFormProps {
	consultingType?: ConsultingTypeInterface;
	agency?: AgencyDataInterface;
	consultant?: ConsultantDataInterface;
	legalLinks: Array<LegalLinkInterface>;
}

interface FormAccordionData {
	username?: string;
	password?: string;
	agencyId?: number;
	postcode?: string;
	state?: string;
	age?: string;
	consultingTypeId?: number;
}

export const RegistrationForm = ({
	consultingType,
	agency,
	legalLinks,
	consultant
}: RegistrationFormProps) => {
	const [formAccordionData, setFormAccordionData] =
		useState<FormAccordionData>({});
	const [formAccordionValid, setFormAccordionValid] = useState(false);
	const [preselectedAgencyData, setPreselectedAgencyData] =
		useState<AgencyDataInterface | null>(agency);
	const [isUsernameAlreadyInUse, setIsUsernameAlreadyInUse] =
		useState<boolean>(false);
	const [isDataProtectionSelected, setIsDataProtectionSelected] =
		useState(false);
	const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
	const [overlayActive, setOverlayActive] = useState(false);

	const [initialPostcode, setInitialPostcode] = useState('');

	useEffect(() => {
		const postcodeParameter = getUrlParameter('postcode');
		if (postcodeParameter) {
			setInitialPostcode(postcodeParameter);
		}

		if (consultingType) {
			setFormAccordionData({
				...formAccordionData,
				consultingTypeId: consultingType.id
			});
		}

		if (consultingType?.registration.autoSelectAgency) {
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
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!!(formAccordionValid && isDataProtectionSelected)) {
			setIsSubmitButtonDisabled(false);
		} else {
			setIsSubmitButtonDisabled(true);
		}
	}, [formAccordionValid, isDataProtectionSelected]);

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
						`<a target="_blank" href="${legalLink.url}">${legalLink.label}</a>`
				)
				.join(''),
			translate('registration.dataProtection.label.suffix')
		].join(' ')
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

	const handleSubmitButtonClick = () => {
		setIsUsernameAlreadyInUse(false);
		setIsSubmitButtonDisabled(true);

		const registrationData = {
			username: formAccordionData.username,
			password: encodeURIComponent(formAccordionData.password),
			agencyId: formAccordionData.agencyId?.toString(),
			postcode: formAccordionData.postcode,
			consultingType: formAccordionData.consultingTypeId?.toString(),
			termsAccepted: isDataProtectionSelected.toString(),
			...(formAccordionData.state && { state: formAccordionData.state }),
			...(formAccordionData.age && { age: formAccordionData.age }),
			...(consultant && { consultantId: consultant.consultantId })
		};

		apiPostRegistration(config.endpoints.registerAsker, registrationData)
			.then((res) => {
				return setOverlayActive(true);
			})
			.catch((errorRes) => {
				if (
					errorRes.status === 409 &&
					errorRes.headers?.get(FETCH_ERRORS.X_REASON) ===
						X_REASON.USERNAME_NOT_AVAILABLE
				) {
					setIsUsernameAlreadyInUse(true);
					setIsSubmitButtonDisabled(true);
					window.scrollTo({ top: 0 });
					return;
				}

				const error = getErrorCaseForStatus(errorRes.status);
				redirectToErrorPage(error);
			});
	};

	const handleChange = useCallback(
		(data) => {
			setFormAccordionData({
				...formAccordionData,
				...data
			});
		},
		[formAccordionData]
	);

	return (
		<>
			<form
				className="registrationForm"
				id="registrationForm"
				data-consultingtype={consultingType?.id}
			>
				<h3 className="registrationForm__overline">
					{consultingType
						? consultingType.titles.long
						: translate('registration.overline')}
				</h3>
				<h2 className="registrationForm__headline">
					{translate('registration.headline')}
				</h2>
				{consultant && (
					<p>{translate('registration.teaser.consultant')}</p>
				)}

				{(consultingType || consultant) && (
					<FormAccordion
						consultingType={consultingType}
						isUsernameAlreadyInUse={isUsernameAlreadyInUse}
						preselectedAgencyData={preselectedAgencyData}
						initialPostcode={initialPostcode}
						onChange={handleChange}
						additionalStepsData={consultingType?.requiredComponents}
						registrationNotes={consultingType?.registration.notes}
						consultant={consultant}
						onValidation={setFormAccordionValid}
					/>
				)}

				{preselectedAgencyData &&
					consultingType?.registration.autoSelectPostcode && (
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
