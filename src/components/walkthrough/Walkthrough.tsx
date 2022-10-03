import { Steps } from 'intro.js-react';
import * as React from 'react';
import { useContext, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import 'intro.js/introjs.css';
import './walkthrough.styles.scss';
import { translate } from '../../utils/translate';
import { UserDataContext } from '../../globalState';
import { apiPatchConsultantData } from '../../api';
import steps from './steps';
import { useAppConfig } from '../../hooks/useAppConfig';

export const Walkthrough = () => {
	const ref = useRef<any>();
	const settings = useAppConfig();
	const { userData, setUserData } = useContext(UserDataContext);
	const history = useHistory();

	const onChangeStep = useCallback(() => {
		ref.current.props.steps.forEach((step, key) => {
			if (step.element) {
				ref.current.introJs._introItems[key].element =
					document.querySelector(step.element);
				ref.current.introJs._introItems[key].position = step.position
					? step.position
					: 'bottom';
			}
		});
	}, [ref]);

	const hasTeamAgency = userData.agencies?.some(
		(agency) => agency.teamAgency
	);
	const stepsData = steps({ hasTeamAgency });
	// Sometimes when not even showing the modal the steps are triggering the on exist callback so it was causing
	// to enable the WalkThrough and this way prevents from render
	if (!userData.isWalkThroughEnabled || !settings.enableWalkThrough) {
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
			steps={stepsData}
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
