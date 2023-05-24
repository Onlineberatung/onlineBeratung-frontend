import React from 'react';
import { AgencySelection } from '../../src/components/registration_new/agencySelection/agencySelection';
import { endpoints } from '../../src/resources/scripts/endpoints';
import { mount } from 'cypress/react';

let agencies = [];

it('Get results for zipcode', () => {
	mount(<AgencySelection></AgencySelection>);
	cy.fixture('service.agencies.json').then((data) => {
		agencies = data;
		cy.intercept(new RegExp(`${endpoints.agencyServiceBase}*`), data).as(
			'agencies'
		);
	});
	cy.get('input').type('12345');
	cy.get('input').invoke('val').should('equal', '12345');
	cy.get('p').should('contains.text', 'name');
});
