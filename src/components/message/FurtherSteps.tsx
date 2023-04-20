import * as React from 'react';
import { useHistory } from 'react-router-dom';
import './furtherSteps.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { ReactComponent as EnvelopeIllustration } from '../../resources/img/illustrations/envelope-check.svg';
import { ReactComponent as ConsultantIllustration } from '../../resources/img/illustrations/consultant.svg';
import { ReactComponent as AnswerIllustration } from '../../resources/img/illustrations/answer.svg';
import { ReactComponent as ArrowIllustration } from '../../resources/img/illustrations/arrow.svg';
import { ReactComponent as EnvelopeIcon } from '../../resources/img/icons/envelope.svg';
import { ReactComponent as SuccessIllustration } from '../../resources/img/illustrations/check.svg';
import {
	InputField,
	InputFieldItem,
	InputFieldLabelState
} from '../inputField/InputField';
import { isStringValidEmail } from '../registration/registrationHelpers';
import { useContext, useState } from 'react';
import { Overlay, OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { apiPutEmail, FETCH_ERRORS, X_REASON } from '../../api';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext
} from '../../globalState';
import { useTranslation } from 'react-i18next';

export const FurtherSteps = () => {
	const { t: translate } = useTranslation();
	const history = useHistory();

	const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
	const [isSuccessOverlay, setIsSuccessOverlay] = useState<boolean>(false);
	const { userData, reloadUserData } = useContext(UserDataContext);
	const [isRequestInProgress, setIsRequestInProgress] =
		useState<boolean>(false);
	const [email, setEmail] = useState<string>('');
	const [emailLabel, setEmailLabel] = useState<string>(
		translate('furtherSteps.email.overlay.input.label')
	);
	const [emailLabelState, setEmailLabelState] =
		useState<InputFieldLabelState>();

	const addEmailButton: ButtonItem = {
		label: translate('furtherSteps.emailNotification.button'),
		type: BUTTON_TYPES.LINK
	};

	const add2faButton: ButtonItem = {
		label: translate('furtherSteps.twoFactorAuth.button'),
		type: BUTTON_TYPES.LINK
	};

	const is2faEnabledAndNotActive =
		userData.twoFactorAuth?.isEnabled && !userData.twoFactorAuth?.isActive;

	const emailInputItem: InputFieldItem = {
		content: email,
		icon: <EnvelopeIcon />,
		id: 'email',
		label: emailLabel,
		name: 'email',
		type: 'text',
		labelState: emailLabelState
	};

	const validateEmail = (
		email
	): { validity: InputFieldLabelState; label: string } => {
		if (email.length > 0 && isStringValidEmail(email)) {
			return {
				validity: 'valid',
				label: translate('furtherSteps.email.overlay.input.valid')
			};
		} else if (email.length > 0) {
			return {
				validity: 'invalid',
				label: translate('furtherSteps.email.overlay.input.invalid')
			};
		} else {
			return {
				validity: null,
				label: translate('furtherSteps.email.overlay.input.label')
			};
		}
	};

	const handleEmailChange = (event) => {
		const validityData = validateEmail(event.target.value);
		setEmailLabelState(validityData.validity);
		setEmailLabel(validityData.label);
		setEmail(event.target.value);
	};

	const emailOverlayItem: OverlayItem = {
		buttonSet: [
			{
				disabled: emailLabelState !== 'valid',
				label: translate('furtherSteps.email.overlay.button1.label'),
				type: BUTTON_TYPES.PRIMARY
			},
			{
				label: translate('furtherSteps.email.overlay.button2.label'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.SECONDARY
			}
		],
		headline: translate('furtherSteps.email.overlay.headline'),
		nestedComponent: (
			<InputField
				item={emailInputItem}
				inputHandle={(e) => handleEmailChange(e)}
			/>
		),
		svg: EnvelopeIllustration
	};

	const successOverlayItem: OverlayItem = {
		buttonSet: [
			{
				label: translate('furtherSteps.email.overlay.button2.label'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.PRIMARY
			}
		],
		headline: translate('furtherSteps.email.success.overlay.headline'),
		svg: SuccessIllustration
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setIsOverlayActive(false);
			setIsSuccessOverlay(false);
			setIsRequestInProgress(false);
		} else if (!isRequestInProgress) {
			setIsRequestInProgress(true);
			apiPutEmail(email)
				.then(reloadUserData)
				.then(() => {
					setIsRequestInProgress(false);
					setIsSuccessOverlay(true);
				})
				.catch((error: Response) => {
					const reason = error.headers?.get(FETCH_ERRORS.X_REASON);
					if (reason === X_REASON.EMAIL_NOT_AVAILABLE) {
						setEmailLabel(
							translate(
								'furtherSteps.email.overlay.input.unavailable'
							)
						);
						setEmailLabelState('invalid');
						setIsRequestInProgress(false);
					}
				});
		}
	};

	const showAddEmail = !userData.email;
	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);

	const redirectTo2FA = () => {
		history.push({
			pathname: '/profile/einstellungen/sicherheit',
			state: {
				openTwoFactor: true
			}
		});
	};

	return (
		<div className="furtherSteps">
			{isConsultant && (
				<Text
					className="furtherSteps__consultantHint"
					text={translate('furtherSteps.consultant.info')}
					type="infoLargeStandard"
				/>
			)}
			<Headline
				semanticLevel="4"
				text={translate('furtherSteps.headline')}
			/>
			<ul className="furtherSteps__steps">
				<li className="furtherSteps__step">
					<div className="furtherSteps__illustration">
						<EnvelopeIllustration
							aria-label={translate(
								'furtherSteps.step1.iconTitle'
							)}
							title={translate('furtherSteps.step1.iconTitle')}
						/>
					</div>
					<Text
						type="infoLargeStandard"
						text={translate('furtherSteps.step1.info')}
						className="furtherSteps__stepInfo"
					/>
				</li>
				<li className="furtherSteps__arrow">
					<ArrowIllustration
						aria-label={translate('furtherSteps.arrowTitle')}
						title={translate('furtherSteps.arrowTitle')}
					/>
				</li>
				<li className="furtherSteps__step">
					<div className="furtherSteps__illustration">
						<ConsultantIllustration
							aria-label={translate(
								'furtherSteps.step2.iconTitle'
							)}
							title={translate('furtherSteps.step2.iconTitle')}
						/>
					</div>
					<Text
						type="infoLargeStandard"
						text={translate('furtherSteps.step2.info')}
						className="furtherSteps__stepInfo"
					/>
				</li>
				<li className="furtherSteps__arrow">
					<ArrowIllustration
						aria-label={translate('furtherSteps.arrowTitle')}
						title={translate('furtherSteps.arrowTitle')}
					/>
				</li>
				<li className="furtherSteps__step">
					<div className="furtherSteps__illustration">
						<AnswerIllustration
							aria-label={translate(
								'furtherSteps.step3.iconTitle'
							)}
							title={translate('furtherSteps.step3.iconTitle')}
						/>
					</div>
					<Text
						type="infoLargeStandard"
						text={translate('furtherSteps.step3.info')}
						className="furtherSteps__stepInfo"
					/>
				</li>
			</ul>
			{!isConsultant && showAddEmail && (
				<>
					<Headline
						semanticLevel="5"
						text={translate(
							'furtherSteps.emailNotification.headline'
						)}
					/>
					<Text
						type="standard"
						text={translate(
							'furtherSteps.emailNotification.infoText'
						)}
						className="furtherSteps__infoText"
					/>
					<Button
						item={addEmailButton}
						buttonHandle={() => setIsOverlayActive(true)}
					/>
					{isOverlayActive && (
						<Overlay
							item={
								isSuccessOverlay
									? successOverlayItem
									: emailOverlayItem
							}
							handleOverlay={handleOverlayAction}
						/>
					)}
				</>
			)}
			{!isConsultant && is2faEnabledAndNotActive && (
				<>
					<Headline
						semanticLevel="5"
						text={translate('furtherSteps.twoFactorAuth.headline')}
					/>
					<Text
						type="standard"
						text={translate('furtherSteps.twoFactorAuth.infoText')}
						className="furtherSteps__infoText"
					/>
					<Button item={add2faButton} buttonHandle={redirectTo2FA} />
				</>
			)}
		</div>
	);
};
