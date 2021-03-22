import * as React from 'react';
import './furtherSteps.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { translate } from '../../resources/scripts/i18n/translate';
import { ReactComponent as EnvelopeIllustration } from '../../resources/img/illustrations/envelope-check.svg';
import { ReactComponent as ConsultantIllustration } from '../../resources/img/illustrations/consultant.svg';
import { ReactComponent as AnswerIllustration } from '../../resources/img/illustrations/answer.svg';
import { ReactComponent as ArrowIllustration } from '../../resources/img/illustrations/arrow.svg';

// const addEmailButton: ButtonItem = {
// 	label: translate('furtherSteps.emailNotification.button'),
// 	type: BUTTON_TYPES.LINK
// };

export const FurtherSteps = () => {
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
			{/* <Headline
				semanticLevel="5"
				text={translate('furtherSteps.emailNotification.headline')}
			/>
			<Text
				type="standard"
				text={translate('furtherSteps.emailNotification.infoText')}
				className="furtherSteps__emailInfo"
			/>
			<Button item={addEmailButton} /> */}
		</div>
	);
};
