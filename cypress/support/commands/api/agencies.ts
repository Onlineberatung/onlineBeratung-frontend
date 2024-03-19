import { endpoints } from '../../../../src/resources/scripts/endpoints';

const agenciesApi = (cy, getWillReturn, setWillReturn) => {
	cy.intercept('GET', `${endpoints.agencyServiceBase}/*`, (req) => {
		const agencies = getWillReturn('agencies');
		const aid = new URL(req.url).pathname.split('/')[3];
		req.reply(
			agencies.filter((a) => a.id === parseInt(aid)) || {
				statusCode: 404
			}
		);
	}).as('service.agencies.id');

	cy.intercept('GET', `${endpoints.agencyServiceBase}*`, (req) => {
		const searchParams = new URL(req.url).searchParams;
		let agencies = getWillReturn('agencies');
		if (searchParams.has('topicId')) {
			agencies = agencies.filter((a) =>
				a.topicIds?.includes(parseInt(searchParams.get('topicId')))
			);
		} else if (searchParams.has('consultingType')) {
			agencies = agencies.filter(
				(a) =>
					a.consultingType ===
					parseInt(searchParams.get('consultingType'))
			);
		}
		req.reply(agencies);
	}).as('service.agencies');
};

export default agenciesApi;
