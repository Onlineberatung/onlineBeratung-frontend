import { deepMerge } from '../helpers';
import { generateConsultantSession } from '../sessions';

let consultantSessions: UserService.Schemas.ConsultantSessionResponseDTO[] = [];

export const getConsultantSessions = () => consultantSessions;
export const setConsultantSessions = (sessions) =>
	(consultantSessions = sessions);

export const updateConsultantSession = (
	props: { [key: string]: any },
	index?: number
) => {
	if (index !== undefined && consultantSessions?.[index]) {
		consultantSessions[index] = deepMerge(
			consultantSessions[index],
			props || {}
		);
	} else {
		consultantSessions.push(
			deepMerge(generateConsultantSession(), props || {})
		);
	}
};

Cypress.Commands.add(
	'consultantSession',
	(props: { [key: string]: any } = {}, index?: number) =>
		new Promise((resolve) => {
			updateConsultantSession(props, index);
			resolve(undefined);
		})
);

Cypress.Commands.add('getConsultantSessions', () => {
	cy.wrap(getConsultantSessions());
});
