import { Typography, Link, Button, Box } from '@mui/material';
import * as React from 'react';
import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import {
	Route,
	Switch,
	useHistory,
	useLocation,
	useParams,
	useRouteMatch,
	generatePath,
	Link as RouterLink
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

import { StageLayout } from '../../../components/stageLayout/StageLayout';
import useIsFirstVisit from '../../../utils/useIsFirstVisit';
import { ReactComponent as HelloBannerIcon } from '../../../resources/img/illustrations/hello-banner.svg';
import { StepBar } from './stepBar/StepBar';
import { WelcomeScreen } from './welcomeScreen/WelcomeScreen';
import {
	RegistrationContext,
	TenantContext,
	registrationSessionStorageKey,
	RegistrationData
} from '../../../globalState';
import { GlobalComponentContext } from '../../../globalState/provider/GlobalComponentContext';
import {
	OVERLAY_FUNCTIONS,
	Overlay,
	OverlayItem
} from '../../../components/overlay/Overlay';
import { redirectToApp } from '../../../components/registration/autoLogin';
import { BUTTON_TYPES } from '../../../components/button/Button';
import { PreselectionBox } from './preselectionBox/PreselectionBox';
import { endpoints } from '../../../resources/scripts/endpoints';
import { apiPostRegistration } from '../../../api';
import { useAppConfig } from '../../../hooks/useAppConfig';
import { REGISTRATION_DATA_VALIDATION } from './registrationDataValidation';
import { UrlParamsContext } from '../../../globalState/provider/UrlParamsProvider';

/**
 * This type of registration is currently not supporting:
 * - autoSelectPostcode because its loaded over the consultingType and
 *
 * MultiTenancy:
 * Each consultingType in mongodb has stored the tenant id (One to One Relation) -> Tenant URL could load by consultingType by tenant alternative only one consultingType exits
 * MultiTenancyWithSingleDomain:
 * Each consultintType in mongodb has stored the tenant id but this relation could not be loaded because no idea which consultingType settings to load before agency is selected
 * For Diakonie there is no consultingType tenant relation and every tenant could have different consultingType depending on agency. So before agency is selected no idea which consultingType settings to load before agency is selected
 * @constructor
 */

export const Registration = () => {
	const { t } = useTranslation(['common', 'consultingTypes', 'agencies']);
	const settings = useAppConfig();
	const isFirstVisit = useIsFirstVisit();
	const location = useLocation();
	const history = useHistory();
	const { path } = useRouteMatch();
	const { step, topicSlug } = useParams<{
		step: string;
		topicSlug: string;
	}>();

	const { Stage } = useContext(GlobalComponentContext);
	const {
		disabledNextButton,
		updateRegistrationData,
		registrationData,
		availableSteps
	} = useContext(RegistrationContext);
	const { consultant: preselectedConsultant } = useContext(UrlParamsContext);
	const { tenant } = useContext(TenantContext);

	const [stepData, setStepData] = useState<Partial<RegistrationData>>({});
	const [redirectOverlayActive, setRedirectOverlayActive] =
		useState<boolean>(false);

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT_WITH_BLUR) {
			redirectToApp();
		}
	};
	const overlayItemRegistrationSuccess: OverlayItem = {
		illustrationStyle: 'large',
		svg: HelloBannerIcon,
		headline: t('registration.overlay.success.headline'),
		copy: t('registration.overlay.success.copy'),
		buttonSet: [
			{
				label: t('registration.overlay.success.button'),
				function: OVERLAY_FUNCTIONS.REDIRECT_WITH_BLUR,
				type: BUTTON_TYPES.AUTO_CLOSE
			}
		]
	};

	const checkForStepsWithMissingMandatoryFields =
		useCallback((): number[] => {
			return availableSteps.reduce<number[]>(
				(missingSteps, step, currentIndex) => {
					if (
						step?.mandatoryFields?.some(
							(mandatoryField) =>
								registrationData?.[mandatoryField] === undefined
						)
					) {
						return [...missingSteps, currentIndex];
					}
					return missingSteps;
				},
				[]
			);
		}, [availableSteps, registrationData]);

	const onNextClick = useCallback(() => {
		updateRegistrationData(stepData);
		setStepData({});
	}, [updateRegistrationData, stepData]);

	const currStepIndex = useMemo(
		() => availableSteps.findIndex(({ name }) => name === step),
		[availableSteps, step]
	);

	useEffect(() => {
		// Check if mandatory fields from previous steps are missing
		const missingPreviousSteps = checkForStepsWithMissingMandatoryFields()
			.sort()
			.filter((missingStep) => missingStep < currStepIndex);

		if (missingPreviousSteps.length > 0) {
			history.push(
				`${generatePath(path, { topicSlug, step: availableSteps[missingPreviousSteps[0]]?.name })}${location.search}`
			);
		}
	}, [
		availableSteps,
		checkForStepsWithMissingMandatoryFields,
		history,
		location.search,
		currStepIndex,
		path,
		topicSlug
	]);

	const onRegisterClick = useCallback(() => {
		const data = {
			...registrationData,
			...stepData,
			agencyId: registrationData.agency.id.toString(),
			postcode: registrationData.zipcode,
			termsAccepted: 'true',
			preferredLanguage: 'de',
			consultingType: registrationData.agency.consultingType,
			...(preselectedConsultant
				? { consultantId: preselectedConsultant?.consultantId }
				: {})
		};

		if (
			Object.keys(REGISTRATION_DATA_VALIDATION).every((item) =>
				REGISTRATION_DATA_VALIDATION[item].validation(data[item])
			)
		) {
			apiPostRegistration(
				endpoints.registerAsker,
				data,
				settings.multitenancyWithSingleDomainEnabled,
				tenant
			).then(() => {
				sessionStorage.removeItem(registrationSessionStorageKey);
				setRedirectOverlayActive(true);
			});
		}
	}, [
		registrationData,
		stepData,
		preselectedConsultant,
		settings.multitenancyWithSingleDomainEnabled,
		tenant
	]);

	const [prevStepUrl, nextStepUrl] = useMemo(
		() => [
			availableSteps[currStepIndex - 1]
				? `${generatePath(path, { topicSlug, step: availableSteps[currStepIndex - 1]?.name || 'welcome' })}${location.search}`
				: null,
			availableSteps[currStepIndex + 1]
				? `${generatePath(path, { topicSlug, step: availableSteps[currStepIndex + 1]?.name || 'welcome' })}${location.search}`
				: null
		],
		[availableSteps, currStepIndex, path, topicSlug, location.search]
	);

	const stepPaths = useMemo(
		() =>
			availableSteps.reduce(
				(acc, { name }) =>
					acc.concat(generatePath(path, { topicSlug, step: name })),
				[]
			),
		[availableSteps, path, topicSlug]
	);

	return (
		<>
			<StageLayout
				showLegalLinks={false}
				showLoginLink={true}
				stage={<Stage hasAnimation={isFirstVisit} />}
				showRegistrationInfoDrawer={true}
			>
				<Box
					sx={{
						pb: '96px',
						maxWidth: '560px !important',
						width: '100%'
					}}
				>
					<Switch>
						<Route path={stepPaths}>
							<Helmet>
								<meta name="robots" content="noindex"></meta>
							</Helmet>
							<form
								data-cy="registration-form"
								data-cy-step={step}
								data-cy-steps={availableSteps
									.map(({ name }) => name)
									.join(',')}
							>
								<Typography
									sx={{ mb: '24px' }}
									component="h1"
									variant="h2"
								>
									{t('registration.headline')}
								</Typography>

								<PreselectionBox hasDrawer={false} />
								<StepBar
									maxNumberOfSteps={availableSteps.length}
									currentStep={currStepIndex + 1}
								/>

								<Switch>
									{availableSteps.map(
										({ name, component: Component }) => (
											<Route
												path={generatePath(path, {
													topicSlug,
													step: name
												})}
												key={name}
											>
												<Component
													onChange={setStepData}
													onNextClick={onNextClick}
													nextStepUrl={nextStepUrl}
												/>
											</Route>
										)
									)}
								</Switch>
								<Box
									sx={{
										height: '96px',
										position: 'fixed',
										bottom: '0',
										right: '0',
										px: {
											xs: '16px',
											md: 'calc((100vw - 550px) / 2)',
											lg: '0'
										},
										width: { xs: '100vw', lg: '60vw' },
										backgroundColor: 'white',
										borderTop: '1px solid #c6c5c4',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										zIndex: 1
									}}
								>
									<Box
										sx={{
											maxWidth: {
												xs: '600px',
												lg: '700px'
											},
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											width: {
												xs: '100%',
												lg: 'calc(60vw - 300px)'
											}
										}}
									>
										<Link
											sx={{
												textDecoration: 'none',
												color: 'info.light'
											}}
											component={RouterLink}
											to={prevStepUrl}
										>
											{t('registration.back')}
										</Link>

										{!nextStepUrl ? (
											<Button
												disabled={disabledNextButton}
												variant="contained"
												onClick={onRegisterClick}
												data-cy="button-register"
											>
												{t('registration.register')}
											</Button>
										) : (
											<Button
												data-cy="button-next"
												disabled={disabledNextButton}
												variant="contained"
												onClick={onNextClick}
												sx={{ width: 'unset' }}
												component={RouterLink}
												to={nextStepUrl}
											>
												{t('registration.next')}
											</Button>
										)}
									</Box>
								</Box>
							</form>
						</Route>
						<Route>
							<WelcomeScreen nextStepUrl={nextStepUrl} />
						</Route>
					</Switch>
				</Box>
			</StageLayout>
			{redirectOverlayActive && (
				<Overlay
					item={overlayItemRegistrationSuccess}
					handleOverlay={handleOverlayAction}
				/>
			)}
		</>
	);
};
