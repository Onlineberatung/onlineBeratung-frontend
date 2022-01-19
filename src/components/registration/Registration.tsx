import '../../polyfill';
import * as React from 'react';
import { StageProps } from '../stage/stage';
import { useParams } from 'react-router-dom';
import { ComponentType, useCallback, useEffect, useState } from 'react';
import { translate } from '../../utils/translate';
import { getUrlParameter } from '../../utils/getUrlParameter';
import { WelcomeScreen } from './WelcomeScreen';
import {
	AgencyDataInterface,
	ConsultingTypeInterface
} from '../../globalState';
import { RegistrationForm } from './RegistrationForm';
import {
	apiGetAgencyById,
	apiGetConsultingType,
	FETCH_ERRORS
} from '../../api';
import { setValueInCookie } from '../sessionCookie/accessSessionCookie';
import '../../resources/styles/styles';
import { StageLayout } from '../stageLayout/StageLayout';
import { LegalInformationLinksProps } from '../login/LegalInformationLinks';
import { redirectToRegistrationWithoutAid } from './prefillPostcode';
import { isNumber } from '../../utils/isNumber';

interface RegistrationProps {
	handleUnmatch: Function;
	stageComponent: ComponentType<StageProps>;
	legalComponent: ComponentType<LegalInformationLinksProps>;
}

export const Registration = ({
	handleUnmatch,
	legalComponent,
	stageComponent: Stage
}: RegistrationProps) => {
	const { consultingTypeSlug } = useParams();
	const agencyId = getUrlParameter('aid');
	const postcodeParameter = getUrlParameter('postcode');
	const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(
		!postcodeParameter
	);
	const [consultingType, setConsultingType] = useState<
		ConsultingTypeInterface | undefined
	>();
	const [showAnimation, setShowAnimation] = useState<boolean>(false);
	const [agency, setAgency] = useState<AgencyDataInterface | null>(null);
	const [isReady, setIsReady] = useState(false);

	const handleForwardToRegistration = () => {
		setShowWelcomeScreen(false);
		window.scrollTo({ top: 0 });
	};

	const getAgency = useCallback(() => {
		return apiGetAgencyById(agencyId)
			.then((response) => {
				setAgency(response[0]);
				return response[0].consultingType;
			})
			.catch((error) => {
				if (error.message === FETCH_ERRORS.NO_MATCH) {
					redirectToRegistrationWithoutAid();
				}
				return null;
			});
	}, [agencyId]);

	const getConsultingType = useCallback(
		(consultingTypeId: number | null = null) => {
			return apiGetConsultingType({
				consultingTypeSlug,
				consultingTypeId
			})
				.then((consultingType) => {
					if (!consultingType) {
						console.error(
							`Unknown consulting type with slug ${consultingTypeSlug}`
						);
						handleUnmatch();
						return false;
					} else if (
						consultingTypeId &&
						consultingTypeId !== consultingType.id
					) {
						redirectToRegistrationWithoutAid();
						return false;
					} else if (
						consultingType.urls?.requiredAidMissingRedirectUrl &&
						!consultingTypeId
					) {
						window.location.href =
							consultingType.urls?.requiredAidMissingRedirectUrl;
						return false;
					}

					// SET FORMAL/INFORMAL COOKIE
					setValueInCookie(
						'useInformal',
						consultingType.languageFormal ? '' : '1'
					);

					setConsultingType(consultingType);

					document.title = `${translate(
						'registration.title.start'
					)} ${consultingType.titles.long}`;

					return true;
				})
				.catch((error) => {
					console.log(error);
					return false;
				});
		},
		[consultingTypeSlug, handleUnmatch]
	);

	useEffect(() => {
		if (!consultingTypeSlug && !agencyId) {
			console.error('No `consultingTypeSlug` or `aid` found in URL.');
			return;
		}

		if (isNumber(agencyId)) {
			getAgency()
				.then(getConsultingType)
				.then((isReady) => {
					setIsReady(isReady);
				});
		} else {
			getConsultingType().then((isReady) => {
				setIsReady(isReady);
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [consultingTypeSlug, agencyId]);

	useEffect(() => {
		setShowAnimation(sessionStorage.getItem('visited') !== 'true');
		sessionStorage.setItem('visited', 'true');
	}, []);

	return (
		<StageLayout
			legalComponent={legalComponent}
			showLegalLinks={true}
			showLoginLink={!showWelcomeScreen}
			stage={<Stage hasAnimation={showAnimation} isReady={isReady} />}
		>
			{isReady &&
				(showWelcomeScreen ? (
					<WelcomeScreen
						title={consultingType.titles.welcome}
						handleForwardToRegistration={
							handleForwardToRegistration
						}
						welcomeScreenConfig={consultingType.welcomeScreen}
					/>
				) : (
					<RegistrationForm
						consultingType={consultingType}
						agency={agency}
						legalComponent={legalComponent}
					/>
				))}
		</StageLayout>
	);
};
