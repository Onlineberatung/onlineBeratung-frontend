import '../../polyfill';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { StageProps } from '../stage/stage';
import { ComponentType, useEffect, useState } from 'react';
import { getUrlParameter } from '../../utils/getUrlParameter';
import { WelcomeScreen } from './WelcomeScreen';
import { LegalLinkInterface } from '../../globalState';
import { RegistrationForm } from './RegistrationForm';
import '../../resources/styles/styles';
import { StageLayout } from '../stageLayout/StageLayout';
import useIsFirstVisit from '../../utils/useIsFirstVisit';
import useUrlParamsLoader from '../../utils/useUrlParamsLoader';
import { setValueInCookie } from '../sessionCookie/accessSessionCookie';
import { useTranslation } from 'react-i18next';

interface RegistrationProps {
	handleUnmatchConsultingType: Function;
	handleUnmatchConsultant: Function;
	stageComponent: ComponentType<StageProps>;
	legalLinks: Array<LegalLinkInterface>;
}

export const Registration = ({
	handleUnmatchConsultingType,
	handleUnmatchConsultant,
	legalLinks,
	stageComponent: Stage
}: RegistrationProps) => {
	const { t: translate } = useTranslation();
	const { consultingTypeSlug } = useParams();
	const agencyId = getUrlParameter('aid');
	const consultantId = getUrlParameter('cid');
	const postcodeParameter = getUrlParameter('postcode');

	const loginParams = Object.entries({
		cid: consultantId,
		aid: agencyId
	})
		.filter(([, value]) => value)
		.map(([key, value]) => `${key}=${value}`)
		.join('&');

	const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(
		!postcodeParameter
	);

	const [isReady, setIsReady] = useState(false);

	const handleForwardToRegistration = () => {
		setShowWelcomeScreen(false);
		window.scrollTo({ top: 0 });
	};

	const { agency, consultingType, consultant, loaded } = useUrlParamsLoader();

	useEffect(() => {
		if (!loaded) {
			return;
		}

		if (!consultingType && !agency && !consultant) {
			console.error(
				'No `consultingType`, `consultant` or `agency` found in URL.'
			);
			return;
		}

		try {
			if (consultantId) {
				if (!consultant) {
					handleUnmatchConsultant();
					throw new Error(
						`Unknown consultant with id ${consultantId}`
					);
				}

				// If all consultant agencies are informal then use informal
				const isInformal = consultant.agencies.every(
					(agency) => !agency.consultingTypeRel.languageFormal
				);
				setValueInCookie('useInformal', isInformal ? '1' : '');

				// If consultant has only one consulting type set document title
				const hasUniqueConsultingType =
					consultant.agencies.reduce(
						(acc: number[], { consultingType }) => {
							if (acc.indexOf(consultingType) < 0) {
								acc.push(consultingType);
							}
							return acc;
						},
						[]
					).length > 1;

				if (hasUniqueConsultingType) {
					document.title = `${translate(
						'registration.title.start'
					)} ${translate([
						`consultingType.${consultingType.id}.titles.long`,
						consultant.agencies[0].consultingTypeRel.titles.long
					])}`;
				}
			} else {
				if (!consultingType) {
					handleUnmatchConsultingType();
					throw new Error(
						agency
							? `Unknown consulting type with agency ${translate([
									`agency.${agency.id}.name`,
									agency.name
							  ])}`
							: `Unknown consulting type with slug ${consultingTypeSlug}`
					);
				}

				if (
					consultingType.urls?.requiredAidMissingRedirectUrl &&
					!agency
				) {
					window.location.href =
						consultingType.urls?.requiredAidMissingRedirectUrl;
					throw new Error(`Consulting type requires matching aid`);
				}

				// SET FORMAL/INFORMAL COOKIE
				setValueInCookie(
					'useInformal',
					consultingType.languageFormal ? '' : '1'
				);

				document.title = `${translate(
					'registration.title.start'
				)} ${translate([
					`consultingType.${consultingType.id}.titles.long`,
					consultingType.titles.long
				])}`;
			}
			setIsReady(true);
		} catch (error) {
			console.log(error);
			return;
		}
	}, [
		consultingType,
		agency,
		consultant,
		loaded,
		consultantId,
		handleUnmatchConsultant,
		handleUnmatchConsultingType,
		consultingTypeSlug,
		translate
	]);

	const isFirstVisit = useIsFirstVisit();

	return (
		<StageLayout
			legalLinks={legalLinks}
			showLegalLinks={true}
			showLoginLink={!showWelcomeScreen}
			stage={<Stage hasAnimation={isFirstVisit} isReady={isReady} />}
			loginParams={loginParams}
		>
			{isReady &&
				(showWelcomeScreen ? (
					<WelcomeScreen
						title={
							translate([
								`consultingType.${consultingType?.id}.titles.welcome`,
								consultingType?.titles.welcome
							]) || translate('registration.overline')
						}
						handleForwardToRegistration={
							handleForwardToRegistration
						}
						loginParams={loginParams}
						welcomeScreenConfig={consultingType?.welcomeScreen}
						consultingTypeId={consultingType?.id}
					/>
				) : (
					<RegistrationForm
						consultingType={consultingType}
						agency={agency}
						consultant={consultant}
						legalLinks={legalLinks}
					/>
				))}
		</StageLayout>
	);
};
