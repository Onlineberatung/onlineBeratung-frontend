import { Steps } from 'intro.js-react';
import * as React from 'react';
import { useContext } from 'react';

import 'intro.js/introjs.css';
import './walkthrough.styles.scss';
import { translate } from '../../utils/translate';
import { UserDataContext } from '../../globalState';
import { apiPatchConsultantData } from '../../api';
import { config } from '../../resources/scripts/config';

import stepsData from './steps';
import peerStepsData from './peerSteps';

export const Walkthrough = () => {
	const { userData, setUserData } = useContext(UserDataContext);
	const {
		twoFactorAuth: { isShown: isShownTwoFactorNag }
	} = userData;
	return (
		<Steps
			enabled={
				userData.isWalkThroughEnabled &&
				config.enableWalkthrough &&
				!isShownTwoFactorNag
			}
			onExit={() => {
				apiPatchConsultantData({
					walkThroughEnabled: !userData.isWalkThroughEnabled
				})
					.then(() => {
						setUserData({
							...userData,
							isWalkThroughEnabled: !userData.isWalkThroughEnabled
						});
					})
					.catch(() => {
						// don't know what to do then :O)
					});
			}}
			steps={
				!userData.userRoles.includes('main-consultant') &&
				userData.userRoles.includes('peer-consultant')
					? peerStepsData
					: stepsData
			}
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
			onChange={function (nextStepIndex) {
				let element: HTMLElement = document.querySelector(
					nextStepIndex < 4
						? '.walkthrough_step_3'
						: `.walkthrough_step_${nextStepIndex}`
				);
				element?.click();
			}}
		/>
	);
};
