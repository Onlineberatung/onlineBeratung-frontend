import * as React from 'react';
import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { encode } from 'hi-base32';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../globalState';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import Switch from 'react-switch';
import { Overlay, OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { Button, BUTTON_TYPES } from '../button/Button';
import {
	InputField,
	InputFieldItem,
	InputFieldLabelState
} from '../inputField/InputField';
import { ReactComponent as DownloadIcon } from '../../resources/img/icons/download.svg';
import { ReactComponent as AddIcon } from '../../resources/img/icons/add.svg';
import { ReactComponent as AddShieldIcon } from '../../resources/img/icons/add-shield.svg';
import { ReactComponent as UrlIcon } from '../../resources/img/icons/url.svg';
import { ReactComponent as CheckIcon } from '../../resources/img/icons/checkmark.svg';
import { ReactComponent as IlluCheck } from '../../resources/img/illustrations/check.svg';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
import {
	apiDeleteTwoFactorAuth,
	apiPutTwoFactorAuthEmail,
	apiPostTwoFactorAuthEmailWithCode,
	apiPutTwoFactorAuthApp,
	FETCH_ERRORS,
	apiPatchTwoFactorAuthEncourage
} from '../../api';
import './twoFactorAuth.styles';
import { isStringValidEmail } from '../registration/registrationHelpers';
import { LockIcon, PenIcon } from '../../resources/img/icons';
import { RadioButton } from '../radioButton/RadioButton';
import { Tooltip } from '../tooltip/Tooltip';
import { TwoFactorAuthResendMail } from './TwoFactorAuthResendMail';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';
import {
	STORAGE_KEY_DISABLE_2FA_DUTY,
	useDevToolbar
} from '../devToolbar/DevToolbar';

export const OTP_LENGTH = 6;

export const TWO_FACTOR_TYPES = {
	EMAIL: 'EMAIL',
	APP: 'APP',
	NONE: ''
};

export const TwoFactorAuth = () => {
	const { t: translate } = useTranslation();
	const location = useLocation<{
		openTwoFactor?: boolean;
		isEditMode?: boolean;
	}>();

	const { userData, reloadUserData } = useContext(UserDataContext);

	const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(
		userData.twoFactorAuth.isActive
	);
	const [overlayActive, setOverlayActive] = useState<boolean>(false);
	const [otp, setOtp] = useState<string>('');
	const defaultOtpLabel = translate(
		'twoFactorAuth.activate.otp.input.label.text'
	);
	const [otpLabel, setOtpLabel] = useState<string>(defaultOtpLabel);
	const [otpLabelState, setOtpLabelState] = useState<InputFieldLabelState>();
	const [otpInputInfo, setOtpInputInfo] = useState<string>('');
	const [isRequestInProgress, setIsRequestInProgress] =
		useState<boolean>(false);
	const [email, setEmail] = useState<string>(userData.email);
	const [hasDuplicateError, setHasDuplicateError] = useState(false);
	const [emailLabel, setEmailLabel] = useState<string>(
		translate('twoFactorAuth.activate.email.input.label')
	);
	const [emailLabelState, setEmailLabelState] =
		useState<InputFieldLabelState>();

	const [twoFactorType, setTwoFactorType] = useState<string>(
		TWO_FACTOR_TYPES.APP
	);
	const settings = useAppConfig();
	const todaysDate = new Date();
	const isTwoFactorBinding =
		todaysDate >= settings.twofactor.dateTwoFactorObligatory;
	const [isEditMode, setIsEditMode] = useState(
		location.state?.isEditMode ?? false
	);
	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);
	const { getDevToolbarOption } = useDevToolbar();

	useEffect(() => {
		if (location.state?.openTwoFactor) {
			setOverlayActive(true);
		}
	}, [location.state?.openTwoFactor]);

	useEffect(() => {
		setIsSwitchChecked(userData.twoFactorAuth.isActive);
		setEmail(userData.email || '');
		setEmailLabel(translate('twoFactorAuth.activate.email.input.label'));
		setEmailLabelState(userData.email ? 'valid' : null);
		setTwoFactorType(userData.twoFactorAuth.type || TWO_FACTOR_TYPES.APP);
		setIsSwitchChecked(userData.twoFactorAuth.isActive);
	}, [
		userData.twoFactorAuth.isActive,
		userData.email,
		userData.twoFactorAuth.type,
		translate
	]);

	const handleOverlayAction = useCallback(
		(buttonFunction: string) => {
			if (buttonFunction === 'DISABLE_2FA') {
				apiDeleteTwoFactorAuth()
					.then(reloadUserData)
					.then(() => setOverlayActive(false))
					.catch(console.log);
			}
		},
		[reloadUserData]
	);

	const handleSwitchChange = () => {
		if (!isSwitchChecked) {
			setIsSwitchChecked(true);
			setOverlayActive(true);
		} else {
			setIsSwitchChecked(false);
			apiDeleteTwoFactorAuth()
				.then(reloadUserData)
				.catch(() => setIsSwitchChecked(true));
		}
	};
	const handleOverlayCloseSuccess = useCallback(() => {
		setOverlayActive(false);
		setOtp('');
		setHasDuplicateError(false);
		setOtpLabel(defaultOtpLabel);
		setOtpLabelState(null);
	}, [defaultOtpLabel]);

	const handleOverlayClose = useCallback(() => {
		setOverlayActive(false);
		setOtp('');
		setEmail(userData.email || '');
		setEmailLabel(translate('twoFactorAuth.activate.email.input.label'));
		setEmailLabelState(null);
		setHasDuplicateError(false);
		setOtpLabel(defaultOtpLabel);
		setOtpLabelState(null);
		setIsSwitchChecked(userData.twoFactorAuth.isActive);
		setTwoFactorType(userData.twoFactorAuth.type || TWO_FACTOR_TYPES.APP);
	}, [
		defaultOtpLabel,
		userData.email,
		userData.twoFactorAuth.isActive,
		userData.twoFactorAuth.type,
		translate
	]);

	const otpInputItem: InputFieldItem = useMemo(
		() => ({
			content: otp,
			id: 'otp',
			infoText: otpInputInfo,
			label: otpLabel,
			name: 'otp',
			type: 'text',
			labelState: otpLabelState,
			maxLength: OTP_LENGTH
		}),
		[otp, otpInputInfo, otpLabel, otpLabelState]
	);

	const validateOtp = useCallback(
		(totp): { validity: InputFieldLabelState; label: string } => {
			if (totp.length === OTP_LENGTH) {
				return {
					validity: 'valid',
					label: translate(
						'twoFactorAuth.activate.otp.input.label.text'
					)
				};
			} else if (totp.lenght === 0) {
				return {
					validity: null,
					label: translate(
						'twoFactorAuth.activate.otp.input.label.text'
					)
				};
			} else if (totp.length < OTP_LENGTH) {
				return {
					validity: 'invalid',
					label: translate(
						'twoFactorAuth.activate.otp.input.label.short'
					)
				};
			}
		},
		[translate]
	);

	const handleOtpChange = useCallback(
		(event) => {
			const validityData = validateOtp(event.target.value);
			setOtpLabelState(validityData.validity);
			setOtpLabel(validityData.label);
			setOtp(event.target.value);
		},
		[validateOtp]
	);

	const activateTwoFactorAuthByType = useCallback(
		(triggerNextStep) => {
			let apiCall, apiData;

			if (twoFactorType === TWO_FACTOR_TYPES.APP) {
				apiCall = apiPutTwoFactorAuthApp;
				apiData = {
					secret: userData.twoFactorAuth.secret,
					otp
				};
			}
			if (twoFactorType === TWO_FACTOR_TYPES.EMAIL) {
				apiCall = apiPostTwoFactorAuthEmailWithCode;
				apiData = otp;
			}

			if (twoFactorType === TWO_FACTOR_TYPES.NONE) return;

			if (!isRequestInProgress) {
				setIsRequestInProgress(true);
				setOtpInputInfo('');
				apiCall(apiData)
					.then(() => apiPatchTwoFactorAuthEncourage(false))
					.then(() => {
						if (triggerNextStep) triggerNextStep();
						setIsRequestInProgress(false);
					})
					.then(reloadUserData)
					.catch((error) => {
						if (error.message === FETCH_ERRORS.BAD_REQUEST) {
							setOtpLabel(defaultOtpLabel);
							setOtpInputInfo(
								translate(
									'twoFactorAuth.activate.otp.input.label.error'
								)
							);
							setOtpLabelState('invalid');
							setIsRequestInProgress(false);
							setIsSwitchChecked(false);
						}
					});
			}
		},
		[
			defaultOtpLabel,
			isRequestInProgress,
			otp,
			twoFactorType,
			reloadUserData,
			userData.twoFactorAuth.secret,
			translate
		]
	);

	/* ENTRY */

	const selectTwoFactorTypeButtons = useCallback((): JSX.Element => {
		return (
			<div className="twoFactorAuth__selectType">
				<div className="twoFactorAuth__radioWrapper">
					<RadioButton
						checked={twoFactorType === TWO_FACTOR_TYPES.APP}
						handleRadioButton={() => {
							setTwoFactorType(TWO_FACTOR_TYPES.APP);
						}}
						inputId="radio_2fa_app"
						name="radio_2fa"
						type="default"
						value={TWO_FACTOR_TYPES.APP}
					>
						{translate('twoFactorAuth.activate.radio.label.app')}
					</RadioButton>
					<Tooltip trigger={<InfoIcon />}>
						{translate('twoFactorAuth.activate.radio.tooltip.app')}
					</Tooltip>
				</div>
				<div className="twoFactorAuth__radioWrapper">
					<RadioButton
						checked={twoFactorType === TWO_FACTOR_TYPES.EMAIL}
						handleRadioButton={() => {
							setTwoFactorType(TWO_FACTOR_TYPES.EMAIL);
						}}
						inputId="radio_2fa_email"
						name="radio_2fa"
						type="default"
						value={TWO_FACTOR_TYPES.EMAIL}
					>
						{translate('twoFactorAuth.activate.radio.label.email')}
					</RadioButton>
					<Tooltip trigger={<InfoIcon />}>
						{translate(
							'twoFactorAuth.activate.radio.tooltip.email'
						)}
					</Tooltip>
				</div>
			</div>
		);
	}, [twoFactorType, translate]);

	const twoFactorAuthStepsOverlayStart: OverlayItem[] = useMemo(
		() => [
			{
				headline: translate('twoFactorAuth.activate.step1.title'),
				copy: translate('twoFactorAuth.activate.step1.copy'),
				step: {
					icon: LockIcon,
					label: translate(
						'twoFactorAuth.activate.step1.visualisation.label'
					)
				},
				handleOverlay: handleOverlayAction,
				nestedComponent: selectTwoFactorTypeButtons(),
				buttonSet: [
					{
						disabled:
							twoFactorType === TWO_FACTOR_TYPES.NONE ||
							twoFactorType === userData.twoFactorAuth.type,
						label: translate('twoFactorAuth.overlayButton.next'),
						function: OVERLAY_FUNCTIONS.NEXT_STEP,
						type: BUTTON_TYPES.PRIMARY
					},
					(!isConsultant ||
						getDevToolbarOption(STORAGE_KEY_DISABLE_2FA_DUTY) ===
							'1') &&
						userData.twoFactorAuth.isActive && {
							label: translate(
								'twoFactorAuth.activate.step1.disable'
							),
							function: 'DISABLE_2FA',
							type: BUTTON_TYPES.SECONDARY
						}
				].filter(Boolean)
			}
		],
		[
			selectTwoFactorTypeButtons,
			twoFactorType,
			translate,
			userData.twoFactorAuth.type,
			isConsultant,
			userData.twoFactorAuth.isActive,
			handleOverlayAction,
			getDevToolbarOption
		]
	);

	/* APP */
	const getAuthenticatorTools = useCallback((): JSX.Element => {
		const tools = [
			{
				title: translate(
					'twoFactorAuth.activate.app.step2.tool1.title'
				),
				urlGoogle: translate(
					'twoFactorAuth.activate.app.step2.tool1.url.google'
				),
				urlApple: translate(
					'twoFactorAuth.activate.app.step2.tool1.url.apple'
				)
			},
			{
				title: translate(
					'twoFactorAuth.activate.app.step2.tool2.title'
				),
				urlGoogle: translate(
					'twoFactorAuth.activate.app.step2.tool2.url.google'
				),
				urlApple: translate(
					'twoFactorAuth.activate.app.step2.tool2.url.apple'
				)
			}
		];
		return (
			<div className="twoFactorAuth__tools">
				{tools.map((tool, i) => {
					return (
						<div className="twoFactorAuth__tool" key={i}>
							<Text text={tool.title} type="standard" />
							<a
								target="_blank"
								rel="noreferrer"
								href={tool.urlGoogle}
							>
								<DownloadIcon />
								<Text
									text={translate(
										'twoFactorAuth.activate.app.step2.download.google'
									)}
									type="standard"
								/>
							</a>
							<a
								target="_blank"
								rel="noreferrer"
								href={tool.urlApple}
							>
								<DownloadIcon />
								<Text
									text={translate(
										'twoFactorAuth.activate.app.step2.download.apple'
									)}
									type="standard"
								/>
							</a>
						</div>
					);
				})}
			</div>
		);
	}, [translate]);

	const connectAuthAccount = useCallback((): JSX.Element => {
		return (
			<div className="twoFactorAuth__connect">
				<div className="twoFactorAuth__qrCode">
					<Text
						text={translate(
							'twoFactorAuth.activate.app.step3.connect.qrCode'
						)}
						type="standard"
					/>
					<img
						className="twoFactorAuth__qrCodeImage"
						alt={translate('qrCode.iconTitle')}
						title={translate('qrCode.iconTitle')}
						src={`data:image/png;base64,${userData.twoFactorAuth.qrCode}`}
					/>
				</div>
				<Text
					text={translate(
						'twoFactorAuth.activate.app.step3.connect.divider'
					)}
					type="divider"
				/>
				<div className="twoFactorAuth__key">
					<Text
						text={translate(
							'twoFactorAuth.activate.app.step3.connect.key'
						)}
						type="standard"
					/>
					<Text
						text={
							userData.twoFactorAuth.secret
								? encode(userData.twoFactorAuth.secret).replace(
										/={1,8}$/,
										''
									)
								: ''
						}
						type="standard"
					/>
				</div>
			</div>
		);
	}, [
		userData.twoFactorAuth.secret,
		userData.twoFactorAuth.qrCode,
		translate
	]);

	const appConfirmation = useCallback((): JSX.Element => {
		return (
			<div className="twoFactorAuth__appConfirmation">
				<IlluCheck
					title={translate('app.successful')}
					aria-label={translate('app.successful')}
				/>
				<Headline
					text={translate('twoFactorAuth.activate.app.step5.title')}
					semanticLevel="3"
				/>
			</div>
		);
	}, [translate]);

	const twoFactorAuthStepsOverlayApp: OverlayItem[] = useMemo(
		() => [
			{
				headline: translate('twoFactorAuth.activate.app.step2.title'),
				copy: translate('twoFactorAuth.activate.app.step2.copy'),
				nestedComponent: getAuthenticatorTools(),
				buttonSet: [
					{
						label: translate('twoFactorAuth.overlayButton.back'),
						function: OVERLAY_FUNCTIONS.PREV_STEP,
						type: BUTTON_TYPES.SECONDARY
					},
					{
						label: translate('twoFactorAuth.overlayButton.next'),
						function: OVERLAY_FUNCTIONS.NEXT_STEP,
						type: BUTTON_TYPES.PRIMARY
					}
				],
				step: {
					icon: AddIcon,
					label: translate(
						'twoFactorAuth.activate.app.step2.visualisation.label'
					)
				}
			},
			{
				headline: translate('twoFactorAuth.activate.app.step3.title'),
				copy: translate('twoFactorAuth.activate.app.step3.copy'),
				nestedComponent: connectAuthAccount(),
				buttonSet: [
					{
						label: translate('twoFactorAuth.overlayButton.back'),
						function: OVERLAY_FUNCTIONS.PREV_STEP,
						type: BUTTON_TYPES.SECONDARY
					},
					{
						label: translate('twoFactorAuth.overlayButton.next'),
						function: OVERLAY_FUNCTIONS.NEXT_STEP,
						type: BUTTON_TYPES.PRIMARY
					}
				],
				step: {
					icon: AddShieldIcon,
					label: translate(
						'twoFactorAuth.activate.app.step3.visualisation.label'
					)
				}
			},
			{
				headline: translate('twoFactorAuth.activate.app.step4.title'),
				copy: translate('twoFactorAuth.activate.app.step4.copy'),
				nestedComponent: (
					<InputField
						item={otpInputItem}
						inputHandle={handleOtpChange}
					/>
				),
				buttonSet: [
					{
						label: translate('twoFactorAuth.overlayButton.back'),
						function: OVERLAY_FUNCTIONS.PREV_STEP,
						type: BUTTON_TYPES.SECONDARY
					},
					{
						disabled: otpLabelState !== 'valid',
						label: translate('twoFactorAuth.overlayButton.confirm'),
						function: OVERLAY_FUNCTIONS.NEXT_STEP,
						type: BUTTON_TYPES.PRIMARY
					}
				],
				handleNextStep: activateTwoFactorAuthByType,
				step: {
					icon: UrlIcon,
					label: translate(
						'twoFactorAuth.activate.app.step4.visualisation.label'
					)
				}
			},
			{
				nestedComponent: appConfirmation(),
				buttonSet: [
					{
						label: translate('twoFactorAuth.overlayButton.close'),
						function: OVERLAY_FUNCTIONS.CLOSE_SUCCESS,
						type: BUTTON_TYPES.AUTO_CLOSE
					}
				],
				handleOverlay: handleOverlayCloseSuccess,
				step: {
					icon: CheckIcon,
					label: translate(
						'twoFactorAuth.activate.app.step5.visualisation.label'
					)
				}
			}
		],
		[
			activateTwoFactorAuthByType,
			connectAuthAccount,
			handleOtpChange,
			handleOverlayCloseSuccess,
			otpInputItem,
			otpLabelState,
			translate,
			appConfirmation,
			getAuthenticatorTools
		]
	);

	/* E-MAIL */

	const validateEmail = useCallback(
		(email: string): { validity: InputFieldLabelState; label: string } => {
			if (email.length > 0 && isStringValidEmail(email)) {
				return {
					validity: 'valid',
					label: translate('twoFactorAuth.activate.email.input.valid')
				};
			} else if (email.length > 0) {
				return {
					validity: 'invalid',
					label: translate(
						'twoFactorAuth.activate.email.input.invalid'
					)
				};
			} else {
				return {
					validity: null,
					label: translate('twoFactorAuth.activate.email.input.label')
				};
			}
		},
		[translate]
	);

	const handleEmailChange = useCallback(
		(event) => {
			const validityData = validateEmail(event.target.value);
			setEmailLabelState(validityData.validity);
			setEmailLabel(validityData.label);
			setEmail(event.target.value);
		},
		[validateEmail]
	);

	const emailInputItem: InputFieldItem = useMemo(
		() => ({
			id: 'email2FA',
			infoText: hasDuplicateError
				? translate('twoFactorAuth.activate.email.input.duplicate.info')
				: '',
			label: emailLabel,
			name: 'email2FA',
			type: 'text',
			labelState: emailLabelState,
			content: email
		}),
		[email, emailLabel, emailLabelState, hasDuplicateError, translate]
	);

	const emailSelection = useCallback((): JSX.Element => {
		return (
			<div className="twoFactorAuth__emailSelection">
				<InputField
					item={emailInputItem}
					inputHandle={(e) => handleEmailChange(e)}
				/>
				{userData.email && (
					<Text
						type="infoLargeAlternative"
						text={translate(
							'twoFactorAuth.activate.email.input.info'
						)}
					/>
				)}
			</div>
		);
	}, [emailInputItem, handleEmailChange, userData.email, translate]);

	const sendEmailActivationCode = useCallback(
		(triggerNextStep) => {
			apiPutTwoFactorAuthEmail(email)
				.then(() => {
					if (triggerNextStep) triggerNextStep();
					setHasDuplicateError(false);
				})
				.catch((error) => {
					if (error.message === FETCH_ERRORS.PRECONDITION_FAILED) {
						setEmailLabelState('invalid');
						setEmailLabel(
							translate(
								'twoFactorAuth.activate.email.input.duplicate.label'
							)
						);
						setHasDuplicateError(true);
					}
				});
		},
		[email, translate]
	);

	const emailCodeInput = useCallback((): JSX.Element => {
		return (
			<div className="twoFactorAuth__emailCode">
				<InputField item={otpInputItem} inputHandle={handleOtpChange} />
				<TwoFactorAuthResendMail
					resendHandler={sendEmailActivationCode}
				/>
			</div>
		);
	}, [handleOtpChange, otpInputItem, sendEmailActivationCode]);

	const emailConfirmation = useCallback((): JSX.Element => {
		return (
			<div className="twoFactorAuth__emailConfirmation">
				<IlluCheck />
				<Headline
					text={translate('twoFactorAuth.activate.email.step4.title')}
					semanticLevel="3"
				/>
			</div>
		);
	}, [translate]);

	const twoFactorAuthStepsOverlayMail: OverlayItem[] = useMemo(
		() => [
			{
				headline: translate('twoFactorAuth.activate.email.step2.title'),
				copy: translate('twoFactorAuth.activate.email.step2.copy'),
				step: {
					icon: PenIcon,
					label: translate(
						'twoFactorAuth.activate.email.step2.visualisation.label'
					)
				},
				nestedComponent: emailSelection(),
				handleNextStep: sendEmailActivationCode,
				buttonSet: [
					{
						label: translate('twoFactorAuth.overlayButton.back'),
						function: OVERLAY_FUNCTIONS.PREV_STEP,
						type: BUTTON_TYPES.SECONDARY
					},
					{
						disabled:
							!userData.email && !(emailLabelState === 'valid'),
						label: translate('twoFactorAuth.overlayButton.next'),
						function: OVERLAY_FUNCTIONS.NEXT_STEP,
						type: BUTTON_TYPES.PRIMARY
					}
				]
			},
			{
				headline: translate('twoFactorAuth.activate.email.step3.title'),
				copy: `${translate(
					'twoFactorAuth.activate.email.step3.copy.1'
				)} <strong>${email}</strong> ${translate(
					'twoFactorAuth.activate.email.step3.copy.2'
				)}`,
				nestedComponent: emailCodeInput(),
				buttonSet: [
					{
						label: translate('twoFactorAuth.overlayButton.back'),
						function: OVERLAY_FUNCTIONS.PREV_STEP,
						type: BUTTON_TYPES.SECONDARY
					},
					{
						disabled: otpLabelState !== 'valid',
						label: translate('twoFactorAuth.overlayButton.confirm'),
						function: OVERLAY_FUNCTIONS.NEXT_STEP,
						type: BUTTON_TYPES.PRIMARY
					}
				],
				handleNextStep: activateTwoFactorAuthByType,
				step: {
					icon: UrlIcon,
					label: translate(
						'twoFactorAuth.activate.email.step3.visualisation.label'
					)
				}
			},
			{
				nestedComponent: emailConfirmation(),
				buttonSet: [
					{
						label: translate('twoFactorAuth.overlayButton.close'),
						function: OVERLAY_FUNCTIONS.CLOSE_SUCCESS,
						type: BUTTON_TYPES.AUTO_CLOSE
					}
				],
				handleOverlay: handleOverlayCloseSuccess,
				step: {
					icon: CheckIcon,
					label: translate(
						'twoFactorAuth.activate.email.step4.visualisation.label'
					)
				}
			}
		],
		[
			translate,
			emailSelection,
			sendEmailActivationCode,
			userData.email,
			emailLabelState,
			email,
			emailCodeInput,
			otpLabelState,
			activateTwoFactorAuthByType,
			emailConfirmation,
			handleOverlayCloseSuccess
		]
	);

	/* GENERAL */
	const [overlayItems, setOverlayItems] = useState<OverlayItem[]>([
		...twoFactorAuthStepsOverlayStart
	]);

	const setOverlayByType = useCallback(() => {
		switch (twoFactorType) {
			case TWO_FACTOR_TYPES.EMAIL:
				setOverlayItems([
					...twoFactorAuthStepsOverlayStart,
					...twoFactorAuthStepsOverlayMail
				]);
				return;
			case TWO_FACTOR_TYPES.APP:
				setOverlayItems([
					...twoFactorAuthStepsOverlayStart,
					...twoFactorAuthStepsOverlayApp
				]);
				return;
			default:
				setOverlayItems([...twoFactorAuthStepsOverlayStart]);
		}
	}, [
		twoFactorType,
		twoFactorAuthStepsOverlayStart,
		twoFactorAuthStepsOverlayApp,
		twoFactorAuthStepsOverlayMail
	]);

	useEffect(() => {
		setOverlayByType();
	}, [setOverlayByType]);

	const handleEditButton = () => {
		setOverlayActive(true);
		setIsEditMode(true);
	};

	return (
		<div className="twoFactorAuth">
			<div className="profile__content__title">
				<div className="twoFactorAuth__head">
					<Headline
						text={translate('twoFactorAuth.title')}
						semanticLevel="5"
					/>
					{isTwoFactorBinding && (
						<Button
							className="twoFactorAuth__edit__button"
							buttonHandle={handleEditButton}
							item={{
								type: BUTTON_TYPES.LINK_INLINE
							}}
							customIcon={
								<PenIcon
									aria-label={translate('twoFactorAuth.edit')}
									title={translate('twoFactorAuth.edit')}
								/>
							}
						/>
					)}
				</div>
				<Text
					className="tertiary"
					text={translate('twoFactorAuth.subtitle')}
					type="standard"
				/>
			</div>
			{!isTwoFactorBinding && (
				<label className="twoFactorAuth__switch">
					<Switch
						onChange={handleSwitchChange}
						checked={isSwitchChecked}
						uncheckedIcon={false}
						checkedIcon={false}
						width={48}
						height={26}
						onColor="#0A882F"
						offColor="#8C878C"
						boxShadow="0px 1px 4px rgba(0, 0, 0, 0.6)"
						handleDiameter={27}
						activeBoxShadow="none"
					/>
					<Text
						text={
							isSwitchChecked
								? translate('twoFactorAuth.switch.active.label')
								: translate(
										'twoFactorAuth.switch.deactive.label'
									)
						}
						type="standard"
					/>
				</label>
			)}
			{(isSwitchChecked || isTwoFactorBinding) &&
				userData.twoFactorAuth.type && (
					<p>
						<strong>
							{translate('twoFactorAuth.switch.type.label')}
						</strong>{' '}
						{translate(
							`twoFactorAuth.switch.type.${userData.twoFactorAuth.type}`
						)}{' '}
						{userData.twoFactorAuth.type === TWO_FACTOR_TYPES.EMAIL
							? `(${userData.email})`
							: ''}
					</p>
				)}
			{overlayActive ? (
				<Overlay
					className="twoFactorAuth__overlay"
					items={overlayItems}
					handleOverlayClose={
						isTwoFactorBinding && !isEditMode && isConsultant
							? null
							: handleOverlayClose
					}
				/>
			) : null}
		</div>
	);
};
