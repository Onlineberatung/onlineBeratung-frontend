import { ReactComponent as WaitingIllustration } from '../../../resources/img/illustrations/waiting.svg';
import { Headline } from '../../headline/Headline';
import { translate } from '../../../utils/translate';
import * as React from 'react';
import { Text } from '../../text/Text';

export const PausedOrFinished = () => {
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
