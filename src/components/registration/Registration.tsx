import '../../polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage } from '../stage/stage';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { translate } from '../../utils/translate';
import { getUrlParameter } from '../../utils/getUrlParameter';
import { WelcomeScreen } from './WelcomeScreen';
import { ConsultingTypeInterface } from '../../globalState';
import { RegistrationForm } from './RegistrationForm';
import { apiGetConsultingType } from '../../api';
import '../../resources/styles/styles';
import './registration.styles';

export const initRegistration = () => {
	ReactDOM.render(
		<Registration />,
		document.getElementById('registrationRoot')
	);
};

export const Registration = () => {
	const { resortName } = useParams();
	const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);
	const [registrationData, setRegistrationData] = useState<
		ConsultingTypeInterface | undefined
	>();

	const handleForwardToRegistration = () => {
		setShowWelcomeScreen(false);
		window.scrollTo({ top: 0 });
	};

	useEffect(() => {
		if (!resortName) {
			console.error('No `resortName` found in URL.');
			return;
		}

		apiGetConsultingType({ resortName })
			.then((result) => {
				if (!result) {
					console.error(`Unknown resort with name ${resortName}`);
					return;
				}

				setRegistrationData(result);

				document.title = `${translate('registration.title.start')} ${
					result.overline
				}`;
			})
			.catch((error) => {
				console.log(error);
			});
	}, [resortName]);

	useEffect(() => {
		if (!registrationData) return;

		if (
			registrationData.requiredAidMissingRedirectUrl &&
			!getUrlParameter('aid')
		) {
			window.location.href =
				registrationData.requiredAidMissingRedirectUrl;
		}
	}, [registrationData]);

	return (
		<div className="registration">
			<Stage hasAnimation isReady={registrationData != null} />
			{registrationData != null && (
				<div className="registration__content">
					{showWelcomeScreen ? (
						<WelcomeScreen
							resortTitle={registrationData.welcomeTitle}
							handleForwardToRegistration={
								handleForwardToRegistration
							}
						/>
					) : (
						<RegistrationForm registrationData={registrationData} />
					)}
				</div>
			)}
		</div>
	);
};
