import '../../polyfill';
import * as React from 'react';
import { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { Stage } from '../stage/stage';
import { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { apiGetRegistrationData } from '../../api';
import { RegistrationDataInterface } from '../../globalState';
import { translate } from '../../resources/scripts/i18n/translate';
import { RegistrationForm } from './RegistrationForm';
import '../../resources/styles/styles';
import './registration.styles';

export const initRegistration = () => {
	ReactDOM.render(
		<Registration />,
		document.getElementById('registrationRoot')
	);
};

const Registration = () => {
	const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);
	const [registrationData, setRegistrationData] = useState<
		RegistrationDataInterface | undefined
	>();

	const handleForwardToRegistration = () => {
		setShowWelcomeScreen(false);
		window.scrollTo({ top: 0 });
	};

	function getResortNameFromUrl() {
		const resortNameMatch = window.location.href.match(/\w+$/);
		return resortNameMatch && resortNameMatch[0];
	}

	useEffect(() => {
		const resortName = getResortNameFromUrl();

		if (!resortName) {
			console.error('No `resortName` found in URL.');
			return;
		}

		apiGetRegistrationData({ resortName })
			.then((result) => {
				setRegistrationData(result);

				document.title = `${translate('registration.title.start')} ${
					result.overline
				}`;
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<div className="registration">
			<Stage hasAnimation isReady={registrationData != null} />
			{registrationData != null && (
				<div className="registration__content">
					{showWelcomeScreen ? (
						<WelcomeScreen
							resortTitle={registrationData.overline}
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
