import * as React from 'react';
import { translate } from '../../utils/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Text } from '../text/Text';
import { Headline } from '../headline/Headline';
import { ServiceExplanation } from '../serviceExplanation/ServiceExplanation';
import { RegistrationWelcomeScreenInterface } from '../../globalState';
import './welcomeScreen.styles';
import { useAppConfig } from '../../hooks/useAppConfig';

interface WelcomeScreenProps {
	title: string;
	handleForwardToRegistration: Function;
	welcomeScreenConfig?: RegistrationWelcomeScreenInterface;
	loginParams?: string;
}

export const WelcomeScreen = ({
	title,
	handleForwardToRegistration,
	welcomeScreenConfig,
	loginParams
}: WelcomeScreenProps) => {
	const settings = useAppConfig();

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
			<Headline text={title} semanticLevel="2" />
			<h4>{translate('registration.welcomeScreen.subline')}</h4>
			<ServiceExplanation
				welcomeScreenConfig={welcomeScreenConfig}
				className="registrationWelcome__explanation"
			/>
			<div className="registrationWelcome__buttonsWrapper">
				<div>
					<Text
						text={translate(
							'registration.welcomeScreen.register.helperText'
						)}
						type="infoLargeAlternative"
					/>
					<Button
						buttonHandle={handleForwardToRegistration}
						item={registrationButton}
						testingAttribute="close-welcome-screen"
					/>
				</div>
				<div>
					<Text
						text={translate('registration.login.helper')}
						type="infoLargeAlternative"
					/>
					<a
						href={`${settings.urls.toLogin}${
							loginParams ? `?${loginParams}` : ''
						}`}
						tabIndex={-1}
					>
						<Button isLink={true} item={loginButton} />
					</a>
				</div>
			</div>
		</div>
	);
};
