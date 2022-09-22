import { endpoints } from '../../../../src/resources/scripts/endpoints';

const videocallsApi = (cy) => {
	cy.intercept('GET', `${endpoints.videocallServiceBase}/*/jwt`, (req) => {
		req.reply({
			domain: `/jitsi`,
			jwt: 'any_token'
		});
	}).as('videocalls_jwt_get');
};

export default videocallsApi;
