import React from 'react';
import { StepBar } from '../../src/components/registration_new/stepBar/StepBar';
import { mount } from 'cypress/react';

it('shows correct steps', () => {
	mount(<StepBar maxNumberOfSteps={3} currentStep={1}></StepBar>);
	cy.get('h5').should(
		'contains.text',
		'registration.stepbar.step 1 registration.stepbar.of 3'
	);
});

it('show maxNumberofsteps if currentStep > maxNumberOfSteps', () => {
	mount(<StepBar maxNumberOfSteps={3} currentStep={4}></StepBar>);
	cy.get('h5').should(
		'contains.text',
		'registration.stepbar.step 3 registration.stepbar.of 3'
	);
});
