import * as React from 'react';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import './waitingRoom.styles';
import { useTranslation } from 'react-i18next';

export interface WaitingRoomContentProps {
	showRegistrationInfo?: boolean;
	headlineKey?: string;
	sublineKey?: string;
	textKey?: string;
	Illustration: any;
	children?: React.ReactNode;
}

export const WaitingRoomContent = ({
	showRegistrationInfo,
	headlineKey,
	sublineKey,
	textKey,
	Illustration,
	children
}: WaitingRoomContentProps) => {
	const { t: translate } = useTranslation();
	return (
		<>
			<div>
				{headlineKey && (
					<Headline
						className="waitingRoom__headline"
						semanticLevel="1"
						styleLevel="2"
						text={translate(headlineKey)}
					/>
				)}
				{sublineKey && (
					<Headline
						className="waitingRoom__subline"
						semanticLevel="2"
						text={translate(sublineKey)}
					/>
				)}
				{textKey && (
					<Text
						className="waitingRoom__text"
						type="standard"
						text={translate(textKey)}
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
