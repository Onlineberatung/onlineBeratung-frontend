import * as React from 'react';
import { useState, useEffect, useCallback, useContext } from 'react';
import { BUTTON_TYPES } from '../button/Button';
import {
	apiPostRegistration,
	FETCH_ERRORS,
	apiAgencySelection,
	X_REASON
} from '../../api';
import { endpoints } from '../../resources/scripts/endpoints';
import { DEFAULT_POSTCODE } from './prefillPostcode';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { redirectToApp } from './autoLogin';
import {
	AgencyDataInterface,
	LocaleContext,
	ConsultantDataInterface,
	ConsultingTypeInterface,
	TenantContext,
	useTenant
} from '../../globalState';
import { FormAccordion } from '../formAccordion/FormAccordion';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/welcome.svg';
import { getUrlParameter } from '../../utils/getUrlParameter';
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
import { isNumber } from '../../utils/isNumber';
import i18n from '../../i18n';

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
	const tenantData = useTenant();
	const legalLinks = useContext(LegalLinksContext);
	const { locale } = useContext(LocaleContext);
	const settings = useAppConfig();
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
	const topicsAreRequired =
		tenantData?.settings?.topicsInRegistrationEnabled &&
		tenantData?.settings?.featureTopicsEnabled;
	const { tenant } = useContext(TenantContext);
	const { featureToolsEnabled } = getTenantSettings();

	// Logout from budibase
	useEffect(() => {
		featureToolsEnabled && budibaseLogout();
	}, [featureToolsEnabled]);

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

		if (
			consultingType?.registration.autoSelectAgency &&
			!topicsAreRequired
		) {
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

	useEffect(() => {
		// When we require the topic to be selected and the autoSelectPostCode is enabled,
		// we need to request the api to get the preselected agency
		const shouldRequestAgencyWhenAutoSelectIsEnabled =
			consultingType?.registration.autoSelectPostcode &&
			!!topicsAreRequired &&
			!consultant &&
			!agency;

		if (
			shouldRequestAgencyWhenAutoSelectIsEnabled &&
			isNumber(`${formAccordionData.mainTopicId}`)
		) {
			apiAgencySelection({
				postcode: formAccordionData.postcode || DEFAULT_POSTCODE,
				consultingType: consultingType.id,
				topicId: formAccordionData.mainTopicId
			})
				.then((response) => {
					const agencyData = response[0];
					setPreselectedAgencyData(agencyData);
				})
				.catch(() => setPreselectedAgencyData(null));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		consultingType?.registration.autoSelectPostcode,
		consultingType?.id,
		formAccordionData.mainTopicId,
		formAccordionData.postcode,
		consultant,
		agency,
		topicsAreRequired,
		i18n.language
	]);

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
						preselectedAgencyData={preselectedAgencyData}
						initialPostcode={initialPostcode}
						onChange={handleChange}
						additionalStepsData={consultingType?.requiredComponents}
						registrationNotes={consultingType?.registration.notes}
						consultant={consultant}
						onValidation={setFormAccordionValid}
						mainTopicId={formAccordionData.mainTopicId}
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
