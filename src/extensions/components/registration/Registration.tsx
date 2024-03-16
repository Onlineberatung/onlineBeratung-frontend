import { Typography, Link, Button, Box } from '@mui/material';
import * as React from 'react';
import { useState, useEffect, useContext, useCallback } from 'react';
import { StageLayout } from '../../../components/stageLayout/StageLayout';
import useIsFirstVisit from '../../../utils/useIsFirstVisit';
import { ReactComponent as HelloBannerIcon } from '../../../resources/img/illustrations/hello-banner.svg';
import { StepBar } from './stepBar/StepBar';
import { AccountData } from './accountData/AccountData';
import { ZipcodeInput } from './zipcodeInput/ZipcodeInput';
import { AgencySelection } from './agencySelection/AgencySelection';
import { TopicSelection } from './topicSelection/TopicSelection';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { WelcomeScreen } from './welcomeScreen/WelcomeScreen';
import {
	RegistrationContext,
	TenantContext,
	registrationSessionStorageKey
} from '../../../globalState';
import { Helmet } from 'react-helmet';
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

export const Registration = () => {
	const { t } = useTranslation(['common', 'consultingTypes', 'agencies']);
	const settings = useAppConfig();
	const isFirstVisit = useIsFirstVisit();
	const { Stage } = useContext(GlobalComponentContext);
	const {
		disabledNextButton,
		setDisabledNextButton,
		updateSessionStorageWithPreppedData,
		refreshSessionStorageRegistrationData,
		sessionStorageRegistrationData,
		availableSteps,
		dataPrepForSessionStorage,
		consultant,
		isConsultantLink
	} = useContext(RegistrationContext);
	const { tenant } = useContext(TenantContext);
	const [currentStep, setCurrentStep] = useState<number>(1);
	const [redirectOverlayActive, setRedirectOverlayActive] =
		useState<boolean>(false);
	const location = useLocation();
	const history = useHistory();
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

	const updateCurrentStep = () => {
		const currentLocation = location?.pathname?.replace(
			'/registration',
			''
		);
		const step = availableSteps.findIndex(
			(step) => step?.urlSuffix === currentLocation
		);
		setCurrentStep(step === -1 ? 0 : step);
	};

	const checkForStepsWithMissingMandatoryFields = (): number[] => {
		if (currentStep > 0) {
			return availableSteps.reduce<number[]>(
				(missingSteps, step, currentIndex) => {
					if (
						step?.mandatoryFields?.some(
							(mandatoryField) =>
								sessionStorageRegistrationData?.[
									mandatoryField
								] === undefined
						)
					) {
						return [...missingSteps, currentIndex];
					}
					return missingSteps;
				},
				[]
			);
		}
		return [];
	};

	const onNextClick = () => {
		updateSessionStorageWithPreppedData();
	};

	useEffect(() => {
		setDisabledNextButton(true);
		updateCurrentStep();
		refreshSessionStorageRegistrationData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	useEffect(() => {
		// Check if mandatory fields from previous steps are missing
		const missingPreviousSteps = checkForStepsWithMissingMandatoryFields()
			.sort()
			.filter((missingStep) => missingStep < currentStep);

		if (missingPreviousSteps.length > 0) {
			history.push(
				`/registration${
					availableSteps[missingPreviousSteps[0]]?.urlSuffix
				}${location.search}`
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentStep, availableSteps, sessionStorageRegistrationData]);

	const onRegisterClick = useCallback(() => {
		const registrationData = {
			...sessionStorageRegistrationData,
			...dataPrepForSessionStorage,
			agencyId: sessionStorageRegistrationData.agencyId.toString(),
			postcode: sessionStorageRegistrationData.zipcode,
			termsAccepted: 'true',
			preferredLanguage: 'de',
			// ConsultingType and mainTopicId are identical for the MVP
			consultingType: sessionStorageRegistrationData.mainTopicId,
			...(isConsultantLink
				? { consultantId: consultant?.consultantId }
				: {})
		};

		if (
			Object.keys(REGISTRATION_DATA_VALIDATION).every((item) =>
				REGISTRATION_DATA_VALIDATION[item].validation(
					registrationData[item]
				)
			)
		) {
			apiPostRegistration(
				endpoints.registerAsker,
				registrationData,
				settings.multitenancyWithSingleDomainEnabled,
				tenant
			).then(() => {
				sessionStorage.removeItem(registrationSessionStorageKey);
				setRedirectOverlayActive(true);
			});
		}
	}, [
		consultant?.consultantId,
		dataPrepForSessionStorage,
		isConsultantLink,
		sessionStorageRegistrationData,
		settings.multitenancyWithSingleDomainEnabled,
		tenant
	]);

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
					{availableSteps[currentStep]?.component === 'welcome' ? (
						<WelcomeScreen
							nextStepUrl={`/registration${
								availableSteps[currentStep + 1]?.urlSuffix
							}`}
						/>
					) : (
						<>
							<Helmet>
								<meta name="robots" content="noindex"></meta>
							</Helmet>
							<form>
								<Typography
									sx={{ mb: '24px' }}
									component="h1"
									variant="h2"
								>
									{t('registration.headline')}
								</Typography>

								{<PreselectionBox hasDrawer={false} />}
								<StepBar
									maxNumberOfSteps={availableSteps.length - 1}
									currentStep={currentStep}
								/>

								{availableSteps[currentStep]?.component ===
									'topicSelection' && (
									<TopicSelection
										onNextClick={onNextClick}
										nextStepUrl={`/registration${
											availableSteps[currentStep + 1]
												?.urlSuffix
										}`}
									/>
								)}
								{availableSteps[currentStep]?.component ===
									'zipcode' && <ZipcodeInput />}
								{availableSteps[currentStep]?.component ===
									'agencySelection' && (
									<AgencySelection
										onNextClick={onNextClick}
										nextStepUrl={`/registration${
											availableSteps[currentStep + 1]
												?.urlSuffix
										}`}
									/>
								)}
								{availableSteps[currentStep]?.component ===
									'accountData' && <AccountData />}

								{availableSteps[currentStep]?.component !==
									'welcome' && (
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
											{currentStep > 0 && (
												<Link
													sx={{
														textDecoration: 'none',
														color: 'info.light'
													}}
													component={RouterLink}
													to={`/registration${
														availableSteps[
															currentStep - 1
														]?.urlSuffix
													}${location.search}`}
												>
													{t('registration.back')}
												</Link>
											)}
											{currentStep ===
											availableSteps.length - 1 ? (
												<Button
													disabled={
														disabledNextButton
													}
													variant="contained"
													onClick={onRegisterClick}
												>
													{t('registration.register')}
												</Button>
											) : (
												<Button
													disabled={
														disabledNextButton
													}
													variant="contained"
													onClick={onNextClick}
													sx={{ width: 'unset' }}
													component={RouterLink}
													to={`/registration${
														availableSteps[
															currentStep + 1
														]?.urlSuffix
													}${location.search}`}
												>
													{t('registration.next')}
												</Button>
											)}
										</Box>
									</Box>
								)}
							</form>
						</>
					)}
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
