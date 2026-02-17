import * as React from 'react';
import unionBy from 'lodash/unionBy';
import { useContext, useEffect, useState } from 'react';
import { getUrlParameter } from '../../utils/getUrlParameter';
import { InformalContext } from '../../globalState';
import { RegistrationForm } from './RegistrationForm';
import '../../resources/styles/styles.scss';
import { StageLayout } from '../stageLayout/StageLayout';
import useIsFirstVisit from '../../utils/useIsFirstVisit';
import { useTranslation } from 'react-i18next';
import { GlobalComponentContext } from '../../globalState/provider/GlobalComponentContext';
import { UrlParamsContext } from '../../globalState/provider/UrlParamsProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import { SEO } from '../seo/SEO';

export const Registration = () => {
	const { t: translate } = useTranslation([
		'common',
		'consultingTypes',
		'agencies'
	]);

	const agencyId = getUrlParameter('aid');
	const consultantId = getUrlParameter('cid');
	const postcodeParameter = getUrlParameter('postcode');
	const settings = useAppConfig();

	const { setInformal } = useContext(InformalContext);
	const { Stage } = useContext(GlobalComponentContext);

	const loginParams = Object.entries({
		cid: consultantId,
		aid: agencyId
	})
		.filter(([, value]) => value)
		.map(([key, value]) => `${key}=${value}`)
		.join('&');

	const [isReady, setIsReady] = useState(false);

	const { agency, consultingType, consultant, topic, loaded } =
		useContext(UrlParamsContext);

	useEffect(() => {
		if (!loaded) {
			return;
		}

		// We now allow registration with just a consultingType (default one)
		// since backend requires it. Only redirect to welcome if we have nothing at all.
		if (!consultingType && !agency && !consultant && !topic) {
			console.error(
				'No `consultingType`, `consultant`, `agency` or `topic` found in URL. Redirecting to welcome.'
			);
			window.location.href = '/welcome';
			return;
		}

		try {
			if (consultant) {
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
		translate,
		setInformal,
		settings.urls.toRegistration,
		topic
	]);

	const isFirstVisit = useIsFirstVisit();

	return (
		<>
			<SEO
				title={translate('registration.headline')}
				description={translate('registration.intro.seoDescription')}
				keywords={translate('registration.intro.seoKeywords')}
			/>
			<StageLayout
				showLegalLinks={true}
				showLoginLink={true}
				stage={<Stage hasAnimation={isFirstVisit} isReady={isReady} />}
				loginParams={loginParams}
			>
			{isReady && (
				<RegistrationForm />
			)}
			</StageLayout>
		</>
	);
};
