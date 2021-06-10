import * as React from 'react';
import { translate } from '../../utils/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Text } from '../text/Text';
import { config } from '../../resources/scripts/config';
import { Headline } from '../headline/Headline';
import { ServiceExplanation } from '../serviceExplanation/ServiceExplanation';
import './welcomeScreen.styles';

interface WelcomeScreenProps {
	title: string;
	handleForwardToRegistration: Function;
}

export const WelcomeScreen = (props: WelcomeScreenProps) => {
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
			<ServiceExplanation className="registrationWelcome__explanation" />
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
