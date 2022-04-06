import { translate } from '../../utils/translate';

// images, etc. can be included via "<div className="hasBackgroundImage"><div>My Text</div> in the intro section
const stepsData = [
	{
		title: translate('walkthrough.step.0.title'),
		intro: translate('walkthrough.step.0')
	},
	{
		title: translate('walkthrough.step.1.title'),
		element: '.walkthrough_step_1',
		intro: translate('walkthrough.step.1')
	},
	{
		title: translate('walkthrough.step.2.title'),
		element: '.walkthrough_step_2',
		intro: translate('walkthrough.step.2')
	},
	{
		title: translate('walkthrough.step.3.title'),
		element: '.walkthrough_step_3',
		intro: translate('walkthrough.step.3')
	},
	{
		title: translate('walkthrough.step.4.title'),
		element: '.walkthrough_step_4',
		intro: translate('walkthrough.step.4')
	},
	{
		title: translate('walkthrough.step.5.title'),
		element: '.walkthrough_step_5',
		intro: translate('walkthrough.step.5')
	},
	{
		title: translate('walkthrough.step.6.title'),
		element: '.walkthrough_step_6',
		intro: translate('walkthrough.step.6')
	}
];

export default stepsData;
