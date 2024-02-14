import { deepMerge } from '../../helpers';
import { LoginArgs, USER_ASKER } from '../mockApi';

const loginCommand = (getWillReturn, setWillReturn) =>
	Cypress.Commands.add(
		'login',
		(
			args: LoginArgs = {
				userId: USER_ASKER
			}
		) => {
			const userId = args.userId || USER_ASKER;

			cy.fixture('service.users.data').then((usersData) => {
				const userData = usersData.find((u) => u.userId === userId);
				setWillReturn('userData', userData, true);
				cy.setCookie('cy_username', userData.userName);
				cy.setCookie('cy_userId', userData.userId);

				cy.fixture('api.v1.login').then((rcUserData) => {
					setWillReturn(
						'rcLogin',
						deepMerge(rcUserData, {
							data: {
								userId: userData.userId,
								userName: userData.userName
							}
						})
					);
				});

				cy.visit('/login');
				cy.get('.loginForm');
				cy.get('#username').type(userData.userName, { force: true });
				cy.get('#passwordInput').type('password', { force: true });
				cy.get('.button__primary').click();
				cy.wait('@authToken');
				cy.get('#appRoot').should('be.visible');
			});
		}
	);

export default loginCommand;
