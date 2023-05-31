import React from 'react';
import { ZipcodeInput } from '../../src/components/registration_new/zipcodeInput/zipcodeInput';
import { mount } from 'cypress/react';

it('shows correct label', () => {
	mount(<ZipcodeInput></ZipcodeInput>);
	cy.get('label').should('contains.text', 'registration.zipcode.label');
});

it('shows correct value', () => {
	mount(<ZipcodeInput></ZipcodeInput>);
	cy.get('input').type('12345');
	cy.get('input').invoke('val').should('equal', '12345');
});

it('show invalid input onBlur', () => {
	mount(<ZipcodeInput></ZipcodeInput>);
	cy.get('input').type('123');
	cy.get('body').click(0, 0);
	cy.get('input').should('have.attr', 'aria-invalid', 'true');
});

it('does not show wrong characters', () => {
	mount(<ZipcodeInput></ZipcodeInput>);
	cy.get('input').type('abc123');
	cy.get('input').invoke('val').should('equal', '123');
});
