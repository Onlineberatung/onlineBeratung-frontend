/*
/service/users/consultants/adsf-asdf-asdf
 */
import { endpoints } from '../../../../../src/resources/scripts/endpoints';

const usersConsultantsApi = (cy, getWillReturn, setWillReturn) => {
	cy.intercept('GET', endpoints.consultantsLanguages, (req) => {
		req.reply(getWillReturn('agencyConsultantsLanguages'));
	}).as('agencyConsultants');

	cy.intercept('PUT', endpoints.setAbsence, (req) => {
		setWillReturn('userData', {
			...getWillReturn('userData'),
			absenceMessage: req.body.message,
			absent: req.body.absent
		});
		req.reply({});
	}).as('putSetAbsence');

	cy.intercept('GET', `${endpoints.agencyConsultants}/*`, (req) => {
		const cid = new URL(req.url).pathname.split('/')[4];
		const consultants = getWillReturn('agencyConsultants');
		const consultant = consultants.find((c) => c.consultantId === cid);
		req.reply(consultant || { statusCode: 404 });
	}).as('agencyConsultants.id');

	cy.intercept('GET', `${endpoints.agencyConsultants}*`, (req) => {
		req.reply(getWillReturn('agencyConsultants'));
	}).as('agencyConsultants');
};

export default usersConsultantsApi;
