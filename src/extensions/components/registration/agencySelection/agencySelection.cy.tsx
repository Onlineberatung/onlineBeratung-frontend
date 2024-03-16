import React from 'react';
import { AgencySelection } from './AgencySelection';
import { endpoints } from '../../../../resources/scripts/endpoints';
import { RegistrationContext } from '../../../../globalState';
import { BrowserRouter as Router } from 'react-router-dom';

it('Get results for zipcode', () => {
	cy.fixture('service.agencies.json').then((data) => {
		cy.intercept(new RegExp(`${endpoints.agencyServiceBase}*`), data).as(
			'agencies'
		);
	});
	cy.mount(
		<Router>
			<RegistrationContext.Provider
				value={{
					setDisabledNextButton: () => {},
					setDataForSessionStorage: () => {},
					isConsultantLink: false,
					consultant: null,
					sessionStorageRegistrationData: {
						zipcode: '12345',
						username: null,
						agencyId: null,
						mainTopicId: null,
						password: null
					}
				}}
			>
				<AgencySelection nextStepUrl="" onNextClick={() => {}} />
			</RegistrationContext.Provider>
		</Router>
	);
	cy.get('p').should('contains.text', 'name');
});
