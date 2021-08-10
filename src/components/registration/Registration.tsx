import '../../polyfill';
import * as React from 'react';
import { StageProps } from '../stage/stage';
import { useParams } from 'react-router-dom';
import { ComponentType, useEffect, useState } from 'react';
import { translate } from '../../utils/translate';
import { getUrlParameter } from '../../utils/getUrlParameter';
import { WelcomeScreen } from './WelcomeScreen';
import { ConsultingTypeInterface } from '../../globalState';
import { RegistrationForm } from './RegistrationForm';
import { apiGetConsultingType } from '../../api';
import { setValueInCookie } from '../sessionCookie/accessSessionCookie';
import '../../resources/styles/styles';
import { StageLayout } from '../stageLayout/StageLayout';

interface RegistrationProps {
	handleUnmatch: Function;
	stageComponent: ComponentType<StageProps>;
}

export const Registration = ({
	handleUnmatch,
	stageComponent: Stage
}: RegistrationProps) => {
	const { consultingTypeSlug } = useParams();
	const postcodeParameter = getUrlParameter('postcode');
	const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(
		!postcodeParameter
	);
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
				setValueInCookie(
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
		<StageLayout
			showLegalLinks={!showWelcomeScreen}
			showLoginLink={!showWelcomeScreen}
			stage={<Stage hasAnimation isReady={consultingType != null} />}
		>
			{consultingType != null &&
				(showWelcomeScreen ? (
					<WelcomeScreen
						title={consultingType.titles.welcome}
						handleForwardToRegistration={
							handleForwardToRegistration
						}
						welcomeScreenConfig={consultingType.welcomeScreen}
					/>
				) : (
					<RegistrationForm consultingType={consultingType} />
				))}
		</StageLayout>
	);
};
