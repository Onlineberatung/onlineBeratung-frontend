/// <reference types="cypress" />

import { LoginArgs } from './commands/mockApi';
import * as Bluebird from 'cypress/types/bluebird';

declare global {
	namespace Cypress {
		interface Chainable {
			login(args?: LoginArgs): Chainable<Element>;

			fastLogin(args?: LoginArgs): Chainable<Element>;

			askerSession(
				args?: { [key: string]: any },
				index?: number
			): Bluebird<unknown>;

			consultantSession(
				args?: { [key: string]: any },
				index?: number
			): Bluebird<unknown>;

			addMessage(
				props?: { [key: string]: any },
				index?: number
			): Bluebird<unknown>;

			mockApi(): Chainable<Element>;

			willReturn(
				name: string,
				data: any,
				mergeData?: boolean
			): Chainable<undefined>;
			willReturn(name: string): Chainable<any>;

			emitDirectMessage(index?: number): Chainable<Element>;

			emitVideoCallRequest(): Chainable<Element>;

			waitForSubscriptions(events: string[]): Chainable<Element>;
		}
	}
}
