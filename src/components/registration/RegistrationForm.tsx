import * as React from 'react';
import { useState, useEffect, useCallback, useContext } from 'react';
import { BUTTON_TYPES } from '../button/Button';
import { apiPostRegistration, FETCH_ERRORS, X_REASON } from '../../api';
import { endpoints } from '../../resources/scripts/endpoints';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { redirectToApp } from './autoLogin';
import {
	NOTIFICATION_TYPE_ERROR,
	NotificationsContext,
	useLocaleData,
	useTenant
} from '../../globalState';
import {
	AgencyDataInterface,
	ConsultingTypeInterface,
	TopicsDataInterface
} from '../../globalState/interfaces';
import { FormAccordion } from '../formAccordion/FormAccordion';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/welcome.svg';
import './registrationForm.styles';
import {
	getErrorCaseForStatus,
	redirectToErrorPage
} from '../error/errorHandling';
import { useTranslation } from 'react-i18next';
import { LegalLinksContext } from '../../globalState/provider/LegalLinksProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import { getTenantSettings } from '../../utils/tenantSettingsHelper';
import { budibaseLogout } from '../budibase/budibaseLogout';
import { getUrlParameter } from '../../utils/getUrlParameter';
import { UrlParamsContext } from '../../globalState/provider/UrlParamsProvider';
import { ConsultingTypeRegistrationDefaults } from '../../containers/registration/components/ProposedAgencies/ProposedAgencies';
import { apiPostError, ERROR_LEVEL_ERROR } from '../../api/apiPostError';

export interface FormAccordionData {
	username?: string;
	password?: string;
	agency?: AgencyDataInterface;
	consultingType?: ConsultingTypeInterface;
	mainTopic?: TopicsDataInterface;
	postcode?: string;
	state?: string;
	age?: string;
}

export const RegistrationForm = () => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);
	const legalLinks = useContext(LegalLinksContext);
	const { addNotification } = useContext(NotificationsContext);
	const { locale } = useLocaleData();
	const settings = useAppConfig();
	const postcode = getUrlParameter('postcode');
	const { agency, consultingType, consultant, topic, slugFallback } =
		useContext(UrlParamsContext);

	const [formAccordionData, setFormAccordionData] =
		useState<FormAccordionData>(() => {
			const initData = {
				agency: agency || null,
				consultingType: consultingType || null,
				mainTopic: topic || null,
				postcode: postcode
			};

			const { autoSelectPostcode } =
				consultingType?.registration ||
				ConsultingTypeRegistrationDefaults;
			if (
				consultingType &&
				agency &&
				postcode === null &&
				autoSelectPostcode
			) {
				initData.postcode = agency.postcode;
			}

			return initData;
		});
	const [formAccordionValid, setFormAccordionValid] = useState(false);
	const [isUsernameAlreadyInUse, setIsUsernameAlreadyInUse] =
		useState<boolean>(false);
	const [isDataProtectionSelected, setIsDataProtectionSelected] =
		useState(false);
	const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
	const [overlayActive, setOverlayActive] = useState(false);
	const [missingFieldsErrorPosted, setMissingFieldsErrorPosted] = useState<
		string[]
	>([]);

	const tenant = useTenant();
	const { featureToolsEnabled } = getTenantSettings();

	// Logout from budibase
	useEffect(() => {
		featureToolsEnabled && budibaseLogout();
	}, [featureToolsEnabled]);

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

		const { autoSelectPostcode } =
			formAccordionData.consultingType?.registration ||
			ConsultingTypeRegistrationDefaults;

		const registrationData = {
			username: formAccordionData.username,
			password: encodeURIComponent(formAccordionData.password),
			postcode: formAccordionData.postcode,
			agencyId: formAccordionData?.agency.id.toString(),
			termsAccepted: isDataProtectionSelected.toString(),
			consultingType: formAccordionData.consultingType?.id?.toString(),
			mainTopicId: formAccordionData.mainTopic?.id?.toString(),
			preferredLanguage: locale,
			...(formAccordionData.state && { state: formAccordionData.state }),
			...(formAccordionData.age && { age: formAccordionData.age }),
			...(consultant && { consultantId: consultant.consultantId }),
			...(slugFallback && {
				consultingType:
					formAccordionData.agency.consultingTypeRel?.id?.toString(),
				postcode: autoSelectPostcode
					? formAccordionData.agency.postcode
					: formAccordionData.postcode
			})
		};

		const missingFields = [
			'username',
			'password',
			'postcode',
			'agencyId',
			'termsAccepted',
			'consultingType'
		].filter(
			(required) =>
				!registrationData[required] || registrationData[required] === ''
		);
		if (missingFields.length > 0) {
			addNotification({
				notificationType: NOTIFICATION_TYPE_ERROR,
				title: translate(
					'registration.error.required_field_missing.title'
				),
				text: translate(
					'registration.error.required_field_missing.text'
				)
			});

			// prevent sending error multiple times with the same fields.
			if (
				missingFields
					.filter((x) => !missingFieldsErrorPosted.includes(x))
					.concat(
						missingFieldsErrorPosted.filter(
							(x) => !missingFields.includes(x)
						)
					).length > 0
			) {
				const { agencyId, consultingType } = registrationData;
				void apiPostError(
					{
						name: `REGISTRATION_MISSING_FIELDS`,
						message: `User got error while trying to register (consultingTypeId: "${consultingType}", agencyId: "${agencyId}") because there where some fields (${missingFields.join(
							', '
						)}) missing.`,
						level: ERROR_LEVEL_ERROR
					},
					null
				);
			}

			setMissingFieldsErrorPosted(missingFields);
			setIsSubmitButtonDisabled(false);
			return;
		}

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
		(data: Partial<FormAccordionData>) => {
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
									`consultingType.fallback.titles.long`,
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
						formAccordionData={formAccordionData}
						isUsernameAlreadyInUse={isUsernameAlreadyInUse}
						onChange={handleChange}
						additionalStepsData={consultingType?.requiredComponents}
						registrationNotes={consultingType?.registration.notes}
						onValidation={setFormAccordionValid}
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
