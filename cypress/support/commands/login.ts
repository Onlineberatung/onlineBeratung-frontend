import { UserDataInterface } from '../../../src/globalState/interfaces';
import { CyHttpMessages, RouteHandler } from 'cypress/types/net-stubbing';

export const USER_ASKER = 'asker';
export const USER_CONSULTANT = 'consultant';
export const USER_VIDEO = 'video';

export interface LoginArgs {
	username?: typeof USER_ASKER | typeof USER_CONSULTANT | typeof USER_VIDEO;
	auth?: {
		expires_in?: number;
		refresh_expires_in?: number;
	};
	// TODO: why is this type not available in userservice's openapi spec?
	userData?: Partial<UserDataInterface>;
	attachmentUpload?: Partial<CyHttpMessages.IncomingResponse>;
	sessions?:
		| UserService.Schemas.UserSessionResponseDTO[]
		| UserService.Schemas.ConsultantSessionResponseDTO[];
	messages?: MessageService.Schemas.MessagesDTO[];
	userSessionsTimeout?: number;
	sessionsCallback?: RouteHandler;
}

Cypress.Commands.add(
	'login',
	(
		args: LoginArgs = {
			username: USER_ASKER
		}
	) => {
		cy.visit('/login');

		cy.get('.loginForm');
		cy.get('#username').type(args.username || USER_ASKER, { force: true });
		cy.get('#passwordInput').type('password', { force: true });
		cy.get('.button__primary').click();
		cy.wait('@authToken');
		cy.get('#appRoot').should('be.visible');
	}
);
