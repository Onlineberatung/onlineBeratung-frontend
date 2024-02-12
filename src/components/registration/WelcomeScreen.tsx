import * as React from 'react';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Text } from '../text/Text';
import { Headline } from '../headline/Headline';
import { ServiceExplanation } from '../serviceExplanation/ServiceExplanation';
import { RegistrationWelcomeScreenInterface } from '../../globalState/interfaces';
import './welcomeScreen.styles';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useAppConfig } from '../../hooks/useAppConfig';

interface WelcomeScreenProps {
	title: string;
	handleForwardToRegistration: Function;
	welcomeScreenConfig?: RegistrationWelcomeScreenInterface;
	loginParams?: string;
	consultingTypeId: number;
	consultingTypeName: string;
}

export const WelcomeScreen = ({
	title,
	handleForwardToRegistration,
	welcomeScreenConfig,
	loginParams,
	consultingTypeId,
	consultingTypeName
}: WelcomeScreenProps) => {
	const { t: translate } = useTranslation();
	const history = useHistory();
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
			{consultingTypeName &&
				!settings.welcomeScreen.consultingType.hidden && (
					<div className="registrationWelcome__consultingType">
						{consultingTypeName}{' '}
					</div>
				)}
			<Headline text={title} semanticLevel="2" />
			<h4>{translate('registration.welcomeScreen.subline')}</h4>
			<ServiceExplanation
				welcomeScreenConfig={welcomeScreenConfig}
				className="registrationWelcome__explanation"
				consultingTypeId={consultingTypeId}
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
					<Button
						isLink={true}
						item={loginButton}
						buttonHandle={() => {
							history.push(
								`${new URL(settings.urls.toLogin).pathname}${
									loginParams ? `?${loginParams}` : ''
								}`
							);
						}}
					/>
				</div>
			</div>
		</div>
	);
};
