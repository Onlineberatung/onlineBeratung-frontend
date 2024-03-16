import React from 'react';
import { TopicSelection } from './TopicSelection';
import { endpoints } from '../../../../resources/scripts/endpoints';
import { RegistrationProvider } from '../../../../globalState';
import { BrowserRouter as Router } from 'react-router-dom';

it('Get accordion content', () => {
	cy.fixture('service.topicGroups.json').then((data) => {
		cy.intercept(new RegExp(`${endpoints.topicGroups}*`), data).as(
			'topicGroups'
		);
	});
	cy.fixture('service.topics.json').then((data) => {
		cy.intercept(new RegExp(`${endpoints.topicsData}*`), data).as('topics');
	});
	cy.mount(
		<Router>
			<RegistrationProvider>
				<TopicSelection nextStepUrl="" onNextClick={() => {}} />
			</RegistrationProvider>
		</Router>
	);
	cy.get('h4').should('contains.text', 'Alter');
});
