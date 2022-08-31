interface StepsData {
	title: string;
	element?: string;
	intro: string;
	path?: string;
}

interface StepsFeatureFlag {
	hasTeamAgency?: boolean;
}

// images, etc. can be included via "<div className="hasBackgroundImage"><div>My Text</div> in the intro section
const steps = ({ hasTeamAgency }: StepsFeatureFlag): StepsData[] =>
	[
		{
			title: 'walkthrough.step.0.title',
			intro: 'walkthrough.step.0.intro'
		},
		{
			title: 'walkthrough.step.1.title',
			element: '.walkthrough_step_1',
			intro: 'walkthrough.step.1.intro',
			path: '/sessions/consultant/sessionPreview'
		},
		{
			title: 'walkthrough.step.2.title',
			element: '.walkthrough_step_2',
			intro: 'walkthrough.step.2.intro',
			path: '/sessions/consultant/sessionPreview?sessionListTab=anonymous'
		},
		{
			title: 'walkthrough.step.3.title',
			element: '.walkthrough_step_3',
			intro: 'walkthrough.step.3.intro',
			path: '/sessions/consultant/sessionView'
		},
		{
			title: 'walkthrough.step.4.title',
			element: '.walkthrough_step_4',
			intro: 'walkthrough.step.4.intro',
			path: '/sessions/consultant/sessionView?sessionListTab=archive'
		},
		{
			title: 'walkthrough.step.5.title',
			element: '.walkthrough_step_5',
			intro: 'walkthrough.step.5.intro',
			path: '/sessions/consultant/teamSessionView'
		},
		{
			title: 'walkthrough.step.6.title',
			element: '.walkthrough_step_6',
			intro: 'walkthrough.step.6.intro',
			path: '/profile'
		}
	]
		.filter(Boolean)
		.map((step, i) => {
			return {
				...step,
				element: step.element ? '.walkthrough_step_' + i : step.element
			};
		});

export default steps;
