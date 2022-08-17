import { translate } from '../../utils/translate';

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
			title: translate('walkthrough.step.0.title'),
			intro: translate('walkthrough.step.0')
		},
		{
			title: translate('walkthrough.step.1.title'),
			element: '.walkthrough_step_1',
			intro: translate('walkthrough.step.1'),
			path: '/sessions/consultant/sessionPreview'
		},
		{
			title: translate('walkthrough.step.2.title'),
			element: '.walkthrough_step_2',
			intro: translate('walkthrough.step.2'),
			path: '/sessions/consultant/sessionPreview?sessionListTab=anonymous'
		},
		{
			title: translate('walkthrough.step.3.title'),
			element: '.walkthrough_step_3',
			intro: translate('walkthrough.step.3'),
			path: '/sessions/consultant/sessionView'
		},
		{
			title: translate('walkthrough.step.4.title'),
			element: '.walkthrough_step_4',
			intro: translate('walkthrough.step.4'),
			path: '/sessions/consultant/sessionView?sessionListTab=archive'
		},
		hasTeamAgency && {
			title: translate('walkthrough.step.5.title'),
			element: '.walkthrough_step_5',
			intro: translate('walkthrough.step.5'),
			path: '/sessions/consultant/teamSessionView'
		},
		{
			title: translate('walkthrough.step.6.title'),
			element: '.walkthrough_step_6',
			intro: translate('walkthrough.step.6'),
			path: '/profile/allgemeines'
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
