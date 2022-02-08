import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { UserDataContext, UserDataInterface } from '../../globalState';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import Switch from 'react-switch';
import {
	Overlay,
	OverlayItem,
	OverlayWrapper,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import {
	InputField,
	InputFieldItem,
	InputFieldLabelState
} from '../inputField/InputField';
import { ReactComponent as DownloadIcon } from '../../resources/img/icons/download.svg';
import { ReactComponent as AddIcon } from '../../resources/img/icons/add.svg';
import { ReactComponent as UrlIcon } from '../../resources/img/icons/url.svg';
import { ReactComponent as CheckIcon } from '../../resources/img/icons/checkmark.svg';
import {
	apiDeleteTwoFactorAuth,
	apiPutTwoFactorAuthEmail,
	apiPostTwoFactorAuthEmailWithCode,
	apiGetUserData,
	apiPutTwoFactorAuthApp,
	FETCH_ERRORS
} from '../../api';
import './twoFactorAuth.styles';
import { isStringValidEmail } from '../registration/registrationHelpers';

export const OTP_LENGTH = 6;

export const TWO_FACTOR_TYPES = {
	MAIL: 'MAIL',
	APP: 'APP',
	NONE: 'NONE'
};

export const TwoFactorAuth = () => {
	const { userData, setUserData } = useContext(UserDataContext);
	const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(
		userData.twoFactorAuth.isActive
	);
	const [overlayActive, setOverlayActive] = useState<boolean>(false);
	const [otp, setOtp] = useState<string>('');
	const defaultOtpLabel = translate('twoFactorAuth.activate.otp.input.label');
	const [otpLabel, setOtpLabel] = useState<string>(defaultOtpLabel);
	const [otpLabelState, setOtpLabelState] = useState<InputFieldLabelState>();
	const [otpInputInfo, setOtpInputInfo] = useState<string>('');
	const [isRequestInProgress, setIsRequestInProgress] =
		useState<boolean>(false);

	const [twoFactorType, setTwoFactorType] = useState<string>(
		TWO_FACTOR_TYPES.NONE
	);

	const updateUserData = () => {
		apiGetUserData()
			.then((newUserData: UserDataInterface) => {
				setUserData(newUserData);
			})
			.catch((error) => console.log(error));
	};

	const handleSwitchChange = () => {
		if (!isSwitchChecked) {
			setIsSwitchChecked(true);
			setOverlayActive(true);
		} else {
			setIsSwitchChecked(false);
			apiDeleteTwoFactorAuth()
				.then((response) => {
					updateUserData();
				})
				.catch((error) => {
					setIsSwitchChecked(true);
				});
		}
	};

	const handleOverlayClose = () => {
		setOverlayActive(false);
		setOtp('');
		setOtpLabel(defaultOtpLabel);
		setOtpLabelState(null);
		setIsSwitchChecked(userData.twoFactorAuth.isActive);
		setTwoFactorType('');
	};

	const otpInputItem: InputFieldItem = {
		content: otp,
		id: 'otp',
		infoText: otpInputInfo,
		label: otpLabel,
		name: 'otp',
		type: 'text',
		labelState: otpLabelState,
		maxLength: OTP_LENGTH
	};

	const validateOtp = (
		totp
	): { validity: InputFieldLabelState; label: string } => {
		if (totp.length === OTP_LENGTH) {
			return {
				validity: 'valid',
				label: translate('twoFactorAuth.activate.otp.input.label')
			};
		} else if (totp.lenght === 0) {
			return {
				validity: null,
				label: translate('twoFactorAuth.activate.otp.input.label')
			};
		} else if (totp.length < OTP_LENGTH) {
			return {
				validity: 'invalid',
				label: translate('twoFactorAuth.activate.otp.input.label.short')
			};
		}
	};

	const handleOtpChange = (event) => {
		const validityData = validateOtp(event.target.value);
		setOtpLabelState(validityData.validity);
		setOtpLabel(validityData.label);
		setOtp(event.target.value);
	};

	const activateTwoFactorAuthByType = () => {
		let apiCall, apiData;

		if (twoFactorType === TWO_FACTOR_TYPES.APP) {
			apiCall = apiPutTwoFactorAuthApp;
			apiData = {
				secret: userData.twoFactorAuth.secret,
				initialCode: otp
			};
		}
		if (twoFactorType === TWO_FACTOR_TYPES.MAIL) {
			apiCall = apiPostTwoFactorAuthEmailWithCode;
			apiData = otp;
		}

		if (twoFactorType === TWO_FACTOR_TYPES.NONE) return;

		if (!isRequestInProgress) {
			setIsRequestInProgress(true);
			setOtpInputInfo('');
			apiCall(apiData)
				.then(() => {
					setOverlayActive(false);
					setIsRequestInProgress(false);
					updateUserData();
				})
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
	};

	/* ENTRY */

	const selectTwoFactorTypeButtons = (): JSX.Element => {
		return (
			<div className="twoFactorAuth__selectType">
				{/* TODO Change Button */}
				<button
					className={
						twoFactorType === TWO_FACTOR_TYPES.MAIL
							? 'is-active'
							: ''
					}
					onClick={() => {
						setTwoFactorType(TWO_FACTOR_TYPES.MAIL);
					}}
				>
					<AddIcon />{' '}
					{translate('twoFactorAuth.activate.step1.email')}{' '}
				</button>
				<button
					className={
						twoFactorType === TWO_FACTOR_TYPES.APP
							? 'is-active'
							: ''
					}
					onClick={() => {
						setTwoFactorType(TWO_FACTOR_TYPES.APP);
					}}
				>
					<AddIcon /> {translate('twoFactorAuth.activate.step1.app')}
				</button>
			</div>
		);
	};

	const twoFactorAuthStepsOverlayStart: OverlayItem[] = [
		{
			headline: translate('twoFactorAuth.activate.step1.title'),
			copy: translate('twoFactorAuth.activate.step1.copy'),
			step: {
				icon: AddIcon,
				label: translate(
					'twoFactorAuth.activate.step1.visualisation.label'
				)
			},
			nestedComponent: selectTwoFactorTypeButtons(),
			buttonSet: [
				{
					disabled: twoFactorType === TWO_FACTOR_TYPES.NONE,
					label: translate('twoFactorAuth.overlayButton.next'),
					function: OVERLAY_FUNCTIONS.NEXT_STEP,
					type: BUTTON_TYPES.PRIMARY
				}
			]
		}
	];

	const twoFactorAuthStepsSkeletons: OverlayItem[] = [
		{
			step: {
				icon: AddIcon,
				label: translate(
					'twoFactorAuth.activate.skeleton.step2.visualisation.label'
				)
			}
		},
		{
			step: {
				icon: CheckIcon,
				label: translate(
					'twoFactorAuth.activate.skeleton.step4.visualisation.label'
				)
			}
		}
	];

	/* APP */
	const getAuthenticatorTools = (): JSX.Element => {
		const tools = [
			{
				title: translate('twoFactorAuth.activate.app.step2.tool1'),
				urlGoogle: translate(
					'twoFactorAuth.activate.app.step2.tool1.url.google'
				),
				urlApple: translate(
					'twoFactorAuth.activate.app.step2.tool1.url.apple'
				)
			},
			{
				title: translate('twoFactorAuth.activate.app.step2.tool2'),
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
	};

	const connectAuthAccount = (): JSX.Element => {
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
						alt="qr code"
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
						text={userData.twoFactorAuth.secret}
						type="standard"
					/>
				</div>
			</div>
		);
	};

	const twoFactorAuthStepsOverlayApp: OverlayItem[] = [
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
				icon: UrlIcon,
				label: translate(
					'twoFactorAuth.activate.app.step3.visualisation.label'
				)
			}
		},
		{
			headline: translate('twoFactorAuth.activate.app.step4.title'),
			copy: translate('twoFactorAuth.activate.app.step4.copy'),
			nestedComponent: (
				<InputField item={otpInputItem} inputHandle={handleOtpChange} />
			),
			buttonSet: [
				{
					label: translate('twoFactorAuth.overlayButton.back'),
					function: OVERLAY_FUNCTIONS.PREV_STEP,
					type: BUTTON_TYPES.SECONDARY
				},
				{
					disabled: otpLabelState !== 'valid',
					label: translate('twoFactorAuth.overlayButton.save'),
					type: BUTTON_TYPES.PRIMARY
				}
			],
			handleOverlay: activateTwoFactorAuthByType,
			step: {
				icon: CheckIcon,
				label: translate(
					'twoFactorAuth.activate.app.step4.visualisation.label'
				)
			}
		}
	];

	/* E-MAIL */
	const [email, setEmail] = useState<string>(userData.email);
	const [emailLabel, setEmailLabel] = useState<string>(
		translate('twoFactorAuth.activate.email.input.label')
	);
	const [emailLabelState, setEmailLabelState] =
		useState<InputFieldLabelState>();

	const validateEmail = (
		email
	): { validity: InputFieldLabelState; label: string } => {
		if (email.length > 0 && isStringValidEmail(email)) {
			return {
				validity: 'valid',
				label: translate('twoFactorAuth.activate.email.input.valid')
			};
		} else if (email.length > 0) {
			return {
				validity: 'invalid',
				label: translate('twoFactorAuth.activate.email.input.invalid')
			};
		} else {
			return {
				validity: null,
				label: translate('twoFactorAuth.activate.email.input.label')
			};
		}
	};

	const handleEmailChange = (event) => {
		const validityData = validateEmail(event.target.value);
		setEmailLabelState(validityData.validity);
		setEmailLabel(validityData.label);
		setEmail(event.target.value);
	};

	const emailInputItem: InputFieldItem = {
		id: 'email2FA',
		infoText: '',
		label: emailLabel,
		name: 'email2FA',
		type: 'text',
		labelState: emailLabelState,
		content: email
	};

	const emailSelection = (): JSX.Element => {
		return (
			<div className="twoFactorAuth__mailSelection">
				{userData.email ? (
					<>
						<p>Deine Mail {userData.email}</p>
						<p>Da schicken wir eine Mail hin.</p>
					</>
				) : (
					<>
						<p>Keine E-Mail hinterlegt.</p>
						<p>
							Bitte eine eingeben:{' '}
							<InputField
								item={emailInputItem}
								inputHandle={(e) => handleEmailChange(e)}
							/>
						</p>
					</>
				)}
			</div>
		);
	};

	const sendEmailActivationCode = async (triggerNextStep) => {
		await apiPutTwoFactorAuthEmail(email)
			.then(() => {
				triggerNextStep();
			})
			.catch((e) => {
				// TODO ADD ERROR HANDLING
			});
	};

	const twoFactorAuthStepsOverlayMail: OverlayItem[] = [
		{
			headline: translate('twoFactorAuth.activate.email.step2.title'),
			copy: translate('twoFactorAuth.activate.email.step2.copy'),
			step: {
				icon: AddIcon,
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
					disabled: !userData.email && !(emailLabelState === 'valid'),
					label: translate('twoFactorAuth.overlayButton.next'),
					function: OVERLAY_FUNCTIONS.NEXT_STEP,
					type: BUTTON_TYPES.PRIMARY
				}
			]
		},
		{
			headline: translate('twoFactorAuth.activate.email.step3.title'),
			copy: translate('twoFactorAuth.activate.email.step3.copy'),

			nestedComponent: (
				<InputField item={otpInputItem} inputHandle={handleOtpChange} />
			),
			buttonSet: [
				{
					label: translate('twoFactorAuth.overlayButton.back'),
					function: OVERLAY_FUNCTIONS.PREV_STEP,
					type: BUTTON_TYPES.SECONDARY
				},
				{
					disabled: otpLabelState !== 'valid',
					label: translate('twoFactorAuth.overlayButton.save'),
					type: BUTTON_TYPES.PRIMARY
				}
			],
			handleOverlay: activateTwoFactorAuthByType,
			step: {
				icon: CheckIcon,
				label: translate(
					'twoFactorAuth.activate.email.step3.visualisation.label'
				)
			}
		}
	];

	/* GENERAL */
	const [overlayItems, setOverlayItems] = useState<OverlayItem[]>([
		...twoFactorAuthStepsOverlayStart,
		...twoFactorAuthStepsSkeletons
	]);

	const setOverlayByType = () => {
		switch (twoFactorType) {
			case TWO_FACTOR_TYPES.MAIL:
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
				setOverlayItems([
					...twoFactorAuthStepsOverlayStart,
					...twoFactorAuthStepsSkeletons
				]);
		}
	};

	useEffect(() => {
		setOverlayByType();
	}, [twoFactorType, email, otp, otpLabel, otpLabelState]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="twoFactorAuth">
			<div className="profile__content__title">
				<Headline
					text={translate('twoFactorAuth.title')}
					semanticLevel="5"
				/>
				<Text
					text={translate('twoFactorAuth.subtitle')}
					type="infoLargeAlternative"
				/>
			</div>
			<label className="twoFactorAuth__switch">
				<Switch
					onChange={handleSwitchChange}
					checked={isSwitchChecked}
					uncheckedIcon={false}
					checkedIcon={false}
					width={48}
					height={26}
					onColor="#0dcd21"
					offColor="#8C878C"
					boxShadow="0px 1px 4px rgba(0, 0, 0, 0.6)"
					handleDiameter={27}
					activeBoxShadow="none"
				/>
				<Text
					text={
						isSwitchChecked
							? translate('twoFactorAuth.switch.active.label')
							: translate('twoFactorAuth.switch.deactive.label')
					}
					type="standard"
				/>
			</label>
			{overlayActive ? (
				<OverlayWrapper>
					<Overlay
						className="twoFactorAuth__overlay"
						items={overlayItems}
						handleOverlayClose={handleOverlayClose}
					/>
				</OverlayWrapper>
			) : null}
		</div>
	);
};
