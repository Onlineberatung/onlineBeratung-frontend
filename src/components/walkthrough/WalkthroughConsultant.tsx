import 'intro.js/introjs.css';
import './walkthrough.styles.scss';

import * as React from 'react';
import { useCallback, useContext, useRef } from 'react';

import { Steps } from 'intro.js-react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { apiPatchConsultantData } from '../../api';
import { ConsultingTypesContext, UserDataContext } from '../../globalState';
import { useAppConfig } from '../../hooks/useAppConfig';
import steps from './steps';

export const WalkthroughConsultant = () => {
	const { t: translate } = useTranslation();

	const { consultingTypes } = useContext(ConsultingTypesContext);
	const ref = useRef<any>();
	const settings = useAppConfig();
	const { userData, reloadUserData } = useContext(UserDataContext);
	const history = useHistory();

	const onChangeStep = useCallback(() => {
		setTimeout(() => {
			ref.current.props.steps.forEach((step, key) => {
				if (step.element) {
					ref.current.introJs._introItems[key].element =
						document.querySelector(step.element);
					ref.current.introJs._introItems[key].position =
						step.position ? step.position : 'bottom';
				}
			});
		}, 100);
	}, [ref]);

	const hasTeamAgency = userData.agencies?.some(
		(agency) => agency.teamAgency
	);
	const stepsData = steps({
		hasTeamAgency,
		anonymousConversationAllowed:
			consultingTypes?.[0]?.isAnonymousConversationAllowed
	});
	// Sometimes when not even showing the modal the steps are triggering the on exist callback so it was causing
	// to enable the WalkThrough and this way prevents from render
	if (!userData.isWalkThroughEnabled || !settings.enableWalkthrough) {
		return null;
	}

	return (
		<Steps
			ref={ref}
			enabled={!userData.twoFactorAuth.isShown}
			onExit={() => {
				apiPatchConsultantData({
					walkThroughEnabled: !userData.isWalkThroughEnabled
				})
					.then(reloadUserData)
					.catch(console.log);
			}}
			steps={stepsData.map((step) => ({
				...step,
				title: translate(step.title),
				intro: translate(step.intro)
			}))}
			initialStep={0}
			options={{
				hidePrev: true,
				nextLabel: translate('walkthrough.step.next'),
				prevLabel: translate('walkthrough.step.prev'),
				doneLabel: translate('walkthrough.step.done'),
				showProgress: false,
				showBullets: true,
				showStepNumbers: false
			}}
			onBeforeChange={(nextStepIndex) => {
				if (stepsData[nextStepIndex]?.path) {
					history.push(stepsData[nextStepIndex].path);
					onChangeStep();
				}
			}}
		/>
	);
};
