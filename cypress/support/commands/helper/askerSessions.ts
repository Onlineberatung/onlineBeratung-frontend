import { deepMerge } from '../../helpers';
import { generateAskerSession } from '../../sessions';

export let askerSessions: UserService.Schemas.UserSessionResponseDTO[] = [];

export const getAskerSessions = () => askerSessions;
export const setAskerSessions = (sessions) => (askerSessions = sessions);

export const updateAskerSession = (
	props: { [key: string]: any },
	index?: number
) => {
	if (index !== undefined && askerSessions?.[index]) {
		askerSessions[index] = deepMerge(askerSessions[index], props || {});
	} else {
		askerSessions.push(deepMerge(generateAskerSession(), props || {}));
	}
};

const askersSessionsCommand = (getWillReturn, setWillReturn) =>
	Cypress.Commands.add(
		'askerSession',
		(props: { [key: string]: any } = {}, index?: number) =>
			new Cypress.Promise((resolve) => {
				updateAskerSession(props, index);
				setWillReturn('askerSessions', askerSessions);
				resolve(undefined);
			})
	);

export default askersSessionsCommand;
