import '../../polyfill';
import * as React from 'react';
import { Stage, StageProps } from '../stage/stage';
import { useParams } from 'react-router-dom';
import { ComponentType, useEffect, useState } from 'react';
import { translate } from '../../utils/translate';
import { getUrlParameter } from '../../utils/getUrlParameter';
import { WelcomeScreen } from './WelcomeScreen';
import { ConsultingTypeInterface } from '../../globalState';
import { RegistrationForm } from './RegistrationForm';
import { apiGetConsultingType } from '../../api';
import { setTokenInCookie } from '../sessionCookie/accessSessionCookie';
import '../../resources/styles/styles';
import './registration.styles';

interface RegistrationProps {
	handleUnmatch: Function;
	stageComponent: ComponentType<StageProps>;
}

export const Registration = ({
	handleUnmatch,
	stageComponent: Stage
}: RegistrationProps) => {
	const { consultingTypeSlug } = useParams();
	const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);
	const [consultingType, setConsultingType] = useState<
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
						`Unknown consulting type with slug ${consultingTypeSlug}`
					);
					handleUnmatch();
					return;
				}

				// SET FORMAL/INFORMAL COOKIE
				setTokenInCookie(
					'useInformal',
					result.languageFormal ? '' : '1'
				);

				setConsultingType(result);

				document.title = `${translate('registration.title.start')} ${
					result.titles.long
				}`;
			})
			.catch((error) => {
				console.log(error);
			});
	}, [consultingTypeSlug, handleUnmatch]);

	useEffect(() => {
		if (!consultingType) return;

		if (
			consultingType.urls?.requiredAidMissingRedirectUrl &&
			!getUrlParameter('aid')
		) {
			window.location.href =
				consultingType.urls?.requiredAidMissingRedirectUrl;
		}
	}, [consultingType]);

	return (
		<div className="registration">
			<Stage hasAnimation isReady={consultingType != null} />
			{consultingType != null && (
				<div className="registration__content">
					{showWelcomeScreen ? (
						<WelcomeScreen
							title={consultingType.titles.welcome}
							handleForwardToRegistration={
								handleForwardToRegistration
							}
						/>
					) : (
						<RegistrationForm consultingType={consultingType} />
					)}
				</div>
			)}
		</div>
	);
};
