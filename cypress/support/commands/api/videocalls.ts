import { endpoints } from '../../../../src/resources/scripts/endpoints';

const videocallsApi = (cy) => {
	cy.intercept('GET', `${endpoints.videocallServiceBase}/*/jwt`, (req) => {
		req.reply({
			domain: `/jitsi`,
			jwt: 'any_token'
		});
	}).as('videocalls_jwt_get');

	cy.intercept('POST', endpoints.startVideoCall, {
		fixture: 'service.videocalls.new'
	}).as('startVideoCall');

	cy.intercept('POST', endpoints.rejectVideoCall, {}).as('rejectVideoCall');
};

export default videocallsApi;
