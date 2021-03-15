import * as React from 'react';
import './furtherSteps.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { translate } from '../../resources/scripts/i18n/translate';
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
import {
	Overlay,
	OverlayItem,
	OverlayWrapper,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import { apiPutEmail, FETCH_ERRORS } from '../../api';
import { UserDataContext } from '../../globalState';

const addEmailButton: ButtonItem = {
	label: translate('furtherSteps.emailNotification.button'),
	type: BUTTON_TYPES.LINK
};

export const FurtherSteps = () => {
	const [overlayActive, setOverlayActive] = useState<boolean>(false);
	const [isSuccessOverlay, setIsSuccessOverlay] = useState<boolean>(false);
	const { userData, setUserData } = useContext(UserDataContext);
	const [isRequestInProgress, setIsRequestInProgress] = useState<boolean>(
		false
	);
	const [email, setEmail] = useState<string>('');
	const [emailLabel, setEmailLabel] = useState<string>(
		translate('furtherSteps.email.overlay.input.label')
	);
	const [emailLabelState, setEmailLabelState] = useState<
		InputFieldLabelState
	>();

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
	): { valid: InputFieldLabelState; label: string } => {
		if (email.length > 0 && isStringValidEmail(email)) {
			return {
				valid: 'valid',
				label: translate('furtherSteps.email.overlay.input.valid')
			};
		} else if (email.length > 0) {
			return {
				valid: 'invalid',
				label: translate('furtherSteps.email.overlay.input.invalid')
			};
		} else {
			return {
				valid: null,
				label: translate('furtherSteps.email.overlay.input.label')
			};
		}
	};

	const handleEmailChange = (event) => {
		const validity = validateEmail(event.target.value);
		setEmailLabelState(validity.valid);
		setEmailLabel(validity.label);
		setEmail(event.target.value);
	};

	const emailOverlayItem: OverlayItem = {
		buttonSet: [
			{
				label: translate('furtherSteps.email.overlay.button1.label'),
				type: BUTTON_TYPES.PRIMARY
			},
			{
				label: translate('furtherSteps.email.overlay.button2.label'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.LINK
			}
		],
		headline: translate('furtherSteps.email.overlay.headline'),
		isIconSmall: true,
		nestedComponent: (
			<InputField item={emailInputItem} inputHandle={handleEmailChange} />
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

	const handleAddEmail = () => {
		setOverlayActive(true);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setOverlayActive(false);
			setIsSuccessOverlay(false);
			setIsRequestInProgress(false);
		} else if (!isRequestInProgress) {
			setIsRequestInProgress(true);
			apiPutEmail(email)
				.then((response) => {
					setIsRequestInProgress(false);
					setIsSuccessOverlay(true);
					let updatedUserData = userData;
					updatedUserData.email = email;
					setUserData(updatedUserData);
				})
				.catch((error: Response) => {
					const reason = error.headers.get(FETCH_ERRORS.X_REASON);
					if (reason === 'EMAIL_NOT_AVAILABLE') {
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
	return (
		<div className="furtherSteps">
			<Headline
				semanticLevel="4"
				text={translate('furtherSteps.headline')}
			/>
			<ul className="furtherSteps__steps">
				<li className="furtherSteps__step">
					<div className="furtherSteps__illustration">
						<EnvelopeIllustration />
					</div>
					<Text
						type="infoLargeStandard"
						text={translate('furtherSteps.step1.info')}
						className="furtherSteps__stepInfo"
					/>
				</li>
				<li className="furtherSteps__arrow">
					<ArrowIllustration />
				</li>
				<li className="furtherSteps__step">
					<div className="furtherSteps__illustration">
						<ConsultantIllustration />
					</div>
					<Text
						type="infoLargeStandard"
						text={translate('furtherSteps.step2.info')}
						className="furtherSteps__stepInfo"
					/>
				</li>
				<li className="furtherSteps__arrow">
					<ArrowIllustration />
				</li>
				<li className="furtherSteps__step">
					<div className="furtherSteps__illustration">
						<AnswerIllustration />
					</div>
					<Text
						type="infoLargeStandard"
						text={translate('furtherSteps.step3.info')}
						className="furtherSteps__stepInfo"
					/>
				</li>
			</ul>
			{showAddEmail && (
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
						className="furtherSteps__emailInfo"
					/>
					<Button
						item={addEmailButton}
						buttonHandle={handleAddEmail}
					/>
					{overlayActive && (
						<OverlayWrapper>
							<Overlay
								item={
									isSuccessOverlay
										? successOverlayItem
										: emailOverlayItem
								}
								handleOverlay={handleOverlayAction}
							/>
						</OverlayWrapper>
					)}
				</>
			)}
		</div>
	);
};
