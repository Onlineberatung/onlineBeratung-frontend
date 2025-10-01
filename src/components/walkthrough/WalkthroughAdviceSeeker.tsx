import 'intro.js/introjs.css';
import './walkthrough.styles.scss';

import * as React from 'react';
import { useCallback, useContext, useRef } from 'react';

import { Steps } from 'intro.js-react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { apiPatchAdviceSeekerData } from '../../api';
import { useAskerHasAssignedConsultant } from '../../containers/bookings/hooks/useAskerHasAssignedConsultant';
import { UserDataContext } from '../../globalState';
import { useAppConfig } from '../../hooks/useAppConfig';
import adviceSeekerSteps from './adviceSeekerSteps';

export const WalkthroughAdviceSeeker = () => {
	const { t: translate } = useTranslation();

	const ref = useRef<any>();
	const settings = useAppConfig();
	const { userData, reloadUserData } = useContext(UserDataContext);
	const history = useHistory();
	const hasAssignedConsultant = useAskerHasAssignedConsultant();

	const onChangeStep = useCallback(() => {
		const pollForElements = () => {
			const steps = ref.current.props.steps;
			let allFound = true;

			steps.forEach((step, key) => {
				if (step.element) {
					const el = document.querySelector(step.element);
					if (el) {
						ref.current.introJs._introItems[key].element = el;
						ref.current.introJs._introItems[key].position =
							step.position ? step.position : 'bottom';
						ref.current.introJs.refresh();
					} else {
						allFound = false;
					}
				}
			});

			if (!allFound) {
				// Try again after 100ms, up to a max of 2 seconds
				if (pollForElements.attempts < 20) {
					pollForElements.attempts++;
					setTimeout(pollForElements, 100);
				}
			}
		};
		pollForElements.attempts = 0;
		setTimeout(pollForElements, 100);
	}, [ref]);

	const getWalkthroughKey = (userId: string) =>
		`walkthroughAdviceSeeker_${userId}`;

	const getCurrentLoginSession = () => {
		const loginTimestamp = sessionStorage.getItem('currentLoginSession');
		if (!loginTimestamp) {
			// Generate a new session identifier for this login
			const newSession = Date.now().toString();
			sessionStorage.setItem('currentLoginSession', newSession);
		}
		return loginTimestamp;
	};

	const walkthroughKey = getWalkthroughKey(userData.userId);
	const currentSession = getCurrentLoginSession();
	const lastShownSession = localStorage.getItem(
		`${walkthroughKey}_lastShown`
	);
	const hasShownWalkthrough = lastShownSession === currentSession;

	if (!settings.enableAdviceSeekerWalkThrough) {
		return null;
	}

	// Only show if initialInquirySent is false and not already shown in this session
	if (!userData.initialInquirySent && hasShownWalkthrough) {
		return null;
	}

	// If not enabled, or if initialInquirySent is true and walkthrough is not enabled, don't show
	if (!userData.isWalkThroughEnabled && userData.initialInquirySent) {
		return null;
	}

	const stepsData = adviceSeekerSteps({
		isSecondTour: !!userData.initialInquirySent,
		hasAssignedConsultant
	});

	return (
		<Steps
			ref={ref}
			enabled={!userData.twoFactorAuth.isShown}
			onExit={() => {
				console.log('Walkthrough exited');
				console.log(userData.isWalkThroughEnabled);
				apiPatchAdviceSeekerData({
					walkThroughEnabled: false
				})
					.then(reloadUserData)
					.catch(console.log);
				const currentSession = getCurrentLoginSession();
				const walkthroughKey = getWalkthroughKey(userData.userId);
				localStorage.setItem(
					`${walkthroughKey}_lastShown`,
					currentSession
				);
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
