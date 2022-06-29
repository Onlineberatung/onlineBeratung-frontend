import { config } from '../../../../src/resources/scripts/config';

const videocallsApi = (cy) => {
	cy.intercept(
		'GET',
		`${config.endpoints.videocallServiceBase}/*/jwt`,
		(req) => {
			req.reply({
				domain: `${Cypress.env('REACT_APP_UI_URL')
					.replace('http://', '')
					.replace('https://', '')}/jitsi`,
				jwt: 'any_token'
			});
		}
	).as('videocalls_jwt_get');
};

export default videocallsApi;
