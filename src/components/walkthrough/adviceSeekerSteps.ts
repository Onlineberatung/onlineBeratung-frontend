interface StepsFeatureFlag {
	isSecondTour: boolean;
	hasAssignedConsultant: boolean;
}

interface StepsData {
	title: string;
	element?: string;
	intro: string;
	path?: string;
}

// images, etc. can be included via "<div className="hasBackgroundImage"><div>My Text</div> in the intro section
const adviceSeekerSteps = ({
	isSecondTour,
	hasAssignedConsultant
}: StepsFeatureFlag): StepsData[] => {
	if (isSecondTour) {
		return [
			{
				title: 'askerSecondRoundWalkthrough.step.0.title',
				intro: 'askerSecondRoundWalkthrough.step.0.intro'
			},
			{
				title: 'askerSecondRoundWalkthrough.step.1.title',
				element: '.walkthrough-sessions-user-view',
				intro: 'askerSecondRoundWalkthrough.step.1.intro',
				path: '/sessions/user/view'
			},
			{
				title: 'askerSecondRoundWalkthrough.step.2.title',
				element: '.walkthrough-asker-profile-about-me-data',
				intro: 'askerSecondRoundWalkthrough.step.2.intro',
				path: '/profile/allgemeines'
			},
			hasAssignedConsultant && {
				title: 'askerSecondRoundWalkthrough.step.3.title',
				element: '.walkthrough-booking-events',
				intro: 'askerSecondRoundWalkthrough.step.3.intro',
				path: '/booking/events/gebuchte'
			}
		].filter(Boolean);
	}
	return [
		{
			title: 'askerFirstRoundWalkthrough.step.0.title',
			intro: 'askerFirstRoundWalkthrough.step.0.intro'
		},
		{
			title: 'askerFirstRoundWalkthrough.step.1.title',
			element: '.walkthrough-wrapper-send-message',
			intro: 'askerFirstRoundWalkthrough.step.1.intro',
			path: '/sessions/user/view/write/'
		},
		{
			title: 'askerFirstRoundWalkthrough.step.2.title',
			element: '.walkthrough-booking-button',
			intro: 'askerFirstRoundWalkthrough.step.2.intro',
			path: '/sessions/user/view/write/'
		},
		{
			title: 'askerFirstRoundWalkthrough.step.3.title',
			element: '.walkthrough-asker-profile-about-me-data',
			intro: 'askerFirstRoundWalkthrough.step.3.intro',
			path: '/profile/allgemeines'
		},
		{
			title: 'askerFirstRoundWalkthrough.step.4.title',
			element: '.walkthrough-sessions-user-view',
			intro: 'askerFirstRoundWalkthrough.step.4.intro',
			path: '/sessions/user/view/write/'
		}
	].filter(Boolean);
};

export default adviceSeekerSteps;
