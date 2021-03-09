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
import {
	InputField,
	InputFieldItem,
	InputFieldLabelState
} from '../inputField/InputField';
import { isStringValidEmail } from '../registration/registrationHelpers';
import { useState } from 'react';
import {
	Overlay,
	OverlayItem,
	OverlayWrapper,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';

const addEmailButton: ButtonItem = {
	label: translate('furtherSteps.emailNotification.button'),
	type: BUTTON_TYPES.LINK
};

export const FurtherSteps = () => {
	const [overlayActive, setOverlayActive] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [email, setEmail] = useState('');
	const [emailInputItem, setEmailInputItem] = useState<InputFieldItem>({
		content: email,
		icon: <EnvelopeIcon />,
		id: 'email',
		label: translate('furtherSteps.email.overlay.input.label'),
		name: 'email',
		type: 'text',
		labelState: null
	});

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
		console.log('HANDLE EMAIL CHANGE');
		setEmail(event.target.value);
		let inputEmail = emailInputItem;
		const validity = validateEmail(event.target.value);
		inputEmail.labelState = validity.valid;
		inputEmail.label = validity.label;
		inputEmail.content = event.target.value;
		setEmailInputItem(inputEmail);
	};

	const overlayItem: OverlayItem = {
		buttonSet: [
			{
				label: translate('furtherSteps.email.overlay.button1.label'),
				function: 'SET EMAIl',
				type: BUTTON_TYPES.PRIMARY
			},
			{
				label: translate('furtherSteps.email.overlay.button2.label'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.LINK
			}
		],
		copy: translate('furtherSteps.email.overlay.copy'),
		headline: translate('furtherSteps.email.overlay.headline'),
		isIconSmall: true,
		nestedComponent: (
			<InputField item={emailInputItem} inputHandle={handleEmailChange} />
		),
		svg: EnvelopeIllustration
	};

	const handleAddEmail = () => {
		setOverlayActive(true);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setOverlayActive(false);
			setIsRequestInProgress(false);
		} else {
			setIsRequestInProgress(true);
			//TODO: update email call
			console.log('Email', emailInputItem.content, email);
		}
	};

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
			{/* TODO: condition to show email text and button & overlay */}
			<Headline
				semanticLevel="5"
				text={translate('furtherSteps.emailNotification.headline')}
			/>
			<Text
				type="standard"
				text={translate('furtherSteps.emailNotification.infoText')}
				className="furtherSteps__emailInfo"
			/>
			<Button item={addEmailButton} buttonHandle={handleAddEmail} />
			{overlayActive ? (
				<OverlayWrapper>
					<Overlay
						item={overlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			) : null}
		</div>
	);
};
