import { SESSION_LIST_TYPES } from '../../../src/components/session/sessionHelpers';
import { deepMerge } from '../helpers';
import { generateConsultantSession } from '../sessions';

let consultantEnquiries: any[] = [];

export const getConsultantEnquiries = () => consultantEnquiries;
export const setConsultantEnquiries = (sessions) =>
	(consultantEnquiries = sessions);

export const updateConsultantEnquiries = (
	props: { [key: string]: any },
	index?: number
) => {
	if (index !== undefined && consultantEnquiries?.[index]) {
		consultantEnquiries[index] = deepMerge(
			consultantEnquiries[index],
			props || {}
		);
	} else {
		consultantEnquiries.push(
			deepMerge(
				generateConsultantSession({ type: SESSION_LIST_TYPES.ENQUIRY }),
				props || {}
			)
		);
	}
};

Cypress.Commands.add(
	'consultantEnquiry',
	(props: { [key: string]: any } = {}, index?: number) =>
		new Promise((resolve) => {
			updateConsultantEnquiries(props, index);
			resolve(undefined);
		})
);
