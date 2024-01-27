import { v4 as uuid } from 'uuid';
import { USER_CONSULTANT, USER_VIDEO } from '../support/commands/login';
import {
	closeWebSocketServer,
	mockWebSocket,
	startWebSocketServer
} from '../support/websocket';

const handleUiEdit = (cy, index, text, proceed = false) => {
	cy.get('.appointments *[class^="box_"]')
		.eq(index)
		.find('.appointment__actions')
		.eq(1)
		.find('span[role="button"]')
		.eq(0)
		.click();
	cy.get('#overlay .onlineMeetingForm textarea')
		.type(text)
		.get('#overlay .overlay__buttons button')
		.eq(proceed ? 1 : 0)
		.click();
	if (proceed) {
		cy.wait('@appointment_put');
	}
	cy.get('#overlay .overlay').should('not.exist');
};

const handleUiDelete = (cy, index, proceed = false) => {
	cy.get('.appointments *[class^="box_"]')
		.eq(index)
		.find('.appointment__actions')
		.eq(1)
		.find('span[role="button"]')
		.eq(1)
		.click();
	cy.get('#overlay .overlay__buttons button')
		.eq(proceed ? 1 : 0)
		.click();
	if (proceed) {
		cy.wait('@appointment_delete');
	}
	cy.get('#overlay .overlay').should('not.exist');
};

