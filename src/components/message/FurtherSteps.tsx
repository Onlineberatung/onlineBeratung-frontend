import * as React from 'react';
import './furtherSteps.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { translate } from '../../utils/translate';
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
import { useContext, useEffect, useState } from 'react';
import {
	Overlay,
	OverlayItem,
	OverlayWrapper,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import { apiPutEmail, FETCH_ERRORS, X_REASON } from '../../api';
import {
	ActiveSessionGroupIdContext,
	getActiveSession,
	ConsultingTypeInterface,
	SessionsDataContext,
	UserDataContext
} from '../../globalState';
import { VoluntaryInfoOverlay } from './VoluntaryInfoOverlay';
import { isVoluntaryInfoSet } from './messageHelpers';
import { getChatItemForSession } from '../session/sessionHelpers';

const addEmailButton: ButtonItem = {
	label: translate('furtherSteps.emailNotification.button'),
	type: BUTTON_TYPES.LINK
};

interface FurtherStepsProps {
	consultingType: number;
	onlyShowVoluntaryInfo?: boolean;
	resortData: ConsultingTypeInterface;
	handleVoluntaryInfoSet?: Function;
}

export const FurtherSteps = (props: FurtherStepsProps) => {
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
	const [isSuccessOverlay, setIsSuccessOverlay] = useState<boolean>(false);
	const { userData, setUserData } = useContext(UserDataContext);
	const [isRequestInProgress, setIsRequestInProgress] =
		useState<boolean>(false);
	const [email, setEmail] = useState<string>('');
	const [emailLabel, setEmailLabel] = useState<string>(
		translate('furtherSteps.email.overlay.input.label')
	);
	const [emailLabelState, setEmailLabelState] =
		useState<InputFieldLabelState>();

	const [showAddVoluntaryInfo, setShowAddVoluntaryInfo] = useState<boolean>();
	const chatItem = getChatItemForSession(activeSession);

	useEffect(() => {
		const sessionData =
			userData.consultingTypes[props.consultingType].sessionData;
		setShowAddVoluntaryInfo(
			!isVoluntaryInfoSet(sessionData, props.resortData)
		);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

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
				type: BUTTON_TYPES.LINK
			}
		],
		headline: translate('furtherSteps.email.overlay.headline'),
		isIllustrationSmall: true,
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

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setIsOverlayActive(false);
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

	const handleVoluntarySuccess = (generatedRegistrationData) => {
		let updatedUserData = userData;
		updatedUserData.consultingTypes[chatItem.consultingType].sessionData =
			generatedRegistrationData;
		setUserData(updatedUserData);
		setShowAddVoluntaryInfo(false);
		if (props.handleVoluntaryInfoSet) {
			props.handleVoluntaryInfoSet();
		}
	};

	const showAddEmail = !userData.email;
	return (
		<div className="furtherSteps">
			{!props.onlyShowVoluntaryInfo && (
				<>
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
								className="furtherSteps__infoText"
							/>
							<Button
								item={addEmailButton}
								buttonHandle={() => setIsOverlayActive(true)}
							/>
							{isOverlayActive && (
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
				</>
			)}
			{props.resortData?.voluntaryComponents &&
				props.resortData.voluntaryComponents.length > 0 &&
				showAddVoluntaryInfo && (
					<>
						<Headline
							semanticLevel="5"
							text={translate(
								'furtherSteps.voluntaryInfo.headline'
							)}
						/>
						<Text
							type="standard"
							text={translate(
								'furtherSteps.voluntaryInfo.infoText'
							)}
							className="furtherSteps__infoText"
						/>
						<VoluntaryInfoOverlay
							voluntaryComponents={
								props.resortData.voluntaryComponents
							}
							handleSuccess={handleVoluntarySuccess}
						/>
					</>
				)}
		</div>
	);
};
