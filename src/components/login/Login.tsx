import '../../polyfill';
import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import {
	InputField,
	InputFieldItem,
	InputFieldLabelState
} from '../inputField/InputField';
import { endpoints } from '../../resources/scripts/endpoints';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import { autoLogin, redirectToApp } from '../registration/autoLogin';
import { Text } from '../text/Text';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import { ReactComponent as LockIcon } from '../../resources/img/icons/lock.svg';
import { ReactComponent as VerifiedIcon } from '../../resources/img/icons/verified.svg';
import { StageLayout } from '../stageLayout/StageLayout';
import {
	apiGetUserData,
	apiRegistrationNewConsultingTypes,
	FETCH_ERRORS
} from '../../api';
import { OTP_LENGTH, TWO_FACTOR_TYPES } from '../twoFactorAuth/TwoFactorAuth';
import clsx from 'clsx';
import {
	AUTHORITIES,
	hasUserAuthority,
	LocaleContext,
	RocketChatGlobalSettingsContext,
	TenantContext,
	UserDataContext,
	UserDataInterface
} from '../../globalState';
import '../../resources/styles/styles';
import './login.styles';
import useIsFirstVisit from '../../utils/useIsFirstVisit';
import { getUrlParameter } from '../../utils/getUrlParameter';
import { ConsultingTypeAgencySelection } from '../consultingTypeSelection/ConsultingTypeAgencySelection';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { ReactComponent as WelcomeIcon } from '../../resources/img/illustrations/welcome.svg';
import {
	VALIDITY_INITIAL,
	VALIDITY_INVALID,
	VALIDITY_VALID
} from '../registration/registrationHelpers';
import { TwoFactorAuthResendMail } from '../twoFactorAuth/TwoFactorAuthResendMail';
import {
	IBooleanSetting,
	SETTING_E2E_ENABLE
} from '../../api/apiRocketChatSettingsPublic';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';
import {
	deleteCookieByName,
	setValueInCookie
} from '../sessionCookie/accessSessionCookie';
import { apiPatchUserData } from '../../api/apiPatchUserData';
import { useSearchParam } from '../../hooks/useSearchParams';
import { getTenantSettings } from '../../utils/tenantSettingsHelper';
import { budibaseLogout } from '../budibase/budibaseLogout';
import { GlobalComponentContext } from '../../globalState/provider/GlobalComponentContext';
import { useConsultantAgenciesAndConsultingTypes } from '../../containers/registration/hooks/useConsultantAgenciesAndConsultingTypes';
import { UrlParamsContext } from '../../globalState/provider/UrlParamsProvider';

const regexAccountDeletedError = /account disabled/i;

