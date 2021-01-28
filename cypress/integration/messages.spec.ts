import { emitStompDirectMessage } from '../support/websocket';
import { generateAskerSession, generateMessage } from '../support/sessions';
import attachmentsI18n from '../../src/resources/scripts/i18n/de/attachments';
import attachmentsInformalI18n from '../../src/resources/scripts/i18n/de/attachmentsInformal';

describe('Messages', () => {
	describe('Attachments', () => {
		it('should allow to send a message with attachment', () => {
			cy.caritasMockedLogin();

			cy.get('[data-cy=sessions-list-items-wrapper]').click();
			cy.get('.textarea__attachmentInput').attachFile('empty.pdf');
			cy.get('.textarea__iconWrapper').click();

			cy.wait('@attachmentUpload');
		});

		describe('formal', () => {
			it('should show inline error when quota is reached', () => {
				cy.caritasMockedLogin({
					attachmentUpload: {
						statusCode: 403,
						headers: {
							'X-Reason': 'QUOTA_REACHED'
						}
					}
				});

				cy.get('[data-cy=sessions-list-items-wrapper]').click();
				cy.get('.textarea__attachmentInput').attachFile('empty.pdf');
				cy.get('.textarea__iconWrapper').click();

				cy.wait('@attachmentUpload');

				cy.contains(attachmentsI18n['error.quota.headline']);
			});
		});

		describe('informal', () => {
			it('should show inline error when quota is reached', () => {
				cy.caritasMockedLogin({
					userData: {
						formalLanguage: false
					},
					attachmentUpload: {
						statusCode: 403,
						headers: {
							'X-Reason': 'QUOTA_REACHED'
						}
					}
				});

				cy.get('[data-cy=sessions-list-items-wrapper]').click();
				cy.get('.textarea__attachmentInput').attachFile('empty.pdf');
				cy.get('.textarea__iconWrapper').click();

				cy.wait('@attachmentUpload');

				cy.contains(attachmentsInformalI18n['error.quota.headline']);
			});
		});
	});

	describe('Unread Animations', () => {
		describe('No unread messages exist', () => {
			describe('Initially loading the app', () => {
				it('should not animate the envelope and no dot visible', () => {
					cy.clock();
					cy.caritasMockedLogin();

					cy.get('.navigation__item__count--active').should(
						'not.exist'
					);
					cy.get('.navigation__item__count--initial').should(
						'not.exist'
					);
				});
			});

			describe('On "My Sessions" but no session open', () => {
				describe('New message from Live Service', () => {
					it('should animate the envelope and initial dot', () => {
						const sessions = [generateAskerSession()];
						cy.caritasMockedLogin({ sessions }).then(() => {
							sessions[0].session.messagesRead = false;
							emitStompDirectMessage();
						});

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--initial').should(
							'exist'
						);
					});
				});
			});

			describe('Not on My Sessions', () => {
				describe('New message from Live Service', () => {
					it('should animate the enevelope and initial dot', () => {
						cy.caritasMockedLogin();
						cy.get('a[href="/profile"]').click();

						emitStompDirectMessage();

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--initial').should(
							'exist'
						);
					});
				});
			});

			describe('Session open', () => {
				describe('New message from Live Service in currently active Session', () => {
					it('should animate envelope and initial dot and remove dot after message was read', () => {
						const session1 = generateAskerSession();
						const messages = [
							generateMessage({
								rcGroupId: session1.session.groupId
							})
						];

						cy.caritasMockedLogin({
							// TODO: we need to delay the call to the
							// sessions endpoint since in case it resolves
							// too fast the dot is removed too fast or
							// doesn't get rendered at all
							userSessionsTimeout: 1500,

							sessions: [session1],
							messages
						});
						cy.get('.sessionsListItem').first().click({
							force: true
						});

						emitStompDirectMessage();

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--initial').should(
							'exist'
						);

						// wait for the animation to finish and the dot to disappear
						// TODO: use cy.clock instead
						// eslint-disable-next-line cypress/no-unnecessary-waiting
						cy.wait(1500);

						cy.get('.navigation__item__count--active').should(
							'not.exist'
						);
						cy.get('.navigation__item__count').should('not.exist');
					});
				});
				describe('New message from Live Service in different Session', () => {
					it('should animate the envelope and initial dot', () => {
						const session1 = generateAskerSession();
						const session2 = generateAskerSession();

						const messages = [
							generateMessage({
								rcGroupId: session1.session.groupId
							}),
							generateMessage({
								rcGroupId: session2.session.groupId
							})
						];

						cy.caritasMockedLogin({
							sessions: [session1, session2],
							messages
						});

						cy.get('.navigation__item__count--active').should(
							'not.exist'
						);

						cy.get('.navigation__item__count--initial').should(
							'not.exist'
						);

						cy.get('.sessionsListItem').first().click({
							force: true
						});
						cy.get('.messageItem__message').should('be.visible');

						cy.window().then(() => {
							session2.session.messagesRead = false;
							const message = generateMessage({
								rcGroupId: session2.session.groupId
							});
							messages.push(message);

							emitStompDirectMessage({
								messageId: message._id
							});
						});

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--initial').should(
							'exist'
						);
					});
				});
			});
		});

		describe('Unread messages already exist', () => {
			describe('Initially loading the app', () => {
				it('should animate the envelope and initial dot', () => {
					cy.clock();
					const sessions = [
						generateAskerSession({
							messagesRead: false
						})
					];
					cy.caritasMockedLogin({ sessions });

					cy.get('.navigation__item__count--active').should('exist');
					cy.get('.navigation__item__count--initial').should('exist');
				});
			});

			describe('On "My Sessions" but no session open', () => {
				describe('New message from Live Service', () => {
					it('should animate the envelope and reanimate the dot', () => {
						const sessions = [
							generateAskerSession({
								messagesRead: false
							})
						];
						cy.caritasMockedLogin({ sessions });

						emitStompDirectMessage();

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--reanimate').should(
							'exist'
						);
					});
				});
			});

			describe('Not on My Sessions', () => {
				describe('New message from Live Service', () => {
					it('should animate the envelope and reanimate dot', () => {
						const sessions = [
							generateAskerSession({
								messagesRead: false
							})
						];
						cy.caritasMockedLogin({ sessions });
						cy.get('.sessionsListItem');

						emitStompDirectMessage();

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--reanimate').should(
							'exist'
						);
					});
				});
			});

			describe('Session open', () => {
				describe('New message from Live Service in currently active Session', () => {
					it('should animate envelope and reanimate dot', () => {
						const session1 = generateAskerSession();
						const session2 = generateAskerSession({
							messagesRead: false
						});

						const messages = [
							generateMessage({
								rcGroupId: session1.session.groupId
							}),
							generateMessage({
								rcGroupId: session2.session.groupId
							})
						];

						cy.caritasMockedLogin({
							sessions: [session1, session2],
							messages
						});

						// TODO: this seems to be brittle timing since the
						// class gets removed again soon after it was added
						cy.get('.navigation__item__count--active').should(
							'exist'
						);

						cy.get('.navigation__item__count--initial').should(
							'exist'
						);
						// wait for animation to fully finish
						cy.wait(500); // eslint-disable-line cypress/no-unnecessary-waiting

						cy.get('.sessionsListItem').first().click({
							force: true
						});
						cy.get('.messageItem__message').should('be.visible');

						cy.window().then(() => {
							const message = generateMessage({
								rcGroupId: session1.session.groupId
							});
							messages.push(message);

							emitStompDirectMessage({
								messageId: message._id
							});
						});

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--reanimate').should(
							'exist'
						);
					});
				});

				describe('New message from Live Service in different Session', () => {
					it('should animate the envelope and reanimate the dot', () => {
						const session1 = generateAskerSession();
						const session2 = generateAskerSession({
							messagesRead: false
						});

						const messages = [
							generateMessage({
								rcGroupId: session1.session.groupId
							}),
							generateMessage({
								rcGroupId: session2.session.groupId
							})
						];

						cy.caritasMockedLogin({
							sessions: [session1, session2],
							messages
						});

						cy.get('.navigation__item__count--active').should(
							'exist'
						);

						cy.get('.navigation__item__count--initial').should(
							'exist'
						);
						// wait for animation to fully finish
						cy.wait(500); // eslint-disable-line cypress/no-unnecessary-waiting

						cy.get('.sessionsListItem').first().click({
							force: true
						});
						cy.get('.messageItem__message').should('be.visible');

						cy.window().then(() => {
							const message = generateMessage({
								rcGroupId: session2.session.groupId
							});
							messages.push(message);

							emitStompDirectMessage({
								messageId: message._id
							});
						});

						cy.get('.navigation__item__count--active').should(
							'exist'
						);
						cy.get('.navigation__item__count--reanimate').should(
							'exist'
						);
					});
				});
			});
		});
	});
});
