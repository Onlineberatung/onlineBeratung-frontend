import { endpoints } from '../../../../../src/resources/scripts/endpoints';

const usersDataApi = (
	cy: Cypress.cy & CyEventEmitter,
	getWillReturn,
	setWillReturn
) => {
	cy.intercept('GET', endpoints.userData, (req) => {
		req.reply(getWillReturn('userData'));
	}).as('usersData');

	cy.intercept('PATCH', endpoints.userData, (req) => {
		console.log(getWillReturn('userData'), req.body);
		setWillReturn('userData', {
			...getWillReturn('userData'),
			...req.body
		});
		req.reply({});
	}).as('patchUsersData');
};

export default usersDataApi;
