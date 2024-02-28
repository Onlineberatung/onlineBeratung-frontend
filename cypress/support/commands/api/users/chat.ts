/*
/service/users/consultants/adsf-asdf-asdf
 */
import { endpoints } from '../../../../../src/resources/scripts/endpoints';

const usersChatApi = (cy, getWillReturn, setWillReturn) => {
	cy.intercept('PUT', endpoints.userUpdateE2EKey, {
		statusCode: 200
	});
};

export default usersChatApi;
