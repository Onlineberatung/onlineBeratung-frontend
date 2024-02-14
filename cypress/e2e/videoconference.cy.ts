import { v4 as uuid } from 'uuid';
import { config } from '../../src/resources/scripts/config';
import { USER_CONSULTANT, USER_VIDEO } from '../support/commands/mockApi';
import {
	closeWebSocketServer,
	mockWebSocket,
	startWebSocketServer
} from '../support/websocket';
import { AppointmentsDataInterface } from '../../src/globalState/interfaces';

class FakeJitsiMeetExternalAPI {
	private _handler: {
		videoConferenceJoined: Function[];
		readyToClose: Function[];
	};
	constructor() {
		this._handler = {
			videoConferenceJoined: [],
			readyToClose: []
		};
	}
	on(name, fn) {
		this._handler[name].push(fn);
	}
	off(name, fn) {
		this._handler[name].splice(
			this._handler[name].findIndex((func) => func === fn),
			1
		);
	}
	emit(name) {
		this._handler[name].forEach((fn) => fn());
	}
}

describe('videoconference', () => {
	before(() => {
		startWebSocketServer();
	});

	after(() => {
		closeWebSocketServer();
	});

	beforeEach(() => {
		mockWebSocket();

		const today = new Date();
		const appointmentId = uuid();
		cy.wrap(appointmentId).as('appointmentId');
		cy.appointments({
			id: appointmentId,
			description: 'Mein Termin',
			datetime: today.toISOString(),
			status: 'created'
		});
	});

	afterEach(() => {
		cy.appointments();
	});

	describe('Asker', () => {
		beforeEach(() => {
			cy.fastLogin();
		});

		xit('Join invited video call', () => {
			cy.clock();
			cy.get('@appointmentId').then((id: any) => {
				cy.window()
					.then((window) => {
						//window.JitsiMeetExternalAPI = FakeJitsiMeetExternalAPI;
					})
					.then(() => {
						const videoUrl = config.urls.videoConference
							.replace('/:type', '/app')
							.replace('/:appointmentId', `/${id}`);

						cy.visit(videoUrl);
						cy.wait('@appointment_get');
						cy.wait('@videocalls_jwt_get');

						// On welcome page
						cy.contains('Herzlich Willkommen!').should('exist');

						// Legal link exists
						config.legalLinks
							.filter((link) => link.registration)
							.forEach((link) => {
								cy.get(`a[href="${link.url}"]`).should('exist');
							});
						// Confirm
						cy.get('.waitingRoom__button button').click();

						// On waiting page
						cy.contains('Bitte haben Sie etwas Geduld').should(
							'exist'
						);

						cy.appointments({ status: 'started' }, 0);
						cy.tick(2000);
						cy.wait('@appointment_get');

						// Check if meeting is started
						cy.get('[data-cy="jitsi-meeting"]').should('exist');

						cy.appointments({ status: 'paused' }, 0);
						cy.tick(2000);
						cy.wait('@appointment_get');

						// On waiting page
						cy.contains('Der Video-Call wurde beendet').should(
							'exist'
						);

						cy.appointments({ status: 'started' }, 0);
						cy.tick(2000);
						cy.wait('@appointment_get');

						// Check if meeting is resumed
						cy.get('[data-cy="jitsi-meeting"]').should('exist');
					});
			});
		});

		it('Join non existent video call', () => {
			const videoUrl = config.urls.videoConference
				.replace('/:type', '/app')
				.replace('/:appointmentId', `/${uuid()}`);

			cy.visit(videoUrl);

			cy.wait('@appointment_get');
			cy.wait('@videocalls_jwt_get');

			cy.contains('Der Video-Call wurde nicht gefunden').should('exist');
		});

		it('Start moderator video call', () => {
			cy.get('@appointmentId').then((id: any) => {
				const videoUrl = config.urls.consultantVideoConference
					.replace('/:type', '/app')
					.replace('/:appointmentId', `/${id}`);

				cy.visit(videoUrl);

				cy.url().should('contain', '/sessions/user/view');
			});
		});

		it('Start non existent moderator video call', () => {
			const videoUrl = config.urls.consultantVideoConference
				.replace('/:type', '/app')
				.replace('/:appointmentId', `/${uuid()}`);

			cy.visit(videoUrl);

			cy.url().should('contain', '/sessions/user/view');
		});
	});

	describe('Consultant', () => {
		beforeEach(() => {
			cy.fastLogin({
				userId: USER_CONSULTANT
			});
		});

		xit('Join invited video call', () => {
			cy.clock();
			cy.get('@appointmentId').then((id: any) => {
				cy.window()
					.then((window) => {
						//window.JitsiMeetExternalAPI = FakeJitsiMeetExternalAPI;
					})
					.then(() => {
						const videoUrl = config.urls.videoConference
							.replace('/:type', '/app')
							.replace('/:appointmentId', `/${id}`);

						cy.visit(videoUrl);
						cy.wait('@appointment_get');
						cy.wait('@videocalls_jwt_get');

						// On welcome page
						cy.contains('Herzlich Willkommen!').should('exist');

						// Legal link exists
						config.legalLinks
							.filter((link) => link.registration)
							.forEach((link) => {
								cy.get(`a[href="${link.url}"]`).should('exist');
							});

						// Confirm
						cy.get('.waitingRoom__button button').click();

						// On waiting page
						cy.contains('Bitte haben Sie etwas Geduld').should(
							'exist'
						);

						cy.appointments({ status: 'started' }, 0);
						cy.tick(2000);
						cy.wait('@appointment_get');

						// Check if meeting is started
						cy.get('[data-cy="jitsi-meeting"]').should('exist');

						cy.appointments({ status: 'paused' }, 0);
						cy.tick(2000);
						cy.wait('@appointment_get');

						// On waiting page
						cy.contains('Der Video-Call wurde beendet').should(
							'exist'
						);

						cy.appointments({ status: 'started' }, 0);
						cy.tick(2000);
						cy.wait('@appointment_get');

						// Check if meeting is resumed
						cy.get('[data-cy="jitsi-meeting"]').should('exist');
					});
			});
		});

		it('Join non existent video call', () => {
			const videoUrl = config.urls.videoConference
				.replace('/:type', '/app')
				.replace('/:appointmentId', `/${uuid()}`);

			cy.visit(videoUrl);

			cy.wait('@appointment_get');
			cy.wait('@videocalls_jwt_get');

			cy.contains('Der Video-Call wurde nicht gefunden').should('exist');
		});

		it('Start moderator video call', () => {
			cy.get('@appointmentId').then((id: any) => {
				const videoUrl = config.urls.consultantVideoConference
					.replace('/:type', '/app')
					.replace('/:appointmentId', `/${id}`);

				cy.visit(videoUrl);

				cy.url().should(
					'contain',
					'/sessions/consultant/sessionPreview'
				);
			});
		});

		it('Start non existent moderator video call', () => {
			const videoUrl = config.urls.consultantVideoConference
				.replace('/:type', '/app')
				.replace('/:appointmentId', `/${uuid()}`);

			cy.visit(videoUrl);

			cy.url().should('contain', '/sessions/consultant/sessionPreview');
		});
	});

	describe('Video Consultant', () => {
		beforeEach(() => {
			cy.fastLogin({
				userId: USER_VIDEO
			});
		});

		xit('Join invited video call', () => {
			cy.clock();
			cy.get('@appointmentId').then((id: any) => {
				cy.window()
					.then((window) => {
						//window.JitsiMeetExternalAPI = FakeJitsiMeetExternalAPI;
					})
					.then(() => {
						const videoUrl = config.urls.videoConference
							.replace('/:type', '/app')
							.replace('/:appointmentId', `/${id}`);

						cy.visit(videoUrl);
						cy.wait('@appointment_get');
						cy.wait('@videocalls_jwt_get');

						// On welcome page
						cy.contains('Herzlich Willkommen!').should('exist');

						// Legal link exists
						config.legalLinks
							.filter((link) => link.registration)
							.forEach((link) => {
								cy.get(`a[href="${link.url}"]`).should('exist');
							});
						// Confirm
						cy.get('.waitingRoom__button button').click();

						// On waiting page
						cy.contains('Bitte haben Sie etwas Geduld').should(
							'exist'
						);

						cy.appointments({ status: 'started' }, 0);
						cy.tick(2000);
						cy.wait('@appointment_get');

						// Check if meeting is started
						cy.get('[data-cy="jitsi-meeting"]').should('exist');

						cy.appointments({ status: 'paused' }, 0);
						cy.tick(2000);
						cy.wait('@appointment_get');

						// On waiting page
						cy.contains('Der Video-Call wurde beendet').should(
							'exist'
						);

						cy.appointments({ status: 'started' }, 0);
						cy.tick(2000);
						cy.wait('@appointment_get');

						// Check if meeting is resumed
						cy.get('[data-cy="jitsi-meeting"]').should('exist');
					});
			});
		});

		it('Join non existent video call', () => {
			const videoUrl = config.urls.videoConference
				.replace('/:type', '/app')
				.replace('/:appointmentId', `/${uuid()}`);

			cy.visit(videoUrl);

			cy.wait('@appointment_get');
			cy.wait('@videocalls_jwt_get');

			cy.contains('Der Video-Call wurde nicht gefunden').should('exist');
		});

		xit('Start moderator video call', () => {
			cy.get('@appointmentId').then((id: any) => {
				const videoUrl = config.urls.consultantVideoConference
					.replace('/:type', '/app')
					.replace('/:appointmentId', `/${id}`);

				cy.appointments({}, 0).then(
					(appointment: AppointmentsDataInterface) => {
						expect(appointment.status).to.equal('created');
					}
				);

				cy.visit(videoUrl);

				cy.wait('@appointment_get');
				cy.wait('@videocalls_jwt_get');

				cy.window()
					.then((window) => {
						//window.JitsiMeetExternalAPI = FakeJitsiMeetExternalAPI;
					})
					.its('externalApi')
					.then((externalApi) => {
						// Start videocall
						cy.wrap(null).then(() =>
							externalApi.emit('videoConferenceJoined')
						);
						cy.wait('@appointment_put');
						cy.appointments({}, 0).then(
							(appointment: AppointmentsDataInterface) => {
								expect(appointment.status).to.equal('started');
							}
						);

						// Pause videocall
						cy.wrap(null).then(() =>
							externalApi.emit('readyToClose')
						);
						cy.wait('@appointment_put');
						cy.appointments({}, 0).then(
							(appointment: AppointmentsDataInterface) => {
								expect(appointment.status).to.equal('paused');
							}
						);
					});
			});
		});

		it('Start non existent moderator video call', () => {
			const videoUrl = config.urls.consultantVideoConference
				.replace('/:type', '/app')
				.replace('/:appointmentId', `/${uuid()}`);

			cy.visit(videoUrl);

			cy.wait('@appointment_get');
			cy.wait('@videocalls_jwt_get');

			cy.contains('Der Video-Call wurde nicht gefunden').should('exist');
		});
	});
});
