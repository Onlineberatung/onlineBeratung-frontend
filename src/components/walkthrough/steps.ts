interface StepsData {
	title: string;
	element?: string;
	intro: string;
	path?: string;
}

interface StepsFeatureFlag {
	anonymousConversationAllowed: boolean;
	hasTeamAgency?: boolean;
}

// images, etc. can be included via "<div className="hasBackgroundImage"><div>My Text</div> in the intro section
const steps = ({
	hasTeamAgency,
	anonymousConversationAllowed
}: StepsFeatureFlag): StepsData[] =>
	[
		{
			title: 'walkthrough.step.0.title',
			intro: 'walkthrough.step.0.intro'
		},
		{
			title: 'walkthrough.step.1.title',
			element: '.walkthrough-sessions-consultant-sessionpreview',
			intro: 'walkthrough.step.1.intro',
			path: '/sessions/consultant/sessionPreview'
		},
		anonymousConversationAllowed && {
			title: 'walkthrough.step.2.title',
			element: '.walkthrough_step_2',
			intro: 'walkthrough.step.2.intro',
			path: '/sessions/consultant/sessionPreview?sessionListTab=anonymous'
		},
		{
			title: 'walkthrough.step.3.title',
			element: '.walkthrough-sessions-consultant-sessionview',
			intro: 'walkthrough.step.3.intro',
			path: '/sessions/consultant/sessionView'
		},
		{
			title: 'walkthrough.step.4.title',
			element: '.walkthrough_step_4',
			intro: 'walkthrough.step.4.intro',
			path: '/sessions/consultant/sessionView?sessionListTab=archive'
		},
		hasTeamAgency && {
			title: 'walkthrough.step.5.title',
			element: '.walkthrough-sessions-consultant-teamsessionview',
			intro: 'walkthrough.step.5.intro',
			path: '/sessions/consultant/teamSessionView'
		},
		{
			title: 'walkthrough.step.6.title',
			element: '.walkthrough-profile',
			intro: 'walkthrough.step.6.intro',
			path: '/profile/allgemeines'
		}
	].filter(Boolean);

export default steps;
