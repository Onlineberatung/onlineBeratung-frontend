import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RegistrationWelcomeScreenInterface } from '../../globalState';
import {
	EnvelopeIcon,
	LockIcon,
	PenIcon,
	SpeechBubbleIcon
} from '../../resources/img/icons';
import { Text } from '../text/Text';
import './ServiceExplanation.styles.scss';

interface ServiceExplanationProps {
	className?: string;
	welcomeScreenConfig?: RegistrationWelcomeScreenInterface;
}

export const ServiceExplanation = ({
	className,
	welcomeScreenConfig
}: ServiceExplanationProps) => {
	const { t: translate } = useTranslation();
	const welcomeScreenData = [
		{
			icon: <PenIcon />,
			title: translate('registration.welcomeScreen.info1.title'),
			text: translate('registration.welcomeScreen.info1.text')
		},
		{
			icon: <EnvelopeIcon />,
			title: translate('registration.welcomeScreen.info2.title'),
			text: translate('registration.welcomeScreen.info2.text')
		},
		{
			icon: <SpeechBubbleIcon />,
			title: translate('registration.welcomeScreen.info3.title'),
			text: translate('registration.welcomeScreen.info3.text')
		},
		{
			icon: <LockIcon />,
			title:
				welcomeScreenConfig?.anonymous.title ||
				translate('registration.welcomeScreen.info4.title'),
			text:
				welcomeScreenConfig?.anonymous.text ||
				translate('registration.welcomeScreen.info4.text')
		}
	];

	return (
		<div className={className}>
			{welcomeScreenData.map((infoItem, key) => (
				<div className="serviceExplanation__infoItem" key={key}>
					{infoItem.icon}
					<div className="serviceExplanation__infoContent">
						<h5>{infoItem.title}</h5>
						<Text
							text={infoItem.text}
							type="infoLargeAlternative"
						/>
					</div>
				</div>
			))}
		</div>
	);
};
