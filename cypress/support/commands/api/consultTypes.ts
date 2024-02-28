import { endpoints } from '../../../../src/resources/scripts/endpoints';

const consultingTypesApi = (cy, getWillReturn, setWillReturn) => {
	cy.intercept(
		`${endpoints.consultingTypeServiceBase}/byslug/*/full`,
		(req) => {
			const slug = new URL(req.url).pathname.split('/')[4];

			const consultingTypes = getWillReturn('consultingTypes');
			const consultingType =
				consultingTypes.find(
					(consultingType) => consultingType.slug === slug
				) ||
				getWillReturn(`consultingType.${slug}`) ||
				getWillReturn('consultingType');
			req.reply(consultingType || { statusCode: 404 });
			/*
			req.reply({
				...(
					consultingTypes.find((consultingType) => consultingType.slug === slug) || {}
				),
				...(getWillReturn('consultingType')),
				...(getWillReturn(`consultingType.${slug}`)),
			});
			*/
		}
	).as('consultingTypeServiceBySlugFull');

	cy.intercept(`${endpoints.consultingTypeServiceBase}/*/full`, (req) => {
		const id = parseInt(new URL(req.url).pathname.split('/')[3]);

		const consultingTypes = getWillReturn('consultingTypes');
		const consultingType =
			consultingTypes.find(
				(consultingType) => consultingType.id === id
			) ||
			getWillReturn(`consultingType.${id}`) ||
			getWillReturn('consultingType');
		req.reply(consultingType || { statusCode: 404 });
		/*
		req.reply({
			...(consultingTypes.find((consultingType) => consultingType.id === id) || {}),
			...(getWillReturn('consultingType')),
			...(getWillReturn(`consultingType.${id}`)),
		});
		 */
	}).as('consultingTypeServiceBaseFull');

	cy.intercept(`${endpoints.consultingTypeServiceBase}/basic`, (req) => {
		req.reply(getWillReturn('consultingTypes'));
	}).as('consultingTypeServiceBaseBasic');
};

export default consultingTypesApi;
