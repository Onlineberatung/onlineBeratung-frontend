import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import unionBy from 'lodash/unionBy';
import { StageLayout } from '../stageLayout/StageLayout';
import { WelcomeScreen } from '../registration/WelcomeScreen';
import { GlobalComponentContext } from '../../globalState/provider/GlobalComponentContext';
import { UrlParamsContext } from '../../globalState/provider/UrlParamsProvider';
import { InformalContext } from '../../globalState';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';
import useIsFirstVisit from '../../utils/useIsFirstVisit';
import { getUrlParameter } from '../../utils/getUrlParameter';
import { SEO } from '../seo/SEO';
import '../../resources/styles/styles.scss';

export const Welcome = () => {
	const { t: translate } = useTranslation([
		'common',
		'consultingTypes',
		'agencies'
	]);
	const history = useHistory();
	const settings = useAppConfig();
	
	const agencyId = getUrlParameter('aid');
	const consultantId = getUrlParameter('cid');
	const postcodeParameter = getUrlParameter('postcode');
	
	const { setInformal } = useContext(InformalContext);
	const { Stage } = useContext(GlobalComponentContext);
	const { agency, consultingType, consultant, topic, loaded } =
		useContext(UrlParamsContext);
	
	const [isReady, setIsReady] = useState(false);
	const isFirstVisit = useIsFirstVisit();
	
	// Build URL parameters for registration and login links
	const urlParams = Object.entries({
		cid: consultantId,
		aid: agencyId,
		postcode: postcodeParameter
	})
		.filter(([, value]) => value)
		.map(([key, value]) => `${key}=${value}`)
		.join('&');
	
	const loginParams = Object.entries({
		cid: consultantId,
		aid: agencyId
	})
		.filter(([, value]) => value)
		.map(([key, value]) => `${key}=${value}`)
		.join('&');
	
	useEffect(() => {
		if (!loaded) {
			return;
		}
		
		// Welcome screen can display without consulting type/agency/consultant/topic
		// Only set up formal/informal and title if they are available
		if (!consultingType && !agency && !consultant && !topic) {
			console.log(
				'No `consultingType`, `consultant`, `agency` or `topic` found in URL. Showing generic welcome screen.'
			);
			setIsReady(true);
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
	
	const handleForwardToRegistration = () => {
		// Navigate to registration with URL parameters
		const registrationPath = '/beratung/registration';
		const path = urlParams ? `${registrationPath}?${urlParams}` : registrationPath;
		history.push(path);
	};
	
	return (
		<>
			<SEO
				title={translate('registration.headline')}
				description={translate('registration.intro.seoDescription')}
				keywords={translate('registration.intro.seoKeywords')}
			/>
			<StageLayout
				showLegalLinks={true}
				showLoginLink={false}
				stage={<Stage hasAnimation={isFirstVisit} isReady={isReady} />}
				loginParams={loginParams}
			>
				{isReady && (
					<WelcomeScreen
						title={
							consultingType
								? translate(
										[
											`consultingType.${consultingType?.id}.titles.welcome`,
											`consultingType.fallback.titles.welcome`,
											consultingType?.titles.welcome
										],
										{
											ns: 'consultingTypes'
										}
								  )
								: translate('registration.headline')
						}
						handleForwardToRegistration={handleForwardToRegistration}
						welcomeScreenConfig={
							consultingType?.registration?.welcomeScreen ||
							agency?.consultingTypeRel?.registration?.welcomeScreen
						}
						loginParams={loginParams}
						consultingTypeId={
							consultingType?.id ||
							agency?.consultingTypeRel?.id ||
							0
						}
						consultingTypeName={
							consultingType
								? translate(
										[
											`consultingType.${consultingType?.id}.titles.long`,
											`consultingType.fallback.titles.long`,
											consultingType?.titles.long
										],
										{
											ns: 'consultingTypes'
										}
								  )
								: ''
						}
					/>
				)}
			</StageLayout>
		</>
	);
};
