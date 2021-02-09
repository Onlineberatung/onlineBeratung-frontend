import * as React from 'react';
import { ReactComponent as PenIcon } from '../../resources/img/icons/pen.svg';
import { ReactComponent as EnvelopeIcon } from '../../resources/img/icons/envelope.svg';
import { ReactComponent as SpeechBubbleIcon } from '../../resources/img/icons/speech-bubble.svg';
import { ReactComponent as LockIcon } from '../../resources/img/icons/lock.svg';
import { ResortData } from './Registration';
import { translate } from '../../resources/scripts/i18n/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import './welcomeScreen.styles';
import { config } from '../../resources/scripts/config';

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
interface WelcomeScreenProps {
	resortTitle: string;
	handleForwardToRegistration: Function;
}

export const WelcomeScreen = (props: WelcomeScreenProps) => {
	return (
		<div className="registrationWelcome">
			<h2>
				{translate('registration.welcomeScreen.title.start')}{' '}
				{props.resortTitle}
				{translate('registration.welcomeScreen.title.end')}
			</h2>
			<h4>{translate('registration.welcomeScreen.subline')}</h4>

			<div className="registrationWelcome__infoWrapper">
				{welcomeScreenData.map((infoItem) => (
					<div className="registrationWelcome__infoItem">
						{infoItem.icon}
						<div className="registrationWelcome__infoContent">
							<h5>{infoItem.title}</h5>
							<p>{infoItem.text}</p>
						</div>
					</div>
				))}
			</div>
			<div className="registrationWelcome__buttonWrapper">
				<div>
					<p>
						{translate(
							'registration.welcomeScreen.register.helperText'
						)}
					</p>
					<Button
						buttonHandle={props.handleForwardToRegistration}
						item={registrationButton}
					/>
				</div>
				<div>
					<p>{translate('registration.login.helper')}</p>
					<a href={config.urls.toLogin}>
						<Button isLink={true} item={loginButton} />
					</a>
				</div>
			</div>
		</div>
	);
};
