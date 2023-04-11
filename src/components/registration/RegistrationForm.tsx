import * as React from 'react';
import { useState, useEffect, useCallback, useContext } from 'react';
import { BUTTON_TYPES } from '../button/Button';
import { apiPostRegistration, FETCH_ERRORS, X_REASON } from '../../api';
import { endpoints } from '../../resources/scripts/endpoints';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { redirectToApp } from './autoLogin';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	ConsultingTypeInterface,
	TenantContext,
	useLocaleData
} from '../../globalState';
import { FormAccordion } from '../formAccordion/FormAccordion';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/welcome.svg';
import './registrationForm.styles';
import {
	getErrorCaseForStatus,
	redirectToErrorPage
} from '../error/errorHandling';
import { useTranslation } from 'react-i18next';
import { TopicsDataInterface } from '../../globalState/interfaces/TopicsDataInterface';
import { LegalLinksContext } from '../../globalState/provider/LegalLinksProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import { getTenantSettings } from '../../utils/tenantSettingsHelper';
import { budibaseLogout } from '../budibase/budibaseLogout';

interface RegistrationFormProps {
	consultingType?: ConsultingTypeInterface;
	agency?: AgencyDataInterface;
	consultant?: ConsultantDataInterface;
	topic?: TopicsDataInterface;
}

interface FormAccordionData {
	username?: string;
	password?: string;
	agencyId?: number;
	mainTopicId?: number;
	postcode?: string;
	state?: string;
	age?: string;
	consultingTypeId?: number;
	mainTopic?: string;
}

export const RegistrationForm = ({
	consultingType,
	agency,
	topic,
	consultant
}: RegistrationFormProps) => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);
	const legalLinks = useContext(LegalLinksContext);
	const { locale } = useLocaleData();
	const settings = useAppConfig();
	const [formAccordionData, setFormAccordionData] =
		useState<FormAccordionData>({});
	const [formAccordionValid, setFormAccordionValid] = useState(false);
	const [isUsernameAlreadyInUse, setIsUsernameAlreadyInUse] =
		useState<boolean>(false);
	const [isDataProtectionSelected, setIsDataProtectionSelected] =
		useState(false);
	const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
	const [overlayActive, setOverlayActive] = useState(false);

	const { tenant } = useContext(TenantContext);
	const { featureToolsEnabled } = getTenantSettings();

	// Logout from budibase
	useEffect(() => {
		featureToolsEnabled && budibaseLogout();
	}, [featureToolsEnabled]);

	useEffect(() => {
		if (consultingType) {
			setFormAccordionData({
				...formAccordionData,
				consultingTypeId: consultingType.id
			});
		}
	}, [consultingType]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		setIsSubmitButtonDisabled(
			!(formAccordionValid && isDataProtectionSelected)
		);
	}, [formAccordionValid, isDataProtectionSelected]);

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
			mainTopicId: formAccordionData.mainTopicId?.toString(),
			postcode: formAccordionData.postcode,
			consultingType: formAccordionData.consultingTypeId?.toString(),
			termsAccepted: isDataProtectionSelected.toString(),
			preferredLanguage: locale,
			...(formAccordionData.state && { state: formAccordionData.state }),
			...(formAccordionData.age && { age: formAccordionData.age }),
			...(consultant && { consultantId: consultant.consultantId })
		};

		apiPostRegistration(
			endpoints.registerAsker,
			registrationData,
			settings.multitenancyWithSingleDomainEnabled,
			tenant
		)
			.then(() => setOverlayActive(true))
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
						? translate(
								[
									`consultingType.${consultingType.id}.titles.long`,
									consultingType.titles.long
								],
								{ ns: 'consultingTypes' }
						  )
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
						preselectedAgencyData={agency}
						onChange={handleChange}
						additionalStepsData={consultingType?.requiredComponents}
						registrationNotes={consultingType?.registration.notes}
						consultant={consultant}
						onValidation={setFormAccordionValid}
						mainTopicId={topic?.id || formAccordionData.mainTopicId}
						preselectedTopic={topic?.id}
						legalLinks={legalLinks}
						handleSubmitButtonClick={handleSubmitButtonClick}
						isSubmitButtonDisabled={isSubmitButtonDisabled}
						setIsDataProtectionSelected={
							setIsDataProtectionSelected
						}
						isDataProtectionSelected={isDataProtectionSelected}
					/>
				)}
			</form>

			{overlayActive && (
				<Overlay
					item={overlayItemRegistrationSuccess}
					handleOverlay={handleOverlayAction}
				/>
			)}
		</>
	);
};