export const Login = () => {
	const settings = useAppConfig();
	const { t: translate } = useTranslation();
	const history = useHistory();

	const { locale, initLocale } = useContext(LocaleContext);
	const { tenant } = useContext(TenantContext);
	const { getSetting } = useContext(RocketChatGlobalSettingsContext);
	const { userData, reloadUserData } = useContext(UserDataContext);
	const { Stage } = useContext(GlobalComponentContext);
	const gcid = useSearchParam<string>('gcid');
	const isFirstVisit = useIsFirstVisit();

	const loginButton: ButtonItem = {
		label: translate('login.button.label'),
		type: BUTTON_TYPES.PRIMARY
	};

	const hasTenant = tenant != null;

	const consultantId = getUrlParameter('cid');
	const { consultant, loaded: isReady } = useContext(UrlParamsContext);

	const [labelState, setLabelState] = useState<InputFieldLabelState>(null);
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(
		username.length > 0 && password.length > 0
	);
	const [otp, setOtp] = useState<string>('');
	const [isOtpRequired, setIsOtpRequired] = useState<boolean>(false);
	const [showLoginError, setShowLoginError] = useState<string>('');
	const [isRequestInProgress, setIsRequestInProgress] =
		useState<boolean>(false);
	const { featureToolsEnabled } = getTenantSettings();

	useEffect(() => {
		// If we're authenticated and have a gcid, redirect to app
		if (gcid && !isFirstVisit) {
			apiGetUserData([FETCH_ERRORS.CATCH_ALL])
				.then(() => redirectToApp(gcid))
				.catch(() => null); // do nothing
		}
	}, [consultant, gcid, isFirstVisit, reloadUserData, userData]);

	useEffect(() => {
		setShowLoginError('');
		setLabelState(null);
		if (
			(!isOtpRequired && username && password) ||
			(isOtpRequired && username && password && otp)
		) {
			setIsButtonDisabled(false);
		} else {
			setIsButtonDisabled(true);
		}
	}, [username, password, otp, isOtpRequired]);

	useEffect(() => {
		setOtp('');
		setIsOtpRequired(false);
	}, [username]);

	useEffect(() => {
		if (!gcid && featureToolsEnabled) {
			budibaseLogout().catch(() => null);
		}
	}, [featureToolsEnabled, gcid]);

	const [agency, setAgency] = useState(null);
	const [validity, setValidity] = useState(VALIDITY_INITIAL);
	const [registerOverlayActive, setRegisterOverlayActive] = useState(false);
	const [pwResetOverlayActive, setPwResetOverlayActive] = useState(false);

	const [twoFactorType, setTwoFactorType] = useState(TWO_FACTOR_TYPES.NONE);

	const inputItemUsername: InputFieldItem = {
		name: 'username',
		class: 'login',
		id: 'username',
		type: 'text',
		label: translate('login.user.label'),
		content: username,
		icon: <PersonIcon />,
		...(labelState && { labelState })
	};

	const inputItemPassword: InputFieldItem = {
		name: 'password',
		id: 'passwordInput',
		type: 'password',
		label: translate('login.password.label'),
		content: password,
		icon: <LockIcon />,
		...(labelState && { labelState })
	};

	const otpInputItem: InputFieldItem = {
		content: otp,
		id: 'otp',
		infoText:
			twoFactorType === TWO_FACTOR_TYPES.APP
				? translate(`login.warning.failed.app.otp.missing`)
				: '',
		label: translate('twoFactorAuth.activate.otp.input.label.text'),
		name: 'otp',
		type: 'text',
		icon: <VerifiedIcon />,
		maxLength: OTP_LENGTH,
		tabIndex: isOtpRequired ? 0 : -1
	};

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleOtpChange = (event) => {
		setOtp(event.target.value);
	};

	const {
		agencies: possibleAgencies,
		consultingTypes: possibleConsultingTypes
	} = useConsultantAgenciesAndConsultingTypes();

	const registerOverlay = useMemo(
		(): OverlayItem => ({
			svg: WelcomeIcon,
			headline: translate('login.consultant.overlay.success.headline'),
			nestedComponent: (
				<ConsultingTypeAgencySelection
					agency={agency}
					onChange={setAgency}
					onValidityChange={(validity) => setValidity(validity)}
				/>
			),
			buttonSet: [
				{
					label: translate('login.consultant.overlay.cancel.button'),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.SECONDARY
				},
				{
					label: translate('login.consultant.overlay.success.button'),
					function: OVERLAY_FUNCTIONS.REDIRECT_WITH_BLUR,
					type: BUTTON_TYPES.PRIMARY,
					disabled: validity !== VALIDITY_VALID
				}
			]
		}),
		[agency, validity, translate]
	);

	const handleRegistration = useCallback(
		(agency) => {
			if (validity === VALIDITY_VALID) {
				apiRegistrationNewConsultingTypes(
					agency.consultingTypeRel.id,
					agency.id,
					agency.postcode,
					consultantId
				)
					.catch((response) => response.json())
					.then((response) => {
						if (response instanceof Error) {
							return redirectToApp();
						}

						if (!response.rcGroupId || !response.sessionId) {
							history.push(endpoints.userSessionsListView);
							return;
						}

						history.push(
							generatePath(
								`${endpoints.userSessionsListView}/:rcGroupId/:sessionId`,
								response
							)
						);
					});
			}
		},
		[consultantId, history, validity]
	);

	const handleOverlayAction = useCallback(
		(buttonFunction: string) => {
			if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT_WITH_BLUR) {
				handleRegistration(agency);
			} else if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
				redirectToApp();
			}
		},
		[agency, handleRegistration]
	);

	const handlePwOverlayReset = useCallback(
		(buttonFunction: string) => {
			if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
				setValueInCookie(
					'KEYCLOAK_LOCALE',
					locale,
					endpoints.loginResetPasswordLink
						.split('/')
						.slice(0, -1)
						.join('/')
				);
				window.open(
					endpoints.loginResetPasswordLink,
					'_self',
					'noreferrer'
				);
			} else if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
				setPwResetOverlayActive(false);
			}
		},
		[locale]
	);

	useEffect(() => {
		if (
			possibleAgencies.length === 1 &&
			possibleConsultingTypes.length === 1
		) {
			setAgency(possibleAgencies[0]);
			setValidity(VALIDITY_VALID);
		}
	}, [possibleAgencies, possibleConsultingTypes]);

	useEffect(() => {
		deleteCookieByName('tenantId');
	}, []);

	const postLogin = useCallback(
		() =>
			reloadUserData().then(async (userData: UserDataInterface) => {
				// If user has changed language from default but the profile has different language in profile override it
				let patchedUserData = {};
				if (
					userData.preferredLanguage !== locale &&
					locale !== initLocale
				) {
					patchedUserData['preferredLanguage'] = locale;
				}

				if (
					hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
				) {
					patchedUserData['available'] = false;
				}

				if (Object.keys(patchedUserData).length > 0) {
					await apiPatchUserData(patchedUserData);
					await reloadUserData().catch(console.log);
				}

				if (
					!consultant ||
					!hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData)
				) {
					return redirectToApp(gcid);
				}

				if (
					possibleAgencies.length === 1 &&
					possibleConsultingTypes.length === 1
				) {
					handleRegistration(possibleAgencies[0]);
				} else {
					setRegisterOverlayActive(true);
				}
			}),
		[
			locale,
			initLocale,
			consultant,
			possibleAgencies,
			possibleConsultingTypes.length,
			reloadUserData,
			handleRegistration,
			gcid
		]
	);

	const tryLogin = (otp?: string) => {
		setIsRequestInProgress(true);
		autoLogin({
			username: username,
			password: password,
			tenantData: tenant,
			...(otp ? { otp } : {})
		})
			.then(postLogin)
			.catch((error) => {
				if (error.message === FETCH_ERRORS.UNAUTHORIZED) {
					setShowLoginError(
						translate(
							otp
								? 'login.warning.failed.unauthorized.otp'
								: 'login.warning.failed.unauthorized.text'
						)
					);
					setLabelState(VALIDITY_INVALID);
				} else if (!otp && error.message === FETCH_ERRORS.BAD_REQUEST) {
					if (
						error.options?.data?.error_description?.match(
							regexAccountDeletedError
						)
					) {
						setShowLoginError(
							translate('login.warning.failed.deletedAccount')
						);
						setLabelState(VALIDITY_INVALID);
					} else if (error.options?.data?.otpType) {
						setTwoFactorType(error.options.data.otpType);
						setIsOtpRequired(true);
					}
				}

				setIsRequestInProgress(false);
			});
	};

	const handleLogin = () => {
		if (
			isRequestInProgress ||
			!username ||
			!password ||
			(isOtpRequired && !otp)
		) {
			return;
		}
		tryLogin(otp);
	};

	const handleKeyUp = (e) => {
		if (e.key === 'Enter') {
			handleLogin();
		}
	};

	const pwResetOverlay: OverlayItem = useMemo(
		() => ({
			headline: translate('login.password.reset.warn.overlay.title'),
			copy: translate('login.password.reset.warn.overlay.description'),
			buttonSet: [
				{
					label: translate(
						'login.password.reset.warn.overlay.button.accept'
					),
					function: OVERLAY_FUNCTIONS.REDIRECT,
					type: BUTTON_TYPES.SECONDARY
				},
				{
					label: translate(
						'login.password.reset.warn.overlay.button.cancel'
					),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.PRIMARY
				}
			]
		}),
		[translate]
	);

	const onPasswordResetClick = (e) => {
		if (getSetting<IBooleanSetting>(SETTING_E2E_ENABLE)?.value) {
			e.preventDefault();
			setPwResetOverlayActive(true);
			return;
		}
		setValueInCookie(
			'KEYCLOAK_LOCALE',
			locale,
			endpoints.loginResetPasswordLink.split('/').slice(0, -1).join('/')
		);
		window.open(endpoints.loginResetPasswordLink, '_self', 'noreferrer');
	};

	return (
		<>
			<StageLayout
				stage={<Stage hasAnimation={isFirstVisit} isReady={isReady} />}
				showLegalLinks
				showRegistrationLink={hasTenant}
			>
				<div className="loginForm">
					<div>
						<div className="loginForm__headline">
							<h2>{translate('login.headline')}</h2>
						</div>
						<InputField
							item={inputItemUsername}
							inputHandle={handleUsernameChange}
							keyUpHandle={handleKeyUp}
						/>
						<InputField
							item={inputItemPassword}
							inputHandle={handlePasswordChange}
							keyUpHandle={handleKeyUp}
						/>
						<div
							className={clsx('loginForm__otp', {
								'loginForm__otp--active': isOtpRequired
							})}
						>
							{twoFactorType === TWO_FACTOR_TYPES.EMAIL && (
								<Text
									className="loginForm__emailHint"
									text={translate(
										'twoFactorAuth.activate.email.resend.hint'
									)}
									type="infoLargeAlternative"
								/>
							)}
							<InputField
								item={otpInputItem}
								inputHandle={handleOtpChange}
								keyUpHandle={handleKeyUp}
							/>
							{twoFactorType === TWO_FACTOR_TYPES.EMAIL && (
								<TwoFactorAuthResendMail
									resendHandler={(callback) => {
										tryLogin();
										callback();
									}}
								/>
							)}
						</div>

						{showLoginError && (
							<Text
								text={showLoginError}
								type="infoSmall"
								className="loginForm__error"
							/>
						)}

						<Button
							item={loginButton}
							buttonHandle={handleLogin}
							disabled={isButtonDisabled || isRequestInProgress}
						/>

						{!(twoFactorType === TWO_FACTOR_TYPES.EMAIL) && (
							<button
								onClick={onPasswordResetClick}
								className="button-as-link"
								type="button"
							>
								{translate('login.resetPasswort.label')}
							</button>
						)}

						{!hasTenant && (
							<div className="loginForm__register">
								<div className="loginForm__register__separator">
									<span>{translate('login.seperator')}</span>
								</div>
								<div className="loginForm__register__content">
									<Text
										text={translate(
											'login.register.infoText.title'
										)}
										type={'infoMedium'}
									/>
									<button
										onClick={() =>
											window.open(
												settings.urls.toRegistration,
												'_self'
											)
										}
										className="button-as-link consulting-topics"
										type="button"
									>
										{translate('login.register.linkLabel')}
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
				{registerOverlayActive && (
					<Overlay
						item={registerOverlay}
						handleOverlay={handleOverlayAction}
					/>
				)}
			</StageLayout>
			{pwResetOverlayActive && (
				<Overlay
					item={pwResetOverlay}
					handleOverlayClose={() => setPwResetOverlayActive(false)}
					handleOverlay={handlePwOverlayReset}
				/>
			)}
		</>
	);
};
