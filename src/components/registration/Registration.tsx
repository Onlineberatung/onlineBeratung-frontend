import '../../polyfill';
import * as React from 'react';
import unionBy from 'lodash/unionBy';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { getUrlParameter } from '../../utils/getUrlParameter';
import { WelcomeScreen } from './WelcomeScreen';
import { InformalContext } from '../../globalState';
import { RegistrationForm } from './RegistrationForm';
import '../../resources/styles/styles';
import { StageLayout } from '../stageLayout/StageLayout';
import useIsFirstVisit from '../../utils/useIsFirstVisit';
import { useTranslation } from 'react-i18next';
import { GlobalComponentContext } from '../../globalState/provider/GlobalComponentContext';
import { UrlParamsContext } from '../../globalState/provider/UrlParamsProvider';

interface RegistrationProps {
	handleUnmatchConsultingType: Function;
	handleUnmatchConsultant: Function;
}

export const Registration = ({
	handleUnmatchConsultingType,
	handleUnmatchConsultant
}: RegistrationProps) => {
	const { t: translate } = useTranslation([
		'common',
		'consultingTypes',
		'agencies'
	]);

	const { consultingTypeSlug } = useParams<{ consultingTypeSlug: string }>();

	const agencyId = getUrlParameter('aid');
	const consultantId = getUrlParameter('cid');
	const postcodeParameter = getUrlParameter('postcode');

	const { setInformal } = useContext(InformalContext);
	const { Stage } = useContext(GlobalComponentContext);

	const loginParams = Object.entries({
		cid: consultantId,
		aid: agencyId
	})
		.filter(([, value]) => value)
		.map(([key, value]) => `${key}=${value}`)
		.join('&');

	const [showWelcomeScreen, setShowWelcomeScreen] =
		useState<boolean>(!postcodeParameter);

	const [isReady, setIsReady] = useState(false);

	const handleForwardToRegistration = () => {
		setShowWelcomeScreen(false);
		window.scrollTo({ top: 0 });
	};

	const { agency, consultingType, consultant, loaded } =
		useContext(UrlParamsContext);

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
				setInformal(isInformal);

				// If consultant has only one consulting type set document title
				const hasUniqueConsultingType =
					unionBy(consultant.agencies, 'consultingType').length > 1;

				if (hasUniqueConsultingType) {
					document.title = `${translate(
						'registration.title.start'
					)} ${translate(
						[
							`consultingType.${consultant.agencies[0].consultingTypeRel.id}.titles.long`,
							`consultingType.fallback.titles.long`,
							consultant.agencies[0].consultingTypeRel.titles.long
						],
						{ ns: 'consultingTypes' }
					)}`;
				}
			} else {
				if (!consultingType) {
					handleUnmatchConsultingType();
					throw new Error(
						agency
							? `Unknown consulting type with agency ${translate(
									[`agency.${agency.id}.name`, agency.name],
									{ ns: 'agencies' }
								)}`
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

				// SET FORMAL/INFORMAL
				setInformal(!consultingType.languageFormal);

				document.title = `${translate(
					'registration.title.start'
				)} ${translate(
					[
						`consultingType.${consultingType.id}.titles.long`,
						`consultingType.fallback.titles.long`,
						consultingType.titles.long
					],
					{ ns: 'consultingTypes' }
				)}`;
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
		translate,
		setInformal
	]);

	const isFirstVisit = useIsFirstVisit();

	return (
		<StageLayout
			showLegalLinks={true}
			showLoginLink={!showWelcomeScreen}
			stage={<Stage hasAnimation={isFirstVisit} isReady={isReady} />}
			loginParams={loginParams}
		>
			{isReady &&
				(showWelcomeScreen ? (
					<WelcomeScreen
						title={
							consultingType
								? translate(
										[
											`consultingType.${consultingType?.id}.titles.welcome`,
											`consultingType.fallback.titles.welcome`,
											consultingType?.titles.welcome
										],
										{ ns: 'consultingTypes' }
									)
								: translate('registration.overline')
						}
						handleForwardToRegistration={
							handleForwardToRegistration
						}
						loginParams={loginParams}
						welcomeScreenConfig={consultingType?.welcomeScreen}
						consultingTypeId={consultingType?.id}
						consultingTypeName={
							consultingType
								? translate(
										[
											`consultingType.${consultingType?.id}.titles.long`,
											`consultingType.fallback.titles.long`,
											consultingType?.titles.long
										],
										{ ns: 'consultingTypes' }
									)
								: null
						}
					/>
				) : (
					<RegistrationForm />
				))}
		</StageLayout>
	);
};
