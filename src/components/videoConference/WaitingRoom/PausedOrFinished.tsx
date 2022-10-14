import { ReactComponent as WaitingIllustration } from '../../../resources/img/illustrations/waiting.svg';
import { Headline } from '../../headline/Headline';
import * as React from 'react';
import { Text } from '../../text/Text';
import { useTranslation } from 'react-i18next';

export const PausedOrFinished = () => {
	const { t: translate } = useTranslation();

	return (
		<>
			<div className="waitingRoom__illustration">
				<WaitingIllustration className="waitingRoom__waitingIllustration" />
			</div>
			<div>
				<Headline
					className="waitingRoom__headline"
					semanticLevel="1"
					text={translate(
						'videoConference.waitingroom.paused.headline'
					)}
				/>
				<Text
					type="standard"
					text={translate(
						'videoConference.waitingroom.paused.subline'
					)}
				/>
			</div>
		</>
	);
};
