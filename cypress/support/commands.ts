import './commands/askerSessions';
import './commands/consultantSessions';
import './commands/login';
import './commands/messages';
import './commands/mockApi';
import './commands/socket';

import { LoginArgs } from './commands/login';
import { AppointmentsDataInterface } from '../../src/globalState/interfaces';

declare global {
	namespace Cypress {
		interface Chainable {
			login(args?: LoginArgs): Chainable<Element>;
			fastLogin(args?: LoginArgs): Chainable<Element>;
			appointments(
				args?: Partial<AppointmentsDataInterface>,
				index?: number
			): Chainable<Element>;
			askerSession(
				args?: { [key: string]: any },
				index?: number
			): Chainable<Element>;
			consultantSession(
				args?: { [key: string]: any },
				index?: number
			): Chainable<Element>;
			addMessage(props?: { [key: string]: any }, index?: number);
			mockApi(): Chainable<Element>;
			willReturn(name: string, data: any): Chainable<Element>;
			emitDirectMessage(index?: number): Chainable<Element>;
			emitVideoCallRequest(): Chainable<Element>;
			waitForSubscriptions(events: string[]): Chainable<Element>;
		}
	}
}

let sessions = [];

export const getSessions = () => sessions;
