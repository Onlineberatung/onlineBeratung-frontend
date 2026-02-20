import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StageLayout } from '../stageLayout/StageLayout';
import { WelcomeScreen } from '../registration/WelcomeScreen';
import { GlobalComponentContext } from '../../globalState/provider/GlobalComponentContext';
import { useTranslation } from 'react-i18next';
import useIsFirstVisit from '../../utils/useIsFirstVisit';
import { SEO } from '../seo/SEO';
import '../../resources/styles/styles.scss';
import { apiGetConsultingTypes } from '../../api';

export const Welcome = () => {
	const { t: translate } = useTranslation(['common']);
	const history = useHistory();
	const { Stage } = useContext(GlobalComponentContext);
	const isFirstVisit = useIsFirstVisit();
	const [liveChatConsultingTypeId, setLiveChatConsultingTypeId] = useState(0);

	useEffect(() => {
		apiGetConsultingTypes()
			.then((consultingTypes) => {
				const liveChatType = consultingTypes.find(
					(ct) => ct.isAnonymousConversationAllowed
				);
				if (liveChatType) {
					setLiveChatConsultingTypeId(liveChatType.id);
				}
			})
			.catch(() => {
				// silently ignore – live chat section simply stays hidden
			});
	}, []);

	const handleForwardToRegistration = () => {
		history.push('/beratung/registration');
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
				stage={<Stage hasAnimation={isFirstVisit} isReady={true} />}
				loginParams=""
			>
				<WelcomeScreen
					title={translate('registration.headline')}
					handleForwardToRegistration={handleForwardToRegistration}
					loginParams=""
					consultingTypeId={liveChatConsultingTypeId}
					consultingTypeName=""
				/>
			</StageLayout>
		</>
	);
};
