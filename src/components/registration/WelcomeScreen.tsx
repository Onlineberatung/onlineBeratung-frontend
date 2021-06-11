import * as React from 'react';
import { ReactComponent as PenIcon } from '../../resources/img/icons/pen.svg';
import { ReactComponent as EnvelopeIcon } from '../../resources/img/icons/envelope.svg';
import { ReactComponent as SpeechBubbleIcon } from '../../resources/img/icons/speech-bubble.svg';
import { ReactComponent as LockIcon } from '../../resources/img/icons/lock.svg';
import { translate } from '../../utils/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Text } from '../text/Text';
import { config } from '../../resources/scripts/config';
import { Headline } from '../headline/Headline';
import './welcomeScreen.styles';

interface WelcomeScreenProps {
	title: string;
	handleForwardToRegistration: Function;
}

export const WelcomeScreen = (props: WelcomeScreenProps) => {
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
			title: translate('registration.welcomeScreen.info4.title'),
			text: translate('registration.welcomeScreen.info4.text')
		}
	];

	const registrationButton: ButtonItem = {
		label: translate('registration.welcomeScreen.register.buttonLabel'),
		type: BUTTON_TYPES.PRIMARY
	};

	const loginButton: ButtonItem = {
		label: translate('registration.login.label'),
		type: BUTTON_TYPES.SECONDARY
	};

	return (
		<div className="registrationWelcome">
			<Headline text={props.title} semanticLevel="2" />
			<h4>{translate('registration.welcomeScreen.subline')}</h4>

			<div className="registrationWelcome__infoWrapper">
				{welcomeScreenData.map((infoItem, key) => (
					<div className="registrationWelcome__infoItem" key={key}>
						{infoItem.icon}
						<div className="registrationWelcome__infoContent">
							<h5>{infoItem.title}</h5>
							<Text
								text={infoItem.text}
								type="infoLargeAlternative"
							/>
						</div>
					</div>
				))}
			</div>
			<div className="registrationWelcome__buttonsWrapper">
				<div>
					<Text
						text={translate(
							'registration.welcomeScreen.register.helperText'
						)}
						type="infoLargeAlternative"
					/>
					<Button
						buttonHandle={props.handleForwardToRegistration}
						item={registrationButton}
						testingAttribute="close-welcome-screen"
					/>
				</div>
				<div>
					<Text
						text={translate('registration.login.helper')}
						type="infoLargeAlternative"
					/>
					<a href={config.urls.toLogin}>
						<Button isLink={true} item={loginButton} />
					</a>
				</div>
			</div>
		</div>
	);
};
