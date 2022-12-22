import * as React from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import './waitingRoom.styles';
import { useTranslation } from 'react-i18next';

export interface WaitingRoomContentProps {
	showRegistrationInfo?: boolean;
	headline?: string;
	subline?: string;
	Illustration: any;
	children?: React.ReactNode;
}

export const WaitingRoomContent = ({
	showRegistrationInfo,
	headline,
	subline,
	Illustration,
	children
}: WaitingRoomContentProps) => {
	const { t: translate } = useTranslation();
	return (
		<>
			<div>
				{headline && (
					<Headline
						className="waitingRoom__headline"
						semanticLevel="1"
						styleLevel="2"
						text={headline}
					/>
				)}
				{subline && (
					<Headline
						className="waitingRoom__subline"
						semanticLevel="2"
						text={subline}
					/>
				)}
				<div className="waitingRoom__action">
					<div className="waitingRoom__action-content">
						{children}
					</div>
					<div className="waitingRoom__illustration-wrapper">
						{Illustration}
					</div>
				</div>
				{showRegistrationInfo && (
					<>
						<Headline
							semanticLevel="5"
							text={translate(
								'anonymous.waitingroom.redirect.title'
							)}
							className="waitingRoom__redirect-title"
						/>
						<Text
							type="standard"
							text={translate(
								'anonymous.waitingroom.redirect.subline'
							)}
							className="waitingRoom__redirect-text"
						/>
					</>
				)}
			</div>
		</>
	);
};