describe('appointments', () => {
	before(() => {
		startWebSocketServer();
	});

	after(() => {
		closeWebSocketServer();
	});

	beforeEach(() => {
		mockWebSocket();
	});

	describe('Video Appointments disabled', () => {
		beforeEach(() => {
			cy.willReturn('settings', {
				disableVideoAppointments: {
					value: true,
					readOnly: false
				}
			});
		});

		describe('Asker', () => {
			beforeEach(() => {
				cy.fastLogin();
			});

			it('Appointments List not exists', () => {
				cy.contains('Video - Termine').should('not.exist');
			});
		});

		describe('Consultant', () => {
			beforeEach(() => {
				cy.fastLogin({
					username: USER_CONSULTANT
				});
			});

			it('Appointments List not exists', () => {
				cy.contains('Video - Termine').should('not.exist');
			});
		});

		describe('Video Consultant', () => {
			beforeEach(() => {
				cy.fastLogin({
					username: USER_VIDEO
				});
			});

			it('Appointments List not exists', () => {
				cy.contains('Video - Termine').should('not.exist');
			});
		});
	});

	describe('Video Appointments enabled', () => {
		beforeEach(() => {
			cy.willReturn('settings', {
				disableVideoAppointments: {
					value: false,
					readOnly: false
				}
			});
		});

		describe('Asker', () => {
			beforeEach(() => {
				cy.fastLogin();
			});

			it('Appointments List not exists', () => {
				cy.contains('Video - Termine').should('not.exist');
			});
		});

		describe('Consultant', () => {
			beforeEach(() => {
				cy.fastLogin({
					username: USER_CONSULTANT
				});
			});

			it('Appointments List not exists', () => {
				cy.contains('Video - Termine').should('not.exist');
			});
		});

		describe('Video Consultant', () => {
			beforeEach(() => {
				cy.fastLogin({
					username: USER_VIDEO
				});
			});

			it('Appointments List without appointments', () => {
				cy.contains('Video - Termine').should('exist').click();
				cy.wait('@appointments_get');
				cy.get('.appointments').contains(
					'Aktuell gibt es keine Termine'
				);
			});

			it('Add appointment', () => {
				// Default Meeting Time
				const dMT = new Date();
				dMT.setHours(8);
				dMT.setMinutes(0);

				cy.contains('Video - Termine').click();
				cy.wait('@appointments_get');

				cy.get('.appointments *[class^="box_"]').should('not.exist');
				cy.get(
					'.appointments__actions .button__wrapper button'
				).click();

				cy.get(
					'#overlay .onlineMeetingForm .react-datepicker--date'
				).click();
				cy.get(
					'#overlay .onlineMeetingForm .react-datepicker--date .react-datepicker .react-datepicker__day--today'
				)
					.should('not.have.class', 'react-datepicker__day--disabled')
					.click();
				cy.get(
					'#overlay .onlineMeetingForm .react-datepicker--time input'
				).should(
					'have.value',
					`${(dMT.getHours() + 100).toString().substring(1)}:${(
						dMT.getMinutes() + 100
					)
						.toString()
						.substring(1)}`
				);
				cy.get('#overlay .onlineMeetingForm textarea').type(
					'Meine Beschreibung'
				);
				cy.get('#overlay .overlay__buttons button')
					.contains('Speichern')
					.click();
				cy.wait('@appointments_post');

				cy.get('.appointments *[class^="box_"]').should(
					'have.length',
					1
				);
				cy.get(
					'.appointments *[class^="box_"] .appointment__description'
				).should('contain.text', 'Meine Beschreibung');

				cy.appointments();
			});

			describe('Appointment actions', () => {
				beforeEach(() => {
					const today = new Date();
					cy.appointments({
						id: uuid(),
						description: 'Mein Termin 1',
						datetime: today.toISOString()
					});
					today.setDate(today.getDate() + 1);
					cy.appointments({
						id: uuid(),
						description: 'Mein Termin 2',
						datetime: today.toISOString()
					});
					today.setDate(today.getDate() + 1);
					cy.appointments({
						id: uuid(),
						description: 'Mein Termin 3',
						datetime: today.toISOString()
					});

					cy.contains('Video - Termine').click();
					cy.wait('@appointments_get');
				});

				afterEach(() => {
					cy.appointments();
				});

				it('Edit appointment', () => {
					cy.get('.appointments *[class^="box_"]').should(
						'have.length',
						3
					);
					cy.get('.appointments *[class^="box_"]')
						.eq(0)
						.find('.appointment__description')
						.should('contain.text', 'Mein Termin 1');
					cy.get('.appointments *[class^="box_"]')
						.eq(1)
						.find('.appointment__description')
						.should('contain.text', 'Mein Termin 2');
					cy.get('.appointments *[class^="box_"]')
						.eq(2)
						.find('.appointment__description')
						.should('contain.text', 'Mein Termin 3');

					// Edit appointment #1
					handleUiEdit(cy, 0, ' hat jetzt mehr Inhalt', true);
					// Edit and cancel appointment #2
					handleUiEdit(
						cy,
						1,
						' wurde geändert aber abgebrochen',
						false
					);
					// Edit appointment #3
					handleUiEdit(cy, 2, ' hat jetzt noch mehr Inhalt', true);

					// Check list
					cy.get('.appointments *[class^="box_"]')
						.eq(0)
						.find('.appointment__description')
						.should(
							'contain.text',
							'Mein Termin 1 hat jetzt mehr Inhalt'
						);
					cy.get('.appointments *[class^="box_"]')
						.eq(1)
						.find('.appointment__description')
						.should('contain.text', 'Mein Termin 2');
					cy.get('.appointments *[class^="box_"]')
						.eq(2)
						.find('.appointment__description')
						.should(
							'contain.text',
							'Mein Termin 3 hat jetzt noch mehr Inhalt'
						);
				});

				it('Delete appointment', () => {
					cy.get('.appointments *[class^="box_"]').should(
						'have.length',
						3
					);
					cy.get('.appointments *[class^="box_"]')
						.eq(0)
						.find('.appointment__description')
						.should('contain.text', 'Mein Termin 1');
					cy.get('.appointments *[class^="box_"]')
						.eq(1)
						.find('.appointment__description')
						.should('contain.text', 'Mein Termin 2');
					cy.get('.appointments *[class^="box_"]')
						.eq(2)
						.find('.appointment__description')
						.should('contain.text', 'Mein Termin 3');

					// Press delete and cancel
					handleUiDelete(cy, 1, false);
					cy.get('.appointments *[class^="box_"]').should(
						'have.length',
						3
					);

					// Press delete and proceed
					handleUiDelete(cy, 1, true);
					cy.get('.appointments *[class^="box_"]').should(
						'have.length',
						2
					);

					cy.get('.appointments *[class^="box_"]')
						.eq(0)
						.find('.appointment__description')
						.should('contain.text', 'Mein Termin 1');
					cy.get('.appointments *[class^="box_"]')
						.eq(1)
						.find('.appointment__description')
						.should('contain.text', 'Mein Termin 3');

					handleUiDelete(cy, 0, true);
					handleUiDelete(cy, 0, true);
					cy.get('.appointments *[class^="box_"]').should(
						'have.length',
						0
					);
					cy.get('.appointments').contains(
						'Aktuell gibt es keine Termine'
					);
				});

				it('Copy appointment link', () => {
					cy.get('.appointments *[class^="box_"]').should(
						'have.length',
						3
					);

					cy.get('.appointments *[class^="box_"]')
						.eq(0)
						.find('[data-cy=appointment_url]')
						.then(($url) => {
							const appointmentLink = $url.text();

							cy.get('.appointments *[class^="box_"]')
								.eq(0)
								.find('[data-cy=appointment_link] span')
								.click();

							cy.window().then((win) => {
								if (win.navigator.clipboard) {
									win.navigator.clipboard
										.readText()
										.then((text) => {
											expect(text).to.eq(appointmentLink);
										});
								} else {
									win.clipboardData
										.getData('text/plain')
										.then((text) => {
											expect(text).to.eq(appointmentLink);
										});
								}
							});
						});
				});

				it('Show appointment qr code', () => {
					cy.get('.appointments *[class^="box_"]').should(
						'have.length',
						3
					);

					cy.get('.appointments *[class^="box_"]')
						.eq(0)
						.find('[data-cy=appointment_qr_code] button')
						.click();

					cy.get('#overlay .generateQrCode__overlay').should('exist');
				});
			});

			describe('Start video conference', () => {
				beforeEach(() => {
					const today = new Date();
					cy.appointments({
						id: uuid(),
						description: 'Mein Termin 1',
						datetime: today.toISOString()
					});
					today.setDate(today.getDate() + 1);
					cy.appointments({
						id: uuid(),
						description: 'Mein Termin 2',
						datetime: today.toISOString()
					});
					today.setDate(today.getDate() + 1);
					cy.appointments({
						id: uuid(),
						description: 'Mein Termin 3',
						datetime: today.toISOString()
					});
				});

				afterEach(() => {
					cy.appointments();
				});

				describe('E2EE check enabled', () => {
					beforeEach(() => {
						cy.willReturn('userData', {
							e2eEncryptionEnabled: true
						});

						cy.fastLogin({
							username: USER_VIDEO
						});

						cy.contains('Video - Termine').click();
						cy.wait('@appointments_get');
					});

					it('Enabled - E2EE not supported', () => {
						cy.get('.appointments *[class^="box_"]').should(
							'have.length',
							3
						);

						cy.window().then((window) => {
							cy.stub(window, 'RTCRtpSender').returns(undefined);
						});

						cy.get('.appointments *[class^="box_"]')
							.eq(0)
							.find('[data-cy=appointment_start] button')
							.click();

						cy.get('#overlay .overlay__content .headline').contains(
							'Der Video-Call kann nicht gestartet werden'
						);

						cy.get(
							'#overlay .overlay__content .overlay__buttons .button__wrapper'
						)
							.eq(0)
							.children('button')
							.click();

						cy.get('#overlay .overlay__content').should(
							'not.exist'
						);
					});

					it('Enabled - E2EE supported', () => {
						cy.get('.appointments *[class^="box_"]').should(
							'have.length',
							3
						);

						cy.window().then((window) => {
							cy.stub(window, 'open').as('windowOpen');
						});

						cy.get('.appointments *[class^="box_"]')
							.eq(0)
							.find('[data-cy=appointment_start] button')
							.click();

						cy.get('#overlay .overlay__content .headline').contains(
							'Video-Call starten'
						);

						cy.get(
							'#overlay .overlay__content .overlay__buttons .button__wrapper'
						)
							.eq(1)
							.children('button')
							.click();

						cy.get('@windowOpen').should('be.called');
					});
				});

				describe('E2EE check disabled', () => {
					beforeEach(() => {
						cy.willReturn('userData', {
							e2eEncryptionEnabled: false
						});

						cy.fastLogin({
							username: USER_VIDEO
						});

						cy.contains('Video - Termine').click();
						cy.wait('@appointments_get');
					});

					it('Disabled - E2EE not supported', () => {
						cy.get('.appointments *[class^="box_"]').should(
							'have.length',
							3
						);

						cy.window().then((window) => {
							cy.stub(window, 'open').as('windowOpen');
							cy.stub(window, 'RTCRtpSender').returns(undefined);
						});

						cy.get('.appointments *[class^="box_"]')
							.eq(0)
							.find('[data-cy=appointment_start] button')
							.click();

						cy.get('#overlay .overlay__content .headline').contains(
							'Video-Call starten'
						);

						cy.get(
							'#overlay .overlay__content .overlay__buttons .button__wrapper'
						)
							.eq(1)
							.children('button')
							.click();

						cy.get('@windowOpen').should('be.called');
					});

					it('Disabled - E2EE supported', () => {
						cy.get('.appointments *[class^="box_"]').should(
							'have.length',
							3
						);

						cy.window().then((window) => {
							cy.stub(window, 'open').as('windowOpen');
						});

						cy.get('.appointments *[class^="box_"]')
							.eq(0)
							.find('[data-cy=appointment_start] button')
							.click();

						cy.get('#overlay .overlay__content .headline').contains(
							'Video-Call starten'
						);

						cy.get(
							'#overlay .overlay__content .overlay__buttons .button__wrapper'
						)
							.eq(1)
							.children('button')
							.click();

						cy.get('@windowOpen').should('be.called');
					});
				});
			});
		});
	});
});
