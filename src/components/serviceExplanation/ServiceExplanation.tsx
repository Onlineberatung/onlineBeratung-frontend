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
	consultingTypeId?: number;
}

export const ServiceExplanation = ({
	className,
	welcomeScreenConfig,
	consultingTypeId
}: ServiceExplanationProps) => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);

	const welcomeScreenData = [
		{
			icon: <PenIcon aria-hidden="true" focusable="false" />,
			title: translate('registration.welcomeScreen.info1.title'),
			text: translate('registration.welcomeScreen.info1.text')
		},
		{
			icon: <EnvelopeIcon aria-hidden="true" focusable="false" />,
			title: translate('registration.welcomeScreen.info2.title'),
			text: translate('registration.welcomeScreen.info2.text')
		},
		{
			icon: <SpeechBubbleIcon aria-hidden="true" focusable="false" />,
			title: translate('registration.welcomeScreen.info3.title'),
			text: translate('registration.welcomeScreen.info3.text')
		},
		{
			icon: <LockIcon aria-hidden="true" focusable="false" />,
			title: translate(
				[
					`consultingType.${consultingTypeId}.welcomeScreen.anonymous.title`,
					welcomeScreenConfig?.anonymous.title ||
						'registration.welcomeScreen.info4.title'
				],
				{ ns: ['consultingTypes', 'common'] }
			),
			text: translate(
				[
					`consultingType.${consultingTypeId}.welcomeScreen.anonymous.text`,
					welcomeScreenConfig?.anonymous.text ||
						'registration.welcomeScreen.info4.text'
				],
				{ ns: ['consultingTypes', 'common'] }
			)
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
