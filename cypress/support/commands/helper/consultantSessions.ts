import { deepMerge } from '../../helpers';
import { generateConsultantSession } from '../../sessions';

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

const consultantSessionsCommand = (getWillReturn, setWillReturn) =>
	Cypress.Commands.add(
		'consultantSession',
		(props: { [key: string]: any } = {}, index?: number) =>
			new Cypress.Promise((resolve) => {
				updateConsultantSession(props, index);
				setWillReturn('consultantSessions', consultantSessions);
				resolve(undefined);
			})
	);
export default consultantSessionsCommand;
