import { LoginArgs, USER_ASKER } from '../mockApi';

const fastLoginCommand = (getWillReturn, setWillReturn) =>
	Cypress.Commands.add(
		'fastLogin',
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
			});

			// ToDo: Required?
			window.sessionStorage.removeItem('public_key');
			window.sessionStorage.removeItem('private_key');
			cy.clearCookie('lang');
			cy.willReturn('userData', { preferredLanguage: null }, true);

			cy.window().then((window) => {
				cy.fixture('api.v1.login').then((res) => {
					if (res.data.authToken) {
						cy.setCookie('rc_token', res.data.authToken);
					}
					if (res.data.userId) {
						cy.setCookie('rc_uid', res.data.userId);
						// masterkey dev user pregnancy
						window.localStorage.setItem(
							`mk_${res.data.userId}`,
							'[225,59,174,132,235,143,199,190,136,68,11,58,123,91,159,241,78,226,65,110,22,100,84,127,59,84,180,138,210,94,176,144]'
						);
					}
				});

				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);

				window.localStorage.setItem(
					'auth.access_token_valid_until',
					tomorrow.getTime().toString()
				);
				window.localStorage.setItem(
					'auth.refresh_token_valid_until',
					tomorrow.getTime().toString()
				);

				cy.visit('/app');
				cy.wait('@usersData');
				cy.wait('@settings');
				cy.wait('@consultingTypeServiceBaseBasic');
				cy.wait('@patchUsersData');
				cy.wait('@fetchMyKeys');
				if (userId === USER_ASKER) {
					cy.wait('@askerSessions');
				} else {
					cy.wait('@consultantEnquiriesBase');
				}
			});
		}
	);

export default fastLoginCommand;
