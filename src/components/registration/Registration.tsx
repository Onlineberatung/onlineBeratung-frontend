import '../../polyfill';
import * as React from 'react';
import { Stage } from '../stage/stage';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { getUrlParameter } from '../../resources/scripts/helpers/getUrlParameter';
import { WelcomeScreen } from './WelcomeScreen';
import { ConsultingTypeInterface } from '../../globalState';
import { RegistrationForm } from './RegistrationForm';
import { apiGetConsultingType } from '../../api';
import '../../resources/styles/styles';
import './registration.styles';

interface RegistrationProps {
	handleUnmatch: Function;
}

export const Registration = ({ handleUnmatch }: RegistrationProps) => {
	const { consultingTypeSlug } = useParams();
	const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);
	const [registrationData, setRegistrationData] = useState<
		ConsultingTypeInterface | undefined
	>();

	const handleForwardToRegistration = () => {
		setShowWelcomeScreen(false);
		window.scrollTo({ top: 0 });
	};

	useEffect(() => {
		if (!consultingTypeSlug) {
			console.error('No `consultingTypeSlug` found in URL.');
			return;
		}

		apiGetConsultingType({ consultingTypeSlug })
			.then((result) => {
				if (!result) {
					console.error(
						`Unknown consulting type with name ${consultingTypeSlug}`
					);
					handleUnmatch();
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
	}, [consultingTypeSlug, handleUnmatch]);

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
