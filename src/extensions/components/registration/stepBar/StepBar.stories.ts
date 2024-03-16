import { Meta } from '@storybook/react';

import { StepBar } from './StepBar';

export default {
	title: 'Registration/StepBar',
	component: StepBar
} as Meta<typeof StepBar>;

export const Default = {
	args: {
		maxNumberOfSteps: 3,
		currentStep: 2
	}
};
