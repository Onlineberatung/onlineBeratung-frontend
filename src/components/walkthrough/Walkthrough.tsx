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

export const Walkthrough = () => {
	const { userData, setUserData } = useContext(UserDataContext);

	return (
		<Steps
			enabled={
				userData.isWalkThroughEnabled &&
				config.enableWalkthrough &&
				!userData.twoFactorAuth.isShown
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
			onChange={function (nextStepIndex) {
				switch (nextStepIndex) {
					case 0:
						break;
					case 1:
						let erstanfragenElement: HTMLElement =
							document.querySelector(
								"a[href='/sessions/consultant/sessionPreview']"
							);

						erstanfragenElement?.click();
						break;
					case 2:
						let liveChatElement: HTMLElement =
							document.querySelector(
								"a[href='/sessions/consultant/sessionPreview?sessionListTab=anonymous']"
							);
						liveChatElement?.click();
						break;
					case 3:
						let myMessagesElement: HTMLElement =
							document.querySelector(
								"a[href='/sessions/consultant/sessionView']"
							);
						myMessagesElement?.click();
						break;
					case 4:
						let archiveElement: HTMLElement =
							document.querySelector(
								"a[href='/sessions/consultant/sessionView?sessionListTab=archive']"
							);
						archiveElement?.click();
						break;
					case 5:
						let teamBeratungElement: HTMLElement =
							document.querySelector(
								"a[href='/sessions/consultant/teamSessionView']"
							);
						teamBeratungElement?.click();
						break;
					case 6:
						let profileElement: HTMLElement =
							document.querySelector("a[href='/profile']");
						profileElement?.click();
						break;
				}
			}}
		/>
	);
};
