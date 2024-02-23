/*
/service/users/consultants/adsf-asdf-asdf
 */
import { endpoints } from '../../../../src/resources/scripts/endpoints';

const uploadsApi = (cy, getWillReturn, setWillReturn) => {
	cy.intercept('POST', `${endpoints.attachmentUpload}*`, (req) =>
		req.reply(getWillReturn('attachmentUpload'))
	).as('attachmentUpload');
};

export default uploadsApi;
