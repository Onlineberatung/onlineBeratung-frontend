import { Steps } from 'intro.js-react';
import * as React from 'react';
import { useContext } from 'react';
import stepsData from './steps';

import 'intro.js/introjs.css';
import './walkthrough.styles.scss';
import { translate } from '../../utils/translate';
import { UserDataContext } from '../../globalState';
import { apiPatchConsultantData } from '../../api';
import { config } from '../../resources/scripts/config';

export const Walkthrough = () => {
	const { userData, setUserData } = useContext(UserDataContext);

	return (
		<Steps
			enabled={userData.isWalkThroughEnabled && config.enableWalkthrough}
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
		/>
	);
};
