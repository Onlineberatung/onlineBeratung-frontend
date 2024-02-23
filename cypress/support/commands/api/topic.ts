import { endpoints } from '../../../../src/resources/scripts/endpoints';

const topicsApi = (cy, getWillReturn, setWillReturn) => {
	cy.intercept('GET', endpoints.topicsData, (req) => {
		req.reply(getWillReturn('topics') || { statusCode: 404 });
	}).as('topics');
};

export default topicsApi;
